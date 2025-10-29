import { Clock, Coffee } from "lucide-react";
import { Exercise } from "@/app/opprett-arrangement/page";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

type Props = {
  exercise: Exercise;
  eventDays: string[];
  onSquadClick?: (squadIndex: number) => void;
};

export const PreviewSlots = ({ exercise, eventDays, onSquadClick }: Props) => {
  const calculateSquadTimes = (exercise: Exercise) => {
    const times: {
      squad: number;
      time: string;
      isBreak?: boolean;
      label?: string;
    }[] = [];
    let currentMinutes =
      Number.parseInt(exercise.startTime.split(":")[0]) * 60 +
      Number.parseInt(exercise.startTime.split(":")[1]);

    for (let i = 1; i <= exercise.numSquads; i++) {
      times.push({
        squad: i,
        time: `${Math.floor(currentMinutes / 60)
          .toString()
          .padStart(2, "0")}:${(currentMinutes % 60)
          .toString()
          .padStart(2, "0")}`,
      });
      currentMinutes += exercise.interval;

      // Check for breaks
      const breakAfter = exercise.breaks.find((b) => b.afterSquad === i);
      if (breakAfter) {
        times.push({
          squad: i,
          time: `${Math.floor(currentMinutes / 60)
            .toString()
            .padStart(2, "0")}:${(currentMinutes % 60)
            .toString()
            .padStart(2, "0")}`,
          isBreak: true,
          label: breakAfter.label,
        });
        currentMinutes += breakAfter.duration;
      }
    }

    return times;
  };

  const squadTimes = calculateSquadTimes(exercise);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-center">
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${eventDays.length}, 1fr)`,
          }}
        >
          {eventDays.map((date) => {
            const dateLabel = new Date(date).toLocaleDateString("no-NO", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });
            return (
              <div key={date} className="min-w-[200px]">
                <h3 className="px-3 py-2 bg-muted/30 text-md">
                  {dateLabel.substring(0, 1).toUpperCase() +
                    dateLabel.substring(1)}
                </h3>
                <div className="space-y-2">
                  {squadTimes.map((slot) => (
                    <Card
                      key={`${slot.label}:${slot.squad}`}
                      className={`overflow-hidden transition-all p-2 ${
                        !slot.isBreak && onSquadClick
                          ? "cursor-pointer hover:border-primary hover:bg-primary/5"
                          : ""
                      }`}
                      onClick={() => {
                        if (!slot.isBreak && onSquadClick) {
                          onSquadClick(slot.squad - 1);
                        }
                      }}
                    >
                      <CardContent
                        className={`w-full px-2 transition-colors flex justify-between ${
                          !slot.isBreak && onSquadClick ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex justify-between w-full gap-3 items-center">
                          <p>
                            {slot.isBreak ? slot.label : `Lag ${slot.squad}`}
                          </p>
                          <div className="flex items-center gap-2">
                            {slot.isBreak ? (
                              <Coffee className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                            <span className="font-semibold">{slot.time}</span>
                          </div>
                          {!slot.isBreak &&
                            (() => {
                              // Determine allowed classes: squad override -> exercise-level -> undefined (means all)
                              const allowed =
                                exercise.squads?.find(
                                  (s) => s.index === slot.squad - 1
                                )?.allowedClasses ?? exercise.allowedClasses;
                              return (
                                <Badge
                                  variant={allowed ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {allowed
                                    ? `${allowed.length} klasser`
                                    : "Alle klasser"}
                                </Badge>
                              );
                            })()}
                          {/*  <Badge
                              variant="secondary"
                              className={`text-xs font-medium ${
                                isFull
                                  ? "bg-secondary text-foreground/80 border-border"
                                  : availableCount <= 2
                                  ? "bg-amber-100 text-amber-900 border-amber-200"
                                  : "bg-emerald-100 text-emerald-900 border-emerald-200"
                              }`}
                            >
                              <span className="font-bold">
                                {displayAvailable}
                              </span>
                              /{totalCount}
                            </Badge> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    /*   <div className="flex flex-wrap gap-2">
      {calculateSquadTimes(exercise)
        .slice(0, 6)
        .map((item, i) =>
          item.isBreak ? (
            <Badge key={i} variant="secondary" className="gap-1 text-xs">
              <Coffee className="h-3 w-3" />
              {item.label} ({item.time})
            </Badge>
          ) : (
            <Badge key={i} variant="outline" className="text-xs">
              Lag {item.squad}: {item.time}
            </Badge>
          )
        )}
      {calculateSquadTimes(exercise).length > 6 && (
        <Badge variant="secondary" className="text-xs">
          +{calculateSquadTimes(exercise).length - 6} flere
        </Badge>
      )}
    </div> */
  );
};
