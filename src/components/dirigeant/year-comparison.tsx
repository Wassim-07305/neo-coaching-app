"use client";

import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type YearData = { month: string; investissement: number; efficacite: number; participation: number }[];

export interface YearComparisonProps {
  currentYear?: YearData;
  previousYear?: YearData;
}

const defaultCurrentYear: YearData = [
  { month: "Jan", investissement: 7.2, efficacite: 6.8, participation: 8.0 },
  { month: "Fev", investissement: 7.5, efficacite: 7.0, participation: 8.2 },
  { month: "Mar", investissement: 7.8, efficacite: 7.3, participation: 8.1 },
  { month: "Avr", investissement: 8.0, efficacite: 7.5, participation: 8.4 },
  { month: "Mai", investissement: 8.2, efficacite: 7.8, participation: 8.6 },
  { month: "Jun", investissement: 8.1, efficacite: 7.6, participation: 8.5 },
];

const defaultPreviousYear: YearData = [
  { month: "Jan", investissement: 6.5, efficacite: 6.0, participation: 7.2 },
  { month: "Fev", investissement: 6.8, efficacite: 6.2, participation: 7.4 },
  { month: "Mar", investissement: 6.7, efficacite: 6.4, participation: 7.3 },
  { month: "Avr", investissement: 7.0, efficacite: 6.5, participation: 7.5 },
  { month: "Mai", investissement: 7.2, efficacite: 6.8, participation: 7.8 },
  { month: "Jun", investissement: 7.1, efficacite: 6.7, participation: 7.6 },
];

export function YearComparison({ currentYear = defaultCurrentYear, previousYear = defaultPreviousYear }: YearComparisonProps) {
  const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];

  const chartData = months.map((m, i) => {
    const curr = currentYear[i];
    const prev = previousYear[i];
    return {
      month: m,
      "Inv. N": curr?.investissement ?? null,
      "Inv. N-1": prev?.investissement ?? null,
      "Eff. N": curr?.efficacite ?? null,
      "Eff. N-1": prev?.efficacite ?? null,
      "Part. N": curr?.participation ?? null,
      "Part. N-1": prev?.participation ?? null,
    };
  });

  // Calculate YoY deltas
  const avgCurrent = currentYear.length > 0
    ? currentYear.reduce((s, m) => s + (m.investissement + m.efficacite + m.participation) / 3, 0) / currentYear.length
    : 0;
  const avgPrevious = previousYear.length > 0
    ? previousYear.reduce((s, m) => s + (m.investissement + m.efficacite + m.participation) / 3, 0) / previousYear.length
    : 0;
  const delta = avgCurrent - avgPrevious;
  const deltaPct = avgPrevious > 0 ? ((delta / avgPrevious) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-dark">
          Comparaison annee sur annee
        </h3>
        <div className="flex items-center gap-2">
          {delta > 0 ? (
            <TrendingUp className="h-4 w-4 text-[#2D8C4E]" />
          ) : delta < 0 ? (
            <TrendingDown className="h-4 w-4 text-[#E74C3C]" />
          ) : (
            <Minus className="h-4 w-4 text-gray-400" />
          )}
          <span
            className={cn(
              "text-sm font-semibold",
              delta > 0 ? "text-[#2D8C4E]" : delta < 0 ? "text-[#E74C3C]" : "text-gray-500"
            )}
          >
            {delta > 0 ? "+" : ""}
            {deltaPct.toFixed(1)}% vs N-1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">Moyenne N</p>
          <p className="text-lg font-bold text-dark">{avgCurrent.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">Moyenne N-1</p>
          <p className="text-lg font-bold text-gray-400">{avgPrevious.toFixed(1)}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Inv. N" stroke="#D4A843" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="Inv. N-1" stroke="#D4A843" strokeWidth={1} strokeDasharray="5 5" dot={false} connectNulls />
            <Line type="monotone" dataKey="Eff. N" stroke="#2D8C4E" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="Eff. N-1" stroke="#2D8C4E" strokeWidth={1} strokeDasharray="5 5" dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-6 bg-[#D4A843]" /> Annee N (continu)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-6 bg-[#D4A843] border-dashed border-b" style={{ borderStyle: "dashed" }} /> Annee N-1 (pointille)
        </div>
      </div>
    </div>
  );
}
