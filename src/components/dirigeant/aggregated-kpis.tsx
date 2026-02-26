"use client";

import { KpiGauge } from "@/components/ui/kpi-gauge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AggregatedKpisProps {
  investissement: number;
  efficacite: number;
  participation: number;
  previousInvestissement?: number;
  previousEfficacite?: number;
  previousParticipation?: number;
}

function TrendIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return null;

  const diff = current - previous;
  const percentage = previous > 0 ? Math.round((diff / previous) * 100) : 0;

  if (diff > 0) {
    return (
      <div className="flex items-center gap-1 text-success text-xs font-medium">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>+{percentage}%</span>
      </div>
    );
  }
  if (diff < 0) {
    return (
      <div className="flex items-center gap-1 text-danger text-xs font-medium">
        <TrendingDown className="w-3.5 h-3.5" />
        <span>{percentage}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
      <Minus className="w-3.5 h-3.5" />
      <span>Stable</span>
    </div>
  );
}

export function AggregatedKpis({
  investissement,
  efficacite,
  participation,
  previousInvestissement,
  previousEfficacite,
  previousParticipation,
}: AggregatedKpisProps) {
  const kpis = [
    {
      label: "Investissement moyen",
      value: investissement,
      previous: previousInvestissement,
    },
    {
      label: "Efficacite moyenne",
      value: efficacite,
      previous: previousEfficacite,
    },
    {
      label: "Participation moyenne",
      value: participation,
      previous: previousParticipation,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <h2 className="font-heading font-semibold text-dark text-base mb-5">
        Indicateurs KPI de l&apos;equipe
      </h2>
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col items-center gap-2">
            <KpiGauge value={kpi.value} label={kpi.label} size="lg" />
            <TrendIndicator current={kpi.value} previous={kpi.previous} />
          </div>
        ))}
      </div>
    </div>
  );
}
