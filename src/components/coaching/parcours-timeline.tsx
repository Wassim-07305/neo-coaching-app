"use client";

import { CheckCircle2, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockModuleProgress, ModuleStatus } from "@/lib/mock-data";

interface ParcoursTimelineProps {
  modules: MockModuleProgress[];
}

function getStepConfig(status: ModuleStatus) {
  switch (status) {
    case "complete":
      return {
        bgClass: "bg-success",
        borderClass: "border-success",
        textClass: "text-success",
        icon: <CheckCircle2 className="w-5 h-5 text-white" />,
        lineClass: "bg-success",
      };
    case "en_cours":
      return {
        bgClass: "bg-accent",
        borderClass: "border-accent",
        textClass: "text-accent",
        icon: <Star className="w-5 h-5 text-white" />,
        lineClass: "bg-accent",
      };
    case "non_commence":
    case "a_venir":
    default:
      return {
        bgClass: "bg-gray-200",
        borderClass: "border-gray-200",
        textClass: "text-gray-400",
        icon: <Lock className="w-4 h-4 text-gray-400" />,
        lineClass: "bg-gray-200",
      };
  }
}

export function ParcoursTimeline({ modules }: ParcoursTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <h2 className="font-heading font-semibold text-dark text-base mb-5">Mon Parcours</h2>

      {/* Desktop: Horizontal timeline */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-6 h-0.5 bg-success z-[1] transition-all duration-500"
            style={{
              width: `${
                modules.filter((m) => m.status === "complete").length > 0
                  ? ((modules.findIndex((m) => m.status === "en_cours" || m.status === "a_venir" || m.status === "non_commence") === -1
                      ? modules.length
                      : modules.findIndex((m) => m.status === "en_cours" || m.status === "a_venir" || m.status === "non_commence")) /
                      (modules.length - 1)) *
                    100
                  : 0
              }%`,
            }}
          />

          {modules.map((mod, index) => {
            const config = getStepConfig(mod.status);
            const isActive = mod.status === "en_cours";

            return (
              <div
                key={mod.module_id}
                className={cn(
                  "flex flex-col items-center relative z-10 flex-1",
                  isActive && "scale-110"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    config.bgClass,
                    config.borderClass,
                    isActive && "ring-4 ring-accent/20"
                  )}
                >
                  {config.icon}
                </div>
                <p
                  className={cn(
                    "text-xs font-medium text-center mt-2 max-w-[100px] leading-tight",
                    config.textClass,
                    isActive && "font-bold"
                  )}
                >
                  {mod.module_title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden space-y-0">
        {modules.map((mod, index) => {
          const config = getStepConfig(mod.status);
          const isActive = mod.status === "en_cours";
          const isLast = index === modules.length - 1;

          return (
            <div key={mod.module_id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0",
                    config.bgClass,
                    config.borderClass,
                    isActive && "ring-4 ring-accent/20"
                  )}
                >
                  {mod.status === "complete" ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : mod.status === "en_cours" ? (
                    <Star className="w-4 h-4 text-white" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 h-8",
                      mod.status === "complete" ? "bg-success" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-6", isActive && "pt-0")}>
                <p
                  className={cn(
                    "text-sm font-medium leading-none mt-1.5",
                    config.textClass,
                    isActive && "font-bold text-base"
                  )}
                >
                  {mod.module_title}
                </p>
                {isActive && (
                  <span className="inline-block text-[10px] font-medium text-white bg-accent px-2 py-0.5 rounded-full mt-1.5">
                    En cours
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
