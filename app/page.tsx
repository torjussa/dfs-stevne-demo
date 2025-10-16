import { CompetitionCard } from "@/components/competition-card";
import { AuthHeader } from "@/components/auth-header";
import { mockCompetitions } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Stevner</h1>
            <AuthHeader />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Viser {mockCompetitions.length} stevner
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mockCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      </div>
    </div>
  );
}
