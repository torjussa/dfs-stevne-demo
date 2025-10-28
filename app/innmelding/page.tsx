"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Shield,
  CreditCard,
  CheckCircle,
  Info,
  FileText,
  Users,
} from "lucide-react";
import type { MembershipFormData, InsuranceInfo } from "@/lib/types";
import { toast } from "sonner";

export default function MembershipPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MembershipFormData>>({
    wantsInsurance: true,
    acceptTerms: false,
    acceptDataProcessing: false,
    paymentMethod: "card", // Default payment method
  });

  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(
    null
  );

  const handleInputChange = (field: keyof MembershipFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.dateOfBirth &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.postalCode &&
          formData.city
        );
      case 2:
        return !!(formData.clubName && formData.shootingClasses?.length);
      case 3:
        return true; // No specific insurance type validation needed
      case 4:
        return !!(
          formData.paymentMethod &&
          formData.acceptTerms &&
          formData.acceptDataProcessing
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast.error("Vennligst fyll ut alle påkrevde felter");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Examine if all fields are filled
    if (!validateStep(4)) {
      toast.error("Vennligst fullfør alle felter før innsending");
      return;
    }

    // Generate insurance info if selected
    if (formData.wantsInsurance) {
      const policyNumber = `DFS-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const newInsurance: InsuranceInfo = {
        policyNumber,
        coverageType: "weapon",
        validFrom: now.toISOString(),
        validTo: oneYearLater.toISOString(),
        status: "active",
        amount: 50000, // 50,000 per weapon
        deductible: 1000, // 1,000 kr egenandel
        maxWeapons: 8, // Inntil 8 våpen
      };

      setInsuranceInfo(newInsurance);

      // Store insurance info in localStorage (for POC)
      localStorage.setItem(
        "membership-insurance",
        JSON.stringify(newInsurance)
      );
    }

    // Store membership data
    localStorage.setItem("membership-application", JSON.stringify(formData));

    toast.success("Innmeldingsøknaden er sendt inn!");

    // Wait a bit then redirect
    setTimeout(() => {
      router.push("/profil");
    }, 2000);
  };

  return (
    <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <UserPlus className="h-8 w-8" />
            Innmelding som medlem
          </h1>
          <p className="text-muted-foreground">
            Bli medlem av DFS og få tilgang til alle arrangementer og forsikring
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepNum
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-muted"
                }`}
              >
                {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNum ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Personlig informasjon
              </CardTitle>
              <CardDescription>
                Fyll ut din personlige informasjon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Fornavn *</Label>
                  <Input
                    id="firstName"
                    placeholder="Fornavn"
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Etternavn *</Label>
                  <Input
                    id="lastName"
                    placeholder="Etternavn"
                    value={formData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fødselsdato *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="navn@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+47 123 45 678"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    placeholder="Gateadresse"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postnummer *</Label>
                  <Input
                    id="postalCode"
                    placeholder="0000"
                    value={formData.postalCode || ""}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Sted *</Label>
                  <Input
                    id="city"
                    placeholder="Oslo"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleNext}>Neste</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Membership Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Medlemskap
              </CardTitle>
              <CardDescription>Velg skytterlag og klasser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clubName">Skytterlag *</Label>
                <Select
                  value={formData.clubName}
                  onValueChange={(value) =>
                    handleInputChange("clubName", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg skytterlag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunnfjord Skytterlag">
                      Sunnfjord Skytterlag
                    </SelectItem>
                    <SelectItem value="Toten Skytterlag">
                      Toten Skytterlag
                    </SelectItem>
                    <SelectItem value="Fiska Skyttarlag">
                      Fiska Skyttarlag
                    </SelectItem>
                    <SelectItem value="Bergen Skytterlag">
                      Bergen Skytterlag
                    </SelectItem>
                    <SelectItem value="Løten Skytterlag">
                      Løten Skytterlag
                    </SelectItem>
                    <SelectItem value="Trondheim Skytterlag">
                      Trondheim Skytterlag
                    </SelectItem>
                    <SelectItem value="Bodø Skyttersamlag">
                      Bodø Skyttersamlag
                    </SelectItem>
                    <SelectItem value="Akershus Skyttersamlag">
                      Akershus Skyttersamlag
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skytterklasser *</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  {[
                    "NU",
                    "ER",
                    "R",
                    "J",
                    "EJ",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "v55",
                    "v65",
                    "v75",
                  ].map((cls) => (
                    <div key={cls} className="flex items-center space-x-2">
                      <Checkbox
                        id={cls}
                        checked={formData.shootingClasses?.includes(cls)}
                        onCheckedChange={(checked) => {
                          const current = formData.shootingClasses || [];
                          if (checked) {
                            handleInputChange("shootingClasses", [
                              ...current,
                              cls,
                            ]);
                          } else {
                            handleInputChange(
                              "shootingClasses",
                              current.filter((c) => c !== cls)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={cls}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {cls}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipType">Medlemstype</Label>
                <Select
                  value={formData.membershipType}
                  onValueChange={(value) =>
                    handleInputChange("membershipType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg medlemstype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">
                      Fullt medlem (årlig kontingent)
                    </SelectItem>
                    <SelectItem value="youth">
                      Ungdomsmedlem (18-25 år)
                    </SelectItem>
                    <SelectItem value="senior">
                      Senior medlem (55+ år)
                    </SelectItem>
                    <SelectItem value="lifetime">Livsvarig medlem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Tilbake
                </Button>
                <Button onClick={handleNext}>Neste</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Insurance */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Forsikring
              </CardTitle>
              <CardDescription>Våpenforsikring via DFS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="wantsInsurance"
                  checked={formData.wantsInsurance}
                  onCheckedChange={(checked) =>
                    handleInputChange("wantsInsurance", checked)
                  }
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="wantsInsurance"
                    className="cursor-pointer text-base"
                  >
                    Ja, jeg ønsker våpenforsikring
                  </Label>
                  <p className="text-sm text颓-muted-foreground">
                    Våpnene dine (inntil 8) er automatisk forsikret når du er
                    medlem
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-base">
                      Våpenforsikring - Kun 110 kr i året
                    </p>
                    <ul className="text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                      <li>Forsikret inntil 8 våpen</li>
                      <li>50.000 kroner per våpen, maks 165.000 per skade</li>
                      <li>Egenandel kun kr 1.000 per våpen</li>
                      <li>Gjelder hele døgnet i hele verden</li>
                      <li>
                        Dekker alle langvåpen, rifler og hagler med optikk og
                        lyddemper
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Tilbake
                </Button>
                <Button onClick={handleNext}>Neste</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Payment and Terms */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Betaling og vilkår
              </CardTitle>
              <CardDescription>
                Velg betalingsmetode og godta vilkår
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pt-2">
                <div className="text-sm font-semibold mb-2">
                  Betalingsmetode *
                </div>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    handleInputChange("paymentMethod", value)
                  }
                >
                  <Label className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 cursor-pointer mb-3">
                    <Radio value="vipps" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#FF5B24]">
                        <span className="text-white font-semibold text-sm">
                          V
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Vipps</p>
                        <p className="text-xs text-muted-foreground">
                          Betal enkelt med Vipps på mobilen
                        </p>
                      </div>
                    </div>
                  </Label>

                  <Label className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 cursor-pointer mb-3">
                    <Radio value="card" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Kort</p>
                        <p className="text-xs text-muted-foreground">
                          Betal med Visa, MasterCard eller American Express
                        </p>
                      </div>
                    </div>
                  </Label>

                  <Label className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 cursor-pointer">
                    <Radio value="invoice" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Faktura</p>
                        <p className="text-xs text-muted-foreground">
                          Motta faktura på e-post eller i posten
                        </p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">Sammentrekk</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Årlig kontingent</span>
                    <span className="font-medium">850 kr</span>
                  </div>
                  {formData.wantsInsurance && (
                    <div className="flex justify-between">
                      <span>Våpenforsikring</span>
                      <span className="font-medium">110 kr</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Totalt</span>
                    <span>{formData.wantsInsurance ? "960 kr" : "850 kr"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptTerms", checked)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="acceptTerms"
                      className="cursor-pointer text-sm leading-tight"
                    >
                      Jeg godtar medlemsvilkår *{" "}
                      <a href="#" className="underline text-primary">
                        Les vilkår
                      </a>
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="acceptDataProcessing"
                    checked={formData.acceptDataProcessing}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptDataProcessing", checked)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="acceptDataProcessing"
                      className="cursor-pointer text-sm leading-tight"
                    >
                      Jeg godtar behandling av personopplysninger *{" "}
                      <a href="#" className="underline text-primary">
                        Les mer
                      </a>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Send inn søknad
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full h-11"
                >
                  Tilbake
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
