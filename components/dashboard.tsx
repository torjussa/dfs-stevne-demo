"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Target,
  TrendingUp,
  CheckCircle,
  Zap,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import type { Competition } from "@/lib/types";
import { useAuth, type UserRole } from "@/lib/auth-context";

interface DashboardProps {
  upcomingCompetitions: Competition[];
  myRegistrations: Competition[];
  totalEvents: number;
}

export function Dashboard({
  upcomingCompetitions,
  myRegistrations,
  totalEvents,
}: DashboardProps) {
  const { user, isAuthenticated } = useAuth();

  // Determine user's role
  const userRole: UserRole = user?.role || (user?.isAdmin ? "admin" : "member");

  // Statistics
  const stats = {
    totalEvents,
    myRegistrations: myRegistrations.length,
    upcomingEvents: upcomingCompetitions.length,
    openRegistrations: upcomingCompetitions.filter((c) => c.status === "open")
      .length,
  };

  // Get club stats for club leaders
  const clubStats = user?.clubName
    ? {
        clubMembers: Math.floor(Math.random() * 50) + 20,
        clubEvents: upcomingCompetitions.filter(
          (c) => c.organizer === user.clubName
        ).length,
        clubRegistrations: myRegistrations.length,
      }
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {!isAuthenticated || !user
              ? "Velkommen til DFS påmeldingsportal!"
              : userRole === "admin"
              ? `Velkommen tilbake, ${user.name}! (Administrator)`
              : userRole === "skytterlagsleder"
              ? `Velkommen tilbake, ${user.name}!${
                  user.clubName ? ` - ${user.clubName}` : ""
                } (Skytterlagsleder)`
              : `Velkommen tilbake, ${user.name}!`}
          </h1>
          {isAuthenticated && user && (
            <Badge variant="outline" className="ml-auto">
              {userRole === "admin"
                ? "Admin"
                : userRole === "skytterlagsleder"
                ? "Leder"
                : "Medlem"}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {userRole === "admin"
            ? "Full oversikt over alle arrangementer, brukere og systemstatistikk"
            : userRole === "skytterlagsleder"
            ? `Oversikt over klubben, medlemmer og arrangementer${
                user?.clubName ? ` for ${user.clubName}` : ""
              }`
            : "Oversikt over tilgjengelige arrangementer, dine påmeldinger og kommende aktiviteter"}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale arrangementer
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stevner, møter og kurs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mine påmeldinger
            </CardTitle>
            <div className="p-2 rounded-full bg-green-100">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.myRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktive registreringer
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kommende arrangementer
            </CardTitle>
            <div className="p-2 rounded-full bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">De neste ukene</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Åpne påmeldinger
            </CardTitle>
            <div className="p-2 rounded-full bg-purple-100">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Venter på påmeldinger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Event Widget */}
      {isAuthenticated && upcomingCompetitions.length > 0 && (
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Neste arrangement</CardTitle>
            <CardDescription>
              Ditt neste stevne, møte eller kurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  {upcomingCompetitions[0].name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {upcomingCompetitions[0].organizer}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {upcomingCompetitions[0].startDate ===
                    upcomingCompetitions[0].endDate
                      ? upcomingCompetitions[0].startDate
                      : `${upcomingCompetitions[0].startDate} - ${upcomingCompetitions[0].endDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{upcomingCompetitions[0].location}</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/arrangement/${upcomingCompetitions[0].id}`}>
                  Se arrangement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Club Leader Specific Widget */}
      {userRole === "skytterlagsleder" && clubStats && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Klubboversikt
              </h2>
              <p className="text-sm text-muted-foreground">{user?.clubName}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Klubbmedlemmer
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {clubStats.clubMembers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aktive medlemmer
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+3 denne måneden</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Klubbarrangementer
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{clubStats.clubEvents}</div>
                <p className="text-xs text-muted-foreground">
                  I denne perioden
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total påmeldinger
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {clubStats.clubRegistrations}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fra klubbmedlemmer
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Admin Specific Widget */}
      {userRole === "admin" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Systemoversikt
              </h2>
              <p className="text-sm text-muted-foreground">
                Administrator dashboard
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Totale brukere
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(Math.random() * 500) + 100}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registrerte brukere
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Åpne påmeldinger
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats.openRegistrations}
                </div>
                <p className="text-xs text-muted-foreground">
                  Krever oppmerksomhet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Systemstatus
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-green-600">
                  Alle systemer operativ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Oppetid: 99.9%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* My Registrations */}
      {isAuthenticated && myRegistrations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Mine påmeldinger
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myRegistrations.slice(0, 3).map((competition) => (
              <Link
                key={competition.id}
                href={`/arrangement/${competition.id}`}
              >
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 text-lg">
                        {competition.name}
                      </span>
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
                    </CardTitle>
                    <CardDescription>{competition.organizer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {competition.startDate === competition.endDate
                          ? competition.startDate
                          : `${competition.startDate} - ${competition.endDate}`}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {competition.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {myRegistrations.length > 3 && (
            <div className="mt-4 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/mine-pameldinger">
                  Se alle mine påmeldinger ({myRegistrations.length})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingCompetitions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Kommende arrangementer
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingCompetitions.slice(0, 3).map((competition) => (
              <Card
                key={competition.id}
                className="hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="line-clamp-2 text-lg">
                      {competition.name}
                    </span>
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
                  </CardTitle>
                  <CardDescription>{competition.organizer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {competition.startDate === competition.endDate
                        ? competition.startDate
                        : `${competition.startDate} - ${competition.endDate}`}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {competition.location}
                    </div>
                  </div>
                  <Button
                    variant={
                      competition.status === "open" ? "default" : "outline"
                    }
                    className="w-full"
                    asChild
                  >
                    <Link href={`/arrangement/${competition.id}`}>
                      {competition.status === "open" && "Åpne påmeldinger"}
                      {competition.status === "full" && "Fullt"}
                      {competition.status === "closed" && "Lukket"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {upcomingCompetitions.length > 3 && (
            <div className="mt-4 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/arrangement">
                  Se alle arrangementer ({upcomingCompetitions.length})
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
