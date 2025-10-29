"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { InsuranceInfo } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      router.push("/logg-inn");
      return;
    }

    // Load insurance info from localStorage (for POC)
    const storedInsurance = localStorage.getItem("membership-insurance");
    if (storedInsurance) {
      setInsuranceInfo(JSON.parse(storedInsurance));
    }
  }, [user, router]);
  return (
    <>
      <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <User className="h-8 w-8" />
              Min profil
            </h1>
            <p className="text-muted-foreground">
              Administrer din profilinformasjon og innstillinger
            </p>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personlig informasjon</CardTitle>
              <CardDescription>
                Din personlige informasjon og kontaktinformasjon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Fullt navn</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Ditt navn"
                      className="pl-10"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="din@epost.no"
                      className="pl-10"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+47 123 45 678"
                      className="pl-10"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasjon</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Din by/region"
                      className="pl-10"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Lagre endringer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Kontoinnstillinger</CardTitle>
              <CardDescription>
                Administrer passord og kontotilgang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Nåværende passord</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nytt passord</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Bekreft nytt passord</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline">Oppdater passord</Button>
              </div>
            </CardContent>
          </Card>

          {/* Shooting Class */}
          <Card>
            <CardHeader>
              <CardTitle>Skytterklasse</CardTitle>
              <CardDescription>
                Din aktiv skytterklasse og tillatte klasser for påmelding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Hovedklasse</Label>
                  <Input
                    value={user?.baseClass || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tillatte klasser for påmelding</Label>
                  <Input
                    value={user?.classes?.join(", ") || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Kontakt din skytterlagsleder for å endre din skytterklasse
              </p>
            </CardContent>
          </Card>

          {/* Insurance Status */}
          {insuranceInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Forsikring
                </CardTitle>
                <CardDescription>
                  Din forsikringsstatus og dekning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    {insuranceInfo.status === "active" ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold">Våpenforsikring</div>
                      <div className="text-sm text-muted-foreground">
                        Polisenr: {insuranceInfo.policyNumber}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      insuranceInfo.status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {insuranceInfo.status === "active" ? "Aktiv" : "Utløpt"}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Dekning per våpen</Label>
                    <Input
                      value={
                        insuranceInfo.amount
                          ? new Intl.NumberFormat("no-NO", {
                              style: "currency",
                              currency: "NOK",
                            }).format(insuranceInfo.amount)
                          : ""
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gyldig til</Label>
                    <Input
                      value={new Date(insuranceInfo.validTo).toLocaleDateString(
                        "no-NO"
                      )}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maks våpen</Label>
                    <Input
                      value={`${insuranceInfo.maxWeapons} våpen`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Egenandel</Label>
                    <Input
                      value={
                        insuranceInfo.deductible
                          ? new Intl.NumberFormat("no-NO", {
                              style: "currency",
                              currency: "NOK",
                            }).format(insuranceInfo.deductible)
                          : ""
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Membership Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Medlemskap
              </CardTitle>
              <CardDescription>Informasjon om ditt medlemskap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Rolle</Label>
                  <Input
                    value={
                      user?.role === "admin"
                        ? "Administrator"
                        : user?.role === "skytterlagsleder"
                        ? "Skytterlagsleder"
                        : "Medlem"
                    }
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Skytterlag</Label>
                  <Input
                    value={user?.clubName || "Ikke tildelt"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Kontakt administrator for å endre medlemskapsstatus
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
