import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Competition, FilterOptions } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shooter class taxonomies
export const BASE_CLASSES = [
  "NU",
  "ER",
  "R",
  "J",
  "EJ",
  "1",
  "2",
  "3",
  "4",
  "5",
  "v55",
  "v65",
  "v75",
] as const;

export const SPECIAL_CLASSES = ["JEG", "KIK", "Å", "HK416"] as const;

// Deterministic demo helper: decide allowed classes per date+time
// This simulates rules that apply to an entire time, not per slot
export function getAllowedClassesForTime(
  time: string,
  date: string
): string[] | undefined {
  // Hash a simple number from date+time string for determinism
  const seed = Array.from(`${date}-${time}`).reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0
  );

  // 95% of times are available to all classes (return undefined)
  // 5% have restrictions
  if (seed % 20 !== 0) {
    return undefined; // Available to all classes
  }

  // For the remaining 5%, apply restrictions to special classes
  const restrictedPresets: string[][] = [["JEG"], ["HK416"], ["Å"], ["KIK"]];
  return restrictedPresets[seed % restrictedPresets.length];
}

export function filterCompetitions(
  competitions: Competition[],
  filters: FilterOptions
): Competition[] {
  return competitions.filter((competition) => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        competition.name.toLowerCase().includes(searchLower) ||
        competition.location.toLowerCase().includes(searchLower) ||
        competition.organizer.toLowerCase().includes(searchLower) ||
        competition.description?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Date range filter
    if (filters.dateFrom && competition.startDate < filters.dateFrom)
      return false;
    if (filters.dateTo && competition.endDate > filters.dateTo) return false;

    // Region filter
    if (
      filters.region &&
      filters.region !== "all" &&
      competition.region !== filters.region
    )
      return false;

    // Competition type filter
    if (
      filters.competitionType !== "all" &&
      competition.type !== filters.competitionType
    )
      return false;

    // Class type filter
    if (
      filters.classType &&
      filters.classType !== "all" &&
      competition.classes &&
      !competition.classes.includes(filters.classType)
    )
      return false;

    // Status filter
    if (filters.status !== "all" && competition.status !== filters.status)
      return false;

    // Organizer filter
    if (filters.organizer) {
      const organizerLower = filters.organizer.toLowerCase();
      if (!competition.organizer.toLowerCase().includes(organizerLower))
        return false;
    }

    // Event type filter
    if (
      filters.eventType &&
      filters.eventType !== "all" &&
      competition.eventType !== filters.eventType
    )
      return false;

    return true;
  });
}
