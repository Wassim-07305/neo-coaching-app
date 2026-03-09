"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getKpiColor } from "@/lib/mock-data";
import type { MockModuleProgress } from "@/lib/mock-data";

interface SatisfactionHistoryProps {
  modules: MockModuleProgress[];
}

const colorTextMap = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

const colorBgMap = {
  danger: "bg-danger/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
};

export function SatisfactionHistory({ modules }: SatisfactionHistoryProps) {
  const scoredModules = modules.filter((m) => m.satisfaction_score !== undefined);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-5 h-5 text-accent" />
        <h2 className="font-heading font-semibold text-dark text-base">Ma Satisfaction</h2>
      </div>

      {scoredModules.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">
            Les scores de satisfaction apparaitront apres la completion de vos modules.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scoredModules.map((mod) => {
            const score = mod.satisfaction_score!;
            const color = getKpiColor(score);
            return (
              <div
                key={mod.module_id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <span className="text-sm text-dark font-medium">{mod.module_title}</span>
                <span
                  className={cn(
                    "text-lg font-bold px-2.5 py-0.5 rounded-lg",
                    colorTextMap[color],
                    colorBgMap[color]
                  )}
                >
                  {score}/10
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
