"use client";

import { KpiGauge } from "@/components/ui/kpi-gauge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MockKpiScores, MockKpiHistory } from "@/lib/mock-data";

interface MyIndicatorsProps {
  kpis: MockKpiScores;
  history: MockKpiHistory[];
}

function SmallTrend({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-success text-[10px] font-medium">
        <TrendingUp className="w-3 h-3" />+{diff}
      </span>
    );
  if (diff < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-danger text-[10px] font-medium">
        <TrendingDown className="w-3 h-3" />{diff}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-gray-400 text-[10px] font-medium">
      <Minus className="w-3 h-3" />0
    </span>
  );
}

export function MyIndicators({ kpis, history }: MyIndicatorsProps) {
  const prev = history.length >= 2 ? history[history.length - 2] : undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">
        Mes Indicateurs
      </h2>

      {/* 3 Gauges */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex flex-col items-center gap-1">
          <KpiGauge value={kpis.investissement} label="Investissement" size="md" />
          <SmallTrend current={kpis.investissement} previous={prev?.investissement} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <KpiGauge value={kpis.efficacite} label="Efficacite" size="md" />
          <SmallTrend current={kpis.efficacite} previous={prev?.efficacite} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <KpiGauge value={kpis.participation} label="Participation" size="md" />
          <SmallTrend current={kpis.participation} previous={prev?.participation} />
        </div>
      </div>

      {/* History chart */}
      {history.length > 1 && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} iconType="circle" iconSize={6} />
              <Line type="monotone" dataKey="investissement" name="Invest." stroke="#1B2A4A" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="efficacite" name="Effic." stroke="#F39C12" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="participation" name="Partic." stroke="#2D8C4E" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
