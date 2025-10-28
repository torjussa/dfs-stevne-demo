"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Save, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { PreviousEvents } from "@/components/createEvent/PreviousEvents";
import { EVENT_TEMPLATES, Templates } from "@/components/createEvent/Templates";
import { Discipline } from "@/components/createEvent/Discipline";
import { EventSettings } from "@/components/createEvent/EventSettings";
import { EventInformation } from "@/components/createEvent/EventInformation";

export type Squad = {
  id: string;
  index: number;
  startTime?: string; // Override the calculated time
  capacity?: number; // Override the default capacity
  isLocked?: boolean; // Whether this squad is locked/blocked
  allowedClasses?: string[]; // Class restrictions specific to this squad
};

export type Exercise = {
  id: string;
  name: string;
  range: string;
  startTime: string;
  interval: number;
  numSquads: number;
  capacity: number;
  breaks: Break[];
  allowedClasses?: string[]; // Exercise-wide class restrictions
  squads?: Squad[]; // Individual squad overrides
};

export type Break = {
  id: string;
  afterSquad: number;
  duration: number;
  label: string;
};

export type DayConfig = {
  date: string;
  exercises: Exercise[];
};
const getDaysBetween = (from: string, to: string) => {
  const start = new Date(from);
  const end = new Date(to);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

const initialDateFrom = "2025-11-18";
const initialDateTo = "2025-11-19";

export default function Proposal1Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [copiedEvent, setCopiedEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [dayConfigs, setDayConfigs] = useState<DayConfig[]>(
    getDaysBetween(initialDateFrom, initialDateTo).map((date) => ({
      date,
      exercises: [],
    }))
  );
  const [selectedDay, setSelectedDay] = useState<string>(initialDateFrom);
  const [sameSetupAllDays, setSameSetupAllDays] = useState(false);

  const eventDays = getDaysBetween(dateFrom, dateTo);

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);

    const days = getDaysBetween(from, to);
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0]);
    }
    // Initialize configs for new days
    const newConfigs = days.map((date) => {
      const existing = dayConfigs.find((c) => c.date === date);
      return existing || { date, exercises: [] };
    });
    setDayConfigs(newConfigs);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    if (!eventName) {
      const month = new Date().toLocaleDateString("nb-NO", { month: "long" });
      setEventName(
        `${month}stevnet ${
          EVENT_TEMPLATES[template as keyof typeof EVENT_TEMPLATES].name
        }`
      );
    }
  };

  const handleCopyEvent = (eventId: string) => {
    setCopiedEvent(eventId);
    setEventName("Oktoberstevnet innendørs 2025");
    setSelectedTemplate("innendørs");
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Opprett nytt stevne
          </h1>
          <p className="text-muted-foreground">
            Velg en mal eller kopier fra tidligere stevne for å komme raskt i
            gang
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          {/* Copy from previous event */}
          {!(selectedTemplate || copiedEvent) && (
            <PreviousEvents
              copiedEvent={copiedEvent}
              handleCopyEvent={handleCopyEvent}
            />
          )}

          {/* Template selection */}
          {!(selectedTemplate || copiedEvent) && (
            <Templates
              selectedTemplate={selectedTemplate}
              handleTemplateSelect={handleTemplateSelect}
            />
          )}

          {(selectedTemplate || copiedEvent) && (
            <Card className="">
              {/* Basic Info */}
              {currentStep === 1 && (
                <EventInformation
                  eventName={eventName}
                  setEventName={setEventName}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  handleDateChange={handleDateChange}
                  selectedTemplate={selectedTemplate}
                  copiedEvent={copiedEvent}
                  setSelectedTemplate={setSelectedTemplate}
                />
              )}
              {currentStep === 2 && <EventSettings />}
              {currentStep === 3 && (
                <Discipline
                  eventDays={eventDays}
                  selectedTemplate={selectedTemplate}
                  dayConfigs={dayConfigs}
                  setDayConfigs={setDayConfigs}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
              )}

              <div className="flex items-center justify-between ">
                {/* <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> Obligatoriske
                    felt
                  </p> */}
                <Button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setCopiedEvent(null);
                  }}
                  variant="ghost"
                  size="lg"
                >
                  Avbryt
                </Button>
                <CardFooter className="flex gap-2">
                  {currentStep !== 1 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={goToPreviousStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Tilbake
                    </Button>
                  )}
                  {currentStep === totalSteps ? (
                    <Button
                      size="lg"
                      onClick={handleSave}
                      disabled={!eventName}
                    >
                      {showSuccess ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Stevne opprettet!
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Opprett stevne
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={goToNextStep}
                      /*  disabled={!canProceedToStep2} */
                    >
                      Neste
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          )}

          {!selectedTemplate && !copiedEvent && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ChevronRight className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  Velg en stevnetype eller kopier et stevne for å starte
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dette gjør opprettelsen mye raskere
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
