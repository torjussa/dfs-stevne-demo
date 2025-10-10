export interface Competition {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  targetCount: number;
  slotDuration: number; // in minutes
  totalSlots: number;
  status: "open" | "full" | "closed";
  classes?: string[];
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
