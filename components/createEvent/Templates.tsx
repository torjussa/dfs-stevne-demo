import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

export const EVENT_TEMPLATES = {
  innendørs: {
    name: "Innendørs",
    defaultInterval: 35,
    defaultCapacity: 10,
    suggestedClasses: [
      "Klasse 1",
      "Klasse 2",
      "Klasse 3",
      "Klasse 4",
      "Klasse 5",
      "V65",
      "Åpen klasse",
    ],
  },
  bane: {
    name: "Bane",
    defaultInterval: 40,
    defaultCapacity: 15,
    suggestedClasses: [
      "Klasse 1",
      "Klasse 2",
      "Klasse 3",
      "Junior 16-17 år",
      "Åpen klasse",
    ],
  },
  felt: {
    name: "Felt",
    defaultInterval: 45,
    defaultCapacity: 12,
    suggestedClasses: [
      "Klasse 1",
      "Klasse 2",
      "Friluft 11-13 år",
      "Eldre Friluft 14-16 år",
    ],
  },
  skogsløp: {
    name: "Skogsløp",
    defaultInterval: 30,
    defaultCapacity: 8,
    suggestedClasses: ["Klasse 1", "Klasse 2", "Klasse 3", "Junior 16-17 år"],
  },
  åpent: {
    name: "Åpent",
    defaultInterval: 35,
    defaultCapacity: 12,
    suggestedClasses: ["Åpen klasse", "Klasse 1", "Klasse 2", "Klasse 3"],
  },
};

type Props = {
  selectedTemplate: string | null;
  handleTemplateSelect: (templateKey: string) => void;
};
export const Templates = ({
  selectedTemplate,
  handleTemplateSelect,
}: Props) => {
  return (
    <Card className="py-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Eller velg stevnetype</CardTitle>
        </div>
        <CardDescription>
          Hver mal har forhåndsinnstilte verdier tilpasset stevnetypen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(EVENT_TEMPLATES).map(([key, template]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTemplate === key
                  ? "border-2 border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => handleTemplateSelect(key)}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">{template.name}</p>
                  {selectedTemplate === key && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Intervall: {template.defaultInterval} min</p>
                  <p>Kapasitet: {template.defaultCapacity}</p>
                  <p>{template.suggestedClasses.length} klasser</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
