"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { BookingService } from "@/lib/booking-service";
import { mockCompetitions } from "@/lib/mock-data";

interface Registration {
  competitionId: string;
  competitionName: string;
  organizer: string;
  date: string;
  location: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
}

export default function MyRegistrationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    if (user && isAuthenticated) {
      // Get all bookings for this user
      const bookings = BookingService.getUserBookings(user.email);

      // Convert bookings to registration format
      const registrations: Registration[] = bookings
        .map((booking) => {
          const competition = mockCompetitions.find(
            (c) => c.id === booking.competitionId
          );
          if (competition) {
            return {
              competitionId: booking.competitionId,
              competitionName: competition.name,
              organizer: competition.organizer,
              date: competition.startDate,
              location: competition.location,
              time: competition.startTime,
              status: "confirmed" as const,
            };
          }
          return null;
        })
        .filter((r) => r !== null) as Registration[];

      setMyRegistrations(registrations);
    }
  }, [user, isAuthenticated]);

  return (
    <>
      <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Target className="h-8 w-8" />
              Mine påmeldinger
            </h1>
            <p className="text-muted-foreground">
              Oversikt over alle dine registrerte arrangementer, stevner, møter
              og kurs
            </p>
          </div>

          {/* Content */}
          {myRegistrations.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Ingen påmeldinger ennå
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Du har ikke meldt deg på noen arrangementer ennå. Utforsk
                  tilgjengelige stevner, møter og kurs for å melde deg på.
                </p>
                <Button asChild>
                  <Link href="/arrangement">
                    Se tilgjengelige arrangementer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myRegistrations.map((registration) => (
                <Card
                  key={registration.competitionId}
                  className="hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {registration.competitionName}
                          <Badge
                            variant="outline"
                            className={
                              registration.status === "confirmed"
                                ? "border-green-500 text-green-600"
                                : registration.status === "pending"
                                ? "border-yellow-500 text-yellow-600"
                                : "border-red-500 text-red-600"
                            }
                          >
                            {registration.status === "confirmed" && (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Bekreftet
                              </>
                            )}
                            {registration.status === "pending" && "Venter"}
                            {registration.status === "cancelled" && (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Avmeldt
                              </>
                            )}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {registration.organizer}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          {registration.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          {registration.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          {registration.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/arrangement/${registration.competitionId}`}
                        >
                          Se detaljer
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
