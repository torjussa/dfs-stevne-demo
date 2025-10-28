"use client";

import { useTransition, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CompetitionCard } from "@/components/competition-card";
import { EventFilters } from "@/components/event-filters";
import { EventTable } from "@/components/event-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Grid,
  List,
  Map,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Competition } from "@/lib/types";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

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

// Pagination constants
const GRID_VIEW_ITEMS_PER_PAGE = 12;
const LIST_VIEW_ITEMS_PER_PAGE = 10; // Table has its own pagination

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get viewMode from URL or default to grid
  const viewMode =
    (searchParams.get("view") as "grid" | "list" | "map" | null) || "grid";

  // Pagination state (only for grid view, table has its own)
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(
    filteredCompetitions.length / GRID_VIEW_ITEMS_PER_PAGE
  );

  // Slice data for grid view pagination
  const paginatedCompetitions = useMemo(() => {
    if (viewMode === "grid") {
      const startIndex = (currentPage - 1) * GRID_VIEW_ITEMS_PER_PAGE;
      const endIndex = startIndex + GRID_VIEW_ITEMS_PER_PAGE;
      return filteredCompetitions.slice(startIndex, endIndex);
    }
    return filteredCompetitions;
  }, [filteredCompetitions, currentPage, viewMode]);

  const setViewMode = (mode: "grid" | "list" | "map") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    params.delete("page"); // Reset to page 1 when switching views
    router.push(`${pathname}?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
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

      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      const viewMode = searchParams.get("view");
      if (viewMode) {
        router.push(`${pathname}?view=${viewMode}`);
      } else {
        router.push(pathname);
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
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "grid" | "list" | "map")}
        >
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
            <TabsList className="p-1 bg-muted/30 rounded-lg">
              <TabsTab value="grid" title="Rutemonster">
                <Grid className="h-4 w-4" />
                <span>Rutemonster</span>
              </TabsTab>
              <TabsTab value="list" title="Liste">
                <List className="h-4 w-4" />
                <span>Liste</span>
              </TabsTab>
              <TabsTab value="map" title="Kart">
                <Map className="h-4 w-4" />
                <span>Kart</span>
              </TabsTab>
            </TabsList>
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
                  også nullstille alle filtre for å se alle tilgjengelige
                  eventer.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Nullstill alle filtre
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsPanel value="map">
                <EventMap competitions={filteredCompetitions} />
              </TabsPanel>
              <TabsPanel value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </div>

                {/* Grid View Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Forrige
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(totalPages, 7) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className="h-10 w-10 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10"
                    >
                      Neste
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </TabsPanel>
              <TabsPanel value="list">
                <EventTable data={filteredCompetitions} />
              </TabsPanel>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
