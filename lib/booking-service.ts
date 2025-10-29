import type { Booking } from "./types";

const STORAGE_KEY = "shooting-app-bookings";

// Initialize with demo bookings if localStorage is empty
function initializeDemoBookings() {
  if (typeof window === "undefined") return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const existingBookings = existing ? JSON.parse(existing) : [];

    // Check if we need to create demo bookings for the logged-in user
    const storedUser = localStorage.getItem("shooting-app-user");
    if (!storedUser) return; // No user logged in yet

    const user = JSON.parse(storedUser);
    const userEmail = user.email;

    // Check if user already has bookings
    const hasUserBookings = existingBookings.some(
      (b: StoredBooking) => b.userEmail === userEmail
    );

    if (hasUserBookings) return; // User already has bookings

    const demoBookings: StoredBooking[] = [
      {
        id: `demo-booking-1-${userEmail}`,
        competitionId: "3", // Samlagsstemne Felt Sunnfjord
        targetId: "demo-target-1",
        timeSlotId: "demo-slot-1",
        userName: user.name,
        userEmail: userEmail,
        bookedAt: new Date().toISOString(),
      },
      {
        id: `demo-booking-2-${userEmail}`,
        competitionId: "6", // Onsdagstreff
        targetId: "demo-target-2",
        timeSlotId: "demo-slot-2",
        userName: user.name,
        userEmail: userEmail,
        bookedAt: new Date().toISOString(),
      },
      {
        id: `demo-booking-3-${userEmail}`,
        competitionId: "k1", // Sikkerhetskurs for Våpenholdere
        targetId: "demo-target-3",
        timeSlotId: "demo-slot-3",
        userName: user.name,
        userEmail: userEmail,
        bookedAt: new Date().toISOString(),
      },
    ];

    const allBookings = [...existingBookings, ...demoBookings];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
  } catch (error) {
    console.error("Error initializing demo bookings:", error);
  }
}

export interface StoredBooking extends Booking {
  reservedUntil?: string; // ISO timestamp for reservation timeout
}

/**
 * Booking service for persisting bookings to localStorage
 * In production, this would be replaced with API calls
 */
export class BookingService {
  /**
   * Get all bookings from localStorage
   */
  static getAllBookings(): StoredBooking[] {
    if (typeof window === "undefined") return [];

    // Initialize demo data on first access
    initializeDemoBookings();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading bookings from localStorage:", error);
      return [];
    }
  }

  /**
   * Get bookings for a specific user (by email)
   */
  static getUserBookings(userEmail: string): StoredBooking[] {
    const allBookings = this.getAllBookings();
    return allBookings.filter((booking) => booking.userEmail === userEmail);
  }

  /**
   * Get bookings for a specific competition
   */
  static getCompetitionBookings(competitionId: string): StoredBooking[] {
    const allBookings = this.getAllBookings();
    return allBookings.filter(
      (booking) => booking.competitionId === competitionId
    );
  }

  /**
   * Get a specific booking by ID
   */
  static getBooking(bookingId: string): StoredBooking | null {
    const allBookings = this.getAllBookings();
    return allBookings.find((booking) => booking.id === bookingId) || null;
  }

  /**
   * Create a new booking
   */
  static createBooking(booking: Booking, reservationDurationMinutes = 0): void {
    const allBookings = this.getAllBookings();

    const now = new Date();
    const reservedUntil =
      reservationDurationMinutes > 0
        ? new Date(
            now.getTime() + reservationDurationMinutes * 60 * 1000
          ).toISOString()
        : undefined;

    const newBooking: StoredBooking = {
      ...booking,
      reservedUntil,
      bookedAt: now.toISOString(),
    };

    allBookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
  }

  /**
   * Delete a booking
   */
  static deleteBooking(bookingId: string): void {
    const allBookings = this.getAllBookings();
    const filtered = allBookings.filter((booking) => booking.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Update a booking (e.g., to extend reservation or confirm payment)
   */
  static updateBooking(
    bookingId: string,
    updates: Partial<StoredBooking>
  ): void {
    const allBookings = this.getAllBookings();
    const index = allBookings.findIndex((booking) => booking.id === bookingId);

    if (index !== -1) {
      allBookings[index] = { ...allBookings[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
    }
  }

  /**
   * Clear expired reservations (reservedUntil < now)
   * Should be called periodically or before displaying bookings
   */
  static clearExpiredReservations(): void {
    const allBookings = this.getAllBookings();
    const now = new Date();

    const validBookings = allBookings.filter((booking) => {
      if (!booking.reservedUntil) return true; // Confirmed booking
      return new Date(booking.reservedUntil) > now; // Reservation still valid
    });

    if (validBookings.length !== allBookings.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validBookings));
    }
  }

  /**
   * Convert a booking ID to a URL-friendly ID
   */
  static generateBookingId(
    competitionId: string,
    targetId: string,
    timeSlotId: string,
    userEmail: string
  ): string {
    return `${competitionId}-${targetId}-${timeSlotId}-${userEmail}`;
  }

  /**
   * Generate a simple booking ID for events without time slots (møter/kurs)
   */
  static generateSimpleBookingId(
    competitionId: string,
    userEmail: string
  ): string {
    return `${competitionId}-simple-${userEmail}-${Date.now()}`;
  }

  /**
   * Create a simple booking for events without time slots (møter/kurs)
   */
  static createSimpleBooking(
    competitionId: string,
    userName: string,
    userEmail: string,
    userClass: string
  ): void {
    const allBookings = this.getAllBookings();

    // Check if user already has a booking for this event
    const existingBooking = allBookings.find(
      (b) => b.competitionId === competitionId && b.userEmail === userEmail
    );

    if (existingBooking) {
      console.warn("User already has a booking for this event");
      return;
    }

    const bookingId = this.generateSimpleBookingId(competitionId, userEmail);
    const now = new Date();

    const newBooking: StoredBooking = {
      id: bookingId,
      competitionId,
      targetId: "none", // No target for simple bookings
      timeSlotId: "none", // No time slot for simple bookings
      userName,
      userEmail,
      bookedAt: now.toISOString(),
    };

    allBookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookings));
  }
}
