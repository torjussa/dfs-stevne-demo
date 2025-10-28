"use client";

import { memo } from "react";
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
  Search,
  X,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";
import { DateRangePicker } from "@/components/date-range-picker";

interface EventFiltersProps {
  filters: {
    eventType: string;
    region: string;
    search: string;
    status: string;
    dateFrom?: string;
    dateTo?: string;
  };
  onFiltersChange: (key: string, value: string) => void;
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

const EVENT_TYPES = [
  { value: "all", label: "Alle typer" },
  { value: "stevne", label: "Stevner" },
  { value: "møte", label: "Møter" },
  { value: "kurs", label: "Kurs" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Alle status" },
  { value: "open", label: "Åpne" },
  { value: "full", label: "Fulle" },
  { value: "closed", label: "Lukkede" },
];

export const EventFilters = memo(function EventFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  isPending = false,
}: EventFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.eventType !== "all" ||
    filters.region !== "all" ||
    filters.status !== "all" ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined;

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
                Filtrer arrangementer
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Søk etter event
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Søk etter navn, arrangement eller beskrivelse..."
              value={filters.search}
              onChange={(e) => onFiltersChange("search", e.target.value)}
              className="pl-9 h-10 border-muted-foreground/20 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Event Type - Quick Filter */}
        <div className="space-y-2">
          <Label htmlFor="eventType" className="text-sm font-medium">
            Eventtype
          </Label>
          <Select
            key={`eventType-${filters.eventType}`}
            value={filters.eventType}
            onValueChange={(value) => onFiltersChange("eventType", value)}
          >
            <SelectTrigger className="h-10 border-muted-foreground/20 focus:border-primary/50 transition-colors">
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

        {/* Date Range */}
        <DateRangePicker
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onDateFromChange={(date) => onFiltersChange("dateFrom", date)}
          onDateToChange={(date) => onFiltersChange("dateTo", date)}
          onClear={() => {
            onFiltersChange("dateFrom", "");
            onFiltersChange("dateTo", "");
          }}
        />
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
            key={`region-${filters.region}`}
            value={filters.region}
            onValueChange={(value) => onFiltersChange("region", value)}
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

        {/* Status */}
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-sm font-medium flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            Status
          </Label>
          <Select
            key={`status-${filters.status}`}
            value={filters.status}
            onValueChange={(value) => onFiltersChange("status", value)}
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
