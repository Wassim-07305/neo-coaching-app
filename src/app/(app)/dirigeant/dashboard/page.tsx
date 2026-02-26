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
import { mockCompanies, mockCoachees, getCompanyAverageKpis } from "@/lib/mock-data";

// Use Alpha Corp as the dirigeant's company
const company = mockCompanies[0];
const companyKpis = getCompanyAverageKpis(company.id);

// Compute aggregated evolution data from team members
const teamMembers = mockCoachees.filter((c) => c.company_id === company.id);

function computeAggregatedHistory(): EvolutionDataPoint[] {
  const allMonths = new Set<string>();
  teamMembers.forEach((m) => m.kpi_history.forEach((h) => allMonths.add(h.month)));

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
    const members = teamMembers.filter((m) =>
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

const evolutionData = computeAggregatedHistory();

// Previous month KPIs for trend
const previousMonthData = evolutionData.length >= 2 ? evolutionData[evolutionData.length - 2] : undefined;

// Module completion stats
const totalModuleSlots = teamMembers.reduce((acc, m) => acc + m.module_progress.length, 0);
const completedModuleSlots = teamMembers.reduce(
  (acc, m) => acc + m.module_progress.filter((p) => p.status === "complete").length,
  0
);

// Satisfaction (avg from completed modules with scores)
const allSatisfactionScores = teamMembers.flatMap((m) =>
  m.module_progress.filter((p) => p.satisfaction_score !== undefined).map((p) => p.satisfaction_score!)
);
const avgSatisfaction =
  allSatisfactionScores.length > 0
    ? Math.round((allSatisfactionScores.reduce((a, b) => a + b, 0) / allSatisfactionScores.length) * 10) / 10
    : 0;

// Mock reports
const mockReports = [
  { id: "r-1", title: "Rapport Fevrier 2026", date: "2026-02-28", period: "Fevrier 2026" },
  { id: "r-2", title: "Rapport Janvier 2026", date: "2026-01-31", period: "Janvier 2026" },
  { id: "r-3", title: "Rapport Decembre 2025", date: "2025-12-31", period: "Decembre 2025" },
];

export default function DirigeantDashboardPage() {
  const today = new Date("2026-02-26");
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark">
            Bonjour, {company.dirigeant_name.split(" ")[0]}
          </h1>
          <p className="text-sm text-gray-500 capitalize mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Building2 className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold text-sm text-primary">{company.name}</span>
        </div>
      </div>

      {/* 2. KPI Objectives Reminder */}
      <KpiObjectives
        objectives={company.objectives}
        missionStart={company.mission_start}
        missionEnd={company.mission_end}
      />

      {/* 3. Aggregated KPI Indicators */}
      <AggregatedKpis
        investissement={companyKpis.investissement}
        efficacite={companyKpis.efficacite}
        participation={companyKpis.participation}
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
