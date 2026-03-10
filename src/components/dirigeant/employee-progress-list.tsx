"use client";

import { useMemo } from "react";
import { Users, TrendingUp, TrendingDown, Minus, BookOpen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeProgress {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  modulesCompleted: number;
  modulesTotal: number;
  progressPercent: number;
  lastActivity: string;
  kpiTrend: "up" | "down" | "stable";
  currentModule: string | null;
}

interface EmployeeProgressListProps {
  employees: EmployeeProgress[];
  className?: string;
}

export function EmployeeProgressList({ employees, className }: EmployeeProgressListProps) {
  // Sort by progress (lowest first to highlight those needing attention)
  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => a.progressPercent - b.progressPercent);
  }, [employees]);

  // Calculate team averages
  const teamStats = useMemo(() => {
    if (employees.length === 0) {
      return { avgProgress: 0, completedModules: 0, totalModules: 0 };
    }

    const avgProgress = Math.round(
      employees.reduce((sum, e) => sum + e.progressPercent, 0) / employees.length
    );
    const completedModules = employees.reduce((sum, e) => sum + e.modulesCompleted, 0);
    const totalModules = employees.reduce((sum, e) => sum + e.modulesTotal, 0);

    return { avgProgress, completedModules, totalModules };
  }, [employees]);

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-success";
    if (percent >= 50) return "bg-accent";
    if (percent >= 25) return "bg-warning";
    return "bg-danger";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3.5 h-3.5 text-success" />;
      case "down":
        return <TrendingDown className="w-3.5 h-3.5 text-danger" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-5 md:p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-dark text-base">
              Progression de l&apos;equipe
            </h2>
            <p className="text-xs text-gray-500">
              {employees.length} collaborateurs
            </p>
          </div>
        </div>

        {/* Team average */}
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">{teamStats.avgProgress}%</p>
          <p className="text-xs text-gray-500">Moyenne equipe</p>
        </div>
      </div>

      {/* Progress summary bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Modules termines globalement</span>
          <span className="font-medium text-dark">
            {teamStats.completedModules} / {teamStats.totalModules}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: teamStats.totalModules > 0
                ? `${(teamStats.completedModules / teamStats.totalModules) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Employee list */}
      <div className="space-y-3">
        {sortedEmployees.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {employee.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={employee.avatarUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <>
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-dark text-sm truncate">
                  {employee.firstName} {employee.lastName}
                </p>
                {getTrendIcon(employee.kpiTrend)}
              </div>

              {/* Current module or completion */}
              <p className="text-xs text-gray-500 truncate">
                {employee.modulesCompleted === employee.modulesTotal ? (
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="w-3 h-3" />
                    Parcours termine
                  </span>
                ) : employee.currentModule ? (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {employee.currentModule}
                  </span>
                ) : (
                  "En attente"
                )}
              </p>
            </div>

            {/* Progress */}
            <div className="w-24 shrink-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">
                  {employee.modulesCompleted}/{employee.modulesTotal}
                </span>
                <span className="font-semibold text-dark">
                  {employee.progressPercent}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getProgressColor(employee.progressPercent)
                  )}
                  style={{ width: `${employee.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun collaborateur</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>&gt;75%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>50-75%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>25-50%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-danger" />
            <span>&lt;25%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
