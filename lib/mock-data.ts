import type { Competition, Target, TimeSlot } from "./types";
import {
  getAllowedClassesForTime,
  BASE_CLASSES,
  SPECIAL_CLASSES,
} from "./utils";

// Helpers to compute totalSlots = floor(days * hours * targetCount * (60/slotDuration))
function calcDays(startDate: string, endDate: string): number {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  const toUTC = (d: Date) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((toUTC(ed) - toUTC(sd)) / msPerDay) + 1;
}

function calcHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

function calcTotalSlots(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  targetCount: number,
  slotDuration: number
): number {
  const days = calcDays(startDate, endDate);
  const hours = calcHours(startTime, endTime);
  return Math.floor(days * hours * targetCount * (60 / slotDuration));
}

export const mockCompetitions: Competition[] = [
  {
    id: "3",
    name: "Samlagsstemne Felt Sunnfjord",
    location: "Dale (Sunnfjord)",
    startDate: "2025-08-13",
    endDate: "2025-08-15",
    startTime: "09:00",
    endTime: "16:00",
    targetCount: 10,
    slotDuration: 45,
    totalSlots: calcTotalSlots(
      "2025-08-13",
      "2025-08-15",
      "09:00",
      "16:00",
      10,
      45
    ),
    status: "open",
    classes: ["R", "HK416", "JEG"],
  },
  {
    id: "5",
    name: "Lørdagsskuddet Toten",
    location: "Toten",
    startDate: "2025-10-11",
    endDate: "2025-10-11",
    startTime: "09:00",
    endTime: "12:00",
    targetCount: 6,
    slotDuration: 60,
    totalSlots: calcTotalSlots(
      "2025-10-11",
      "2025-10-11",
      "09:00",
      "12:00",
      6,
      60
    ),
    status: "open",
    classes: ["R", "HK416", "JEG"],
  },
  {
    id: "6",
    name: "Onsdagstreff",
    location: "Fiska Skyttarlag",
    startDate: "2026-10-10",
    endDate: "2026-10-10",
    startTime: "15:00",
    endTime: "18:00",
    targetCount: 10,
    slotDuration: 30,
    totalSlots: calcTotalSlots(
      "2026-10-10",
      "2026-10-10",
      "15:00",
      "18:00",
      10,
      30
    ),
    status: "open",
    classes: ["3", "4", "5", "EJ"],
  },
  {
    id: "7",
    name: "VM - Cup Runde 4",
    location: "Fiska Skyttarlag",
    startDate: "2026-01-10",
    endDate: "2026-01-11",
    startTime: "11:00",
    endTime: "18:00",
    targetCount: 10,
    slotDuration: 35,
    totalSlots: calcTotalSlots(
      "2026-01-10",
      "2026-01-11",
      "11:00",
      "18:00",
      10,
      35
    ),
    status: "open",
    classes: ["3", "4", "5", "EJ", "J", "v55"],
  },
  {
    id: "9",
    name: "VM - Cup Runde 3",
    location: "Fiska Skyttarlag",
    startDate: "2025-10-10",
    endDate: "2025-10-12",
    startTime: "10:00",
    endTime: "18:00",
    targetCount: 9,
    slotDuration: 30,
    totalSlots: calcTotalSlots(
      "2025-10-10",
      "2025-10-12",
      "10:00",
      "18:00",
      9,
      30
    ),
    status: "open",
    classes: ["3", "4", "5", "EJ"],
  },
];

export const generateTargets = (
  competitionId: string,
  targetCount: number
): Target[] => {
  return Array.from({ length: targetCount }, (_, i) => ({
    id: `${competitionId}-target-${i + 1}`,
    competitionId,
    targetNumber: i + 1,
    name: `Skive ${i + 1}`,
  }));
};

export const generateTimeSlots = (
  targetId: string,
  startTime: string,
  endTime: string,
  slotDuration: number,
  date?: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentTime = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;

  let slotIndex = 0;
  while (currentTime < endTimeMinutes) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Demo booking generation: some booked, ~10% anonymous
    const isBooked = Math.random() > 0.7;
    const bookingNames = [
      "Ola Nordmann",
      "Kari Nordmann",
      "Nils Hansen",
      "Anne Olsen",
      "Per Hansen",
      "Lise Olsen",
      "Harald Sandviken",
      "Joakim Eriksen",
      "Ole Petter Hansen",
    ];
    const allClasses = [...BASE_CLASSES, ...SPECIAL_CLASSES];
    const randomName =
      bookingNames[Math.floor(Math.random() * bookingNames.length)];
    const randomClass =
      allClasses[Math.floor(Math.random() * allClasses.length)];
    const bookedByName = isBooked
      ? Math.random() < 0.1
        ? "anonym"
        : randomName
      : undefined;
    const bookedByClass = isBooked ? randomClass : undefined;

    slots.push({
      id: `${targetId}-slot-${slotIndex}${date ? `-${date}` : ""}`,
      targetId,
      time: timeString,
      date: date ?? new Date().toISOString().slice(0, 10),
      isBooked,
      bookedByName,
      bookedByClass,
      // class restrictions are per time (computed from date+time)
      allowedClasses: getAllowedClassesForTime(
        timeString,
        date ?? new Date().toISOString().slice(0, 10)
      ),
      isLocked: Math.random() > 0.85,
    });

    currentTime += slotDuration;
    slotIndex++;
  }

  return slots;
};

export const generateDateRange = (
  startDate: string,
  endDate: string
): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().slice(0, 10));
  }
  return dates;
};
