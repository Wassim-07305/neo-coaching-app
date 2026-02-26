"use client";

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
import type { MockKpiHistory } from "@/lib/mock-data";

interface KpiHistoryChartProps {
  data: MockKpiHistory[];
}

export function KpiHistoryChart({ data }: KpiHistoryChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-heading font-semibold text-sm text-dark mb-4">
        Evolution des indicateurs
      </h3>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
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
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="investissement"
              name="Investissement"
              stroke="#1B2A4A"
              strokeWidth={2}
              dot={{ r: 3, fill: "#1B2A4A" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="efficacite"
              name="Efficacite"
              stroke="#F39C12"
              strokeWidth={2}
              dot={{ r: 3, fill: "#F39C12" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="participation"
              name="Participation"
              stroke="#2D8C4E"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2D8C4E" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
