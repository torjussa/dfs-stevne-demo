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

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const competitions = await getCompetitions();

  return (
    <>
      <div className="container mx-auto flex-1 gap-4 p-4 max-w-7xl">
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
    </>
  );
}
