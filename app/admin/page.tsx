"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthHeader } from "@/components/auth-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Users, Target } from "lucide-react";
import Link from "next/link";
import { mockCompetitions } from "@/lib/mock-data";
import { CompetitionList } from "@/components/admin/competition-list";
import { CreateCompetitionDialog } from "@/components/admin/create-competition-dialog";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  const totalCompetitions = mockCompetitions.length;
  const totalSlots = mockCompetitions.reduce(
    (sum, comp) => sum + comp.totalSlots,
    0
  );
  const totalBookings = 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Administrer stevner og reservasjoner
              </p>
            </div>
            <AuthHeader />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totalt stevner
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompetitions}</div>
              <p className="text-xs text-muted-foreground">Aktive stevner</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totalt reservasjoner
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                av {totalSlots} plasser
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belegg</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSlots
                  ? Math.round((totalBookings / totalSlots) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Gjennomsnittlig belegg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="competitions" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="competitions">Stevner</TabsTrigger>
              <TabsTrigger value="bookings">Reservasjoner</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nytt stevne
            </Button>
          </div>

          <TabsContent value="competitions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alle stevner</CardTitle>
                <CardDescription>
                  Administrer og rediger eksisterende stevner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompetitionList competitions={mockCompetitions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alle reservasjoner</CardTitle>
                <CardDescription>
                  Oversikt over alle reservasjoner på tvers av stevner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Reservasjonsoversikt kommer snart</p>
                  <p className="text-sm mt-2">
                    Her vil du kunne se alle reservasjoner med detaljer
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/">Tilbake til oversikt</Link>
          </Button>
        </div>
      </div>

      <CreateCompetitionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
