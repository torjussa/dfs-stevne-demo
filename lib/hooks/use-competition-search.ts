"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import type { Competition, FilterOptions } from "@/lib/types";
import { filterCompetitions } from "@/lib/utils";

interface UseCompetitionSearchProps {
  competitions: Competition[];
}

export function useCompetitionSearch({
  competitions,
}: UseCompetitionSearchProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    location: "",
    region: "all",
    classType: "all",
    competitionType: "all",
    status: "all",
    organizer: "",
    eventType: "all",
  });

  const [isPending, startTransition] = useTransition();

  const filteredCompetitions = useMemo(() => {
    return filterCompetitions(competitions, filters);
  }, [competitions, filters]);

  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    startTransition(() => {
      setFilters(newFilters);
    });
  }, []);

  const clearFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        searchTerm: "",
        dateFrom: "",
        dateTo: "",
        location: "",
        region: "all",
        classType: "all",
        competitionType: "all",
        status: "all",
        organizer: "",
        eventType: "all",
      });
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== "" && value !== "all"
    );
  }, [filters]);

  return {
    filters,
    filteredCompetitions,
    isPending,
    hasActiveFilters,
    handleFiltersChange,
    clearFilters,
  };
}
