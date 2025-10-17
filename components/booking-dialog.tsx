"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SPECIAL_CLASSES, BASE_CLASSES } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Target,
  Clock,
  User,
  CreditCard,
  FileText,
  Check,
} from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handlePayment = async (paymentMethod: string) => {
    if (
      displayName === "Ukjent" ||
      (reserveForFriend && !selectedFriend) ||
      !selectedClass
    ) {
      return;
    }

    setIsLoading(true);

    // Mock 1 second loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSuccess(true);

    // After showing success, close dialog and confirm booking after 2 seconds
    setTimeout(() => {
      onConfirm(displayName, selectedClass);
      onOpenChange(false);
      // Reset states
      setIsSuccess(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [open]);

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

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Reservasjon bekreftet</h3>
              <p className="text-sm text-muted-foreground">
                Din reservasjon er registrert
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  onClick={() => handlePayment("vipps")}
                  disabled={
                    isLoading ||
                    displayName === "Ukjent" ||
                    (reserveForFriend && !selectedFriend) ||
                    !selectedClass
                  }
                  className="w-full h-12 bg-[#FF5B24] hover:bg-[#FF5B24]/90 text-white font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Behandler...
                    </span>
                  ) : (
                    "Betal med Vipps"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePayment("card")}
                  disabled={
                    isLoading ||
                    displayName === "Ukjent" ||
                    (reserveForFriend && !selectedFriend) ||
                    !selectedClass
                  }
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Behandler...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Betal med kort
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => handlePayment("invoice")}
                  disabled={
                    isLoading ||
                    displayName === "Ukjent" ||
                    (reserveForFriend && !selectedFriend) ||
                    !selectedClass
                  }
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mb-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Behandler...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Bekreft og betal med faktura
                    </span>
                  )}
                </Button>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="h-11 w-full"
                >
                  Avbryt
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
