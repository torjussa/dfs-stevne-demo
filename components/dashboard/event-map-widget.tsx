"use client";

import type { Competition } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventMap } from "@/components/event-map";

export function EventMapWidget({ events }: { events: Competition[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kart</CardTitle>
      </CardHeader>
      <CardContent>
        <EventMap competitions={events} />
      </CardContent>
    </Card>
  );
}
