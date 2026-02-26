"use client";

import { LayoutDashboard, UserPlus, Download } from "lucide-react";
import { StatsBar } from "@/components/admin/stats-bar";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { EnterpriseKpis } from "@/components/admin/enterprise-kpis";
import { ActivityFeed } from "@/components/admin/activity-feed";
import {
  mockCoachees,
  mockCompanies,
  mockActivities,
} from "@/lib/mock-data";

// Replace this function with a Supabase query when ready
function getDashboardData() {
  const activeCoachees = mockCoachees.filter((c) => c.status === "actif");
  const activeCompanies = mockCompanies.filter((c) => c.mission_status === "active");
  const modulesCompletedThisMonth = 12;
  const allSatisfaction = mockCoachees
    .flatMap((c) => c.module_progress)
    .filter((m) => m.satisfaction_score !== undefined)
    .map((m) => m.satisfaction_score as number);
  const avgSatisfaction =
    allSatisfaction.length > 0
      ? (allSatisfaction.reduce((a, b) => a + b, 0) / allSatisfaction.length).toFixed(1)
      : "N/A";

  const companyNames = [...new Set(mockCoachees.filter((c) => c.company_name).map((c) => c.company_name as string))];

  return {
    activeCoachees: activeCoachees.length,
    activeCompanies: activeCompanies.length,
    modulesCompletedThisMonth,
    averageSatisfaction: `${avgSatisfaction}/10`,
    coachees: mockCoachees,
    companies: mockCompanies,
    companyNames,
    activities: mockActivities,
  };
}

export default function AdminDashboardPage() {
  const data = getDashboardData();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Dashboard Admin
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un coachee</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar
        activeCoachees={data.activeCoachees}
        activeCompanies={data.activeCompanies}
        modulesCompletedThisMonth={data.modulesCompletedThisMonth}
        averageSatisfaction={data.averageSatisfaction}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Table takes 3 columns */}
        <div className="xl:col-span-3 space-y-6">
          {/* Coachee table */}
          <div>
            <h2 className="font-heading font-semibold text-lg text-dark mb-3">
              Coachees
            </h2>
            <CoacheeTable coachees={data.coachees} companies={data.companyNames} />
          </div>

          {/* Enterprise KPIs */}
          <EnterpriseKpis companies={data.companies} />
        </div>

        {/* Activity feed sidebar */}
        <div className="xl:col-span-1">
          <ActivityFeed activities={data.activities} />
        </div>
      </div>
    </div>
  );
}
