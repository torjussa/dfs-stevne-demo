import { AuthHeader } from "@/components/auth-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export function HomeHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Stevner</h1>

            <Button asChild variant="ghost" size="sm">
              <Link href="/create-event">
                <PlusIcon />
                Opprett event
              </Link>
            </Button>
          </div>
          <AuthHeader />
        </div>
      </div>
    </header>
  );
}
