"use client";

import Link from "next/link";
import type { Competition } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

interface UpcomingEventsWidgetProps {
  events: Competition[];
}

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Kommende arrangement</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/arrangement">
              Se alle
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Ingen kommende arrangementer.
          </div>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/arrangement/${c.id}`}
                className="block rounded-lg border p-3 hover:border-primary/50 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${
                          c.eventType === "stevne"
                            ? "border-orange-500 text-orange-600"
                            : c.eventType === "møte"
                            ? "border-blue-500 text-blue-600"
                            : "border-green-500 text-green-600"
                        }`}
                      >
                        {c.eventType === "stevne" && "Stevne"}
                        {c.eventType === "møte" && "Møte"}
                        {c.eventType === "kurs" && "Kurs"}
                      </Badge>
                      <h4 className="font-medium text-sm truncate">{c.name}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {c.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {c.location}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
