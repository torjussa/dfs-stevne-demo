"use client";

import { useState, memo } from "react";
import { CompetitionCard } from "@/components/competition-card";
import { CompetitionFilters } from "@/components/competition-filters";
import { useCompetitionSearch } from "@/lib/hooks/use-competition-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, List, Search, X } from "lucide-react";
import type { Competition } from "@/lib/types";

interface CompetitionListProps {
  initialCompetitions: Competition[];
}

export const CompetitionList = memo(function CompetitionList({
  initialCompetitions,
}: CompetitionListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    filters,
    filteredCompetitions,
    isPending,
    hasActiveFilters,
    handleFiltersChange,
    clearFilters,
  } = useCompetitionSearch({ competitions: initialCompetitions });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <CompetitionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
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
              {filteredCompetitions.length === initialCompetitions.length
                ? `Alle stevner (${initialCompetitions.length})`
                : `${filteredCompetitions.length} av ${initialCompetitions.length} stevner`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredCompetitions.length === 0
                ? "Ingen stevner matcher dine filtre"
                : "Klikk på et stevne for å se detaljer og melde deg på"}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
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
                Ingen stevner funnet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Prøv å justere filtrene dine eller søk etter noe annet. Du kan
                også nullstille alle filtre for å se alle tilgjengelige stevner.
              </p>
              <Button variant="outline" onClick={clearFilters} className="h-10">
                <X className="h-4 w-4 mr-2" />
                Nullstill alle filtre
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1" : "grid-cols-1"
            }`}
          >
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
