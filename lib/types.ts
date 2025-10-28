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
  targetId: string;
  timeSlotId: string;
  userName: string;
  userEmail: string;
  bookedAt: string;
}

export interface InsuranceInfo {
  policyNumber: string;
  coverageType: "weapon"; // Updated to reflect weapon insurance only
  validFrom: string;
  validTo: string;
  status: "active" | "expired" | "pending";
  amount: number; // Coverage amount in NOK (50,000 per weapon, max 165,000)
  deductible: number; // Egenandel (1,000 kr per weapon)
  maxWeapons: number; // Maksimalt antall våpen (8)
}

export interface MembershipFormData {
  // Personal information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;

  // Membership details
  clubName: string;
  shootingClasses: string[]; // Which classes they can participate in
  membershipType: "full" | "youth" | "senior" | "lifetime";

  // Insurance (weapon insurance)
  wantsInsurance: boolean;

  // Payment
  paymentMethod: "card" | "vipps" | "invoice";
  acceptTerms: boolean;
  acceptDataProcessing: boolean;

  // Additional info
  previousExperience?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}
