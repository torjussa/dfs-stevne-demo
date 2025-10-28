"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const greeting = useMemo(
    () =>
      isAuthenticated && user
        ? `Hei ${user.name.split(" ")[0]}`
        : "Velkommen til DFS Påmeldinger",
    [isAuthenticated, user]
  );

  return (
    <div className="rounded-lg border bg-gradient-to-br from-card to-muted/50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting}</h1>
          <p className="text-sm text-muted-foreground">
            Finn og meld deg på arrangementer
          </p>
        </div>
        <form action="/arrangement" className="flex gap-2 w-full md:w-auto">
          <Input
            name="search"
            placeholder="Søk arrangementer..."
            className="w-full md:w-64"
          />
          <Button type="submit" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
