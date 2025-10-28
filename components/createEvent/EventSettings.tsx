import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const EventSettings = () => {
  const [registrationFrom, setRegistrationFrom] = useState("");
  const [registrationTo, setRegistrationTo] = useState("");
  const [hasPayment, setHasPayment] = useState(false);
  const [feeSenior, setFeeSenior] = useState("");
  const [feeYouth, setFeeYouth] = useState("");
  const [feeForest, setFeeForest] = useState("");
  const [shooterCanChoose, setShooterCanChoose] = useState(true);
  const [isClassDetermining, setIsClassDetermining] = useState(true);
  const [allowAfterBilling, setAllowAfterBilling] = useState(false);
  return (
    <>
      <CardHeader className="bg-primary/5 py-4">
        <CardTitle>Stevneinnstillinger</CardTitle>
        <CardDescription>
          Konfigurer påmelding, betaling og klasseregler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Period */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Påmeldingsperiode</Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="regFrom" className="text-sm font-normal">
                Påmelding åpner
              </Label>
              <Input
                id="regFrom"
                type="datetime-local"
                value={registrationFrom}
                onChange={(e) => setRegistrationFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regTo" className="text-sm font-normal">
                Påmelding stenger
              </Label>
              <Input
                id="regTo"
                type="datetime-local"
                value={registrationTo}
                onChange={(e) => setRegistrationTo(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Skyttere kan melde seg på mellom disse tidspunktene
          </p>
        </div>

        {/* Payment Settings */}
        <div className="space-y-4">
          <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
            <Checkbox
              checked={hasPayment}
              onCheckedChange={(v) => setHasPayment(v === true)}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-4">Betaling</p>
              <p className="text-xs text-muted-foreground">
                Krever stevnet startavgift?
              </p>
            </div>
          </Label>

          {hasPayment && (
            <div className="grid gap-4 rounded-lg border bg-primary/5 p-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="feeSenior" className="text-sm">
                  Senior
                </Label>
                <div className="relative">
                  <Input
                    id="feeSenior"
                    type="number"
                    placeholder="0"
                    value={feeSenior}
                    onChange={(e) => setFeeSenior(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    kr
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeYouth" className="text-sm">
                  Ungdom
                </Label>
                <div className="relative">
                  <Input
                    id="feeYouth"
                    type="number"
                    placeholder="0"
                    value={feeYouth}
                    onChange={(e) => setFeeYouth(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    kr
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeForest" className="text-sm">
                  Veteran
                </Label>
                <div className="relative">
                  <Input
                    id="feeForest"
                    type="number"
                    placeholder="0"
                    value={feeForest}
                    onChange={(e) => setFeeForest(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    kr
                  </span>
                </div>
              </div>
              <Label className="">
                <Checkbox
                  checked={allowAfterBilling}
                  onCheckedChange={(v) => setAllowAfterBilling(v === true)}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-4">Tillat etterfakturering</p>
                </div>
              </Label>
            </div>
          )}
        </div>

        {/* Shooter Options */}
        <div className="flex flex-col gap-4">
          <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
            <Checkbox
              checked={shooterCanChoose}
              onCheckedChange={(v) => setShooterCanChoose(v === true)}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-4">
                Skytter kan velge øvelse/skive
              </p>
              <p className="text-xs text-muted-foreground">
                Tillat skyttere å velge hvilken øvelse og skive de vil skyte på
              </p>
            </div>
          </Label>

          <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
            <Checkbox
              checked={isClassDetermining}
              onCheckedChange={(v) => setIsClassDetermining(v === true)}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-4">Klassesettende stevne</p>
              <p className="text-xs text-muted-foreground">
                Poeng fra dette stevnet teller inn på skytterens klasse
              </p>
            </div>
          </Label>
        </div>
      </CardContent>
    </>
  );
};
