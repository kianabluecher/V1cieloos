import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertCircle,
  Info,
  CheckCircle2,
  Mail
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Design Request",
      message: "Sarah Johnson submitted a new design request for Brand Guidelines",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: "2",
      title: "Task Completed",
      message: "Logo Design project has been completed and delivered",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
    },
    {
      id: "3",
      title: "Payment Received",
      message: "Monthly subscription payment of $999 has been processed",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: true,
    },
    {
      id: "4",
      title: "Upcoming Meeting",
      message: "Strategy review meeting scheduled for tomorrow at 2:00 PM",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: false,
    },
    {
      id: "5",
      title: "New Comment",
      message: "Team member commented on your recent design request",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-400" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-accent" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/20";
      case "warning":
        return "bg-orange-500/10 border-orange-500/20";
      case "alert":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-cyan-accent/10 border-cyan-accent/20";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white">Notifications</h3>
          <p className="text-text-secondary mt-1">
            Stay updated with your latest activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <>
              <Badge
                variant="secondary"
                className="bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20"
              >
                <Bell className="h-3 w-3 mr-1" />
                {unreadCount} unread
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="border-border-subtle text-text-secondary hover:text-white hover:border-cyan-accent/30"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
        <TabsList className="bg-card-bg border border-border-subtle">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            All Notifications
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-cyan-accent/10 data-[state=active]:text-cyan-accent"
          >
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 glass-card border-border-subtle text-center">
              <div className="w-16 h-16 bg-cyan-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-cyan-accent" />
              </div>
              <h4 className="text-white mb-2">No notifications</h4>
              <p className="text-text-secondary text-sm">
                {activeTab === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 border transition-all duration-200 ${
                  notification.read
                    ? "border-border-subtle bg-card-bg/50 hover:border-cyan-accent/30 opacity-40"
                    : "border-[#2A3F4D] bg-[#1E2D3A] hover:border-cyan-accent/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-cyan-accent rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-text-secondary text-sm">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-text-secondary" />
                          <span className="text-xs text-text-secondary">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-accent hover:text-cyan-accent hover:bg-cyan-accent/10 text-xs"
                        >
                          View Task →
                        </Button>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-cyan-accent hover:text-cyan-accent/80"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-text-secondary hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
