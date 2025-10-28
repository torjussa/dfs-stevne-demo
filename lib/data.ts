import { mockCompetitions } from "./mock-data";
import type { Competition } from "./types";

// Server-side data fetching functions
export async function getCompetitions(): Promise<Competition[]> {
  // In a real app, this would fetch from a database
  // For now, we return the mock data
  return mockCompetitions;
}

export async function getCompetitionById(
  id: string
): Promise<Competition | null> {
  const competitions = await getCompetitions();
  return competitions.find((competition) => competition.id === id) || null;
}

export async function getCompetitionsByRegion(
  region: string
): Promise<Competition[]> {
  const competitions = await getCompetitions();
  return competitions.filter((competition) => competition.region === region);
}

export async function getCompetitionsByType(
  type: "indoor" | "outdoor"
): Promise<Competition[]> {
  const competitions = await getCompetitions();
  return competitions.filter((competition) => competition.type === type);
}

// Dashboard helpers
export async function getUpcomingEvents(limit = 7): Promise<Competition[]> {
  const competitions = await getCompetitions();
  const today = new Date().toISOString().slice(0, 10);
  return competitions
    .filter((c) => c.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export async function getEventStats(): Promise<{
  totalEvents: number;
  upcomingEvents: number;
  openEvents: number;
  closedEvents: number;
  courses: number;
  meetings: number;
  competitions: number;
}> {
  const competitions = await getCompetitions();
  const today = new Date().toISOString().slice(0, 10);
  const totalEvents = competitions.length;
  const upcomingEvents = competitions.filter((c) => c.endDate >= today).length;
  const openEvents = competitions.filter((c) => c.status === "open").length;
  const closedEvents = competitions.filter((c) => c.status === "closed").length;
  const courses = competitions.filter((c) => c.eventType === "kurs").length;
  const meetings = competitions.filter((c) => c.eventType === "møte").length;
  const competitionsCount = competitions.filter(
    (c) => c.eventType === "stevne"
  ).length;
  return {
    totalEvents,
    upcomingEvents,
    openEvents,
    closedEvents,
    courses,
    meetings,
    competitions: competitionsCount,
  };
}

export async function getRecentNotifications(): Promise<
  Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    read?: boolean;
  }>
> {
  // Mock notifications for dashboard
  const today = new Date();
  const format = (d: Date) => d.toISOString();
  return [
    {
      id: "n1",
      title: "Nytt stevne publisert",
      message: "Vestlandsmesterskap Skive 2025 er nå publisert.",
      date: format(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    },
    {
      id: "n2",
      title: "Påminnelse: Årsmøte 2025",
      message: "Husk årsmøte i DFS Sentral neste uke kl 10:00.",
      date: format(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    },
    {
      id: "n3",
      title: "Kurs: Skyteteknikk for nybegynnere",
      message: "Nytt kurs er tilgjengelig hos Toten Skytterlag.",
      date: format(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
      read: true,
    },
  ];
}
