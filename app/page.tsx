import { Dashboard } from "@/components/dashboard";
import { getCompetitions } from "@/lib/data";

export default async function DashboardPage() {
  const competitions = await getCompetitions();
  const today = new Date().toISOString().split("T")[0];

  // Filter upcoming competitions (next 30 days)
  const upcomingCompetitions = competitions
    .filter((c) => c.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 6);

  // Mock my registrations (would come from authenticated user's data)
  // In a real app, this would fetch based on the current user's ID
  const myRegistrations: typeof competitions = [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Dashboard
        upcomingCompetitions={upcomingCompetitions}
        myRegistrations={myRegistrations}
        totalEvents={competitions.length}
      />
    </div>
  );
}
