"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import type { Competition } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Info,
  Building,
  ChevronRight,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface CompetitionCardProps {
  competition: Competition;
}

export const CompetitionCard = memo(function CompetitionCard({
  competition,
}: CompetitionCardProps) {
  const {
    totalSlots,
    userAvailable,
    availabilityPercentage,
    statusColor,
    statusText,
  } = useMemo(() => {
    // Use deterministic calculation based on competition ID for consistent SSR
    const competitionSeed = competition.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalSlots = competition.totalSlots;

    // Calculate availability percentage deterministically
    const baseAvailability = 60 + (competitionSeed % 30); // 60-90% availability
    const userAvailable = Math.floor((totalSlots * baseAvailability) / 100);
    const availabilityPercentage = (userAvailable / totalSlots) * 100;

    // Determine status color based on availability
    let statusColor = "text-green-600";
    let statusText = "Ledig";

    if (availabilityPercentage === 0) {
      statusColor = "text-red-600";
      statusText = "Fullt";
    } else if (availabilityPercentage < 25) {
      statusColor = "text-orange-600";
      statusText = "Få plasser";
    } else if (availabilityPercentage < 50) {
      statusColor = "text-yellow-600";
      statusText = "Begrenset";
    }

    return {
      totalSlots,
      userAvailable,
      availabilityPercentage,
      statusColor,
      statusText,
    };
  }, [competition.id, competition.totalSlots]);

  return (
    <Link href={`/arrangement/${competition.id}`}>
      <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer h-full group">
        <CardContent className="">
          {/* Header */}
          <div className="mb-4">
            <div className="space-y-2 mb-2">
              <Badge
                variant="outline"
                className={`shrink-0 ${
                  competition.eventType === "stevne"
                    ? "border-orange-500 text-orange-600 bg-orange-50"
                    : competition.eventType === "møte"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-green-500 text-green-600 bg-green-50"
                }`}
              >
                {competition.eventType === "stevne" && "Stevne"}
                {competition.eventType === "møte" && "Møte"}
                {competition.eventType === "kurs" && "Kurs"}
              </Badge>
              <h3 className="text-xl font-bold text-foreground pr-2 line-clamp-2">
                {competition.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {competition.organizer}
            </p>
          </div>

          {/* Details grid */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">
                  {competition.startDate === competition.endDate
                    ? competition.startDate
                    : `${competition.startDate} - ${competition.endDate}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {competition.startTime} - {competition.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">
                  {competition.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">
                  {competition.region}
                </span>
              </div>
            </div>

            {/* Additional details */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground pt-2 border-t border-border/50">
              {/* Stevne-specific details */}
              {competition.eventType === "stevne" && (
                <>
                  {competition.targetCount && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      {competition.targetCount} skiver
                    </span>
                  )}
                  {competition.type && (
                    <span className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 shrink-0" />
                      {competition.type === "indoor" ? "Innendørs" : "Utendørs"}
                    </span>
                  )}
                  {competition.classes && competition.classes.length > 0 && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="flex items-center gap-1.5 cursor-default hover:text-foreground transition-colors">
                          <Info className="h-3.5 w-3.5 shrink-0" />
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
                </>
              )}

              {/* Møte-specific details */}
              {competition.eventType === "møte" && competition.meetingType && (
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                  {competition.meetingType === "ordinært"
                    ? "Ordinært møte"
                    : competition.meetingType === "ekstraordinært"
                    ? "Ekstraordinært møte"
                    : "Øvelsesmøte"}
                </span>
              )}
              {competition.eventType === "møte" &&
                competition.agenda &&
                competition.agenda.length > 0 && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="flex items-center gap-1.5 cursor-default hover:text-foreground transition-colors">
                        <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                        {competition.agenda.length} dagsordenspunkter
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="text-xs">
                        <div className="font-medium mb-1">Dagsorden</div>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {competition.agenda.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}

              {/* Kurs-specific details */}
              {competition.eventType === "kurs" && competition.instructor && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  Instruktør: {competition.instructor}
                </span>
              )}
              {competition.eventType === "kurs" &&
                competition.prerequisites &&
                competition.prerequisites.length > 0 && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <span className="flex items-center gap-1.5 cursor-default hover:text-foreground transition-colors">
                        <Info className="h-3.5 w-3.5 shrink-0" />
                        {competition.prerequisites.length} forutsetninger
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="text-xs">
                        <div className="font-medium mb-1">Forutsetninger</div>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {competition.prerequisites.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
            </div>
          </div>

          {/* Footer with availability and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-1">
              <div className={`text-sm font-semibold ${statusColor}`}>
                {statusText}
              </div>
              <div className="text-xs text-muted-foreground">
                {userAvailable} av {totalSlots} plasser
              </div>
              <div className="w-24 mt-1.5">
                <Meter
                  value={availabilityPercentage}
                  className={`h-2 ${
                    availabilityPercentage === 0
                      ? "[&>div]:bg-red-600"
                      : availabilityPercentage < 25
                      ? "[&>div]:bg-orange-600"
                      : availabilityPercentage < 50
                      ? "[&>div]:bg-yellow-600"
                      : "[&>div]:bg-green-600"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium mr-1">Se detaljer</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
