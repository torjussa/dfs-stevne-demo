"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Users, Shield } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("member");

  const handleLogin = () => {
    // Store selected role in localStorage before login
    localStorage.setItem("selected-role", selectedRole);
    login();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Logg inn</CardTitle>
          <CardDescription>
            Velg brukerrolle for å teste forskjellige tilganger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Velg brukerrolle:</label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Medlem
                    </div>
                  </SelectItem>
                  <SelectItem value="skytterlagsleder">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Skytterlagsleder
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Administrator
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role info */}
            <div className="bg-muted p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon =
                    selectedRole === "admin"
                      ? Shield
                      : selectedRole === "skytterlagsleder"
                      ? Users
                      : User;
                  return (
                    <div className="p-2 bg-background rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                      {selectedRole === "admin"
                        ? "Administrator"
                        : selectedRole === "skytterlagsleder"
                        ? "Skytterlagsleder"
                        : "Medlem"}
                    </h4>
                    <Badge variant="outline">{selectedRole}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRole === "admin"
                      ? "Full tilgang til alle funksjoner og systemstatistikk"
                      : selectedRole === "skytterlagsleder"
                      ? "Administrer klubb, se medlemmer og klubbarrangementer"
                      : "Se arrangementer, meld deg på stevner og håndter dine påmeldinger"}
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleLogin}>
              Logg inn som{" "}
              {selectedRole === "admin"
                ? "Administrator"
                : selectedRole === "skytterlagsleder"
                ? "Skytterlagsleder"
                : "Medlem"}
            </Button>
            <div className="text-center">
              <Button variant="link" asChild>
                <Link href="/">Tilbake til oversikt</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
