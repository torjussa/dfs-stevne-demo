"use client";

import { useState, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  Target,
  Building,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { FilterOptions } from "@/lib/types";

interface CompetitionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  resultCount: number;
  isPending?: boolean;
}

const REGIONS = [
  { value: "all", label: "Alle regioner" },
  { value: "Oslo", label: "Oslo" },
  { value: "Vestland", label: "Vestland" },
  { value: "Innlandet", label: "Innlandet" },
  { value: "Trøndelag", label: "Trøndelag" },
  { value: "Nordland", label: "Nordland" },
  { value: "Troms og Finnmark", label: "Troms og Finnmark" },
  { value: "Agder", label: "Agder" },
  { value: "Vestfold og Telemark", label: "Vestfold og Telemark" },
  { value: "Møre og Romsdal", label: "Møre og Romsdal" },
  { value: "Rogaland", label: "Rogaland" },
];

const CLASS_TYPES = [
  { value: "all", label: "Alle klasser" },
  { value: "R", label: "R" },
  { value: "HK416", label: "HK416" },
  { value: "JEG", label: "JEG" },
  { value: "KIK", label: "KIK" },
  { value: "Å", label: "Å" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "EJ", label: "EJ" },
  { value: "J", label: "J" },
  { value: "v55", label: "v55" },
  { value: "v65", label: "v65" },
  { value: "v75", label: "v75" },
  { value: "NU", label: "NU" },
  { value: "ER", label: "ER" },
];

const COMPETITION_TYPES = [
  { value: "all", label: "Alle typer" },
  { value: "indoor", label: "Innendørs" },
  { value: "outdoor", label: "Utendørs" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Alle status" },
  { value: "open", label: "Åpne" },
  { value: "full", label: "Fulle" },
  { value: "closed", label: "Lukkede" },
];

const EVENT_TYPES = [
  { value: "all", label: "Alle typer" },
  { value: "stevne", label: "Stevner" },
  { value: "møte", label: "Møter" },
  { value: "kurs", label: "Kurs" },
];

export const CompetitionFilters = memo(function CompetitionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isPending = false,
}: CompetitionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = useCallback(
    (key: keyof FilterOptions, value: string) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== "all"
  );

  // Count only advanced filters (region, classType, competitionType, status, organizer)
  const activeFilterCount = [
    filters.region,
    filters.classType,
    filters.competitionType,
    filters.status,
    filters.organizer,
  ].filter((value) => value !== "" && value !== "all").length;

  return (
    <Card className="w-full shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Filtrer stevner
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Søk etter stevne
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Søk etter navn, arrangør eller beskrivelse..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-9 h-10 border-muted-foreground/20 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tidsperiode</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="date-from"
                className="text-xs text-muted-foreground"
              >
                Fra dato
              </Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="date-to"
                className="text-xs text-muted-foreground"
              >
                Til dato
              </Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger
            className="w-full flex items-center justify-between h-10 px-3 py-2 text-sm font-medium text-left bg-background border border-muted-foreground/20 rounded-md hover:border-primary/50 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            disabled={isPending}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Flere filtre</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs font-medium">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-muted-foreground/10">
              {/* Event Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="eventType"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  Eventtype
                </Label>
                <Select
                  value={filters.eventType}
                  onValueChange={(value) =>
                    handleFilterChange("eventType", value)
                  }
                >
                  <SelectTrigger className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Velg eventtype" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Region
                </Label>
                <Select
                  value={filters.region}
                  onValueChange={(value) => handleFilterChange("region", value)}
                >
                  <SelectTrigger className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Velg region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Competition Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Stevnetype
                </Label>
                <Select
                  value={filters.competitionType}
                  onValueChange={(value) =>
                    handleFilterChange("competitionType", value)
                  }
                >
                  <SelectTrigger className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Velg type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPETITION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Class Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="class"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Klasse
                </Label>
                <Select
                  value={filters.classType}
                  onValueChange={(value) =>
                    handleFilterChange("classType", value)
                  }
                >
                  <SelectTrigger className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Velg klasse" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_TYPES.map((classType) => (
                      <SelectItem key={classType.value} value={classType.value}>
                        {classType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Status
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors">
                    <SelectValue placeholder="Velg status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Organizer */}
              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-sm font-medium">
                  Arrangør
                </Label>
                <Input
                  id="organizer"
                  placeholder="Søk etter arrangør..."
                  value={filters.organizer}
                  onChange={(e) =>
                    handleFilterChange("organizer", e.target.value)
                  }
                  className="h-9 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        {hasActiveFilters && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1 h-9 border-muted-foreground/20 hover:border-destructive/50 hover:text-destructive transition-colors"
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Nullstill alle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
