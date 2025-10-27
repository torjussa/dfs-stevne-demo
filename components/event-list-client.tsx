"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompetitionCard } from "@/components/competition-card";
import { EventFilters } from "@/components/event-filters";
import { EventTable } from "@/components/event-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List, Map, Search, X } from "lucide-react";
import type { Competition } from "@/lib/types";
import dynamic from "next/dynamic";

// Dynamic import of EventMap to prevent SSR (Leaflet uses window object)
const EventMap = dynamic(
  () =>
    import("@/components/event-map").then((mod) => ({ default: mod.EventMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg border border-border bg-muted/50 flex items-center justify-center">
        Laster kart...
      </div>
    ),
  }
);

interface EventListClientProps {
  allCompetitions: Competition[];
  filteredCompetitions: Competition[];
  initialFilters: {
    eventType: string;
    region: string;
    search: string;
    status: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export function EventListClient({
  allCompetitions,
  filteredCompetitions,
  initialFilters,
}: EventListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Get viewMode from URL or default to grid
  const viewMode =
    (searchParams.get("view") as "grid" | "list" | "map" | null) || "grid";

  const setViewMode = (mode: "grid" | "list" | "map") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.push(`/?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset to page 1 when filters change
      params.delete("page");

      router.push(`/?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      const viewMode = searchParams.get("view");
      if (viewMode) {
        router.push(`/?view=${viewMode}`);
      } else {
        router.push("/");
      }
    });
  };

  const hasActiveFilters =
    initialFilters.eventType !== "all" ||
    initialFilters.region !== "all" ||
    initialFilters.search !== "" ||
    initialFilters.status !== "all";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <EventFilters
          filters={initialFilters}
          onFiltersChange={handleFilterChange}
          onClearFilters={clearFilters}
          resultCount={filteredCompetitions.length}
          isPending={isPending}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              {filteredCompetitions.length === allCompetitions.length
                ? `Alle eventer (${allCompetitions.length})`
                : `${filteredCompetitions.length} av ${allCompetitions.length} eventer`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredCompetitions.length === 0
                ? "Ingen eventer matcher dine filtre"
                : "Klikk på et event for å se detaljer og melde deg på"}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
              title="Rutemonster"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
              title="Liste"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="h-8 w-8 p-0"
              title="Kart"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {filteredCompetitions.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Ingen eventer funnet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Prøv å justere filtrene dine eller søk etter noe annet. Du kan
                også nullstille alle filtre for å se alle tilgjengelige eventer.
              </p>
              <Button variant="outline" onClick={clearFilters} className="h-10">
                <X className="h-4 w-4 mr-2" />
                Nullstill alle filtre
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "map" ? (
          <EventMap competitions={filteredCompetitions} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <EventTable data={filteredCompetitions} />
        )}
      </div>
    </div>
  );
}
