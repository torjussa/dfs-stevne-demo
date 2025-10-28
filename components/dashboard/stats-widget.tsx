"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar, Users } from "lucide-react";

interface StatsWidgetProps {
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    openEvents: number;
    closedEvents: number;
    courses: number;
    meetings: number;
    competitions: number;
  };
}

export function StatsWidget({ stats }: StatsWidgetProps) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-lg">Oversikt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main stat */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {stats.totalEvents}
            </div>
            <div className="text-xs text-muted-foreground">
              Aktive arrangementer
            </div>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="text-lg font-semibold">
                {stats.upcomingEvents}
              </div>
              <div className="text-[10px] text-muted-foreground">Kommende</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <div className="text-lg font-semibold">{stats.openEvents}</div>
              <div className="text-[10px] text-muted-foreground">Åpne</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
