import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Copy, Plus, Trash2, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayConfig, Exercise } from "@/app/create-event/page";
import { EVENT_TEMPLATES } from "./Templates";
import { PreviewSlots } from "./PreviewSlots";

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
  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: "Ny øvelse",
      range: "Bane 1",
      startTime: "09:00",
      interval: selectedTemplate
        ? EVENT_TEMPLATES[selectedTemplate as keyof typeof EVENT_TEMPLATES]
            .defaultInterval
        : 35,
      numSquads: 10,
      capacity: selectedTemplate
        ? EVENT_TEMPLATES[selectedTemplate as keyof typeof EVENT_TEMPLATES]
            .defaultCapacity
        : 10,
      breaks: [],
    };

    setDayConfigs((prev) =>
      prev.map((config) =>
        config.date === selectedDay
          ? { ...config, exercises: [...config.exercises, newExercise] }
          : config
      )
    );
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
  return (
    <div className="rounded-lg border-2 border-accent/50 bg-accent/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5 text-accent" />
          Øvelser og lag
        </h3>
        {/* {eventDays.length > 1 &&
          currentDayConfig &&
          currentDayConfig.exercises.length > 0 && (
            <Button variant="outline" size="sm" onClick={copyToAllDays}>
              <Copy className="mr-2 h-4 w-4" />
              Kopier til alle dager
            </Button>
          )} */}
      </div>

      {currentDayConfig?.exercises.map((exercise, idx) => (
        <div key={exercise.id}>
          <CardHeader className="pb-3 flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Øvelsesnavn</Label>
                  <Input
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(exercise.id, "name", e.target.value)
                    }
                    placeholder="F.eks. Bane 100m"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Bane</Label>
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
                      <SelectItem value="Innendørs">Innendørs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-xs">Første lag</Label>
                  <Input
                    type="time"
                    value={exercise.startTime}
                    onChange={(e) =>
                      updateExercise(exercise.id, "startTime", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Intervall (min)</Label>
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
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Antall lag</Label>
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
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Kapasitet</Label>
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
                  />
                </div>
              </div>
            </div>
            {/*  <div className="ml-4 flex gap-2">
              {eventDays.length > 1 && (
                <Select
                  onValueChange={(day) => copyExerciseToDay(exercise.id, day)}
                >
                  <SelectTrigger className="w-[140px]">
                    <Copy className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kopier til..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eventDays
                      .filter((day) => day !== selectedDay)
                      .map((day) => (
                        <SelectItem key={day} value={day}>
                          {new Date(day).toLocaleDateString("nb-NO", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteExercise(exercise.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div> */}
          </CardHeader>
          <CardContent className="space-y-3">
            {exercise.breaks.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs">Pauser</Label>
                {exercise.breaks.map((breakItem) => (
                  <div key={breakItem.id} className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-muted-foreground" />
                    <Input
                      className="flex-1"
                      placeholder="Pausenavn"
                      value={breakItem.label}
                      onChange={(e) => {
                        setDayConfigs((prev) =>
                          prev.map((config) =>
                            config.date === selectedDay
                              ? {
                                  ...config,
                                  exercises: config.exercises.map((ex) =>
                                    ex.id === exercise.id
                                      ? {
                                          ...ex,
                                          breaks: ex.breaks.map((b) =>
                                            b.id === breakItem.id
                                              ? {
                                                  ...b,
                                                  label: e.target.value,
                                                }
                                              : b
                                          ),
                                        }
                                      : ex
                                  ),
                                }
                              : config
                          )
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="w-24"
                      placeholder="Etter lag"
                      value={breakItem.afterSquad}
                      onChange={(e) => {
                        setDayConfigs((prev) =>
                          prev.map((config) =>
                            config.date === selectedDay
                              ? {
                                  ...config,
                                  exercises: config.exercises.map((ex) =>
                                    ex.id === exercise.id
                                      ? {
                                          ...ex,
                                          breaks: ex.breaks.map((b) =>
                                            b.id === breakItem.id
                                              ? {
                                                  ...b,
                                                  afterSquad: Number.parseInt(
                                                    e.target.value
                                                  ),
                                                }
                                              : b
                                          ),
                                        }
                                      : ex
                                  ),
                                }
                              : config
                          )
                        );
                      }}
                    />
                    <Input
                      type="number"
                      className="w-24"
                      placeholder="Minutter"
                      value={breakItem.duration}
                      onChange={(e) => {
                        setDayConfigs((prev) =>
                          prev.map((config) =>
                            config.date === selectedDay
                              ? {
                                  ...config,
                                  exercises: config.exercises.map((ex) =>
                                    ex.id === exercise.id
                                      ? {
                                          ...ex,
                                          breaks: ex.breaks.map((b) =>
                                            b.id === breakItem.id
                                              ? {
                                                  ...b,
                                                  duration: Number.parseInt(
                                                    e.target.value
                                                  ),
                                                }
                                              : b
                                          ),
                                        }
                                      : ex
                                  ),
                                }
                              : config
                          )
                        );
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBreak(exercise.id, breakItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addBreak(exercise.id)}
            >
              <Coffee className="mr-2 h-4 w-4" />
              Legg til pause
            </Button>

            <div className="rounded-md bg-background p-3">
              <p className="mb-2 text-sm font-medium">
                Forhåndsvisning av tidspunkter:
              </p>
              <PreviewSlots exercise={exercise} eventDays={eventDays} />
            </div>
          </CardContent>
        </div>
      ))}

      {/* <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={addExercise}
      >
        <Plus className="mr-2 h-4 w-4" />
        Legg til øvelse
      </Button> */}
    </div>
  );
};
