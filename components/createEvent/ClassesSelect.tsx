import { EVENT_TEMPLATES } from "./Templates";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const CLASSES = [
  "Nybegynner Ungdom",
  "Friluft 11-13 år",
  "Eldre Friluft 14-16 år",
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
  const [isSelectAll, setIsSelectAll] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Klasser som kan delta</Label>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setIsSelectAll((prev) => !prev)}
        >
          Velg alle
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CLASSES.map((category) => {
          const isRecommended =
            selectedTemplate &&
            EVENT_TEMPLATES[
              selectedTemplate as keyof typeof EVENT_TEMPLATES
            ].suggestedClasses.includes(category);
          return (
            <div
              key={category}
              className={`flex items-center gap-2 rounded-md border p-2 ${
                isRecommended ? "border-secondary bg-secondary/5" : ""
              }`}
            >
              <input
                type="checkbox"
                id={category}
                defaultChecked={isRecommended || false}
                className="h-4 w-4 rounded border-border"
              />
              <Label
                htmlFor={category}
                className="cursor-pointer text-sm font-normal flex-1"
              >
                {category}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
