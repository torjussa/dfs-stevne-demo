"use client";

import type { Competition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface CompetitionListProps {
  competitions: Competition[];
}

export function CompetitionList({ competitions }: CompetitionListProps) {
  const handleDelete = (id: string) => {
    if (confirm("Er du sikker på at du vil slette dette stevnet?")) {
      // In a real app, this would call an API to delete the competition
      console.log("Delete competition:", id);
    }
  };

  return (
    <div className="space-y-4">
      {competitions.map((competition) => (
        <div
          key={competition.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">{competition.name}</h3>
              <Badge
                variant={
                  competition.status === "full" ? "destructive" : "default"
                }
              >
                {competition.status === "full" ? "Fullt" : "Åpent"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                {competition.location} •{" "}
                {new Date(competition.startDate).toLocaleDateString("no-NO")}
              </p>
              <p>
                {competition.totalSlots} plasser totalt (
                {competition.targetCount} skiver)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/competition/${competition.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("Edit:", competition.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(competition.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
