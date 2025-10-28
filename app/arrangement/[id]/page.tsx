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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, Info } from "lucide-react";
import { BookingDialog } from "@/components/booking-dialog";
import { BookingService } from "@/lib/booking-service";
// Drawer removed for desktop-only view
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TimeSlotTable } from "@/components/time-slot-table";
import {
  Frame,
  FramePanel,
  FrameHeader,
  FrameTitle,
} from "@/components/ui/frame";

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
  // Expanded state handled by Accordion
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  // Mobile-specific UI removed – only desktop behavior remains
  // Reservation window (10 min) per tidsrad (POC, lokal lagring per bruker)
  const [reservations, setReservations] = useState<Map<string, number>>(
    new Map()
  ); // slotId -> expiresAt
  const [nowTs, setNowTs] = useState<number>(Date.now());
  const RESERVATION_MINUTES = 10;
  const SESSION_MINUTES = 15;
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [hasRefreshedAfterExpiry, setHasRefreshedAfterExpiry] = useState(false);
  const sessionStorageKey = (competitionId: string) =>
    `dfs-session-${competitionId}-${user?.email || "anon"}`;

  const reservationStorageKey = (competitionId: string) =>
    `dfs-slot-reservations-${competitionId}-${user?.email || "anon"}`;

  const loadReservations = (competitionId: string) => {
    if (typeof window === "undefined") return new Map<string, number>();
    try {
      const raw = localStorage.getItem(reservationStorageKey(competitionId));
      const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      const now = Date.now();
      const valid = Object.entries(data).filter(([, exp]) => exp > now);
      return new Map(valid);
    } catch {
      return new Map<string, number>();
    }
  };

  const persistReservations = (
    competitionId: string,
    map: Map<string, number>
  ) => {
    if (typeof window === "undefined") return;
    const obj: Record<string, number> = {};
    map.forEach((v, k) => {
      if (v > Date.now()) obj[k] = v;
    });
    localStorage.setItem(
      reservationStorageKey(competitionId),
      JSON.stringify(obj)
    );
  };

  useEffect(() => {
    if (competition) {
      // Only generate targets for stevner (competitions)
      if (
        competition.eventType === "stevne" &&
        competition.targetCount &&
        competition.slotDuration
      ) {
        const targets = generateTargets(
          competition.id,
          competition.targetCount
        );
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
                competition.slotDuration!,
                date
              )
            );
            return [target.id, allSlots] as const;
          })
        );
        setBookings(bookingsMap);
      }

      // Load existing reservations and start ticker
      setReservations(loadReservations(competition.id));
      // Initialize or read global session
      try {
        const raw = localStorage.getItem(sessionStorageKey(competition.id));
        const stored = raw ? parseInt(raw, 10) : NaN;
        const now = Date.now();
        if (!isNaN(stored) && stored > now) {
          setSessionExpiresAt(stored);
        } else {
          const exp = now + SESSION_MINUTES * 60 * 1000;
          setSessionExpiresAt(exp);
          localStorage.setItem(sessionStorageKey(competition.id), String(exp));
        }
      } catch {
        const exp = Date.now() + SESSION_MINUTES * 60 * 1000;
        setSessionExpiresAt(exp);
      }
      setHasRefreshedAfterExpiry(false);
    }
  }, [competition]);
  // Tick countdown and clear expired
  useEffect(() => {
    if (!competition) return;
    const interval = setInterval(() => {
      setNowTs(Date.now());
      setReservations((prev) => {
        const now = Date.now();
        let changed = false;
        const next = new Map<string, number>();
        prev.forEach((exp, k) => {
          if (exp > now) next.set(k, exp);
          else changed = true;
        });
        if (changed) persistReservations(competition.id, next);
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [competition?.id]);

  const refreshSlotsFromStorage = () => {
    if (!competition) return;
    if (
      competition.eventType === "stevne" &&
      competition.targetCount &&
      competition.slotDuration
    ) {
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
              competition.slotDuration!,
              date
            )
          );
          return [target.id, allSlots] as const;
        })
      );

      const persistedBookings = BookingService.getCompetitionBookings(
        competition.id
      );
      persistedBookings.forEach((booking) => {
        const targetSlots = bookingsMap.get(booking.targetId);
        if (targetSlots) {
          const idx = targetSlots.findIndex((s) => s.id === booking.timeSlotId);
          if (idx !== -1) {
            targetSlots[idx] = {
              ...targetSlots[idx],
              isBooked: true,
              bookedByName: booking.userName,
            };
          }
        }
      });
      setBookings(bookingsMap);
    }
  };

  useEffect(() => {
    if (!competition || !sessionExpiresAt) return;
    if (nowTs >= sessionExpiresAt && !hasRefreshedAfterExpiry) {
      refreshSlotsFromStorage();
      setSelectedSlots(new Set());
      setReservations(new Map());
      setHasRefreshedAfterExpiry(true);
    }
  }, [nowTs, sessionExpiresAt, competition, hasRefreshedAfterExpiry]);

  // No manual restart; session auto-initializes on mount and expires automatically

  const startReservation = (slotId: string) => {
    if (!competition) return;
    const expiresAt = Date.now() + RESERVATION_MINUTES * 60 * 1000;
    setReservations((prev) => {
      const next = new Map(prev);
      next.set(slotId, expiresAt);
      persistReservations(competition.id, next);
      return next;
    });
  };

  const formatCountdown = (expiresAt: number) => {
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

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

  const targets =
    competition.eventType === "stevne" && competition.targetCount
      ? generateTargets(competition.id, competition.targetCount)
      : [];

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

  const handleUnbook = (targetId: string, slotId: string) => {
    setBookings((prev) => {
      const next = new Map(prev);
      const targetSlots = next.get(targetId) || [];
      const updatedSlots = targetSlots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              isBooked: false,
              bookedByName: undefined,
              bookedByClass: undefined,
            }
          : slot
      );
      next.set(targetId, updatedSlots);
      return next;
    });
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

  // Toggle select (multi-select) without locking
  const toggleSelectSlot = (targetId: string, slotId: string) => {
    const key = `${targetId}:${slotId}`;
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
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

  // No manual toggle needed; Accordion handles open/close

  return (
    <div className="min-h-screen bg-background">
      {sessionExpiresAt && nowTs < sessionExpiresAt ? (
        <div className="sticky top-0 left-0 z-20 border-b bg-amber-50 text-amber-900">
          <div className="container mx-auto px-4 py-2 max-w-[1600px] flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              {`Sesjon: ${String(
                Math.floor((sessionExpiresAt - nowTs) / 1000 / 60)
              ).padStart(2, "0")}:${String(
                Math.floor(((sessionExpiresAt - nowTs) / 1000) % 60)
              ).padStart(2, "0")}`}{" "}
              – fullfør bookingene dine
            </span>
          </div>
        </div>
      ) : sessionExpiresAt ? (
        <div className="sticky top-0 z-20 border-b bg-destructive/10 text-destructive">
          <div className="container mx-auto px-4 py-2 max-w-[1600px] flex items-center justify-between">
            <span className="text-sm font-medium">
              Sesjonen er utløpt – du har fått oppdatert tidspunkt og skiver
            </span>
          </div>
        </div>
      ) : null}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-[1600px]">
          <div className="flex flex-wrap justify-between gap-4">
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
            <CardContent>
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
            <CardContent>
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

          <div className="overflow-hidden">
            <div className="flex gap-6 pb-1" role="list">
              {sortedDates.map((date) => {
                const dateLabel = new Date(date).toLocaleDateString("no-NO", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                });
                return (
                  <Frame
                    key={date}
                    className="w-[380px] flex-shrink-0 m-0"
                    role="listitem"
                  >
                    <FrameHeader>
                      <FrameTitle>
                        {dateLabel.substring(0, 1).toUpperCase() +
                          dateLabel.substring(1)}
                      </FrameTitle>
                    </FrameHeader>
                    <FramePanel className="not-has-[table]:p-0 not-has-[table]:bg-transparent not-has-[table]:border-0">
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-2"
                      >
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
                          const isFull = displayAvailable === 0;
                          // Per-row badge relies on slot reservations later
                          const expiresAtRow = reservations.get(key);

                          return (
                            <AccordionItem
                              key={key}
                              value={key}
                              className="rounded-xl border bg-background px-4 py-1 outline-none last:border-b has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                            >
                              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                                <div className="flex justify-between w-full items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md flex items-center justify-center">
                                      <Clock className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-base">
                                      {time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {expiresAtRow && expiresAtRow > nowTs ? (
                                      <Badge className="bg-amber-100 text-amber-900 border-amber-300">
                                        Reservert{" "}
                                        {formatCountdown(expiresAtRow)}
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className={
                                          isFull
                                            ? ""
                                            : "border-emerald-200 text-emerald-700 bg-emerald-50"
                                        }
                                      >
                                        {displayAvailable}/{totalCount} ledig
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-2 text-muted-foreground">
                                <TimeSlotTable
                                  slots={slotsForDateTime.map(
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
                                      const userClasses = isAuthenticated
                                        ? user?.classes || []
                                        : [];
                                      const isAvailable =
                                        !slot.isBooked &&
                                        (!slot.allowedClasses ||
                                          slot.allowedClasses.some((c) =>
                                            userClasses.includes(c)
                                          ));
                                      const isBookedByUser =
                                        slot.bookedByName === user?.name;

                                      return {
                                        slotKey: `${targetId}:${slot.id}`,
                                        targetId,
                                        slot,
                                        target,
                                        isBookedByUser,
                                        isAvailable,
                                      };
                                    }
                                  )}
                                  isAuthenticated={isAuthenticated}
                                  onReserve={(targetId, slotId, date) => {
                                    setSelectedSlot({
                                      targetId,
                                      slotId,
                                      date,
                                    });
                                  }}
                                  onUnbook={handleUnbook}
                                />
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </FramePanel>
                  </Frame>
                );
              })}
            </div>
          </div>
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
          reservationExpiresAt={reservations.get(selectedSlot.slotId)}
        />
      )}
    </div>
  );
}
