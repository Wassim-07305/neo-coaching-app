"use client";

import { useMemo } from "react";
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
import { BookOpen, Users, CheckCircle, Clock } from "lucide-react";
import type { ModuleProgress, Module } from "@/lib/supabase/types";

interface ModuleStatsChartProps {
  modules: Module[];
  moduleProgress: ModuleProgress[];
  loading?: boolean;
}

interface ModuleStatData {
  name: string;
  id: string;
  enrolled: number;
  completed: number;
  inProgress: number;
  completionRate: number;
}

const COLORS = {
  completed: "#2D8C4E",
  inProgress: "#F39C12",
  notStarted: "#E5E7EB",
};

export function ModuleStatsChart({
  modules,
  moduleProgress,
  loading,
}: ModuleStatsChartProps) {
  const chartData = useMemo((): ModuleStatData[] => {
    if (!modules || modules.length === 0) {
      // Mock data for demo
      return [
        { name: "Intelligence...", id: "1", enrolled: 45, completed: 32, inProgress: 8, completionRate: 71 },
        { name: "Estime de soi", id: "2", enrolled: 38, completed: 25, inProgress: 10, completionRate: 66 },
        { name: "Confiance", id: "3", enrolled: 28, completed: 15, inProgress: 8, completionRate: 54 },
        { name: "Prise parole", id: "4", enrolled: 22, completed: 8, inProgress: 12, completionRate: 36 },
      ];
    }

    return modules.map((module) => {
      const progress = moduleProgress?.filter((mp) => mp.module_id === module.id) || [];
      const completed = progress.filter((p) => p.status === "validated").length;
      const inProgress = progress.filter((p) => p.status === "in_progress" || p.status === "submitted").length;
      const enrolled = progress.length;
      const completionRate = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;

      return {
        name: module.title.length > 15 ? module.title.substring(0, 12) + "..." : module.title,
        id: module.id,
        enrolled,
        completed,
        inProgress,
        completionRate,
      };
    }).slice(0, 6); // Show top 6 modules
  }, [modules, moduleProgress]);

  const totals = useMemo(() => {
    const totalEnrolled = chartData.reduce((sum, d) => sum + d.enrolled, 0);
    const totalCompleted = chartData.reduce((sum, d) => sum + d.completed, 0);
    const totalInProgress = chartData.reduce((sum, d) => sum + d.inProgress, 0);
    const avgCompletionRate = chartData.length > 0
      ? Math.round(chartData.reduce((sum, d) => sum + d.completionRate, 0) / chartData.length)
      : 0;

    return { totalEnrolled, totalCompleted, totalInProgress, avgCompletionRate };
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-dark">
              Statistiques des modules
            </h3>
            <p className="text-xs text-gray-500">
              Progression et completion par module
            </p>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3 p-5 border-b border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xl font-bold text-dark">{totals.totalEnrolled}</p>
          <p className="text-[10px] text-gray-500">Inscrits</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-success" />
          </div>
          <p className="text-xl font-bold text-success">{totals.totalCompleted}</p>
          <p className="text-[10px] text-gray-500">Termines</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-warning" />
          </div>
          <p className="text-xl font-bold text-warning">{totals.totalInProgress}</p>
          <p className="text-[10px] text-gray-500">En cours</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-dark">{totals.avgCompletionRate}%</p>
          <p className="text-[10px] text-gray-500">Taux moyen</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#374151" }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value, name) => [
                  value ?? 0,
                  name === "completed" ? "Termines" : name === "inProgress" ? "En cours" : name,
                ]}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Bar dataKey="completed" stackId="a" fill={COLORS.completed} radius={[0, 0, 0, 0]} name="Termines" />
              <Bar dataKey="inProgress" stackId="a" fill={COLORS.inProgress} radius={[0, 4, 4, 0]} name="En cours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-100 px-5 py-3">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.completed }} />
            <span className="text-gray-600">Termines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.inProgress }} />
            <span className="text-gray-600">En cours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
