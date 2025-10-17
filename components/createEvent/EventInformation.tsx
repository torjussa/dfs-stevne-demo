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

import { EVENT_TEMPLATES } from "@/components/createEvent/Templates";
import { ClassesSelect } from "@/components/createEvent/ClassesSelect";

type Props = {
  eventName: string;
  setEventName: (name: string) => void;
  dateFrom: string;
  dateTo: string;
  handleDateChange: (from: string, to: string) => void;
  selectedTemplate: string | null;
  copiedEvent?: string | null;
  setSelectedTemplate?: (templateKey: string) => void;
};
export const EventInformation = ({
  eventName,
  setEventName,
  dateFrom,
  dateTo,
  handleDateChange,
  selectedTemplate,
  copiedEvent,
  setSelectedTemplate,
}: Props) => {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="eventName">
            Stevnenavn <span className="text-destructive">*</span>
          </Label>
          <Input
            id="eventName"
            placeholder="F.eks. Oktoberstevnet innendørs"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">
            Arrangør <span className="text-destructive">*</span>
          </Label>
          <Select defaultValue="bæker">
            <SelectTrigger id="organizer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bæker">Bæker Skytterlag</SelectItem>
              <SelectItem value="oslo">Oslo Skytterlag</SelectItem>
              <SelectItem value="bergen">Bergen Skytterlag</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Sted</Label>
          <Input
            id="location"
            placeholder="Anleggsnavn"
            defaultValue="Bæker Skyteanlegg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFrom">
            Fra dato <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateChange(e.target.value, dateTo)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateTo">
            Til dato <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => handleDateChange(dateFrom, e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventType">
            Stevnetype <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedTemplate || ""}
            onValueChange={setSelectedTemplate}
          >
            <SelectTrigger id="eventType">
              <SelectValue placeholder="Velg type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(EVENT_TEMPLATES).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beskrivelse</Label>
        <Textarea
          id="description"
          placeholder="Legg til informasjon om stevnet..."
          rows={3}
          defaultValue={
            copiedEvent ? "Årlig innendørs stevne for alle klasser" : ""
          }
        />
      </div>
      <ClassesSelect selectedTemplate={selectedTemplate} />
    </>
  );
};
