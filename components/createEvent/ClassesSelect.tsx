import { EVENT_TEMPLATES } from "./Templates";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";

const CLASSES = [
  "Nybegynner Ungdom",
  "Rekrutt 11-13 år",
  "Eldre Rekrutt",
  "Junior 16-17 år",
  "Eldre Junior 18 år",
  "Klasse 1",
  "Klasse 2",
  "Klasse 3",
  "Klasse 4",
  "Klasse 5",
  "V65",
  "HK16",
  "Kvinner klassen",
  "Åpen klasse",
];

type Props = {
  selectedTemplate: string | null;
};

export const ClassesSelect = ({ selectedTemplate }: Props) => {
  const initialRecommended = useMemo(() => {
    if (!selectedTemplate) return new Set<string>();
    const suggested =
      EVENT_TEMPLATES[selectedTemplate as keyof typeof EVENT_TEMPLATES]
        .suggestedClasses;
    return new Set<string>(suggested);
  }, [selectedTemplate]);

  const [selected, setSelected] = useState<Set<string>>(initialRecommended);

  useEffect(() => {
    setSelected(initialRecommended);
  }, [initialRecommended]);

  const allSelected = selected.size === CLASSES.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(CLASSES));
    }
  };

  const toggleOne = (category: string, checked: boolean | "indeterminate") => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked === true) {
        next.add(category);
      } else {
        next.delete(category);
      }
      return next;
    });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Klasser som kan delta</Label>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={toggleAll}
        >
          {allSelected ? "Fjern alle" : "Velg alle"}
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((category) => {
          const isRecommended = initialRecommended.has(category);
          return (
            <Label
              key={category}
              className={`flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 ${
                isRecommended ? "border-secondary bg-secondary/5" : ""
              }`}
            >
              <Checkbox
                checked={selected.has(category)}
                onCheckedChange={(v) => toggleOne(category, v)}
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm leading-4">{category}</p>
                {isRecommended ? (
                  <p className="text-xs text-muted-foreground">
                    Anbefalt fra mal
                  </p>
                ) : null}
              </div>
            </Label>
          );
        })}
      </div>
    </div>
  );
};
