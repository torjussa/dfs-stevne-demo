import { HomeHeader } from "@/components/home-header";
import { EventList } from "@/components/event-list";
import { getCompetitions } from "@/lib/data";

interface PageProps {
  searchParams: Promise<{
    eventType?: string;
    region?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const competitions = await getCompetitions();

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <EventList
          initialCompetitions={competitions}
          eventType={params.eventType}
          region={params.region}
          search={params.search}
          status={params.status}
          dateFrom={params.dateFrom}
          dateTo={params.dateTo}
        />
      </div>
    </div>
  );
}
