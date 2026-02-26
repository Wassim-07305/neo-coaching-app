import { cn } from "@/lib/utils";
import { Check, Play, X, Clock } from "lucide-react";
import type { MockModuleProgress, ModuleStatus } from "@/lib/mock-data";

interface ModuleTimelineProps {
  modules: MockModuleProgress[];
}

const statusConfig: Record<
  ModuleStatus,
  { color: string; bgColor: string; borderColor: string; icon: React.ElementType; label: string }
> = {
  complete: {
    color: "text-white",
    bgColor: "bg-success",
    borderColor: "border-success",
    icon: Check,
    label: "Complete",
  },
  en_cours: {
    color: "text-white",
    bgColor: "bg-warning",
    borderColor: "border-warning",
    icon: Play,
    label: "En cours",
  },
  non_commence: {
    color: "text-white",
    bgColor: "bg-danger",
    borderColor: "border-danger",
    icon: X,
    label: "Non commence",
  },
  a_venir: {
    color: "text-gray-400",
    bgColor: "bg-gray-200",
    borderColor: "border-gray-200",
    icon: Clock,
    label: "A venir",
  },
};

export function ModuleTimeline({ modules }: ModuleTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Progression des modules
      </h3>

      {/* Horizontal timeline for desktop */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {modules.map((mod, idx) => {
            const config = statusConfig[mod.status];
            const Icon = config.icon;
            const isLast = idx === modules.length - 1;

            return (
              <div key={mod.module_id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute top-5 left-1/2 w-full h-0.5",
                      mod.status === "complete" ? "bg-success" : "bg-gray-200"
                    )}
                  />
                )}
                {/* Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 border-2",
                    config.bgColor,
                    config.borderColor,
                    mod.status === "en_cours" && "ring-4 ring-warning/20"
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                {/* Label */}
                <p className="text-xs text-center text-gray-600 mt-2 max-w-[120px] leading-tight">
                  {mod.module_title}
                </p>
                <span
                  className={cn(
                    "text-[10px] mt-1 px-1.5 py-0.5 rounded-full",
                    mod.status === "complete" && "bg-success/10 text-success",
                    mod.status === "en_cours" && "bg-warning/10 text-warning",
                    mod.status === "non_commence" && "bg-danger/10 text-danger",
                    mod.status === "a_venir" && "bg-gray-100 text-gray-400"
                  )}
                >
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical timeline for mobile */}
      <div className="md:hidden space-y-0">
        {modules.map((mod, idx) => {
          const config = statusConfig[mod.status];
          const Icon = config.icon;
          const isLast = idx === modules.length - 1;

          return (
            <div key={mod.module_id} className="flex gap-3">
              {/* Circle + line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                    config.bgColor,
                    config.borderColor,
                    mod.status === "en_cours" && "ring-4 ring-warning/20"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", config.color)} />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[24px]",
                      mod.status === "complete" ? "bg-success" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-4">
                <p className="text-sm font-medium text-dark">{mod.module_title}</p>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    mod.status === "complete" && "bg-success/10 text-success",
                    mod.status === "en_cours" && "bg-warning/10 text-warning",
                    mod.status === "non_commence" && "bg-danger/10 text-danger",
                    mod.status === "a_venir" && "bg-gray-100 text-gray-400"
                  )}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
