"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SPECIAL_CLASSES, BASE_CLASSES } from "@/lib/utils";
import { Calendar, MapPin, Target, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userName: string, userClass: string) => void;
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
  const [selectedClass, setSelectedClass] = useState<string>(
    user?.baseClass || ""
  );
  const [reserveForFriend, setReserveForFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string>("");

  // Friends with their shooting classes
  const friendsData = useMemo(
    () => [
      { name: "Ola Nordmann", baseClass: "3", classes: ["3", "HK416"] },
      { name: "Kari Nordmann", baseClass: "5", classes: ["5"] },
      { name: "Nils Hansen", baseClass: "R", classes: ["R", "JEG"] },
      { name: "Anne Olsen", baseClass: "EJ", classes: ["EJ"] },
      { name: "Per Hansen", baseClass: "4", classes: ["4", "Å"] },
      { name: "Lise Olsen", baseClass: "J", classes: ["J"] },
    ],
    []
  );

  const [friendQuery, setFriendQuery] = useState("");
  const filteredFriends = useMemo(
    () =>
      friendsData.filter((f) =>
        f.name.toLowerCase().includes(friendQuery.toLowerCase())
      ),
    [friendsData, friendQuery]
  );

  // Get available classes for the current shooter
  const availableClasses = useMemo(() => {
    if (reserveForFriend && selectedFriend) {
      const friend = friendsData.find((f) => f.name === selectedFriend);
      return friend ? friend.classes : [];
    }
    return user?.classes || [];
  }, [reserveForFriend, selectedFriend, friendsData, user?.classes]);

  // Update selected class when shooter changes
  useEffect(() => {
    if (reserveForFriend && selectedFriend) {
      const friend = friendsData.find((f) => f.name === selectedFriend);
      if (friend) {
        setSelectedClass(friend.baseClass);
      }
    } else if (user?.baseClass) {
      setSelectedClass(user.baseClass);
    }
  }, [reserveForFriend, selectedFriend, friendsData, user?.baseClass]);

  const displayName =
    reserveForFriend && selectedFriend
      ? selectedFriend
      : user?.name || "Ukjent";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName && displayName !== "Ukjent" && selectedClass) {
      onConfirm(displayName, selectedClass);
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
        <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-5 mb-4">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Tid</span>
            </div>
            <div className="text-sm font-semibold">{time}</div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Dato</span>
            </div>
            <div className="text-sm font-semibold">
              {date
                ? new Date(date).toLocaleDateString("no-NO", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Skive</span>
            </div>
            <div className="text-sm font-semibold">{targetNumber}</div>

            {location && (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Sted</span>
                </div>
                <div className="text-sm font-semibold">{location}</div>
              </>
            )}

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Skytter</span>
            </div>
            <div className="text-sm font-semibold">{displayName}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <Checkbox
                id="friend"
                checked={reserveForFriend}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setReserveForFriend(isChecked);
                  if (!isChecked) {
                    setSelectedFriend("");
                    setFriendQuery("");
                  }
                }}
              />
              <Label
                htmlFor="friend"
                className="cursor-pointer font-normal text-sm"
              >
                Reserver for en venn
              </Label>
            </div>
            {reserveForFriend && (
              <div className="space-y-3 pl-7">
                <Label htmlFor="friendSearch" className="text-sm font-semibold">
                  Søk etter venn
                </Label>
                <Input
                  id="friendSearch"
                  placeholder="Søk navn"
                  value={friendQuery}
                  onChange={(e) => setFriendQuery(e.target.value)}
                  className="h-11"
                />
                <div className="max-h-44 overflow-auto border rounded-md shadow-sm">
                  {filteredFriends.map((f) => (
                    <button
                      type="button"
                      key={f.name}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                        selectedFriend === f.name ? "bg-muted font-medium" : ""
                      }`}
                      onClick={() => setSelectedFriend(f.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{f.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {f.classes.join(", ")}
                        </span>
                      </div>
                    </button>
                  ))}
                  {filteredFriends.length === 0 && (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      Ingen treff
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="class" className="text-sm font-semibold">
              Klasse *
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableClasses.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedClass(c)}
                  className={`px-4 py-2.5 rounded-md border-2 font-medium text-sm transition-colors ${
                    selectedClass === c
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background border-input hover:bg-muted hover:border-muted-foreground/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={
                displayName === "Ukjent" ||
                (reserveForFriend && !selectedFriend) ||
                !selectedClass
              }
              className="h-11 font-semibold"
            >
              Bekreft reservasjon
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
