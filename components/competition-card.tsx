"use client";

import Link from "next/link";
import type { Competition, TimeSlot } from "@/lib/types";
import {
  generateTargets,
  generateTimeSlots,
  generateDateRange,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface CompetitionCardProps {
  competition: Competition;
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const { isAuthenticated, user } = useAuth();

  // Compute user-aware availability to mirror competition detail logic
  const targets = generateTargets(competition.id, competition.targetCount);
  const dates = generateDateRange(competition.startDate, competition.endDate);
  const allSlots: TimeSlot[] = targets.flatMap((t) =>
    dates.flatMap((d) =>
      generateTimeSlots(
        t.id,
        competition.startTime,
        competition.endTime,
        competition.slotDuration,
        d
      )
    )
  );
  const totalSlots = allSlots.length;
  const userAvailable = allSlots.filter((s) => {
    if (!isAuthenticated) return !s.isBooked && !s.isLocked;
    const userClasses = user?.classes || [];
    const isAllowed =
      !s.allowedClasses ||
      s.allowedClasses.some((c) => userClasses.includes(c));
    return !s.isBooked && !s.isLocked && isAllowed;
  }).length;
  const availabilityPercentage = (userAvailable / totalSlots) * 100;

  // Determine status color based on availability
  const getStatusColor = () => {
    if (userAvailable === 0) return "bg-destructive";
    if (availabilityPercentage > 25) return "bg-success";

    return "bg-warning";
  };

  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleDateString("no-NO", { month: "short" });

    if (startDay === endDay) {
      return `${startDay}. ${month}`;
    }
    return `${startDay}. - ${endDay}. ${month}`;
  };

  return (
    <Card className="overflow-hidden border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: title and inline meta */}
          <div className="min-w-0 md:flex-1">
            <h3 className="font-semibold text-base leading-tight truncate">
              {competition.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                {formatDate(competition.startDate, competition.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                {competition.startTime} - {competition.endTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                {competition.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0" />
                {competition.targetCount} skiver
              </span>
              {competition.classes && competition.classes.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="flex items-center gap-1.5 cursor-default">
                      <Info className="h-4 w-4 shrink-0" />
                      {competition.classes.length} klasser
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="text-xs">
                      <div className="font-medium mb-1">Klasser</div>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {competition.classes.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>

          {/* Right: availability and action */}
          <div className="flex items-center gap-3 shrink-0">
            {userAvailable > 0 ? (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor()} text-white whitespace-nowrap`}
              >
                {userAvailable} av {totalSlots}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground whitespace-nowrap px-2 py-1 rounded bg-destructive text-white">
                Fullt
              </span>
            )}
            <Button
              asChild
              size="sm"
              variant={competition.status === "full" ? "secondary" : "outline"}
            >
              <Link href={`/competition/${competition.id}`}>Påmelding</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
