import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  Trash2,
  Coffee,
  Copy,
  AlertCircle,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DayConfig, Exercise, Squad } from "@/app/opprett-arrangement/page";
import { EVENT_TEMPLATES } from "./Templates";
import { PreviewSlots } from "./PreviewSlots";
import { BASE_CLASSES, SPECIAL_CLASSES } from "@/lib/utils";
import { useState } from "react";

type Props = {
  eventDays: string[];
  selectedTemplate: string | null;
  dayConfigs: DayConfig[];
  setDayConfigs: React.Dispatch<React.SetStateAction<DayConfig[]>>;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
};

export const Discipline = ({
  eventDays,
  selectedTemplate,
  dayConfigs,
  setDayConfigs,
  selectedDay,
  setSelectedDay,
}: Props) => {
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<{
    exerciseId: string;
    squadIndex: number;
  } | null>(null);

  // Helper to validate exercise
  const isExerciseValid = (exercise: Exercise): boolean => {
    return (
      exercise.interval > 0 &&
      exercise.numSquads >= 1 &&
      exercise.capacity >= 1 &&
      exercise.startTime !== ""
    );
  };

  // Calculate estimated end time for an exercise
  const getEstimatedEndTime = (exercise: Exercise): string => {
    const startMinutes =
      Number.parseInt(exercise.startTime.split(":")[0]) * 60 +
      Number.parseInt(exercise.startTime.split(":")[1]);
    const totalMinutes =
      startMinutes +
      exercise.numSquads * exercise.interval +
      exercise.breaks.reduce((sum, b) => sum + b.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const addExercise = (date: string) => {
    const templateData = selectedTemplate
      ? EVENT_TEMPLATES[selectedTemplate as keyof typeof EVENT_TEMPLATES]
      : undefined;
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: "Ny øvelse",
      range: "Bane 1",
      startTime: "09:00",
      interval: templateData?.defaultInterval ?? 35,
      numSquads: 10,
      capacity: templateData?.defaultCapacity ?? 10,
      breaks: [],
    };

    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === date
          ? { ...config, exercises: [...config.exercises, newExercise] }
          : config
      )
    );
    // Auto-expand newly added exercise
    setExpandedExercises((prev) => [...prev, newExercise.id]);
  };

  const duplicateExercise = (exerciseId: string) => {
    const sourceConfig = dayConfigs.find((c) => c.date === selectedDay);
    const exercise = sourceConfig?.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const duplicatedExercise = {
      ...exercise,
      id: `ex-${Date.now()}`,
      name: `${exercise.name} (kopi)`,
    };
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? { ...config, exercises: [...config.exercises, duplicatedExercise] }
          : config
      )
    );
    setExpandedExercises((prev) => [...prev, duplicatedExercise.id]);
  };

  const copyExerciseToDay = (exerciseId: string, targetDate: string) => {
    const sourceConfig = dayConfigs.find((c) => c.date === selectedDay);
    const exercise = sourceConfig?.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const copiedExercise = { ...exercise, id: `ex-${Date.now()}` };
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === targetDate
          ? { ...config, exercises: [...config.exercises, copiedExercise] }
          : config
      )
    );
  };

  const copyToAllDays = () => {
    const sourceConfig = dayConfigs.find((c) => c.date === selectedDay);
    if (!sourceConfig) return;

    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date !== selectedDay
          ? {
              ...config,
              exercises: sourceConfig.exercises.map((ex) => ({
                ...ex,
                id: `ex-${Date.now()}-${Math.random()}`,
              })),
            }
          : config
      )
    );
  };

  const addBreak = (exerciseId: string) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      breaks: [
                        ...ex.breaks,
                        {
                          id: `break-${Date.now()}`,
                          afterSquad: Math.floor(ex.numSquads / 2),
                          duration: 30,
                          label: "Pause",
                        },
                      ],
                    }
                  : ex
              ),
            }
          : config
      )
    );
  };

  const removeBreak = (exerciseId: string, breakId: string) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) =>
                ex.id === exerciseId
                  ? { ...ex, breaks: ex.breaks.filter((b) => b.id !== breakId) }
                  : ex
              ),
            }
          : config
      )
    );
  };

  const updateBreak = (
    exerciseId: string,
    breakId: string,
    field: "label" | "afterSquad" | "duration",
    value: string | number
  ) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      breaks: ex.breaks.map((b) =>
                        b.id === breakId ? { ...b, [field]: value } : b
                      ),
                    }
                  : ex
              ),
            }
          : config
      )
    );
  };

  const updateExercise = (
    exerciseId: string,
    field: keyof Exercise,
    value: any
  ) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, [field]: value } : ex
              ),
            }
          : config
      )
    );
  };

  // Generate squads for an exercise if they don't exist
  const ensureSquads = (exercise: Exercise): Squad[] => {
    if (exercise.squads && exercise.squads.length === exercise.numSquads) {
      return exercise.squads;
    }

    // Create new squads array with the correct length
    const newSquads: Squad[] = [];
    for (let i = 0; i < exercise.numSquads; i++) {
      const existingSquad = exercise.squads?.find((s) => s.index === i);
      newSquads.push(
        existingSquad || {
          id: `squad-${exercise.id}-${i}-${Date.now()}`,
          index: i,
        }
      );
    }
    return newSquads;
  };

  // Update a specific squad property
  const updateSquad = (
    exerciseId: string,
    squadId: string,
    field: keyof Squad,
    value: any
  ) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) => {
                if (ex.id !== exerciseId) return ex;

                const squads = ensureSquads(ex);
                return {
                  ...ex,
                  squads: squads.map((squad) =>
                    squad.id === squadId ? { ...squad, [field]: value } : squad
                  ),
                };
              }),
            }
          : config
      )
    );
  };

  // Toggle a squad's locked state
  const toggleSquadLock = (exerciseId: string, squadId: string) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.map((ex) => {
                if (ex.id !== exerciseId) return ex;

                const squads = ensureSquads(ex);
                return {
                  ...ex,
                  squads: squads.map((squad) =>
                    squad.id === squadId
                      ? { ...squad, isLocked: !squad.isLocked }
                      : squad
                  ),
                };
              }),
            }
          : config
      )
    );
  };

  const deleteExercise = (exerciseId: string) => {
    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? {
              ...config,
              exercises: config.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : config
      )
    );
  };

  const currentDayConfig = dayConfigs.find((c) => c.date === selectedDay);
  const exercises = currentDayConfig?.exercises || [];

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Øvelser og lag
        </CardTitle>
        <CardDescription>
          Konfigurer øvelser, lag, pauser og tidspunkt for påmelding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Day selector and quick actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Dag:</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {new Date(day).toLocaleDateString("nb-NO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {exercises.length > 0 && eventDays.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToAllDays}
              disabled={
                !currentDayConfig || currentDayConfig.exercises.length === 0
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Kopier til alle dager
            </Button>
          )}
        </div>

        {/* Exercises accordion */}
        {exercises.length > 0 ? (
          <Accordion
            type="multiple"
            value={expandedExercises}
            onValueChange={setExpandedExercises}
            className="space-y-2"
          >
            {exercises.map((exercise) => {
              const isValid = isExerciseValid(exercise);
              const endTime = getEstimatedEndTime(exercise);

              return (
                <AccordionItem key={exercise.id} value={exercise.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{exercise.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {exercise.range}
                          </Badge>
                          {!isValid && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Mangler data
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {exercise.startTime} - {endTime} •{" "}
                          {exercise.numSquads} lag
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateExercise(exercise.id);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExercise(exercise.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <Tabs defaultValue="setup" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTab value="setup">Oppsett</TabsTab>
                        <TabsTab value="preview">Lag</TabsTab>
                        <TabsTab value="rules">Restriksjoner</TabsTab>
                      </TabsList>

                      <TabsPanel value="setup" className="space-y-4">
                        {/* Exercise name and range */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Øvelsesnavn *</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) =>
                                updateExercise(
                                  exercise.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="F.eks. Bane 100m"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bane *</Label>
                            <Select
                              value={exercise.range}
                              onValueChange={(val) =>
                                updateExercise(exercise.id, "range", val)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bane 1">Bane 1</SelectItem>
                                <SelectItem value="Bane 2">Bane 2</SelectItem>
                                <SelectItem value="Bane 3">Bane 3</SelectItem>
                                <SelectItem value="Innendørs">
                                  Innendørs
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Start time, interval, number of squads, capacity */}
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <Label>Første lag *</Label>
                            <Input
                              type="time"
                              value={exercise.startTime}
                              onChange={(e) =>
                                updateExercise(
                                  exercise.id,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Intervall (min) *</Label>
                            <Input
                              type="number"
                              value={exercise.interval}
                              onChange={(e) =>
                                updateExercise(
                                  exercise.id,
                                  "interval",
                                  Number.parseInt(e.target.value)
                                )
                              }
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Antall lag *</Label>
                            <Input
                              type="number"
                              value={exercise.numSquads}
                              onChange={(e) =>
                                updateExercise(
                                  exercise.id,
                                  "numSquads",
                                  Number.parseInt(e.target.value)
                                )
                              }
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Kapasitet per lag *</Label>
                            <Input
                              type="number"
                              value={exercise.capacity}
                              onChange={(e) =>
                                updateExercise(
                                  exercise.id,
                                  "capacity",
                                  Number.parseInt(e.target.value)
                                )
                              }
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Breaks section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Pauser</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addBreak(exercise.id)}
                            >
                              <Coffee className="mr-2 h-4 w-4" />
                              Legg til pause
                            </Button>
                          </div>

                          {exercise.breaks.length > 0 ? (
                            <div className="space-y-3">
                              {exercise.breaks.map((breakItem) => (
                                <div
                                  key={breakItem.id}
                                  className="rounded-lg border bg-card p-4"
                                >
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2 flex-1">
                                      <Coffee className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                      <Input
                                        className="flex-1"
                                        placeholder="Pausenavn (valgfritt)"
                                        value={breakItem.label}
                                        onChange={(e) =>
                                          updateBreak(
                                            exercise.id,
                                            breakItem.id,
                                            "label",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeBreak(exercise.id, breakItem.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-xs text-muted-foreground">
                                        Etter lag
                                      </Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        max={exercise.numSquads}
                                        value={breakItem.afterSquad}
                                        onChange={(e) =>
                                          updateBreak(
                                            exercise.id,
                                            breakItem.id,
                                            "afterSquad",
                                            Number.parseInt(e.target.value)
                                          )
                                        }
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Hvilket lagnummer
                                      </p>
                                    </div>

                                    <div className="space-y-1.5">
                                      <Label className="text-xs text-muted-foreground">
                                        Varighet (minutter)
                                      </Label>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={breakItem.duration}
                                        onChange={(e) =>
                                          updateBreak(
                                            exercise.id,
                                            breakItem.id,
                                            "duration",
                                            Number.parseInt(e.target.value)
                                          )
                                        }
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Hvor lenge varer pausen
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center">
                              <Coffee className="mx-auto h-8 w-8 text-muted-foreground/50" />
                              <p className="mt-2 text-sm text-muted-foreground">
                                Ingen pauser lagt til
                              </p>
                              <p className="text-xs text-muted-foreground/75 mt-1">
                                Legg til pauser for å strukturere dagen
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsPanel>

                      <TabsPanel value="preview" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base">
                            Forhåndsvisning av lag
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Klikk på et lag for å gjøre endringer
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <PreviewSlots
                            exercise={exercise}
                            eventDays={eventDays}
                            onSquadClick={(squadIndex) => {
                              setSelectedSquad({
                                exerciseId: exercise.id,
                                squadIndex,
                              });
                            }}
                          />
                        </div>
                      </TabsPanel>

                      <TabsPanel value="rules" className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-base">
                              Klasse-restriksjoner
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Velg hvilke klasser som kan melde seg på denne
                              øvelsen
                            </p>
                          </div>

                          <div className="border rounded-lg p-4 space-y-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Grunnklasser
                              </Label>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                {BASE_CLASSES.map((cls) => (
                                  <div
                                    key={cls}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${exercise.id}-${cls}`}
                                      checked={
                                        exercise.allowedClasses?.includes(
                                          cls
                                        ) ?? true
                                      }
                                      onCheckedChange={(checked) => {
                                        const ALL_CLASSES = [
                                          ...BASE_CLASSES,
                                          ...SPECIAL_CLASSES,
                                        ];
                                        setDayConfigs((prev) =>
                                          prev.map((config) =>
                                            config.date === selectedDay
                                              ? {
                                                  ...config,
                                                  exercises:
                                                    config.exercises.map(
                                                      (ex) => {
                                                        if (
                                                          ex.id !== exercise.id
                                                        )
                                                          return ex;
                                                        const current =
                                                          ex.allowedClasses;
                                                        if (checked) {
                                                          // Add back this class if we're already in whitelist mode
                                                          return current
                                                            ? {
                                                                ...ex,
                                                                allowedClasses:
                                                                  Array.from(
                                                                    new Set([
                                                                      ...current,
                                                                      cls,
                                                                    ])
                                                                  ),
                                                              }
                                                            : ex; // still all allowed
                                                        }
                                                        // Unchecked: move to whitelist (or update it) excluding this class
                                                        const next = (
                                                          current ?? ALL_CLASSES
                                                        ).filter(
                                                          (c) => c !== cls
                                                        );
                                                        return {
                                                          ...ex,
                                                          allowedClasses: next,
                                                        };
                                                      }
                                                    ),
                                                }
                                              : config
                                          )
                                        );
                                      }}
                                    />
                                    <Label
                                      htmlFor={`${exercise.id}-${cls}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {cls}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <Label className="text-sm font-medium">
                                Spesialklasser
                              </Label>
                              <div className="grid grid-cols-3 gap-3 mt-2">
                                {SPECIAL_CLASSES.map((cls) => (
                                  <div
                                    key={cls}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${exercise.id}-${cls}`}
                                      checked={
                                        exercise.allowedClasses?.includes(
                                          cls
                                        ) ?? true
                                      }
                                      onCheckedChange={(checked) => {
                                        const ALL_CLASSES = [
                                          ...BASE_CLASSES,
                                          ...SPECIAL_CLASSES,
                                        ];
                                        setDayConfigs((prev) =>
                                          prev.map((config) =>
                                            config.date === selectedDay
                                              ? {
                                                  ...config,
                                                  exercises:
                                                    config.exercises.map(
                                                      (ex) => {
                                                        if (
                                                          ex.id !== exercise.id
                                                        )
                                                          return ex;
                                                        const current =
                                                          ex.allowedClasses;
                                                        if (checked) {
                                                          return current
                                                            ? {
                                                                ...ex,
                                                                allowedClasses:
                                                                  Array.from(
                                                                    new Set([
                                                                      ...current,
                                                                      cls,
                                                                    ])
                                                                  ),
                                                              }
                                                            : ex;
                                                        }
                                                        const next = (
                                                          current ?? ALL_CLASSES
                                                        ).filter(
                                                          (c) => c !== cls
                                                        );
                                                        return {
                                                          ...ex,
                                                          allowedClasses: next,
                                                        };
                                                      }
                                                    ),
                                                }
                                              : config
                                          )
                                        );
                                      }}
                                    />
                                    <Label
                                      htmlFor={`${exercise.id}-${cls}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {cls}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsPanel>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="rounded-md border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Ingen øvelser ennå</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Legg til din første øvelse for å komme i gang
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => addExercise(selectedDay)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Legg til øvelse
        </Button>
      </CardContent>
      {/* Squad edit dialog */}
      {selectedSquad &&
        (() => {
          const exercise = exercises.find(
            (ex) => ex.id === selectedSquad.exerciseId
          );
          if (!exercise) return null;

          const squads = ensureSquads(exercise);
          const squad = squads[selectedSquad.squadIndex];
          if (!squad) return null;

          // Calculate base time
          const baseMinutes =
            Number.parseInt(exercise.startTime.split(":")[0]) * 60 +
            Number.parseInt(exercise.startTime.split(":")[1]);
          let squadMinutes = baseMinutes + squad.index * exercise.interval;
          for (const breakItem of exercise.breaks) {
            if (breakItem.afterSquad <= squad.index) {
              squadMinutes += breakItem.duration;
            }
          }
          const hours = Math.floor(squadMinutes / 60);
          const minutes = squadMinutes % 60;
          const calculatedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

          return (
            <Dialog
              open={!!selectedSquad}
              onOpenChange={(open) => !open && setSelectedSquad(null)}
            >
              <DialogPopup className="max-w-2xl">
                <DialogTitle>Rediger Lag {squad.index + 1}</DialogTitle>
                <DialogDescription>
                  Tilpass innstillinger for dette laget
                </DialogDescription>
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tidspunkt (overskriv)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={squad.startTime || ""}
                          onChange={(e) =>
                            updateSquad(
                              exercise.id,
                              squad.id,
                              "startTime",
                              e.target.value || undefined
                            )
                          }
                          placeholder={calculatedTime}
                        />
                        {squad.startTime && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateSquad(
                                exercise.id,
                                squad.id,
                                "startTime",
                                undefined
                              )
                            }
                          >
                            Tilbakestill
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Standard: {calculatedTime}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Kapasitet (overskriv)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={squad.capacity || ""}
                          onChange={(e) =>
                            updateSquad(
                              exercise.id,
                              squad.id,
                              "capacity",
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined
                            )
                          }
                          placeholder={exercise.capacity.toString()}
                        />
                        {squad.capacity && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateSquad(
                                exercise.id,
                                squad.id,
                                "capacity",
                                undefined
                              )
                            }
                          >
                            Tilbakestill
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Standard: {exercise.capacity}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Button
                      variant={squad.isLocked ? "secondary" : "outline"}
                      onClick={() => toggleSquadLock(exercise.id, squad.id)}
                      className="w-full"
                    >
                      <Lock
                        className={`h-4 w-4 mr-2 ${
                          squad.isLocked ? "text-destructive" : ""
                        }`}
                      />
                      {squad.isLocked ? "Låst" : "Åpen"}
                    </Button>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <Label>Klasse-restriksjoner (overskriv)</Label>
                    <div className="flex flex-wrap gap-2">
                      {!squad.allowedClasses ? (
                        <>
                          <Badge variant="outline" className="bg-muted/50">
                            Bruker øvelses-nivå restriksjoner
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateSquad(
                                exercise.id,
                                squad.id,
                                "allowedClasses",
                                exercise.allowedClasses || [
                                  ...BASE_CLASSES,
                                  ...SPECIAL_CLASSES,
                                ]
                              )
                            }
                          >
                            Sett egne restriksjoner
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 dark:bg-blue-900/20"
                          >
                            {squad.allowedClasses.length} klasser tillatt
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateSquad(
                                exercise.id,
                                squad.id,
                                "allowedClasses",
                                undefined
                              )
                            }
                          >
                            Bruk øvelses-nivå
                          </Button>
                        </>
                      )}
                    </div>
                    {squad.allowedClasses && (
                      <div className="mt-3 space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Grunnklasser
                          </Label>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {BASE_CLASSES.map((cls) => (
                              <div
                                key={cls}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`squad-${squad.id}-${cls}`}
                                  checked={squad.allowedClasses?.includes(cls)}
                                  onCheckedChange={(checked) => {
                                    const current = squad.allowedClasses || [];
                                    const next = checked
                                      ? Array.from(new Set([...current, cls]))
                                      : current.filter((c) => c !== cls);
                                    updateSquad(
                                      exercise.id,
                                      squad.id,
                                      "allowedClasses",
                                      next
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`squad-${squad.id}-${cls}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {cls}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Spesialklasser
                          </Label>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {SPECIAL_CLASSES.map((cls) => (
                              <div
                                key={cls}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`squad-${squad.id}-${cls}`}
                                  checked={squad.allowedClasses?.includes(cls)}
                                  onCheckedChange={(checked) => {
                                    const current = squad.allowedClasses || [];
                                    const next = checked
                                      ? Array.from(new Set([...current, cls]))
                                      : current.filter((c) => c !== cls);
                                    updateSquad(
                                      exercise.id,
                                      squad.id,
                                      "allowedClasses",
                                      next
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`squad-${squad.id}-${cls}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {cls}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSquad(null)}
                    >
                      Lukk
                    </Button>
                  </div>
                </div>
              </DialogPopup>
            </Dialog>
          );
        })()}
    </>
  );
};
