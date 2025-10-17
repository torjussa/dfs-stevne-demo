import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PREVIOUS_EVENTS = [
  {
    id: "2024-oktober",
    name: "Oktoberstevnet 2024",
    date: "18-19 nov 2024",
    type: "Innendørs",
  },
  {
    id: "2024-vinter",
    name: "Vinterstevnet 2024",
    date: "15-16 jan 2024",
    type: "Bane",
  },
  {
    id: "2024-sommer",
    name: "Sommerstevnet 2024",
    date: "20-21 jun 2024",
    type: "Felt",
  },
];

type Props = {
  copiedEvent: string | null;
  handleCopyEvent: (eventId: string) => void;
};
export const PreviousEvents = ({ copiedEvent, handleCopyEvent }: Props) => {
  return (
    <Card className="border-2 border-secondary/50 py-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-secondary" />
          <CardTitle>Kopier fra tidligere stevne</CardTitle>
        </div>
        <CardDescription>
          Alle innstillinger kopieres - du kan justere datoer og detaljer
          etterpå
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {PREVIOUS_EVENTS.map((event) => (
            <Card
              key={event.id}
              className={`cursor-pointer transition-all hover:border-secondary ${
                copiedEvent === event.id
                  ? "border-2 border-secondary bg-secondary/10"
                  : ""
              }`}
              onClick={() => handleCopyEvent(event.id)}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                  {copiedEvent === event.id && (
                    <Check className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
