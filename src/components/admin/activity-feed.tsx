import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Award,
} from "lucide-react";
import type { MockActivity } from "@/lib/mock-data";

interface ActivityFeedProps {
  activities: MockActivity[];
}

const typeConfig = {
  module_complete: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  kpi_alert: {
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  rdv: {
    icon: Calendar,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  livrable: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  certificate: {
    icon: Award,
    color: "text-accent",
    bg: "bg-accent/10",
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="font-heading font-semibold text-dark flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Activite recente
        </h3>
      </div>
      <div className="p-4 space-y-1">
        {activities.map((activity, idx) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50",
                idx === 0 && "bg-gray-50/50"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark leading-snug font-medium">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time_ago}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <button className="text-xs text-accent font-medium hover:underline">
          Voir tout l&apos;historique
        </button>
      </div>
    </div>
  );
}
