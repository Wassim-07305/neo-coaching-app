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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Activite recente
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark leading-snug">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activity.time_ago}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
