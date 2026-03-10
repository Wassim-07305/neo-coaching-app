"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface KpiData {
  investissement: number;
  efficacite: number;
  participation: number;
  month: string;
}

interface KpiComparisonProps {
  currentData: KpiData;
  previousData?: KpiData;
  historicalData?: KpiData[];
  companyName?: string;
  className?: string;
}

type KpiKey = "investissement" | "efficacite" | "participation";

const KPI_CONFIG: Record<KpiKey, { label: string; color: string; description: string }> = {
  investissement: {
    label: "Investissement",
    color: "text-success",
    description: "Engagement et motivation des participants",
  },
  efficacite: {
    label: "Efficacite",
    color: "text-accent",
    description: "Productivite et resultats obtenus",
  },
  participation: {
    label: "Participation",
    color: "text-blue-500",
    description: "Presence et implication active",
  },
};

function getTrend(current: number, previous: number): "up" | "down" | "stable" {
  const diff = current - previous;
  if (diff > 0.5) return "up";
  if (diff < -0.5) return "down";
  return "stable";
}

function getTrendIcon(trend: "up" | "down" | "stable") {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-success" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-danger" />;
    default:
      return <Minus className="w-4 h-4 text-gray-400" />;
  }
}

function getProgressColor(value: number): string {
  if (value >= 7) return "bg-success";
  if (value >= 5) return "bg-warning";
  return "bg-danger";
}

export function KpiComparison({
  currentData,
  previousData,
  historicalData,
  companyName,
  className,
}: KpiComparisonProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"1m" | "3m" | "6m">("1m");

  // Calculate period-based comparison
  const comparisonData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return previousData || null;
    }

    const monthsBack = selectedPeriod === "1m" ? 1 : selectedPeriod === "3m" ? 3 : 6;
    const targetIndex = Math.min(monthsBack - 1, historicalData.length - 1);
    return historicalData[targetIndex];
  }, [historicalData, previousData, selectedPeriod]);

  // Calculate averages over selected period
  const periodAverages = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }

    const monthsBack = selectedPeriod === "1m" ? 1 : selectedPeriod === "3m" ? 3 : 6;
    const relevantData = historicalData.slice(0, monthsBack);

    return {
      investissement:
        Math.round(
          (relevantData.reduce((sum, d) => sum + d.investissement, 0) /
            relevantData.length) *
            10
        ) / 10,
      efficacite:
        Math.round(
          (relevantData.reduce((sum, d) => sum + d.efficacite, 0) /
            relevantData.length) *
            10
        ) / 10,
      participation:
        Math.round(
          (relevantData.reduce((sum, d) => sum + d.participation, 0) /
            relevantData.length) *
            10
        ) / 10,
    };
  }, [historicalData, selectedPeriod]);

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark text-base">
                Comparaison KPI
              </h2>
              {companyName && (
                <p className="text-xs text-gray-500">{companyName}</p>
              )}
            </div>
          </div>

          {/* Period selector */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["1m", "3m", "6m"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedPeriod === period
                    ? "bg-accent text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {period === "1m" ? "1 mois" : period === "3m" ? "3 mois" : "6 mois"}
              </button>
            ))}
          </div>
        </div>

        {/* Period info */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{currentData.month}</span>
          {comparisonData && (
            <>
              <ArrowRight className="w-3 h-3" />
              <span className="text-gray-400">vs {comparisonData.month}</span>
            </>
          )}
        </div>
      </div>

      {/* KPI Comparison Grid */}
      <div className="p-5 space-y-4">
        {(Object.keys(KPI_CONFIG) as KpiKey[]).map((key) => {
          const config = KPI_CONFIG[key];
          const currentValue = currentData[key];
          const previousValue = comparisonData?.[key];
          const trend = previousValue ? getTrend(currentValue, previousValue) : "stable";
          const diff = previousValue
            ? Math.round((currentValue - previousValue) * 10) / 10
            : 0;

          return (
            <div key={key} className="space-y-2">
              {/* Label and values */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark">
                    {config.label}
                  </span>
                  {getTrendIcon(trend)}
                </div>
                <div className="flex items-center gap-3">
                  {previousValue !== undefined && (
                    <span className="text-sm text-gray-400">
                      {previousValue.toFixed(1)}
                    </span>
                  )}
                  <ArrowRight className="w-3 h-3 text-gray-300" />
                  <span className={cn("text-lg font-bold", config.color)}>
                    {currentValue.toFixed(1)}
                  </span>
                  {diff !== 0 && (
                    <span
                      className={cn(
                        "text-xs font-medium px-1.5 py-0.5 rounded",
                        diff > 0
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      )}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar comparison */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                {/* Previous value indicator */}
                {previousValue !== undefined && (
                  <div
                    className="absolute top-0 h-full bg-gray-300 rounded-full"
                    style={{ width: `${previousValue * 10}%` }}
                  />
                )}
                {/* Current value */}
                <div
                  className={cn(
                    "absolute top-0 h-full rounded-full transition-all duration-500",
                    getProgressColor(currentValue)
                  )}
                  style={{ width: `${currentValue * 10}%` }}
                />
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400">{config.description}</p>
            </div>
          );
        })}
      </div>

      {/* Period averages */}
      {periodAverages && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>
              Moyenne sur{" "}
              {selectedPeriod === "1m"
                ? "1 mois"
                : selectedPeriod === "3m"
                  ? "3 mois"
                  : "6 mois"}
            </span>
          </div>
          <div className="flex gap-4">
            {(Object.keys(KPI_CONFIG) as KpiKey[]).map((key) => {
              const config = KPI_CONFIG[key];
              const avgValue = periodAverages[key];

              return (
                <div key={key} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      getProgressColor(avgValue)
                    )}
                  />
                  <span className="text-xs text-gray-600">
                    {config.label}: <strong>{avgValue.toFixed(1)}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>&ge;7 Excellent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>5-7 Correct</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-danger" />
            <span>&lt;5 A ameliorer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
