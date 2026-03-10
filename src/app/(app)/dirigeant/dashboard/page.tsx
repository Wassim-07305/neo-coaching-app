"use client";

import { Building2, MessageSquare, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiObjectives } from "@/components/dirigeant/kpi-objectives";
import { AggregatedKpis } from "@/components/dirigeant/aggregated-kpis";
import { EvolutionChart } from "@/components/dirigeant/evolution-chart";
import type { EvolutionDataPoint } from "@/components/dirigeant/evolution-chart";
import { ModuleCompletion } from "@/components/dirigeant/module-completion";
import { ReportsPreview } from "@/components/dirigeant/reports-preview";
import { useProfile, useCompany, useCompanyKpis } from "@/lib/supabase/hooks";
import type { Company, KpiScore } from "@/lib/supabase/types";
import { mockCompanies, mockCoachees, getCompanyAverageKpis } from "@/lib/mock-data";

// ─── Mock fallback data ─────────────────────────────────────

const fallbackCompany = mockCompanies[0];
const fallbackTeam = mockCoachees.filter((c) => c.company_id === fallbackCompany.id);
const fallbackKpis = getCompanyAverageKpis(fallbackCompany.id);

const MONTH_ORDER: Record<string, number> = {
  "Jan": 1, "Fev": 2, "Mar": 3, "Avr": 4, "Mai": 5, "Jun": 6,
  "Jul": 7, "Aou": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
};
const MONTH_NAMES = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];

function sortMonthLabels(months: string[]): string[] {
  return months.sort((a, b) => {
    const [mA, yA] = a.split(" ");
    const [mB, yB] = b.split(" ");
    if (yA !== yB) return parseInt(yA) - parseInt(yB);
    return (MONTH_ORDER[mA] || 0) - (MONTH_ORDER[mB] || 0);
  });
}

function computeMockEvolution(): EvolutionDataPoint[] {
  const allMonths = new Set<string>();
  fallbackTeam.forEach((m) => m.kpi_history.forEach((h) => allMonths.add(h.month)));

  return sortMonthLabels(Array.from(allMonths)).map((month) => {
    const members = fallbackTeam.filter((m) =>
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
}

const fallbackEvolution = computeMockEvolution();

// Module completion stats from mock
const fallbackTotalModules = fallbackTeam.reduce((acc, m) => acc + m.module_progress.length, 0);
const fallbackCompletedModules = fallbackTeam.reduce(
  (acc, m) => acc + m.module_progress.filter((p) => p.status === "complete").length,
  0
);
const fallbackSatisfactionScores = fallbackTeam.flatMap((m) =>
  m.module_progress.filter((p) => p.satisfaction_score !== undefined).map((p) => p.satisfaction_score!)
);
const fallbackAvgSatisfaction =
  fallbackSatisfactionScores.length > 0
    ? Math.round((fallbackSatisfactionScores.reduce((a, b) => a + b, 0) / fallbackSatisfactionScores.length) * 10) / 10
    : 0;

// Mock reports
const mockReports = [
  { id: "r-1", title: "Rapport Fevrier 2026", date: "2026-02-28", period: "Fevrier 2026" },
  { id: "r-2", title: "Rapport Janvier 2026", date: "2026-01-31", period: "Janvier 2026" },
  { id: "r-3", title: "Rapport Decembre 2025", date: "2025-12-31", period: "Decembre 2025" },
];

// ─── Helpers: derive data from Supabase KPI scores ──────────

function computeAggregatedKpis(scores: KpiScore[]) {
  if (scores.length === 0) return fallbackKpis;

  // Get the latest score per user (scores are ordered desc by scored_at)
  const latestByUser = new Map<string, { investissement: number; efficacite: number; participation: number }>();
  for (const score of scores) {
    if (!latestByUser.has(score.user_id)) {
      latestByUser.set(score.user_id, {
        investissement: score.investissement,
        efficacite: score.efficacite,
        participation: score.participation,
      });
    }
  }
  const entries = Array.from(latestByUser.values());
  const count = entries.length || 1;
  const sum = entries.reduce(
    (acc, e) => ({
      investissement: acc.investissement + e.investissement,
      efficacite: acc.efficacite + e.efficacite,
      participation: acc.participation + e.participation,
    }),
    { investissement: 0, efficacite: 0, participation: 0 }
  );
  return {
    investissement: Math.round((sum.investissement / count) * 10) / 10,
    efficacite: Math.round((sum.efficacite / count) * 10) / 10,
    participation: Math.round((sum.participation / count) * 10) / 10,
  };
}

function computeEvolutionFromScores(scores: KpiScore[]): EvolutionDataPoint[] {
  if (scores.length === 0) return fallbackEvolution;

  const byMonth = new Map<string, { investissement: number; efficacite: number; participation: number; count: number }>();
  for (const score of scores) {
    const d = new Date(score.scored_at);
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    const existing = byMonth.get(label) || { investissement: 0, efficacite: 0, participation: 0, count: 0 };
    existing.investissement += score.investissement;
    existing.efficacite += score.efficacite;
    existing.participation += score.participation;
    existing.count += 1;
    byMonth.set(label, existing);
  }

  return sortMonthLabels(Array.from(byMonth.keys())).map((month) => {
    const d = byMonth.get(month)!;
    return {
      month,
      investissement: Math.round((d.investissement / d.count) * 10) / 10,
      efficacite: Math.round((d.efficacite / d.count) * 10) / 10,
      participation: Math.round((d.participation / d.count) * 10) / 10,
    };
  });
}

function extractObjectives(company: Company | null): string[] {
  if (!company?.kpi_objectives) return fallbackCompany.objectives;
  if (Array.isArray(company.kpi_objectives)) {
    return company.kpi_objectives as unknown as string[];
  }
  if (typeof company.kpi_objectives === "object") {
    const obj = company.kpi_objectives as Record<string, unknown>;
    if (Array.isArray(obj.objectives)) return obj.objectives as string[];
  }
  return fallbackCompany.objectives;
}

// ─── Page Component ─────────────────────────────────────────

export default function DirigeantDashboardPage() {
  // 1. Fetch current user's profile to get company_id
  const { data: profile, loading: profileLoading } = useProfile();
  const companyId = profile?.company_id ?? null;

  // 2. Fetch company & KPIs from Supabase
  const { data: rawCompany, loading: companyLoading } = useCompany(companyId);
  const company = rawCompany as Company | null;
  const { data: rawKpis, loading: kpisLoading } = useCompanyKpis(companyId);
  const companyKpiScores = (rawKpis ?? []) as KpiScore[];

  // 3. Derive display values with mock fallback
  const firstName = profile
    ? profile.first_name
    : fallbackCompany.dirigeant_name.split(" ")[0];
  const companyName = company?.name ?? fallbackCompany.name;
  const objectives = extractObjectives(company);
  const missionStart = company?.mission_start_date ?? fallbackCompany.mission_start;
  const missionEnd = company?.mission_end_date ?? fallbackCompany.mission_end;

  // 4. Aggregated KPIs & evolution from Supabase or mock fallback
  const aggregatedKpis = computeAggregatedKpis(companyKpiScores);
  const evolutionData = computeEvolutionFromScores(companyKpiScores);
  const previousMonthData = evolutionData.length >= 2 ? evolutionData[evolutionData.length - 2] : undefined;

  // 5. Module completion & satisfaction — keep mock for now (no Supabase aggregate query yet)
  const totalModuleSlots = fallbackTotalModules;
  const completedModuleSlots = fallbackCompletedModules;
  const avgSatisfaction = fallbackAvgSatisfaction;

  // 6. Real date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Loading state
  const isLoading = profileLoading || companyLoading || kpisLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark">
            Bonjour, {firstName}
          </h1>
          <p className="text-sm text-gray-500 capitalize mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold text-sm text-primary">{companyName}</span>
        </div>
      </div>

      {/* 2. KPI Objectives Reminder */}
      <KpiObjectives
        objectives={objectives}
        missionStart={missionStart}
        missionEnd={missionEnd}
      />

      {/* 3. Aggregated KPI Indicators */}
      <AggregatedKpis
        investissement={aggregatedKpis.investissement}
        efficacite={aggregatedKpis.efficacite}
        participation={aggregatedKpis.participation}
        previousInvestissement={previousMonthData?.investissement}
        previousEfficacite={previousMonthData?.efficacite}
        previousParticipation={previousMonthData?.participation}
      />

      {/* 4. Evolution Chart */}
      <EvolutionChart data={evolutionData} />

      {/* 5 & 6. Module Completion + Satisfaction side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModuleCompletion
          completedModules={completedModuleSlots}
          totalModules={totalModuleSlots}
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
        <ReportsPreview reports={mockReports} />

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
