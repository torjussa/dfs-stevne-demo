"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { BookingService } from "@/lib/booking-service";
import { mockCompetitions } from "@/lib/mock-data";
import { Calendar, MapPin } from "lucide-react";

interface RegistrationItem {
  id: string;
  competitionId: string;
  name: string;
  date: string;
  location: string;
}

export function MyRegistrationsWidget() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<RegistrationItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const bookings = BookingService.getUserBookings(user.email);
    const list: RegistrationItem[] = bookings
      .map((b) => {
        const c = mockCompetitions.find((x) => x.id === b.competitionId);
        if (!c) return null;
        return {
          id: b.id,
          competitionId: c.id,
          name: c.name,
          date: c.startDate,
          location: c.location,
        };
      })
      .filter(Boolean) as RegistrationItem[];
    list.sort((a, b) => a.date.localeCompare(b.date));
    setItems(list.slice(0, 3));
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Mine påmeldinger</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/mine-pameldinger">Se alle</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Ingen påmeldinger ennå.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((r) => (
              <Link
                key={r.id}
                href={`/arrangement/${r.competitionId}`}
                className="block rounded-lg border p-2.5 hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-sm truncate">{r.name}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {r.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {r.location}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
