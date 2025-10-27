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
