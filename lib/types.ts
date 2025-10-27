export type EventType = "stevne" | "møte" | "kurs";

export interface Competition {
  id: string;
  name: string;
  location: string;
  region: string; // Added for filtering
  eventType: EventType; // stevne, møte, or kurs
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  targetCount?: number; // Only for stevner
  slotDuration?: number; // Only for stevner
  totalSlots: number;
  status: "open" | "full" | "closed";
  classes?: string[];
  type?: "indoor" | "outdoor"; // Only for stevner
  organizer: string; // Added for filtering
  description?: string; // Added for search
  coordinates?: { lat: number; lng: number }; // Added for map view
  // Kurs-specific fields
  instructor?: string;
  prerequisites?: string[];
  maxParticipants?: number;
  // Møte-specific fields
  agenda?: string[];
  meetingType?: "ordinært" | "ekstraordinært" | "øvelse";
}

export interface FilterOptions {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  region: "all" | string;
  classType: "all" | string;
  competitionType: "all" | "indoor" | "outdoor";
  status: "all" | "open" | "full" | "closed";
  organizer: string;
  eventType: "all" | EventType;
}

export interface Target {
  id: string;
  competitionId: string;
  targetNumber: number;
  name: string;
}

export interface TimeSlot {
  id: string;
  targetId: string;
  time: string;
  date: string;
  isBooked: boolean;
  bookedBy?: string;
  bookedByName?: string;
  bookedByClass?: string;
  allowedClasses?: string[];
  isLocked?: boolean;
}

export interface Booking {
  id: string;
  competitionId: string;
  competitionName: string;
  targetId: string;
  timeSlotId: string;
  userName: string;
  userEmail: string;
  userClass: string;
  bookedAt: string;
  date: string;
  time: string;
  targetNumber: number;
  location: string;
  status: "confirmed" | "pending" | "cancelled";
  paymentMethod?: "vipps" | "card" | "invoice";
  paymentStatus?: "paid" | "pending" | "failed";
  invoiceId?: string;
  price?: number;
}
