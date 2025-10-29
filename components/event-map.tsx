"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Competition } from "@/lib/types";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom div icon factory for event types
function createEventIcon(eventType: "stevne" | "møte" | "kurs") {
  const colors = {
    stevne: { bg: "#f97316", border: "#ea580c" }, // orange
    møte: { bg: "#3b82f6", border: "#2563eb" }, // blue
    kurs: { bg: "#22c55e", border: "#16a34a" }, // green
  };

  const icons = {
    stevne: "🎯",
    møte: "💼",
    kurs: "📚",
  };

  const { bg, border } = colors[eventType];

  return L.divIcon({
    html: `
      <div style="
        background-color: ${bg};
        border: 3px solid ${border};
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${icons[eventType]}</div>
    `,
    className: "custom-event-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

// Helper function to offset overlapping markers
function getOffsetPosition(
  lat: number,
  lng: number,
  index: number,
  total: number
): [number, number] {
  const offsetDistance = 0.0005; // ~50 meters

  if (total === 1) {
    return [lat, lng];
  }

  // Create a circular offset pattern
  const angle = (index * 2 * Math.PI) / total;
  const offsetLat = lat + Math.cos(angle) * offsetDistance;
  const offsetLng = lng + Math.sin(angle) * offsetDistance;

  return [offsetLat, offsetLng];
}

interface EventMapProps {
  competitions: Competition[];
}

// Component to track visible events on map
function MapEventHandler({
  competitionsWithCoords,
  onVisibleChange,
}: {
  competitionsWithCoords: Competition[];
  onVisibleChange: (visibleCompetitions: Competition[]) => void;
}) {
  const map = useMap();
  const callbackRef = useRef(onVisibleChange);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = onVisibleChange;
  }, [onVisibleChange]);

  useEffect(() => {
    const updateVisibleEvents = () => {
      const bounds = map.getBounds();
      const visibleCompetitions = competitionsWithCoords.filter((c) =>
        bounds.contains([c.coordinates!.lat, c.coordinates!.lng])
      );
      callbackRef.current(visibleCompetitions);
    };

    // Update on map move/zoom
    map.on("moveend", updateVisibleEvents);
    map.on("zoomend", updateVisibleEvents);

    // Initial update
    updateVisibleEvents();

    return () => {
      map.off("moveend", updateVisibleEvents);
      map.off("zoomend", updateVisibleEvents);
    };
  }, [map, competitionsWithCoords]);

  // Also update bounds on initial load
  useEffect(() => {
    if (competitionsWithCoords.length > 0) {
      const bounds = competitionsWithCoords.map(
        (c) => [c.coordinates!.lat, c.coordinates!.lng] as [number, number]
      );

      if (bounds.length === 1) {
        // If only one event, just center on it with appropriate zoom
        map.setView(bounds[0], 10);
      } else if (bounds.length > 1) {
        // Fit bounds to show all events with some padding
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, competitionsWithCoords]);

  return null;
}

export function EventMap({ competitions }: EventMapProps) {
  const router = useRouter();
  const [visibleCompetitions, setVisibleCompetitions] = useState<Competition[]>(
    []
  );

  // Filter competitions with valid coordinates (memoized to prevent re-creation on every render)
  const competitionsWithCoords = useMemo(
    () => competitions.filter((c) => c.coordinates?.lat && c.coordinates?.lng),
    [competitions]
  );

  // Group events by location to handle overlapping markers
  const eventsByLocation = useMemo(() => {
    const map = new Map<string, Competition[]>();
    competitionsWithCoords.forEach((competition) => {
      const key = `${competition.coordinates!.lat.toFixed(
        4
      )},${competition.coordinates!.lng.toFixed(4)}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(competition);
    });
    return map;
  }, [competitionsWithCoords]);

  // Default center to Norway center (will be adjusted by MapBoundsController)
  const center: [number, number] = [64.5, 11.5]; // Norway center
  const defaultZoom = 5;

  if (competitionsWithCoords.length === 0) {
    return (
      <Card className="h-[600px] border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <span className="text-3xl">🗺️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Ingen arrangementer på kartet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Ingen av filtrede arrangementer har geografisk lokasjon
            tilgjengelig. Prøv å justere filtrene eller se andre arrangementer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex gap-4 w-full h-[600px]">
      {/* Map */}
      <div className="flex-1 rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={center}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventHandler
            competitionsWithCoords={competitionsWithCoords}
            onVisibleChange={setVisibleCompetitions}
          />
          {Array.from(eventsByLocation.entries()).flatMap(
            ([locationKey, events]) =>
              events.map((competition, index) => {
                const [lat, lng] = [
                  competition.coordinates!.lat,
                  competition.coordinates!.lng,
                ];
                const [offsetLat, offsetLng] = getOffsetPosition(
                  lat,
                  lng,
                  index,
                  events.length
                );
                return (
                  <Marker
                    key={competition.id}
                    position={[offsetLat, offsetLng]}
                    icon={createEventIcon(competition.eventType)}
                  >
                    <Popup>
                      <div className="min-w-[220px] max-w-[280px]">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                              {competition.name}
                            </h3>
                          </div>
                          <Badge
                            variant="outline"
                            className={`
                      shrink-0
                      ${
                        competition.eventType === "stevne"
                          ? "border-orange-500 text-orange-600"
                          : ""
                      }
                      ${
                        competition.eventType === "møte"
                          ? "border-blue-500 text-blue-600"
                          : ""
                      }
                      ${
                        competition.eventType === "kurs"
                          ? "border-green-500 text-green-600"
                          : ""
                      }
                    `}
                          >
                            {competition.eventType === "stevne" && "Stevne"}
                            {competition.eventType === "møte" && "Møte"}
                            {competition.eventType === "kurs" && "Kurs"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          📍 {competition.location}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          📅{" "}
                          {new Date(competition.startDate).toLocaleDateString(
                            "nb-NO"
                          )}{" "}
                          -{" "}
                          {new Date(competition.endDate).toLocaleDateString(
                            "nb-NO"
                          )}
                        </p>
                        <Link
                          href={`/arrangement/${competition.id}`}
                          className="inline-block text-xs font-medium text-primary hover:underline transition-colors"
                        >
                          Se detaljer →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
          )}
        </MapContainer>
      </div>

      {/* Event List Sidebar */}
      <div className="w-80 rounded-lg border border-border bg-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm">Arrangementer på kartet</h3>
          <p className="text-xs text-muted-foreground">
            {visibleCompetitions.length} av {competitionsWithCoords.length}{" "}
            arrangementer
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {visibleCompetitions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Ingen arrangementer synlig i kartet. Zoom inn eller ut for å se
              arrangementer.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {visibleCompetitions.map((competition) => (
                <Link
                  key={competition.id}
                  className="block p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  href={`/arrangement/${competition.id}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {competition.name}
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        shrink-0
                        ${
                          competition.eventType === "stevne"
                            ? "border-orange-500 text-orange-600"
                            : ""
                        }
                        ${
                          competition.eventType === "møte"
                            ? "border-blue-500 text-blue-600"
                            : ""
                        }
                        ${
                          competition.eventType === "kurs"
                            ? "border-green-500 text-green-600"
                            : ""
                        }
                      `}
                    >
                      {competition.eventType === "stevne" && "Stevne"}
                      {competition.eventType === "møte" && "Møte"}
                      {competition.eventType === "kurs" && "Kurs"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    📍 {competition.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📅{" "}
                    {new Date(competition.startDate).toLocaleDateString(
                      "nb-NO"
                    )}{" "}
                    -{" "}
                    {new Date(competition.endDate).toLocaleDateString("nb-NO")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
