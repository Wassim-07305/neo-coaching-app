"use client";

import { LayoutDashboard, UserPlus, Download, Loader2 } from "lucide-react";
import { StatsBar } from "@/components/admin/stats-bar";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { EnterpriseKpis } from "@/components/admin/enterprise-kpis";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { RevenueWidget } from "@/components/admin/revenue-widget";
import { MonthlyEvolutionChart } from "@/components/admin/monthly-evolution-chart";
import { useAdminDashboardStats, useProfiles, useCompanies, useModuleProgress, useKpiScores, usePayments } from "@/hooks/use-supabase-data";
import { useMemo, useCallback } from "react";
import type { MockActivity } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Fetch real data from Supabase
  const { data: stats, loading: statsLoading } = useAdminDashboardStats();
  const { data: profiles, loading: profilesLoading } = useProfiles({ status: "active" });
  const { data: companies, loading: companiesLoading } = useCompanies();
  const { data: moduleProgressList } = useModuleProgress();
  const { data: allKpiScores } = useKpiScores();
  const { data: payments, loading: paymentsLoading } = usePayments();

  // Build a map of latest KPI scores per user
  const latestKpiByUser = useMemo(() => {
    const map: Record<string, { investissement: number; efficacite: number; participation: number }> = {};
    if (!allKpiScores) return map;

    for (const score of allKpiScores) {
      if (!map[score.user_id]) {
        // Scores are ordered by scored_at desc, so the first one per user is the latest
        map[score.user_id] = {
          investissement: score.investissement ?? 5,
          efficacite: score.efficacite ?? 5,
          participation: score.participation ?? 5,
        };
      }
    }
    return map;
  }, [allKpiScores]);

  // Transform Supabase data to match component props
  const coachees = useMemo(() => {
    if (!profiles) return [];

    return profiles
      .filter((p) => p.role === "coachee" || p.role === "salarie")
      .map((profile) => {
        const company = companies?.find((c) => c.id === profile.company_id);
        const userProgress = moduleProgressList?.filter((mp) => mp.user_id === profile.id) || [];
        const userKpis = latestKpiByUser[profile.id] || {
          investissement: 5,
          efficacite: 5,
          participation: 5,
        };

        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          type: (profile.coaching_type || "individuel") as "individuel" | "entreprise",
          status: profile.status === "active" ? "actif" as const : profile.status === "inactive" ? "inactif" as const : "archive" as const,
          company_id: profile.company_id,
          company_name: company?.name || null,
          start_date: profile.created_at,
          current_module: null,
          kpis: userKpis,
          kpi_history: [],
          module_progress: userProgress.map((mp) => ({
            module_id: mp.module_id,
            module_title: mp.module?.title || "Module",
            status: mp.status === "validated" ? "complete" as const : mp.status === "in_progress" ? "en_cours" as const : "non_commence" as const,
            satisfaction_score: mp.satisfaction_score || undefined,
          })),
          livrables: [],
          calls: [],
          certificates: [],
          last_activity: profile.updated_at,
        };
      });
  }, [profiles, companies, moduleProgressList, latestKpiByUser]);

  const companiesForKpi = useMemo(() => {
    if (!companies) return [];

    return companies.map((company) => {
      const employees = profiles?.filter((p) => p.company_id === company.id) || [];

      return {
        id: company.id,
        name: company.name,
        dirigeant_name: "",
        dirigeant_email: "",
        employee_count: employees.length,
        mission_start: company.mission_start_date || "",
        mission_end: company.mission_end_date || "",
        mission_status: company.mission_status,
        objectives: [] as string[],
        logo_placeholder: company.name.substring(0, 2).toUpperCase(),
      };
    });
  }, [companies, profiles]);

  const companyNames = useMemo(() => {
    return companies?.map((c) => c.name) || [];
  }, [companies]);

  // Generate activity feed from recent data
  const activities = useMemo<MockActivity[]>(() => {
    const items: MockActivity[] = [];

    // Add recent module completions
    moduleProgressList
      ?.filter((mp) => mp.status === "validated")
      .slice(0, 5)
      .forEach((mp, i) => {
        const user = profiles?.find((p) => p.id === mp.user_id);
        const userName = user ? `${user.first_name} ${user.last_name}` : "Utilisateur";
        const timestamp = mp.validated_at || mp.created_at;

        items.push({
          id: `activity-${i}`,
          type: "module_complete",
          message: `${userName} a termine le module "${mp.module?.title || "Module"}"`,
          time_ago: formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr }),
          coachee_id: mp.user_id,
        });
      });

    return items.slice(0, 10);
  }, [moduleProgressList, profiles]);

  const exportToCSV = useCallback(() => {
    if (coachees.length === 0) {
      toast("Aucun coachee a exporter", "warning");
      return;
    }

    const headers = ["Prenom", "Nom", "Email", "Type", "Entreprise", "Statut", "Modules completes", "Date inscription"];
    const rows = coachees.map((c) => [
      c.first_name,
      c.last_name,
      c.email,
      c.type === "individuel" ? "Individuel" : "Entreprise",
      c.company_name || "",
      c.status,
      c.module_progress.filter((m) => m.status === "complete").length,
      c.start_date ? new Date(c.start_date).toLocaleDateString("fr-FR") : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `coachees-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Export CSV telecharge", "success");
  }, [coachees, toast]);

  const isLoading = statsLoading || profilesLoading || companiesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

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
          <button
            onClick={exportToCSV}
            disabled={coachees.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
          <button
            onClick={() => router.push("/admin/coachees")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un coachee</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar
        activeCoachees={stats?.totalCoachees || 0}
        activeCompanies={stats?.activeCompanies || 0}
        modulesCompletedThisMonth={stats?.completedModules || 0}
        averageSatisfaction={stats?.avgSatisfaction ? `${stats.avgSatisfaction}/10` : "N/A"}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEvolutionChart kpiScores={allKpiScores || []} />
        <RevenueWidget payments={payments || []} loading={paymentsLoading} />
      </div>

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
          <EnterpriseKpis companies={companiesForKpi} />
        </div>

        {/* Activity feed sidebar */}
        <div className="xl:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
