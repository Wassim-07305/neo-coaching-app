"use client";

import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Activity,
  UserPlus,
  UserMinus,
  BookOpen,
  CreditCard,
  MessageSquare,
  Settings,
  Calendar,
  Award,
  FileText,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile, ModuleProgress, Payment } from "@/lib/supabase/types";

export type ActivityType =
  | "user_created"
  | "user_updated"
  | "user_archived"
  | "module_started"
  | "module_completed"
  | "payment_received"
  | "message_sent"
  | "appointment_scheduled"
  | "appointment_completed"
  | "certificate_issued"
  | "report_generated"
  | "company_created";

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  metadata?: Record<string, string | number>;
}

const activityIcons: Record<ActivityType, typeof Activity> = {
  user_created: UserPlus,
  user_updated: Settings,
  user_archived: UserMinus,
  module_started: BookOpen,
  module_completed: Award,
  payment_received: CreditCard,
  message_sent: MessageSquare,
  appointment_scheduled: Calendar,
  appointment_completed: Calendar,
  certificate_issued: Award,
  report_generated: FileText,
  company_created: Building2,
};

const activityColors: Record<ActivityType, string> = {
  user_created: "bg-success/10 text-success",
  user_updated: "bg-blue-100 text-blue-600",
  user_archived: "bg-gray-100 text-gray-500",
  module_started: "bg-accent/10 text-accent",
  module_completed: "bg-success/10 text-success",
  payment_received: "bg-success/10 text-success",
  message_sent: "bg-primary/10 text-primary",
  appointment_scheduled: "bg-blue-100 text-blue-600",
  appointment_completed: "bg-success/10 text-success",
  certificate_issued: "bg-accent/10 text-accent",
  report_generated: "bg-purple-100 text-purple-600",
  company_created: "bg-primary/10 text-primary",
};

interface ActivityLogProps {
  activities: ActivityLogEntry[];
  loading?: boolean;
  maxItems?: number;
  showDate?: boolean;
}

export function ActivityLog({
  activities,
  loading,
  maxItems = 10,
  showDate = true,
}: ActivityLogProps) {
  const visibleActivities = activities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-dark">
            Journal d&apos;activite
          </h3>
        </div>
      </div>

      {/* Activity list */}
      <div className="divide-y divide-gray-50">
        {visibleActivities.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            Aucune activite recente
          </div>
        ) : (
          visibleActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div
                key={activity.id}
                className="px-5 py-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      colorClass
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                      {showDate && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(activity.timestamp), "d MMM HH:mm", {
                              locale: fr,
                            })}
                          </span>
                        </>
                      )}
                      {activity.actor && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-[10px] text-gray-400">
                            par {activity.actor}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {activities.length > maxItems && (
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <button className="text-xs text-accent font-medium hover:underline">
            Voir tout l&apos;historique ({activities.length} entrees)
          </button>
        </div>
      )}
    </div>
  );
}

// Extended types for joined data
interface ModuleProgressWithModule extends ModuleProgress {
  module?: { title: string };
}

interface PaymentWithDetails extends Payment {
  user?: Profile;
}

// Helper function to generate activity log from various data sources
export function generateActivityLog(
  profiles: Profile[],
  moduleProgress: ModuleProgressWithModule[],
  payments: PaymentWithDetails[]
): ActivityLogEntry[] {
  const activities: ActivityLogEntry[] = [];

  // Add user creation events
  profiles.slice(0, 10).forEach((profile) => {
    activities.push({
      id: `user-${profile.id}`,
      type: "user_created",
      title: `Nouveau ${profile.role === "coachee" ? "coachee" : profile.role}`,
      description: `${profile.first_name} ${profile.last_name} a rejoint la plateforme`,
      timestamp: profile.created_at,
      actor: "Systeme",
    });
  });

  // Add module completion events
  moduleProgress
    .filter((mp) => mp.status === "validated")
    .slice(0, 10)
    .forEach((mp) => {
      activities.push({
        id: `module-${mp.id}`,
        type: "module_completed",
        title: "Module termine",
        description: `${mp.module?.title || "Module"} valide`,
        timestamp: mp.validated_at || mp.created_at,
        actor: "Coachee",
      });
    });

  // Add payment events
  payments
    .filter((p) => p.status === "succeeded")
    .slice(0, 10)
    .forEach((payment) => {
      activities.push({
        id: `payment-${payment.id}`,
        type: "payment_received",
        title: "Paiement recu",
        description: `${(payment.amount_cents / 100).toFixed(2)} EUR - ${payment.type === "module" ? "Module" : "Session"}`,
        timestamp: payment.created_at,
      });
    });

  // Sort by timestamp descending
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return activities;
}
