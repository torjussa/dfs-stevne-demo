"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  mockCompetitions,
  generateTargets,
  generateTimeSlots,
  generateDateRange,
} from "@/lib/mock-data";
import type { TimeSlot } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { AuthHeader } from "@/components/auth-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BookingDialog } from "@/components/booking-dialog";
// Drawer removed for desktop-only view

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const competition = mockCompetitions.find((c) => c.id === id);
  const { isAuthenticated, login, user } = useAuth();

  const [bookings, setBookings] = useState<Map<string, TimeSlot[]>>(new Map());
  const [selectedSlot, setSelectedSlot] = useState<{
    targetId: string;
    slotId: string;
    date?: string;
  } | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [expandedTimes, setExpandedTimes] = useState<Set<string>>(new Set());
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  // Mobile-specific UI removed – only desktop behavior remains

  useEffect(() => {
    if (competition) {
      const targets = generateTargets(competition.id, competition.targetCount);
      const dates = generateDateRange(
        competition.startDate,
        competition.endDate
      );
      const bookingsMap = new Map(
        targets.map((target) => {
          const allSlots = dates.flatMap((date) =>
            generateTimeSlots(
              target.id,
              competition.startTime,
              competition.endTime,
              competition.slotDuration,
              date
            )
          );
          return [target.id, allSlots] as const;
        })
      );
      setBookings(bookingsMap);

      setExpandedTimes(new Set());
    }
  }, [competition]);

  // No mobile casing

  if (!competition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stevne ikke funnet</h1>
          <Button asChild>
            <Link href="/">Tilbake til oversikt</Link>
          </Button>
        </div>
      </div>
    );
  }

  const targets = generateTargets(competition.id, competition.targetCount);

  const handleBooking = (
    targetId: string,
    slotId: string,
    userName: string,
    userClass: string
  ) => {
    setBookings((prev) => {
      const next = new Map(prev);
      const targetSlots = next.get(targetId) || [];
      const updatedSlots = targetSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              isBooked: true,
              bookedByName: userName,
              bookedByClass: userClass,
            }
          : slot
      );
      next.set(targetId, updatedSlots);
      return next;
    });
    setSelectedSlot(null);
  };

  const handleMultiBooking = (userName: string, userClass: string) => {
    setBookings((prev) => {
      const next = new Map(prev);
      selectedSlots.forEach((slotKey) => {
        const [targetId, slotId] = slotKey.split(":");
        const targetSlots = next.get(targetId) || [];
        const updatedSlots = targetSlots.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                isBooked: true,
                bookedByName: userName,
                bookedByClass: userClass,
              }
            : slot
        );
        next.set(targetId, updatedSlots);
      });
      return next;
    });
    setSelectedSlots(new Set());
  };

  // Group by time, then date to support side-by-side day columns
  const timeSlotGroupsByDate = new Map<
    string,
    Map<string, { targetId: string; slot: TimeSlot }[]>
  >();

  bookings.forEach((slots, targetId) => {
    slots.forEach((slot) => {
      if (!timeSlotGroupsByDate.has(slot.time)) {
        timeSlotGroupsByDate.set(slot.time, new Map());
      }
      const byDate = timeSlotGroupsByDate.get(slot.time)!;
      if (!byDate.has(slot.date)) {
        byDate.set(slot.date, []);
      }
      byDate.get(slot.date)!.push({ targetId, slot });
    });
  });

  const sortedTimes = Array.from(timeSlotGroupsByDate.keys()).sort();
  const sortedDates = competition
    ? generateDateRange(competition.startDate, competition.endDate)
    : [];
  const columnPx = 420;
  const totalSlotsCount = Array.from(bookings.values()).reduce(
    (sum, slots) => sum + slots.length,
    0
  );
  const userAvailableForEvent = Array.from(bookings.values()).reduce(
    (sum, slots) =>
      sum +
      slots.filter((s) => {
        if (!isAuthenticated) return !s.isBooked && !s.isLocked;
        const userClasses = user?.classes || [];
        const isAllowed =
          !s.allowedClasses ||
          s.allowedClasses.some((c) => userClasses.includes(c));
        return !s.isBooked && !s.isLocked && isAllowed;
      }).length,
    0
  );

  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleDateString("no-NO", { month: "long" });
    const year = start.getFullYear();

    if (startDay === endDay) {
      return `${startDay}. ${month} ${year}`;
    }
    return `${startDay}. - ${endDay}. ${month} ${year}`;
  };

  const toggleTimeSlot = (date: string, time: string) => {
    const key = `${date}|${time}`;
    setExpandedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-[1600px]">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Tilbake
              </Link>
            </Button>
            <AuthHeader />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-balance">
                {competition.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Arrangør: {competition.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:gap-4">
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Dato</span>
                  <span className="text-sm font-semibold">
                    {formatDate(competition.startDate, competition.endDate)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md">
                <Clock className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Tid</span>
                  <span className="text-sm font-semibold">
                    {competition.startTime} - {competition.endTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md">
                <Target className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Tilgjengelig
                  </span>
                  <span className="text-sm font-semibold">
                    {userAvailableForEvent} av {totalSlotsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        {!isAuthenticated && (
          <Card className="mb-8 border-primary bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">
                    Logg inn for å reservere
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Du må være logget inn for å kunne reservere tidspunkt
                  </p>
                </div>
                <Button size="lg" onClick={login}>
                  Logg inn
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Tidspunkt og skiver</h2>
            <p className="text-muted-foreground">
              Klikk på en rad for å utvide og se detaljer
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2">Informasjon</h3>
                  <p className="text-sm text-muted-foreground">
                    {isInfoExpanded ? (
                      <>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur.
                        <br />
                        <br />
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium.
                      </>
                    ) : (
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                    )}
                  </p>
                  <button
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="text-sm text-primary hover:underline mt-2 font-medium"
                  >
                    {isInfoExpanded ? "Vis mindre" : "Les mer"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day columns with per-day collapsible time rows (desktop only) */}
          <div className="overflow-x-auto">
            <div className="flex justify-center">
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${sortedDates.length}, ${columnPx}px)`,
                }}
              >
                {sortedDates.map((date) => {
                  const dateLabel = new Date(date).toLocaleDateString("no-NO", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  });
                  return (
                    <div key={date} className="min-w-[320px]">
                      <h3 className="px-4 py-3 bg-muted/30 text-lg">
                        {dateLabel.substring(0, 1).toUpperCase() +
                          dateLabel.substring(1)}
                      </h3>
                      <div className="space-y-2">
                        {sortedTimes.map((time) => {
                          const byDate =
                            timeSlotGroupsByDate.get(time) ||
                            new Map<
                              string,
                              { targetId: string; slot: TimeSlot }[]
                            >();
                          const slotsForDateTime = (
                            byDate.get(date) || []
                          ).sort(
                            (
                              a: { targetId: string; slot: TimeSlot },
                              b: { targetId: string; slot: TimeSlot }
                            ) => {
                              const targetA = targets.find(
                                (t) => t.id === a.targetId
                              );
                              const targetB = targets.find(
                                (t) => t.id === b.targetId
                              );
                              return (
                                (targetA?.targetNumber || 0) -
                                (targetB?.targetNumber || 0)
                              );
                            }
                          );
                          const availableCount = slotsForDateTime.filter(
                            ({ slot }) => {
                              if (!isAuthenticated)
                                return !slot.isBooked && !slot.isLocked;
                              const userClasses = isAuthenticated
                                ? user?.classes || []
                                : [];
                              const isAllowed =
                                !slot.allowedClasses ||
                                slot.allowedClasses.some((c) =>
                                  userClasses.includes(c)
                                );
                              return (
                                !slot.isBooked && !slot.isLocked && isAllowed
                              );
                            }
                          ).length;
                          const totalCount = slotsForDateTime.length;
                          const displayAvailable = Math.min(
                            availableCount,
                            userAvailableForEvent
                          );
                          const key = `${date}|${time}`;
                          const isExpanded = expandedTimes.has(key);
                          const isFull = displayAvailable === 0;

                          return (
                            <Card
                              key={key}
                              className={"overflow-hidden transition-all"}
                            >
                              <button
                                onClick={() => toggleTimeSlot(date, time)}
                                className={`w-full cursor-pointer px-6 transition-colors py-3 flex items-center justify-between ${
                                  isFull
                                    ? "bg-primary/70"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                }`}
                              >
                                <div className="flex justify-between w-full gap-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    <span className="font-semibold">
                                      {time}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs font-medium ${
                                      isFull
                                        ? "bg-secondary text-foreground/80 border-border"
                                        : availableCount <= 2
                                        ? "bg-amber-100 text-amber-900 border-amber-200"
                                        : "bg-emerald-100 text-emerald-900 border-emerald-200"
                                    }`}
                                  >
                                    <span className="font-bold">
                                      {displayAvailable}
                                    </span>
                                    /{totalCount}
                                  </Badge>
                                </div>
                              </button>
                              {isExpanded && (
                                <CardContent className="p-0">
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b bg-muted/30">
                                          <th className="px-4 py-3 text-left text-sm font-medium w-20">
                                            Skive
                                          </th>
                                          <th className="px-4 py-3 text-left text-sm font-medium">
                                            Navn
                                          </th>
                                          <th className="px-4 py-3 text-left text-sm font-medium w-24">
                                            Klasse
                                          </th>
                                          <th className="px-4 py-3 text-right text-sm font-medium w-40">
                                            Status
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {slotsForDateTime.map(
                                          ({
                                            targetId,
                                            slot,
                                          }: {
                                            targetId: string;
                                            slot: TimeSlot;
                                          }) => {
                                            const target = targets.find(
                                              (t) => t.id === targetId
                                            );
                                            const slotKey = `${targetId}:${slot.id}`;
                                            const isSelected =
                                              selectedSlots.has(slotKey);
                                            const userClasses = isAuthenticated
                                              ? user?.classes || []
                                              : [];
                                            const isAvailable =
                                              !slot.isBooked &&
                                              !slot.isLocked &&
                                              (!slot.allowedClasses ||
                                                slot.allowedClasses.some((c) =>
                                                  userClasses.includes(c)
                                                ));
                                            return (
                                              <tr
                                                key={slot.id}
                                                className={`border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                                                  isSelected
                                                    ? "bg-primary/5"
                                                    : ""
                                                }`}
                                              >
                                                <td className="px-4 py-3">
                                                  <span className="font-semibold">
                                                    {target?.targetNumber}
                                                  </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                  {slot.isBooked &&
                                                  slot.bookedByName ? (
                                                    <span className="text-sm">
                                                      {slot.bookedByName}
                                                    </span>
                                                  ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                      -
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="px-4 py-3">
                                                  {slot.isBooked &&
                                                  slot.bookedByClass ? (
                                                    <span className="text-sm font-medium">
                                                      {slot.bookedByClass}
                                                    </span>
                                                  ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                      -
                                                    </span>
                                                  )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                  <div className="flex items-center justify-end gap-2">
                                                    {slot.isBooked ? (
                                                      <Badge
                                                        variant="secondary"
                                                        className="bg-secondary text-foreground/80 border-border"
                                                      >
                                                        Reservert
                                                      </Badge>
                                                    ) : slot.isLocked ? (
                                                      <HoverCard>
                                                        <HoverCardTrigger
                                                          asChild
                                                        >
                                                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 cursor-default">
                                                            Låst
                                                          </Badge>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                          <div className="text-xs">
                                                            En annen skytter
                                                            holder på å
                                                            reservere denne
                                                            tiden.
                                                          </div>
                                                        </HoverCardContent>
                                                      </HoverCard>
                                                    ) : !isAuthenticated &&
                                                      !slot.isBooked &&
                                                      !slot.isLocked ? (
                                                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                                                        Ledig
                                                      </Badge>
                                                    ) : !isAvailable ? (
                                                      <HoverCard>
                                                        <HoverCardTrigger
                                                          asChild
                                                        >
                                                          <Badge className="bg-gray-200 text-gray-600 border-gray-300 cursor-default flex items-center gap-1">
                                                            <Info className="h-3.5 w-3.5" />
                                                            Utilgjengelig
                                                          </Badge>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                          <div className="text-xs">
                                                            Ikke tilgjengelig
                                                            for dine klasser.
                                                          </div>
                                                        </HoverCardContent>
                                                      </HoverCard>
                                                    ) : null}
                                                    {isAvailable &&
                                                    isAuthenticated ? (
                                                      <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                          setSelectedSlot({
                                                            targetId,
                                                            slotId: slot.id,
                                                            date: slot.date,
                                                          })
                                                        }
                                                      >
                                                        Reserver
                                                      </Button>
                                                    ) : null}
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* No separate mobile list */}
        </div>
      </div>

      {/* Mobile drawer for a selected time */}
      {/* Drawer removed */}

      {selectedSlot && (
        <BookingDialog
          open={!!selectedSlot}
          onOpenChange={(open) => !open && setSelectedSlot(null)}
          onConfirm={(userName, userClass) => {
            if (selectedSlot.targetId === "multi") {
              handleMultiBooking(userName, userClass);
            } else {
              handleBooking(
                selectedSlot.targetId,
                selectedSlot.slotId,
                userName,
                userClass
              );
            }
          }}
          targetNumber={
            selectedSlot.targetId === "multi"
              ? 0
              : targets.find((t) => t.id === selectedSlot.targetId)
                  ?.targetNumber || 0
          }
          time={
            selectedSlot.targetId === "multi"
              ? `${selectedSlots.size} plasser`
              : bookings
                  .get(selectedSlot.targetId)
                  ?.find((s) => s.id === selectedSlot.slotId)?.time || ""
          }
          date={selectedSlot.date}
          location={competition.location}
        />
      )}
    </div>
  );
}
