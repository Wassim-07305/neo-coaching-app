"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockModuleProgress, ModuleStatus } from "@/lib/mock-data";

interface MyModulesProps {
  modules: MockModuleProgress[];
}

function getStatusConfig(status: ModuleStatus) {
  switch (status) {
    case "complete":
      return { label: "Fait", bgClass: "bg-success/10", textClass: "text-success", dotClass: "bg-success" };
    case "en_cours":
      return { label: "En cours", bgClass: "bg-warning/10", textClass: "text-warning", dotClass: "bg-warning" };
    case "non_commence":
      return { label: "Non commence", bgClass: "bg-danger/10", textClass: "text-danger", dotClass: "bg-danger" };
    case "a_venir":
      return { label: "A venir", bgClass: "bg-gray-100", textClass: "text-gray-500", dotClass: "bg-gray-400" };
    default:
      return { label: status, bgClass: "bg-gray-100", textClass: "text-gray-500", dotClass: "bg-gray-400" };
  }
}

function getProgressValue(status: ModuleStatus): number {
  switch (status) {
    case "complete": return 100;
    case "en_cours": return 50;
    case "non_commence": return 0;
    case "a_venir": return 0;
    default: return 0;
  }
}

export function MyModules({ modules }: MyModulesProps) {
  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Modules</h2>
        <div className="text-center py-8">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Aucun module assigne pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Modules</h2>
      <div className="space-y-3">
        {modules.map((mod) => {
          const config = getStatusConfig(mod.status);
          const progress = getProgressValue(mod.status);

          return (
            <div
              key={mod.module_id}
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark">{mod.module_title}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0",
                    config.bgClass,
                    config.textClass
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
                  {config.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    mod.status === "complete" ? "bg-success" :
                    mod.status === "en_cours" ? "bg-warning" : "bg-gray-200"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {(mod.status === "en_cours" || mod.status === "complete") && (
                <button className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                  Acceder au module
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
