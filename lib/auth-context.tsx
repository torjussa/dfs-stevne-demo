"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserRole = "member" | "skytterlagsleder" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean; // Deprecated: use role instead
  isSkytterlagsleder: boolean; // Convenience check for skytterlagsleder role
  classes: string[]; // allowed classes user can register as (base + special)
  baseClass: string; // user's main class
  clubName?: string; // Name of the shooting club user belongs to
  clubId?: string; // ID of the shooting club
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("shooting-app-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = () => {
    // Check if user selected a specific role
    const selectedRole = localStorage.getItem(
      "selected-role"
    ) as UserRole | null;

    const randomId = Math.floor(Math.random() * 10000);
    const names = [
      "Ola Nordmann",
      "Kari Nordmann",
      "Nils Hansen",
      "Anne Olsen",
      "Per Hansen",
      "Lise Olsen",
      "Kjell Hansen",
      "Lise Olsen",
      "Kari Hansen",
      "Nils Olsen",
      "Anne Hansen",
      "Per Olsen",
      "Lise Hansen",
      "Kjell Olsen",
      "Lise Hansen",
      "Joakim Eriksen",
      "Harald Sandviken",
      "Ole Petter Hansen",
      "Kari Olsen",
      "Nils Hansen",
      "Anne Olsen",
      "Per Hansen",
      "Lise Olsen",
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `user${randomId}@example.com`;

    // Use selected role or assign a random role (5% admin, 20% club leader, 75% member)
    let role: UserRole;
    if (
      selectedRole &&
      ["member", "skytterlagsleder", "admin"].includes(selectedRole)
    ) {
      role = selectedRole;
      localStorage.removeItem("selected-role"); // Clear after use
    } else {
      const roleChance = Math.random();
      role =
        roleChance < 0.05
          ? "admin"
          : roleChance < 0.25
          ? "skytterlagsleder"
          : "member";
    }

    const isAdmin = role === "admin";
    const isSkytterlagsleder = role === "skytterlagsleder";

    // Choose a base class from the official set
    const baseClasses = [
      "NU",
      "ER",
      "R",
      "J",
      "EJ",
      "1",
      "2",
      "3",
      "4",
      "5",
      "v55",
      "v65",
      "v75",
    ] as const;
    const baseClass = baseClasses[
      Math.floor(Math.random() * baseClasses.length)
    ] as string;

    // Optionally allow one special class in addition to the base
    const specialClasses = ["JEG", "KIK", "Å", "HK416"];
    const extra =
      Math.random() > 0.5
        ? [specialClasses[Math.floor(Math.random() * specialClasses.length)]]
        : [];
    const classes = Array.from(new Set([baseClass, ...extra]));

    // Assign a club for club leaders and some members
    const clubs = [
      "Sunnfjord Skytterlag",
      "Toten Skytterlag",
      "Fiska Skyttarlag",
      "Bergen Skytterlag",
      "Løten Skytterlag",
      "Trondheim Skytterlag",
      "Bodø Skyttersamlag",
      "Akershus Skyttersamlag",
    ];
    const clubName = clubs[Math.floor(Math.random() * clubs.length)];
    const clubId = `club-${clubName.toLowerCase().replace(/\s+/g, "-")}`;

    const newUser: User = {
      name,
      email,
      role,
      isAdmin,
      isSkytterlagsleder,
      classes,
      baseClass,
      clubName,
      clubId,
    };
    setUser(newUser);
    localStorage.setItem("shooting-app-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shooting-app-user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
