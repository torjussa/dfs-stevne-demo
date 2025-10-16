"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Shield } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" onClick={login}>
        Logg inn
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          {user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Min konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="h-4 w-4 mr-2" />
          {user?.email}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <div className="ml-6 text-sm">
            Klasse: <span className="font-semibold">{user?.baseClass}</span>
            {user?.classes && user.classes.length > 1 && (
              <span className="text-muted-foreground">
                {" "}
                + {user.classes.filter((c) => c !== user.baseClass).join(", ")}
              </span>
            )}
          </div>
        </DropdownMenuItem>
        {user?.isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="h-4 w-4 mr-2" />
              Admin panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logg ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
