import type { Booking } from "./types";

const STORAGE_KEY = "shooting-app-bookings";

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
}
