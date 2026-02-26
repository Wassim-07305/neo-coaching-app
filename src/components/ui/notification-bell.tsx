"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  type NotificationType,
} from "@/hooks/use-notifications";
import {
  Bell,
  Award,
  Clock,
  AlertTriangle,
  MessageSquare,
  Calendar,
  ClipboardList,
  CheckCheck,
} from "lucide-react";

const notificationIcons: Record<NotificationType, typeof Award> = {
  module_complete: Award,
  module_reminder: Clock,
  kpi_alert: AlertTriangle,
  message: MessageSquare,
  rdv_reminder: Calendar,
  task_reminder: ClipboardList,
};

const notificationColors: Record<NotificationType, string> = {
  module_complete: "text-success bg-success/10",
  module_reminder: "text-warning bg-warning/10",
  kpi_alert: "text-danger bg-danger/10",
  message: "text-accent bg-accent/10",
  rdv_reminder: "text-blue-500 bg-blue-50",
  task_reminder: "text-purple-500 bg-purple-50",
};

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const visibleNotifications = notifications.slice(0, 8);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-heading text-sm font-bold text-dark">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <CheckCheck className="w-3 h-3" />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Aucune notification
              </div>
            ) : (
              visibleNotifications.map((notif) => {
                const Icon = notificationIcons[notif.type];
                const colorClass = notificationColors[notif.type];

                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      setOpen(false);
                      // In production, navigate to notif.link
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-3",
                      !notif.read
                        ? "border-l-accent bg-accent/[0.02]"
                        : "border-l-transparent"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5",
                        colorClass
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm truncate",
                          !notif.read
                            ? "font-semibold text-dark"
                            : "font-medium text-gray-600"
                        )}
                      >
                        {notif.title}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-0.5 line-clamp-2",
                          !notif.read ? "text-gray-600" : "text-gray-400"
                        )}
                      >
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {notif.timeLabel}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 text-center">
            <button className="text-xs text-accent font-medium hover:underline">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
