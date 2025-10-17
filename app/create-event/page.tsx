"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PreviousEvents } from "@/components/createEvent/PreviousEvents";
import { EVENT_TEMPLATES, Templates } from "@/components/createEvent/Templates";
import { ClassesSelect } from "@/components/createEvent/ClassesSelect";
import { Discipline } from "@/components/createEvent/Discipline";
import { EventSettings } from "@/components/createEvent/EventSettings";
import { EventInformation } from "@/components/createEvent/EventInformation";

export type Exercise = {
  id: string;
  name: string;
  range: string;
  startTime: string;
  interval: number;
  numSquads: number;
  capacity: number;
  breaks: Break[];
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Tilbake til oversikt
              </Link>
            </Button>
          </div>
        </div>
      </header>

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
            <Card className="border-2 border-primary/20 ">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle>Stevnedetaljer</CardTitle>
                <CardDescription>
                  {copiedEvent
                    ? "Justér informasjonen fra det kopierte stevnet"
                    : "Fyll inn detaljer - mange felt er forhåndsutfylt basert på malen"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
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
                <EventSettings />

                {eventDays.length > 0 && (
                  <Discipline
                    eventDays={eventDays}
                    selectedTemplate={selectedTemplate}
                    dayConfigs={dayConfigs}
                    setDayConfigs={setDayConfigs}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                  />
                )}

                <div className="flex items-center justify-between border-t pt-6 pb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> Obligatoriske
                    felt
                  </p>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              </CardContent>
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
