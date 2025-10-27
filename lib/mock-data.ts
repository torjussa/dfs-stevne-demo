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
    region: "Vestland",
    eventType: "stevne",
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
    type: "outdoor",
    organizer: "Sunnfjord Skytterlag",
    description:
      "Årlig samlagsstemne i felt med alle klasser. Perfekt for både nybegynnere og erfarne skyttere.",
    coordinates: { lat: 61.3631, lng: 5.4003 },
  },
  {
    id: "5",
    name: "Lørdagsskuddet Toten",
    location: "Toten",
    region: "Innlandet",
    eventType: "stevne",
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
    type: "indoor",
    organizer: "Toten Skytterlag",
    description:
      "Månedlig lørdagsskudd for alle klasser. Hyggelig og uformell atmosfære.",
    coordinates: { lat: 60.7945, lng: 10.6919 },
  },
  {
    id: "6",
    name: "Onsdagstreff",
    location: "Fiska Skyttarlag",
    region: "Trøndelag",
    eventType: "stevne",
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
    type: "indoor",
    organizer: "Fiska Skyttarlag",
    description:
      "Ukelig onsdagstreff for alle aldersgrupper. Fokus på teknikk og presisjon.",
    coordinates: { lat: 63.4305, lng: 10.3951 },
  },
  {
    id: "7",
    name: "VM - Cup Runde 4",
    location: "Fiska Skyttarlag",
    region: "Trøndelag",
    eventType: "stevne",
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
    type: "indoor",
    organizer: "Fiska Skyttarlag",
    description:
      "VM-Cup runde 4 med høyt nivå og konkurranse. For erfarne skyttere.",
    coordinates: { lat: 63.4305, lng: 10.3951 },
  },
  {
    id: "9",
    name: "VM - Cup Runde 3",
    location: "Fiska Skyttarlag",
    region: "Trøndelag",
    eventType: "stevne",
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
    type: "indoor",
    organizer: "Fiska Skyttarlag",
    description:
      "VM-Cup runde 3 med fokus på presisjon og konsistens. Alle klasser velkommen.",
    coordinates: { lat: 63.4305, lng: 10.3951 },
  },
  // Møter
  {
    id: "m1",
    name: "Årsmøte 2025",
    location: "DFS Sentral, Oslo",
    region: "Oslo",
    eventType: "møte",
    startDate: "2025-03-15",
    endDate: "2025-03-15",
    startTime: "10:00",
    endTime: "14:00",
    totalSlots: 50,
    status: "open",
    organizer: "DFS Sentral",
    description:
      "Årsmøte for alle medlemmer. Velkommen til generalforsamling med valg av nytt styre og vedtektsendringer.",
    coordinates: { lat: 59.9139, lng: 10.7522 }, // Oslo
    meetingType: "ordinært",
    agenda: [
      "Godkjenning av innkalling",
      "Valg av møteleder og protokollfører",
      "Årsberetning",
      "Regnskap og revisorsberetning",
      "Valg av nytt styre",
      "Eventuelt",
    ],
  },
  {
    id: "m2",
    name: "Styremøte Sunnfjord",
    location: "Sunnfjord Skytterlag, Dale",
    region: "Vestland",
    eventType: "møte",
    startDate: "2025-09-02",
    endDate: "2025-09-02",
    startTime: "19:00",
    endTime: "21:00",
    totalSlots: 12,
    status: "open",
    organizer: "Sunnfjord Skytterlag",
    description:
      "Månedlig styremøte for å planlegge aktiviteter og gå gjennom økonomi.",
    coordinates: { lat: 61.3631, lng: 5.4003 }, // Dale, Sunnfjord
    meetingType: "ordinært",
    agenda: [
      "Godkjenning av forrige møteprotokoll",
      "Økonomirapport",
      "Planlegging av stevner",
      "Eventuelt",
    ],
  },
  // Kurs
  {
    id: "k1",
    name: "Sikkerhetskurs for Våpenholdere",
    location: "Bærum Skytebane",
    region: "Oslo",
    eventType: "kurs",
    startDate: "2025-06-10",
    endDate: "2025-06-11",
    startTime: "09:00",
    endTime: "16:00",
    totalSlots: 20,
    status: "open",
    organizer: "DFS Sentral",
    description:
      "Obligatorisk sikkerhetskurs for alle våpenholdere. Kurset dekker våpenbehandling, sikkerhet og lover.",
    coordinates: { lat: 59.9407, lng: 10.4946 }, // Bærum
    instructor: "Erik Hansen",
    prerequisites: ["Gyldig våpenbevis"],
    maxParticipants: 20,
  },
  {
    id: "k2",
    name: "Skyteteknikk for Nybegynnere",
    location: "Toten Skytterlag",
    region: "Innlandet",
    eventType: "kurs",
    startDate: "2025-05-20",
    endDate: "2025-05-20",
    startTime: "10:00",
    endTime: "15:00",
    totalSlots: 15,
    status: "open",
    organizer: "Toten Skytterlag",
    description:
      "Intensivkurs i skytingsteknikk for nybegynnere. Lære grunnleggende teknikk og sikkerhet.",
    coordinates: { lat: 60.7945, lng: 10.6919 }, // Toten
    instructor: "Anne Larsen",
    prerequisites: [],
    maxParticipants: 15,
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

    // Demo booking generation: deterministic based on slot details
    const slotSeed = `${targetId}-${timeString}-${date}`
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isBooked = slotSeed % 10 > 7; // ~30% booked
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
    const randomName = bookingNames[slotSeed % bookingNames.length];
    const randomClass = allClasses[slotSeed % allClasses.length];
    const bookedByName = isBooked
      ? slotSeed % 10 < 1
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
      isLocked: slotSeed % 20 > 17, // ~15% locked
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
