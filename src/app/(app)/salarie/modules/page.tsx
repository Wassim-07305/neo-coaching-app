"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Check,
  Play,
  Clock,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCoachees, mockModules } from "@/lib/mock-data";
import type { ModuleStatus } from "@/lib/mock-data";

// Use Marie Dupont as the logged-in salarie
const currentUser = mockCoachees[0];

const statusConfig: Record<
  ModuleStatus,
  {
    label: string;
    icon: React.ElementType;
    bgClass: string;
    textClass: string;
    dotClass: string;
    progress: number;
  }
> = {
  complete: {
    label: "Termine",
    icon: Check,
    bgClass: "bg-success/10",
    textClass: "text-success",
    dotClass: "bg-success",
    progress: 100,
  },
  en_cours: {
    label: "En cours",
    icon: Play,
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    dotClass: "bg-warning",
    progress: 50,
  },
  non_commence: {
    label: "Non commence",
    icon: Clock,
    bgClass: "bg-danger/10",
    textClass: "text-danger",
    dotClass: "bg-danger",
    progress: 0,
  },
  a_venir: {
    label: "A venir",
    icon: Lock,
    bgClass: "bg-gray-100",
    textClass: "text-gray-400",
    dotClass: "bg-gray-300",
    progress: 0,
  },
};

type Filter = "tous" | "en_cours" | "complete" | "a_venir";

export default function SalarieModulesPage() {
  const [filter, setFilter] = useState<Filter>("tous");

  const modules = currentUser.module_progress.map((mp) => {
    const moduleDetail = mockModules.find((m) => m.id === mp.module_id);
    return {
      ...mp,
      description: moduleDetail?.description || "",
      duration_weeks: moduleDetail?.duration_weeks || 4,
    };
  });

  const filtered =
    filter === "tous"
      ? modules
      : modules.filter((m) => m.status === filter);

  const completedCount = modules.filter((m) => m.status === "complete").length;
  const inProgressCount = modules.filter((m) => m.status === "en_cours").length;
  const overallProgress =
    modules.length > 0
      ? Math.round(
          modules.reduce((sum, m) => sum + statusConfig[m.status].progress, 0) /
            modules.length
        )
      : 0;

  const filters: { key: Filter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "en_cours", label: "En cours" },
    { key: "complete", label: "Termines" },
    { key: "a_venir", label: "A venir" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-xl font-bold text-dark">
            Mes Modules
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Suivez votre progression dans les modules de formation assignes.
        </p>
      </div>

      {/* Progress summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Progression globale</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-bold font-heading text-dark shrink-0">
                {overallProgress}%
              </span>
            </div>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-success">{completedCount}</p>
              <p className="text-[10px] text-gray-500">Termines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-warning">{inProgressCount}</p>
              <p className="text-[10px] text-gray-500">En cours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-dark">{modules.length}</p>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              filter === f.key
                ? "bg-accent text-white border-accent"
                : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Module cards */}
      <div className="space-y-3">
        {filtered.map((mod) => {
          const config = statusConfig[mod.status];
          const Icon = config.icon;
          const isAccessible = mod.status === "en_cours" || mod.status === "complete";

          return (
            <div
              key={mod.module_id}
              className={cn(
                "bg-white rounded-xl border border-gray-200 p-5 transition-all",
                isAccessible && "hover:border-accent/30 hover:shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-dark text-sm sm:text-base">
                      {mod.module_title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0",
                        config.bgClass,
                        config.textClass
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {mod.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">
                      Duree: {mod.duration_weeks} semaines
                    </span>
                    {mod.satisfaction_score !== undefined && (
                      <span className="text-xs text-accent font-medium">
                        Satisfaction: {mod.satisfaction_score}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    mod.status === "complete"
                      ? "bg-success"
                      : mod.status === "en_cours"
                      ? "bg-warning"
                      : "bg-gray-200"
                  )}
                  style={{ width: `${config.progress}%` }}
                />
              </div>

              {isAccessible && (
                <Link
                  href={`/salarie/modules/${mod.module_id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  {mod.status === "complete" ? "Revoir le module" : "Continuer le module"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun module dans cette categorie.</p>
            <button
              onClick={() => setFilter("tous")}
              className="mt-2 text-xs text-accent font-medium hover:underline"
            >
              Voir tous les modules
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
