"use client";

import type React from "react";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { BASE_CLASSES, SPECIAL_CLASSES } from "@/lib/utils";
import { Calendar, MapPin, Target, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userName: string) => void;
  targetNumber: number;
  time: string;
  date?: string;
  location?: string;
}

export function BookingDialog({
  open,
  onOpenChange,
  onConfirm,
  targetNumber,
  time,
  date,
  location,
}: BookingDialogProps) {
  const { user } = useAuth();
  const [userName, setUserName] = useState(user?.name || "");
  const [selectedClass, setSelectedClass] = useState<string>(
    user?.baseClass || ""
  );
  const [reserveForFriend, setReserveForFriend] = useState(false);
  const friends = useMemo(
    () => [
      "Ola Nordmann",
      "Kari Nordmann",
      "Nils Hansen",
      "Anne Olsen",
      "Per Hansen",
      "Lise Olsen",
    ],
    []
  );
  const [friendQuery, setFriendQuery] = useState("");
  const filteredFriends = useMemo(
    () =>
      friends.filter((f) =>
        f.toLowerCase().includes(friendQuery.toLowerCase())
      ),
    [friends, friendQuery]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onConfirm(userName.trim());
      // Don't reset if using auth
      if (!user) {
        setUserName("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft reservasjon</DialogTitle>
          <DialogDescription>
            Du er i ferd med å reservere følgende tidspunkt:
          </DialogDescription>
        </DialogHeader>

        {/* Structured booking details */}
        <div className="bg-muted/40 border rounded-md p-4 text-sm mb-2 space-y-3">
          <div className="flex items-center gap-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Skive</span>
              <span className="font-medium">{targetNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Dato</span>
              <span className="font-medium">
                {date
                  ? new Date(date).toLocaleDateString("no-NO", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Tid</span>
              <span className="font-medium">{time}</span>
            </div>
          </div>

          {location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground">Sted</span>
                <span className="font-medium">{location}</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Klasse *</Label>
            <div className="flex flex-wrap gap-2">
              {[user?.baseClass, ...SPECIAL_CLASSES]
                .filter(Boolean)
                .map((c) => (
                  <button
                    type="button"
                    key={c as string}
                    onClick={() => setSelectedClass(c as string)}
                    className={`px-2 py-1 rounded border text-xs ${
                      selectedClass === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    }`}
                  >
                    {c}
                  </button>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Navn *</Label>
            <Input
              id="name"
              placeholder="Skriv inn ditt navn"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              readOnly={!!user}
              required
              className="border-primary/40 focus-visible:ring-primary bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="friend"
                type="checkbox"
                checked={reserveForFriend}
                onChange={(e) => setReserveForFriend(e.target.checked)}
              />
              <Label htmlFor="friend" className="cursor-pointer">
                Reserver for en venn
              </Label>
            </div>
            {reserveForFriend && (
              <div className="space-y-2">
                <Label htmlFor="friendSearch">Søk etter venn</Label>
                <Input
                  id="friendSearch"
                  placeholder="Søk navn"
                  value={friendQuery}
                  onChange={(e) => setFriendQuery(e.target.value)}
                />
                <div className="max-h-40 overflow-auto border rounded-md">
                  {filteredFriends.map((f) => (
                    <button
                      type="button"
                      key={f}
                      className={`w-full text-left px-3 py-2 hover:bg-muted ${
                        userName === f ? "bg-muted" : ""
                      }`}
                      onClick={() => setUserName(f)}
                    >
                      {f}
                    </button>
                  ))}
                  {filteredFriends.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Ingen treff
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={!userName.trim()}>
              Bekreft reservasjon
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
