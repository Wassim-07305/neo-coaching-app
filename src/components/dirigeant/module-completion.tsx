"use client";

import { BookOpen } from "lucide-react";

interface ModuleCompletionProps {
  completedModules: number;
  totalModules: number;
}

export function ModuleCompletion({ completedModules, totalModules }: ModuleCompletionProps) {
  const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-heading font-semibold text-dark text-base">
          Completion des modules
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold font-heading text-dark">{percentage}%</span>
          <span className="text-sm text-gray-500">
            {completedModules} / {totalModules} modules completes
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          {percentage}% des modules completes par l&apos;equipe
        </p>
      </div>
    </div>
  );
}
