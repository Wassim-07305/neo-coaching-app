"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { MockModuleProgress } from "@/lib/mock-data";

interface SatisfactionChartProps {
  modules: MockModuleProgress[];
}

export function SatisfactionChart({ modules }: SatisfactionChartProps) {
  const data = modules
    .filter((m) => m.satisfaction_score !== undefined)
    .map((m) => ({
      name: m.module_title.length > 15 ? m.module_title.slice(0, 15) + "..." : m.module_title,
      fullName: m.module_title,
      score: m.satisfaction_score as number,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Satisfaction par module
        </h3>
        <p className="text-sm text-gray-400 text-center py-6">
          Aucune donnee de satisfaction disponible.
        </p>
      </div>
    );
  }

  function getBarColor(score: number): string {
    if (score <= 3) return "#E74C3C";
    if (score <= 6) return "#F39C12";
    return "#2D8C4E";
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Satisfaction par module
      </h3>
      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value}/10`, "Satisfaction"]}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(_label: any, payload: any) => {
                if (payload && payload[0]?.payload?.fullName) return payload[0].payload.fullName;
                return _label;
              }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
