"use client";

import { Building2, MessageSquare, Star, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiObjectives } from "@/components/dirigeant/kpi-objectives";
import { AggregatedKpis } from "@/components/dirigeant/aggregated-kpis";
import { EvolutionChart } from "@/components/dirigeant/evolution-chart";
import type { EvolutionDataPoint } from "@/components/dirigeant/evolution-chart";
import { ModuleCompletion } from "@/components/dirigeant/module-completion";
import { ReportsPreview } from "@/components/dirigeant/reports-preview";
import { EmployeeProgressList } from "@/components/dirigeant/employee-progress-list";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useCompany,
  useDirigeantDashboardStats,
  useKpiScores,
  useModuleProgress,
  useProfiles,
} from "@/hooks/use-supabase-data";
import { subMonths, endOfMonth } from "date-fns";
import { mockCompanies, mockCoachees, getCompanyAverageKpis } from "@/lib/mock-data";

export default function DirigeantDashboardPage() {
  const { profile, loading: authLoading } = useAuth();

  // Fetch real data from Supabase
  const { data: company, loading: companyLoading } = useCompany(profile?.company_id || undefined);
  const { data: dashboardStats, loading: statsLoading } = useDirigeantDashboardStats(profile?.company_id || undefined);
  const { data: kpiHistory } = useKpiScores({ company_id: profile?.company_id || undefined });
  const { data: moduleProgressData } = useModuleProgress({ company_id: profile?.company_id || undefined });
  const { data: companyEmployees } = useProfiles({ company_id: profile?.company_id || undefined });

  // Fallback mock data
  const mockCompany = mockCompanies[0];
  const mockKpis = getCompanyAverageKpis(mockCompany.id);
  const mockTeamMembers = mockCoachees.filter((c) => c.company_id === mockCompany.id);

  // Compute aggregated evolution data
  const evolutionData = useMemo((): EvolutionDataPoint[] => {
    if (kpiHistory && kpiHistory.length > 0) {
      // Group KPI history by month
      const monthlyData: Record<string, { investissement: number[]; efficacite: number[]; participation: number[] }> = {};
      kpiHistory.forEach((k) => {
        const month = format(new Date(k.scored_at), "MMM yyyy", { locale: fr });
        if (!monthlyData[month]) {
          monthlyData[month] = { investissement: [], efficacite: [], participation: [] };
        }
        monthlyData[month].investissement.push(k.investissement);
        monthlyData[month].efficacite.push(k.efficacite);
        monthlyData[month].participation.push(k.participation);
      });

      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          investissement: Math.round((data.investissement.reduce((a, b) => a + b, 0) / data.investissement.length) * 10) / 10,
          efficacite: Math.round((data.efficacite.reduce((a, b) => a + b, 0) / data.efficacite.length) * 10) / 10,
          participation: Math.round((data.participation.reduce((a, b) => a + b, 0) / data.participation.length) * 10) / 10,
        }))
        .slice(-6); // Last 6 months
    }

    // Fallback to mock data
    const allMonths = new Set<string>();
    mockTeamMembers.forEach((m) => m.kpi_history.forEach((h) => allMonths.add(h.month)));

    const sortedMonths = Array.from(allMonths).sort((a, b) => {
      const monthOrder: Record<string, number> = {
        "Jan": 1, "Fev": 2, "Mar": 3, "Avr": 4, "Mai": 5, "Jun": 6,
        "Jul": 7, "Aou": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
      };
      const [mA, yA] = a.split(" ");
      const [mB, yB] = b.split(" ");
      if (yA !== yB) return parseInt(yA) - parseInt(yB);
      return (monthOrder[mA] || 0) - (monthOrder[mB] || 0);
    });

    return sortedMonths.map((month) => {
      const members = mockTeamMembers.filter((m) =>
        m.kpi_history.some((h) => h.month === month)
      );
      const count = members.length || 1;
      const sums = members.reduce(
        (acc, m) => {
          const h = m.kpi_history.find((h) => h.month === month);
          if (h) {
            acc.investissement += h.investissement;
            acc.efficacite += h.efficacite;
            acc.participation += h.participation;
          }
          return acc;
        },
        { investissement: 0, efficacite: 0, participation: 0 }
      );
      return {
        month,
        investissement: Math.round((sums.investissement / count) * 10) / 10,
        efficacite: Math.round((sums.efficacite / count) * 10) / 10,
        participation: Math.round((sums.participation / count) * 10) / 10,
      };
    });
  }, [kpiHistory]);

  // Previous month KPIs for trend
  const previousMonthData = evolutionData.length >= 2 ? evolutionData[evolutionData.length - 2] : undefined;

  // Module completion stats
  const { completedModules, totalModules } = useMemo(() => {
    if (moduleProgressData && moduleProgressData.length > 0) {
      const completed = moduleProgressData.filter((m) => m.status === "validated").length;
      return { completedModules: completed, totalModules: moduleProgressData.length };
    }
    // Fallback to mock
    const total = mockTeamMembers.reduce((acc, m) => acc + m.module_progress.length, 0);
    const completed = mockTeamMembers.reduce(
      (acc, m) => acc + m.module_progress.filter((p) => p.status === "complete").length,
      0
    );
    return { completedModules: completed, totalModules: total };
  }, [moduleProgressData]);

  // Satisfaction (avg from completed modules with scores)
  const avgSatisfaction = useMemo(() => {
    if (moduleProgressData && moduleProgressData.length > 0) {
      const scores = moduleProgressData
        .filter((m) => m.satisfaction_score !== null && m.satisfaction_score !== undefined)
        .map((m) => m.satisfaction_score as number);
      if (scores.length > 0) {
        return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
      }
    }
    // Fallback to mock
    const allScores = mockTeamMembers.flatMap((m) =>
      m.module_progress.filter((p) => p.satisfaction_score !== undefined).map((p) => p.satisfaction_score!)
    );
    return allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : 0;
  }, [moduleProgressData]);

  // Normalize company data to handle both Supabase and mock types
  const companyData = useMemo(() => {
    if (company) {
      // Supabase Company
      return {
        name: company.name,
        dirigeantName: profile?.first_name || "Dirigeant",
        objectives: company.kpi_objectives
          ? Object.keys(company.kpi_objectives)
          : mockCompany.objectives,
        missionStart: company.mission_start_date || mockCompany.mission_start,
        missionEnd: company.mission_end_date || mockCompany.mission_end,
      };
    }
    // Mock Company fallback
    return {
      name: mockCompany.name,
      dirigeantName: mockCompany.dirigeant_name.split(" ")[0],
      objectives: mockCompany.objectives,
      missionStart: mockCompany.mission_start,
      missionEnd: mockCompany.mission_end,
    };
  }, [company, profile]);

  const kpis = dashboardStats
    ? {
        investissement: dashboardStats.avgKpiInvestissement,
        efficacite: dashboardStats.avgKpiEfficacite,
        participation: dashboardStats.avgKpiParticipation,
      }
    : mockKpis;

  // Transform employee data for progress list
  const employeeProgressData = useMemo(() => {
    if (companyEmployees && companyEmployees.length > 0 && moduleProgressData) {
      return companyEmployees
        .filter((e) => e.role === "salarie")
        .map((employee) => {
          const userModules = moduleProgressData.filter((m) => m.user_id === employee.id);
          const completedCount = userModules.filter((m) => m.status === "validated").length;
          const totalCount = userModules.length || 1;
          const currentModule = userModules.find((m) => m.status === "in_progress");

          return {
            id: employee.id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            avatarUrl: employee.avatar_url,
            modulesCompleted: completedCount,
            modulesTotal: totalCount,
            progressPercent: Math.round((completedCount / totalCount) * 100),
            lastActivity: employee.updated_at
              ? formatDistanceToNow(new Date(employee.updated_at), { addSuffix: true, locale: fr })
              : "Inconnu",
            kpiTrend: "stable" as const, // Would need KPI comparison logic
            currentModule: currentModule?.module?.title || null,
          };
        });
    }
    // Fallback to mock data
    return mockTeamMembers.map((member) => {
      const completedCount = member.module_progress.filter((m) => m.status === "complete").length;
      const totalCount = member.module_progress.length || 1;
      const currentModule = member.module_progress.find((m) => m.status === "en_cours");

      return {
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        avatarUrl: member.avatar_url,
        modulesCompleted: completedCount,
        modulesTotal: totalCount,
        progressPercent: Math.round((completedCount / totalCount) * 100),
        lastActivity: formatDistanceToNow(new Date(member.last_activity), { addSuffix: true, locale: fr }),
        kpiTrend: member.kpis.investissement >= 7 ? "up" as const : member.kpis.investissement <= 4 ? "down" as const : "stable" as const,
        currentModule: currentModule?.module_title || null,
      };
    });
  }, [companyEmployees, moduleProgressData]);

  // Generate dynamic reports for the last 3 months
  const recentReports = useMemo(() => {
    const now = new Date();
    return [0, 1, 2].map((offset) => {
      const d = subMonths(now, offset + 1);
      const end = endOfMonth(d);
      const period = format(d, "MMMM yyyy", { locale: fr });
      const capitalizedPeriod = period.charAt(0).toUpperCase() + period.slice(1);
      return {
        id: `r-${offset}`,
        title: `Rapport ${capitalizedPeriod}`,
        date: format(end, "yyyy-MM-dd"),
        period: capitalizedPeriod,
      };
    });
  }, []);

  const isLoading = authLoading || companyLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark">
            Bonjour, {profile?.first_name || companyData.dirigeantName}
          </h1>
          <p className="text-sm text-gray-500 capitalize mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold text-sm text-primary">{companyData.name}</span>
        </div>
      </div>

      {/* 2. KPI Objectives Reminder */}
      <KpiObjectives
        objectives={companyData.objectives}
        missionStart={companyData.missionStart}
        missionEnd={companyData.missionEnd}
      />

      {/* 3. Aggregated KPI Indicators */}
      <AggregatedKpis
        investissement={kpis.investissement}
        efficacite={kpis.efficacite}
        participation={kpis.participation}
        previousInvestissement={previousMonthData?.investissement}
        previousEfficacite={previousMonthData?.efficacite}
        previousParticipation={previousMonthData?.participation}
      />

      {/* 4. Evolution Chart */}
      <EvolutionChart data={evolutionData} />

      {/* 5. Employee Progress List - Real-time */}
      <EmployeeProgressList employees={employeeProgressData} />

      {/* 6 & 7. Module Completion + Satisfaction side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModuleCompletion
          completedModules={completedModules}
          totalModules={totalModules}
        />

        {/* Satisfaction Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-heading font-semibold text-dark text-base">
              Taux de satisfaction
            </h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <KpiGauge value={avgSatisfaction} label="Satisfaction moyenne" size="lg" />
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tendance positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 & 8. Reports + Message Jean-Claude side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportsPreview reports={recentReports} />

        {/* Message Jean-Claude */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-medium/10">
              <MessageSquare className="w-5 h-5 text-primary-medium" />
            </div>
            <h2 className="font-heading font-semibold text-dark text-base">
              Contact Jean-Claude
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 flex-1">
            Vous avez une question sur l&apos;avancement de votre equipe ? N&apos;hesitez pas
            a contacter Jean-Claude directement.
          </p>
          <Link
            href="/dirigeant/messages"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Envoyer un message a Jean-Claude
          </Link>
        </div>
      </div>
    </div>
  );
}
