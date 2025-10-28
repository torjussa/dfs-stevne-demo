"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { Competition } from "@/lib/types";

interface CalendarWidgetProps {
  events: Competition[];
}

export function CalendarWidget({ events }: CalendarWidgetProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Get all dates that have events
  const eventDates = React.useMemo(
    () => new Set(events.map((e) => e.startDate)),
    [events]
  );

  // Get events for the selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    const dateStr = date.toISOString().slice(0, 10);
    return events.filter((e) => e.startDate === dateStr);
  }, [date, events]);

  return (
    <Card>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0 w-full"
          modifiers={{
            event: (d) => eventDates.has(d.toISOString().slice(0, 10)),
          }}
          modifiersClassNames={{
            event:
              "after:absolute after:bottom-0 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full after:left-1/2 after:-translate-x-1/2 rounded-full",
          }}
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t px-3 !pt-3">
        {selectedDateEvents.length > 0 ? (
          <div className="flex w-full flex-col gap-1.5">
            {selectedDateEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-muted after:bg-primary/70 relative rounded-md p-1.5 pl-5 text-xs after:absolute after:inset-y-1.5 after:left-1.5 after:w-0.5 after:rounded-full"
              >
                <div className="font-medium truncate">{event.name}</div>
                <div className="text-muted-foreground text-[10px]">
                  {event.startTime}
                </div>
              </div>
            ))}
            {selectedDateEvents.length > 3 && (
              <div className="text-xs text-muted-foreground pt-1">
                +{selectedDateEvents.length - 3} fler
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground w-full">
            Ingen arrangementer
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
