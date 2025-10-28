import { Suspense } from "react";
import {
  getUpcomingEvents,
  getEventStats,
  getRecentNotifications,
} from "@/lib/data";
import { HeroSection } from "@/components/dashboard/hero-section";
import { UpcomingEventsWidget } from "@/components/dashboard/upcoming-events-widget";
import { StatsWidget } from "@/components/dashboard/stats-widget";
import { NotificationsWidget } from "@/components/dashboard/notifications-widget";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { MyRegistrationsWidget } from "@/components/dashboard/my-registrations-widget";
import { SidebarNavigationHandler } from "@/components/sidebar-navigation-handler";

export default async function HomePage() {
  const [upcoming, stats, notifications] = await Promise.all([
    getUpcomingEvents(6),
    getEventStats(),
    getRecentNotifications(),
  ]);

  return (
    <div className="container mx-auto flex-1 gap-4 p-4 max-w-7xl space-y-4">
      <HeroSection />

      <div className="grid grid-cols-1 align-start md:grid-cols-7 xl:grid-cols-8 lg:grid-cols-9 gap-4">
        <div className="xl:col-span-6 lg:col-span-6 md:col-span-4 space-y-4">
          <div className="grid grid-cols-2  gap-4">
            <MyRegistrationsWidget />
            <NotificationsWidget items={notifications} />
          </div>
          <UpcomingEventsWidget events={upcoming} />
        </div>
        {/* <div className="xl:col-span-2 lg:col-span-3 md:col-span-3 grid gap-4"> */}
        <div className="xl:col-span-2 lg:col-span-3 md:col-span-3 flex md:flex-col gap-4">
          <StatsWidget stats={stats} />
          <CalendarWidget events={upcoming} />
        </div>
        {/* </div> */}
      </div>

      <Suspense>
        <SidebarNavigationHandler />
      </Suspense>
    </div>
  );
}
