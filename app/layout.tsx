import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarNavigationHandler } from "@/components/sidebar-navigation-handler";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "DFS Påmelding demo",
  description: "DFS Påmelding demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="no" className="overscroll-none">
      <body>
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <AuthProvider>
          {
            <SidebarProvider
              defaultOpen={defaultOpen}
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
              }
            >
              <SidebarNavigationHandler />
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          }
        </AuthProvider>
        {/* </Suspense> */}
        <Analytics />
      </body>
    </html>
  );
}
