"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavigationHandler() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const previousPathname = useRef<string>(pathname);

  useEffect(() => {
    // Only collapse if we actually navigated (pathname changed)
    // And only collapse when leaving home page
    if (
      previousPathname.current !== pathname &&
      previousPathname.current === "/"
    ) {
      setOpen(false);
    }

    // Update the previous pathname
    previousPathname.current = pathname;
  }, [pathname, setOpen]);

  return null;
}
