"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read?: boolean;
}

export function NotificationsWidget({ items }: { items: NotificationItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Varsler</CardTitle>
          <Link
            href="/varsler"
            className="text-xs text-primary hover:underline"
          >
            Se alle
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">Ingen varsler</div>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 3).map((n) => (
              <div key={n.id} className="text-sm">
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.message}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
