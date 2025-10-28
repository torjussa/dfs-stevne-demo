"use client";

import * as React from "react";
import {
  IconTarget,
  IconCalendar,
  IconUser,
  IconBell,
  IconSettings,
  IconUsers,
  IconPlus,
  IconHome,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";

const getNavData = (isAdmin: boolean) => ({
  navMain: [
    {
      title: "Hjem",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Alle arrangementer",
      url: "/arrangement",
      icon: IconCalendar,
    },
    {
      title: "Mine påmeldinger",
      url: "/mine-pameldinger",
      icon: IconTarget,
    },
    {
      title: "Varsler",
      url: "/varsler",
      icon: IconBell,
    },
    {
      title: "Profil",
      url: "/profil",
      icon: IconUser,
    },
    ...(isAdmin
      ? [
          {
            title: "Administrasjon",
            url: "/admin",
            icon: IconUsers,
          },
        ]
      : []),
  ],
  navSecondary: [
    {
      title: "Innmelding",
      url: "/innmelding",
      icon: IconUserPlus,
    },
    {
      title: "Opprett arrangement",
      url: "/opprett-arrangement",
      icon: IconPlus,
    },
    {
      title: "Innstillinger",
      url: "#",
      icon: IconSettings,
    },
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const data = getNavData(user?.isAdmin || false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center h-20 p-0">
                <Image
                  src="/DFS-logo-hvit.svg"
                  alt="DFS Logo"
                  width={150}
                  height={50}
                  className="object-contain h-20"
                />
                {/* <span className="text-base font-semibold">
                  Det Frivillige Skyttervesen
                </span> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
