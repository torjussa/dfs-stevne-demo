import type { Competition, Target, TimeSlot } from "./types";
import {
  getAllowedClassesForTime,
  BASE_CLASSES,
  SPECIAL_CLASSES,
} from "./utils";

// Helper function to get a date relative to today (in YYYY-MM-DD format)
function getRelativeDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().slice(0, 10);
}

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
  // --- Existing Competitions ---
  {
    id: "3",
    name: "Samlagsstemne Felt Sunnfjord",
    location: "Dale (Sunnfjord)",
    region: "Vestland",
    eventType: "stevne",
    startDate: getRelativeDate(5),
    endDate: getRelativeDate(7),
    startTime: "09:00",
    endTime: "16:00",
    targetCount: 10,
    slotDuration: 45,
    totalSlots: calcTotalSlots(
      getRelativeDate(5),
      getRelativeDate(7),
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
      "Årlig samlagsstemne i felt med alle klasser. Perfekt for både " +
      "nybegynnere og erfarne skyttere.",
    coordinates: { lat: 61.3631, lng: 5.4003 },
  },
  {
    id: "5",
    name: "Lørdagsskuddet Toten",
    location: "Toten",
    region: "Innlandet",
    eventType: "stevne",
    startDate: getRelativeDate(-2),
    endDate: getRelativeDate(-2),
    startTime: "09:00",
    endTime: "12:00",
    targetCount: 6,
    slotDuration: 60,
    totalSlots: calcTotalSlots(
      getRelativeDate(-2),
      getRelativeDate(-2),
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
    startDate: getRelativeDate(2),
    endDate: getRelativeDate(2),
    startTime: "15:00",
    endTime: "18:00",
    targetCount: 10,
    slotDuration: 30,
    totalSlots: calcTotalSlots(
      getRelativeDate(2),
      getRelativeDate(2),
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
    startDate: getRelativeDate(30),
    endDate: getRelativeDate(31),
    startTime: "11:00",
    endTime: "18:00",
    targetCount: 10,
    slotDuration: 35,
    totalSlots: calcTotalSlots(
      getRelativeDate(30),
      getRelativeDate(31),
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
    startDate: getRelativeDate(-5),
    endDate: getRelativeDate(-3),
    startTime: "10:00",
    endTime: "18:00",
    targetCount: 9,
    slotDuration: 30,
    totalSlots: calcTotalSlots(
      getRelativeDate(-5),
      getRelativeDate(-3),
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
  // --- New Competitions ---
  {
    id: "10",
    name: "Vestlandsmesterskap Skive 2025",
    location: "Bergen Skytebane",
    region: "Vestland",
    eventType: "stevne",
    startDate: getRelativeDate(5),
    endDate: getRelativeDate(7),
    startTime: "08:30",
    endTime: "17:00",
    targetCount: 12,
    slotDuration: 40,
    totalSlots: calcTotalSlots(
      getRelativeDate(5),
      getRelativeDate(7),
      "08:30",
      "17:00",
      12,
      40
    ),
    status: "open",
    classes: ["JEG", "V73", "K5", "AG3", "NV"],
    type: "outdoor",
    organizer: "Bergen Skytterlag",
    description:
      "Årets store skivemesterskap i Vestland. Krevende forhold, premier til " +
      "topp 3 i hver klasse.",
    coordinates: { lat: 60.3913, lng: 5.3221 }, // Bergen
  },
  {
    id: "11",
    name: "Østlandscup Finale",
    location: "Løten Skytehall",
    region: "Innlandet",
    eventType: "stevne",
    startDate: getRelativeDate(45),
    endDate: getRelativeDate(46),
    startTime: "10:00",
    endTime: "16:00",
    targetCount: 8,
    slotDuration: 50,
    totalSlots: calcTotalSlots(
      getRelativeDate(45),
      getRelativeDate(46),
      "10:00",
      "16:00",
      8,
      50
    ),
    status: "open",
    classes: ["R", "ER", "Eldre Junior", "Kikkertklasse"],
    type: "indoor",
    organizer: "Løten Skytterlag",
    description:
      "Spenende finale i Østlandscupen. Hvem stikker av med den gjeve tittelen?",
    coordinates: { lat: 60.8354, lng: 11.3667 }, // Løten
  },
  {
    id: "12",
    name: "Nord-Norsk Mesterskap Felt",
    location: "Bodø Militære Skytefelt",
    region: "Nordland",
    eventType: "stevne",
    startDate: getRelativeDate(1),
    endDate: getRelativeDate(2),
    startTime: "07:00",
    endTime: "19:00",
    targetCount: 15,
    slotDuration: 30,
    totalSlots: calcTotalSlots(
      getRelativeDate(1),
      getRelativeDate(2),
      "07:00",
      "19:00",
      15,
      30
    ),
    status: "closed",
    classes: ["HV", "AG3", "Spesialfelt"],
    type: "outdoor",
    organizer: "Bodø Skyttersamlag",
    description:
      "Tradisjonsrikt feltstevne i vakre Nord-Norge. Utfordrende løyper " +
      "og spektakulær natur.",
    coordinates: { lat: 67.2801, lng: 14.4756 }, // Bodø
  },
  {
    id: "13",
    name: "Nasjonal Skyteskolekonkurranse",
    location: "Landsskytterstevnet Arena",
    region: "Trøndelag",
    eventType: "stevne",
    startDate: getRelativeDate(-1),
    endDate: getRelativeDate(-1),
    startTime: "09:00",
    endTime: "14:00",
    targetCount: 20,
    slotDuration: 20,
    totalSlots: calcTotalSlots(
      getRelativeDate(-1),
      getRelativeDate(-1),
      "09:00",
      "14:00",
      20,
      20
    ),
    status: "open",
    classes: ["Nybygger", "Aspirant", "Rekrutt", "Eldre Rekrutt"],
    type: "outdoor",
    organizer: "Det Frivillige Skyttervesen",
    description:
      "Ungdommens store dag! Konkurranse for deltakere på Skyteskolen " +
      "fra hele landet.",
    coordinates: { lat: 63.4305, lng: 10.3951 }, // Example, assuming near Fiska
  },
  {
    id: "14",
    name: "Kretsmesterskap Grovfelt Akershus",
    location: "Østmarka Skytefelt",
    region: "Viken",
    eventType: "stevne",
    startDate: getRelativeDate(1),
    endDate: getRelativeDate(1),
    startTime: "09:00",
    endTime: "15:00",
    targetCount: 8,
    slotDuration: 45,
    totalSlots: calcTotalSlots(
      getRelativeDate(8),
      getRelativeDate(8),
      "09:00",
      "15:00",
      8,
      45
    ),
    status: "closed",
    classes: ["V55", "V65", "V73", "Klasse 1-5"],
    type: "outdoor",
    organizer: "Akershus Skyttersamlag",
    description:
      "Kretsmesterskap for grovfelt i Akershus. Dessverre avlyst pga. dårlig vær.",
    coordinates: { lat: 59.8837, lng: 10.9328 }, // Eastern Oslo area
  },
  {
    id: "15",
    name: "Innendørs Stangskyting NM",
    location: "Trondheim Skytehall",
    region: "Trøndelag",
    eventType: "stevne",
    startDate: getRelativeDate(60),
    endDate: getRelativeDate(60),
    startTime: "10:00",
    endTime: "17:00",
    targetCount: 6,
    slotDuration: 60,
    totalSlots: calcTotalSlots(
      getRelativeDate(60),
      getRelativeDate(60),
      "10:00",
      "17:00",
      6,
      60
    ),
    status: "closed",
    classes: ["Åpen", "Damer", "Veteran"],
    type: "indoor",
    organizer: "Trondheim Skytterlag",
    description:
      "Norgesmesterskap i innendørs stangskyting. Kun for inviterte skyttere.",
    coordinates: { lat: 63.4305, lng: 10.3951 }, // Trondheim
  },

  // --- Møter (Meetings) ---
  {
    id: "m1",
    name: "Årsmøte 2025",
    location: "DFS Sentral, Oslo",
    region: "Oslo",
    eventType: "møte",
    startDate: getRelativeDate(20),
    endDate: getRelativeDate(20),
    startTime: "10:00",
    endTime: "14:00",
    totalSlots: 50,
    status: "open",
    organizer: "DFS Sentral",
    description:
      "Årsmøte for alle medlemmer. Velkommen til generalforsamling " +
      "med valg av nytt styre og vedtektsendringer.",
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
    startDate: getRelativeDate(-7),
    endDate: getRelativeDate(-7),
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
  // --- New Meetings ---
  {
    id: "m3",
    name: "Medlemsmøte Toten",
    location: "Toten Skytterlag Klubbhus",
    region: "Innlandet",
    eventType: "møte",
    startDate: getRelativeDate(40),
    endDate: getRelativeDate(40),
    startTime: "18:00",
    endTime: "20:00",
    totalSlots: 30,
    status: "open",
    organizer: "Toten Skytterlag",
    description:
      "Åpent medlemsmøte for alle interesserte. Diskusjon om kommende " +
      "arrangementer og sosiale aktiviteter.",
    coordinates: { lat: 60.7945, lng: 10.6919 }, // Toten
    meetingType: "ekstraordinært",
    agenda: [
      "Presentasjon av nye baneplaner",
      "Diskusjon om juleavslutning",
      "Innspill fra medlemmer",
      "Enkel servering",
    ],
  },
  {
    id: "m4",
    name: "Region Vestland: Styreledersamling",
    location: "Thon Hotel Sandven, Norheimsund",
    region: "Vestland",
    eventType: "møte",
    startDate: getRelativeDate(70),
    endDate: getRelativeDate(71),
    startTime: "16:00",
    endTime: "12:00", // Next day, ends at noon
    totalSlots: 25,
    status: "open",
    organizer: "DFS Region Vestland",
    description:
      "Årlig samling for styreledere i skytterlagene i Vestland. Fokus på " +
      "ledelse, rekruttering og fremtidsplaner.",
    coordinates: { lat: 60.3653, lng: 6.1368 }, // Norheimsund
    meetingType: "ordinært",
    agenda: [
      "Velkomst og middag (dag 1)",
      "Innlegg: Rekruttering i skyttersporten",
      "Workshop: Fremtidens skytterlag",
      "Oppsummering og lunsj (dag 2)",
    ],
  },
  {
    id: "m5",
    name: "Online Trenerforum",
    location: "Zoom (Online)",
    region: "Nasjonalt",
    eventType: "møte",
    startDate: getRelativeDate(30),
    endDate: getRelativeDate(30),
    startTime: "19:30",
    endTime: "21:00",
    totalSlots: 100,
    status: "closed", // Already happened
    organizer: "DFS Trenerkomité",
    description:
      "Online forum for skyttertrenere. Diskusjon av nye treningsmetoder " +
      "og erfautveksling.",
    coordinates: { lat: 0, lng: 0 }, // Not physical location
    meetingType: "ordinært",
    agenda: [
      "Introduksjon av ny treningsressurs",
      "Q&A med landslagstrener",
      "Erfaringsdeling i grupper",
    ],
  },

  // --- Kurs (Courses) ---
  {
    id: "k1",
    name: "Sikkerhetskurs for Våpenholdere",
    location: "Bærum Skytebane",
    region: "Oslo",
    eventType: "kurs",
    startDate: getRelativeDate(25),
    endDate: getRelativeDate(26),
    startTime: "09:00",
    endTime: "16:00",
    totalSlots: 20,
    status: "open",
    organizer: "DFS Sentral",
    description:
      "Obligatorisk sikkerhetskurs for alle våpenholdere. Kurset dekker " +
      "våpenbehandling, sikkerhet og lover.",
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
    startDate: getRelativeDate(18),
    endDate: getRelativeDate(18),
    startTime: "10:00",
    endTime: "15:00",
    totalSlots: 15,
    status: "open",
    organizer: "Toten Skytterlag",
    description:
      "Intensivkurs i skytingsteknikk for nybegynnere. Lære grunnleggende " +
      "teknikk og sikkerhet.",
    coordinates: { lat: 60.7945, lng: 10.6919 }, // Toten
    instructor: "Anne Larsen",
    prerequisites: [],
    maxParticipants: 15,
  },
  // --- New Courses ---
  {
    id: "k3",
    name: "Videregående Feltkurs",
    location: "Sogndal Skytebane",
    region: "Vestland",
    eventType: "kurs",
    startDate: getRelativeDate(80),
    endDate: getRelativeDate(81),
    startTime: "09:00",
    endTime: "17:00",
    totalSlots: 10,
    status: "open",
    organizer: "Sogndal Skytterlag",
    description:
      "Fordypningskurs i feltsskyting for erfarne skyttere. Fokus på " +
      "vanskeliug terreng og vindlesing.",
    coordinates: { lat: 61.2183, lng: 7.1009 }, // Sogndal
    instructor: "Bjørn Dale",
    prerequisites: ["Bestått nybegynnerkurs", "Minimum 2 års erfaring"],
    maxParticipants: 10,
  },
  {
    id: "k4",
    name: "Laderkurs for Rifleammunisjon",
    location: "Narvik Skytehall",
    region: "Nordland",
    eventType: "kurs",
    startDate: getRelativeDate(28),
    endDate: getRelativeDate(28),
    startTime: "09:00",
    endTime: "16:00",
    totalSlots: 8,
    status: "full", // Course is full
    organizer: "Narvik Skytterlag",
    description:
      "Lær å lade din egen rifleammunisjon for presisjon og kostnadsbesparelser.",
    coordinates: { lat: 68.4385, lng: 17.427 }, // Narvik
    instructor: "Hans Petter Nilsen",
    prerequisites: ["Sikkerhetskurs for våpenholdere"],
    maxParticipants: 8,
  },
  {
    id: "k5",
    name: "Ungdomstrener 1 Kurs",
    location: "Online",
    region: "Nasjonalt",
    eventType: "kurs",
    startDate: getRelativeDate(22),
    endDate: getRelativeDate(23),
    startTime: "17:00",
    endTime: "21:00", // Ends 21:00 on both days
    totalSlots: 40,
    status: "open",
    organizer: "DFS Ungdomskomité",
    description:
      "Grunnleggende kurs for nye ungdomstrenere. Fokus på pedagogikk, " +
      "sikkerhet og motivasjon.",
    coordinates: { lat: 0, lng: 0 }, // Online
    instructor: "Line Johansen",
    prerequisites: ["Fylt 16 år"],
    maxParticipants: 40,
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
      "Ingrid Jensen", // Added new names
      "Martin Solberg",
      "Solveig Bakke",
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
