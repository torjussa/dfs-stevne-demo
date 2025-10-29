import { EventListClient } from "./event-list-client";
import type { Competition } from "@/lib/types";

interface EventListProps {
  initialCompetitions: Competition[];
  eventType?: string;
  region?: string;
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function EventList({
  initialCompetitions,
  eventType,
  region,
  search,
  status,
  dateFrom,
  dateTo,
}: EventListProps) {
  // Server-side filtering based on URL params
  let filteredCompetitions = initialCompetitions;

  if (eventType && eventType !== "all") {
    filteredCompetitions = filteredCompetitions.filter(
      (c) => c.eventType === eventType
    );
  }

  if (region && region !== "all") {
    filteredCompetitions = filteredCompetitions.filter(
      (c) => c.region === region
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredCompetitions = filteredCompetitions.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.organizer.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
    );
  }

  if (status && status !== "all") {
    filteredCompetitions = filteredCompetitions.filter(
      (c) => c.status === status
    );
  }

  if (dateFrom) {
    filteredCompetitions = filteredCompetitions.filter(
      (c) => c.startDate >= dateFrom
    );
  }

  if (dateTo) {
    filteredCompetitions = filteredCompetitions.filter(
      (c) => c.endDate <= dateTo
    );
  }

  return (
    <EventListClient
      allCompetitions={initialCompetitions}
      filteredCompetitions={filteredCompetitions}
      initialFilters={{
        eventType: eventType || "all",
        region: region || "all",
        search: search || "",
        status: status || "all",
        dateFrom: dateFrom,
        dateTo: dateTo,
      }}
    />
  );
}
