"use client";

import { useMemo } from "react";
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
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import type { KpiScore } from "@/lib/supabase/types";

interface MonthlyEvolutionChartProps {
  kpiScores: KpiScore[];
  loading?: boolean;
}

interface MonthData {
  month: string;
  investissement: number;
  efficacite: number;
  participation: number;
}

export function MonthlyEvolutionChart({ kpiScores, loading }: MonthlyEvolutionChartProps) {
  const chartData = useMemo((): MonthData[] => {
    if (!kpiScores || kpiScores.length === 0) {
      // Generate mock data for demo
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(now, 5 - i);
        return {
          month: format(date, "MMM", { locale: fr }),
          investissement: 5 + Math.random() * 3,
          efficacite: 5 + Math.random() * 3,
          participation: 5 + Math.random() * 3,
        };
      }).map((d) => ({
        ...d,
        investissement: Math.round(d.investissement * 10) / 10,
        efficacite: Math.round(d.efficacite * 10) / 10,
        participation: Math.round(d.participation * 10) / 10,
      }));
    }

    // Group KPI scores by month
    const monthlyData: Record<string, { inv: number[]; eff: number[]; part: number[] }> = {};
    const now = new Date();

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const key = format(date, "yyyy-MM");
      monthlyData[key] = { inv: [], eff: [], part: [] };
    }

    // Fill with actual data
    kpiScores.forEach((score) => {
      const key = format(new Date(score.scored_at), "yyyy-MM");
      if (monthlyData[key]) {
        monthlyData[key].inv.push(score.investissement);
        monthlyData[key].eff.push(score.efficacite);
        monthlyData[key].part.push(score.participation);
      }
    });

    // Calculate averages
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => {
        const date = new Date(key + "-01");
        const avgInv = data.inv.length > 0 ? data.inv.reduce((a, b) => a + b, 0) / data.inv.length : 5;
        const avgEff = data.eff.length > 0 ? data.eff.reduce((a, b) => a + b, 0) / data.eff.length : 5;
        const avgPart = data.part.length > 0 ? data.part.reduce((a, b) => a + b, 0) / data.part.length : 5;

        return {
          month: format(date, "MMM", { locale: fr }),
          investissement: Math.round(avgInv * 10) / 10,
          efficacite: Math.round(avgEff * 10) / 10,
          participation: Math.round(avgPart * 10) / 10,
        };
      });
  }, [kpiScores]);

  // Calculate trends
  const trends = useMemo(() => {
    if (chartData.length < 2) return { inv: 0, eff: 0, part: 0 };

    const last = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];

    return {
      inv: Math.round((last.investissement - prev.investissement) * 10) / 10,
      eff: Math.round((last.efficacite - prev.efficacite) * 10) / 10,
      part: Math.round((last.participation - prev.participation) * 10) / 10,
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-dark">
                Evolution des KPIs
              </h3>
              <p className="text-xs text-gray-500">
                Moyennes mensuelles sur 6 mois
              </p>
            </div>
          </div>
          <Link
            href="/admin/rapports"
            className="text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-1"
          >
            Rapports
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="investissement"
                name="Investissement"
                stroke="#0A1628"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="efficacite"
                name="Efficacite"
                stroke="#D4A843"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="participation"
                name="Participation"
                stroke="#2D8C4E"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend indicators */}
      <div className="border-t border-gray-100 p-4">
        <div className="grid grid-cols-3 gap-4">
          <TrendIndicator
            label="Investissement"
            value={trends.inv}
            color="bg-primary"
          />
          <TrendIndicator
            label="Efficacite"
            value={trends.eff}
            color="bg-accent"
          />
          <TrendIndicator
            label="Participation"
            value={trends.part}
            color="bg-success"
          />
        </div>
      </div>
    </div>
  );
}

function TrendIndicator({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const isPositive = value >= 0;
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold ${
          isPositive ? "text-success" : "text-danger"
        }`}
      >
        {isPositive ? "+" : ""}
        {value}
      </span>
    </div>
  );
}
