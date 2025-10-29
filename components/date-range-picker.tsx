"use client";

import * as React from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverPositioner,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClear: () => void;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: DateRangePickerProps) {
  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    dateFrom ? new Date(dateFrom) : undefined
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    dateTo ? new Date(dateTo) : undefined
  );

  // Update local state when props change
  React.useEffect(() => {
    setFromDate(dateFrom ? new Date(dateFrom) : undefined);
  }, [dateFrom]);

  React.useEffect(() => {
    setToDate(dateTo ? new Date(dateTo) : undefined);
  }, [dateTo]);

  const hasDates = fromDate || toDate;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tidsperiode</Label>
      <div className="grid grid-cols-2 gap-3">
        {/* From Date */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal border-muted-foreground/20 focus:border-primary/50 transition-colors text-sm",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {fromDate ? format(fromDate, "PP", { locale: nb }) : "Fra"}
                </span>
              </Button>
            }
          />

          <PopoverPositioner>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => {
                  if (date) {
                    setFromDate(date);
                    onDateFromChange(format(date, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </PopoverPositioner>
        </Popover>

        {/* To Date */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal border-muted-foreground/20 focus:border-primary/50 transition-colors text-sm",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {toDate ? format(toDate, "PP", { locale: nb }) : "Til"}
                </span>
              </Button>
            }
          />

          <PopoverPositioner>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(date) => {
                  if (date) {
                    setToDate(date);
                    onDateToChange(format(date, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
                disabled={(date) => (fromDate ? date < fromDate : false)}
              />
            </PopoverContent>
          </PopoverPositioner>
        </Popover>
      </div>
      {hasDates && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFromDate(undefined);
            setToDate(undefined);
            onClear();
          }}
          className="h-8 w-full text-xs"
        >
          Nullstill dato
        </Button>
      )}
    </div>
  );
}
