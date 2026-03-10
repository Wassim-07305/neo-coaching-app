"use client";

import { useMemo } from "react";
import { LayoutDashboard, UserPlus, Download } from "lucide-react";
import { StatsBar } from "@/components/admin/stats-bar";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { EnterpriseKpis } from "@/components/admin/enterprise-kpis";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { PushPermissionCard } from "@/components/ui/push-permission-card";
import { useAdminDashboardStats, useCoachees, useCompanies } from "@/lib/supabase/hooks";
import { adaptCompany } from "@/lib/supabase/adapters";
import {
  mockCoachees,
  mockCompanies,
  mockActivities,
} from "@/lib/mock-data";
import type { MockCoachee } from "@/lib/mock-data";

// ─── Adapt Supabase profile to MockCoachee shape ─────────────
function adaptCoachee(p: Record<string, unknown>): MockCoachee {
  const companies = p.companies as { name: string } | null;
  return {
    id: p.id as string,
    first_name: (p.first_name as string) || "",
    last_name: (p.last_name as string) || "",
    email: (p.email as string) || "",
    avatar_url: (p.avatar_url as string) || null,
    type: p.company_id ? "entreprise" : "individuel",
    company_id: (p.company_id as string) || null,
    company_name: companies?.name || null,
    status: ((p.status as string) === "active" ? "actif" : "inactif") as MockCoachee["status"],
    start_date: (p.created_at as string) || "",
    current_module: null,
    kpis: { investissement: 5, efficacite: 5, participation: 5 },
    kpi_history: [],
    module_progress: [],
    livrables: [],
    calls: [],
    certificates: [],
    last_activity: (p.updated_at as string) || (p.created_at as string) || "",
  };
}

// Mock fallback stats
function getMockStats() {
  const activeCoachees = mockCoachees.filter((c) => c.status === "actif");
  const activeCompanies = mockCompanies.filter((c) => c.mission_status === "active");
  const allSatisfaction = mockCoachees
    .flatMap((c) => c.module_progress)
    .filter((m) => m.satisfaction_score !== undefined)
    .map((m) => m.satisfaction_score as number);
  const avgSatisfaction =
    allSatisfaction.length > 0
      ? (allSatisfaction.reduce((a, b) => a + b, 0) / allSatisfaction.length).toFixed(1)
      : "N/A";

  return {
    activeCoachees: activeCoachees.length,
    activeCompanies: activeCompanies.length,
    avgSatisfaction,
  };
}

export default function AdminDashboardPage() {
  const { data: stats } = useAdminDashboardStats();
  const { data: supaCoachees } = useCoachees();
  const { data: supaCompanies } = useCompanies();
  const mock = getMockStats();

  // ─── Coachees: Supabase with mock fallback ─────────────────
  const coachees = useMemo(
    () => (supaCoachees ? supaCoachees.map(adaptCoachee) : mockCoachees),
    [supaCoachees]
  );

  const companyNames = useMemo(
    () => [...new Set(coachees.filter((c) => c.company_name).map((c) => c.company_name as string))],
    [coachees]
  );

  // ─── Companies: Supabase with mock fallback ────────────────
  const companies = useMemo(
    () =>
      supaCompanies
        ? supaCompanies.map((c) => adaptCompany(c as Parameters<typeof adaptCompany>[0]))
        : mockCompanies,
    [supaCompanies]
  );

  // Real Supabase stats with mock fallback
  const activeCoachees = stats?.activeCoachees ?? mock.activeCoachees;
  const activeCompanies = stats?.totalCompanies ?? mock.activeCompanies;

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

      <PushPermissionCard />

      {/* Stats bar */}
      <StatsBar
        activeCoachees={activeCoachees}
        activeCompanies={activeCompanies}
        modulesCompletedThisMonth={stats?.totalModules ?? 12}
        averageSatisfaction={`${mock.avgSatisfaction}/10`}
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
            <CoacheeTable coachees={coachees} companies={companyNames} />
          </div>

          {/* Enterprise KPIs */}
          <EnterpriseKpis companies={companies} />
        </div>

        {/* Activity feed sidebar */}
        <div className="xl:col-span-1">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </div>
  );
}
