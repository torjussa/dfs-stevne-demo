import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";

export default async function NotificationsPage() {
  // Mock notifications - in a real app, these would come from a database
  const notifications = [
    {
      id: "1",
      type: "info" as const,
      title: "Nytt stevne registrert",
      message: "VM - Cup Runde 4 er nå åpent for påmelding",
      date: "2025-01-15",
      read: false,
    },
    {
      id: "2",
      type: "success" as const,
      title: "Påmelding bekreftet",
      message: "Din påmelding til Årsmøte 2025 er bekreftet",
      date: "2025-01-14",
      read: false,
    },
    {
      id: "3",
      type: "warning" as const,
      title: "Påmeldingsfrist nærmer seg",
      message: "Påmeldingsfristen for Styremøte Sunnfjord går ut om 2 dager",
      date: "2025-01-13",
      read: true,
    },
    {
      id: "4",
      type: "info" as const,
      title: "Nytt kurs tilgjengelig",
      message: "Skyteteknikk for Nybegynnere er nå tilgjengelig for påmelding",
      date: "2025-01-12",
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return XCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-50";
      case "warning":
        return "border-yellow-500 bg-yellow-50";
      case "error":
        return "border-red-500 bg-red-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Varsler og oppdateringer
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} nye
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Viktige varsler og oppdateringer om arrangementer, påmeldinger og
              systemet
            </p>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`${getNotificationColor(notification.type)} ${
                    !notification.read ? "border-l-4" : "opacity-70"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {notification.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {notification.message}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.date}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Badge variant="secondary" className="shrink-0">
                          Ny
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Empty state */}
          {notifications.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ingen varsler</h3>
                <p className="text-muted-foreground max-w-md">
                  Du har ingen nye varsler eller oppdateringer. Varsler vil
                  vises her når de blir tilgjengelige.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
