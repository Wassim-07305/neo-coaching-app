"use client";

import { useState } from "react";
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import {
  mockCoachees,
  mockCompanies,
  getKpiColor,
  getKpiLabel,
} from "@/lib/mock-data";

const company = mockCompanies[0]; // Alpha Corp
const teamMembers = mockCoachees.filter((c) => c.company_id === company.id);

function getKpiAverage(kpis: { investissement: number; efficacite: number; participation: number }) {
  return Math.round(((kpis.investissement + kpis.efficacite + kpis.participation) / 3) * 10) / 10;
}

function getTrend(member: (typeof teamMembers)[0]) {
  const history = member.kpi_history;
  if (history.length < 2) return "stable";
  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const lastAvg = (last.investissement + last.efficacite + last.participation) / 3;
  const prevAvg = (prev.investissement + prev.efficacite + prev.participation) / 3;
  if (lastAvg > prevAvg + 0.3) return "up";
  if (lastAvg < prevAvg - 0.3) return "down";
  return "stable";
}

export default function DirigeantEquipePage() {
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const filtered = search.trim()
    ? teamMembers.filter(
        (m) =>
          `${m.first_name} ${m.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : teamMembers;

  const selectedMember = selectedMemberId
    ? teamMembers.find((m) => m.id === selectedMemberId)
    : null;

  const activeCount = teamMembers.filter((m) => m.status === "actif").length;
  const avgKpi = getKpiAverage({
    investissement:
      teamMembers.reduce((s, m) => s + m.kpis.investissement, 0) /
      teamMembers.length,
    efficacite:
      teamMembers.reduce((s, m) => s + m.kpis.efficacite, 0) /
      teamMembers.length,
    participation:
      teamMembers.reduce((s, m) => s + m.kpis.participation, 0) /
      teamMembers.length,
  });
  const alertCount = teamMembers.filter(
    (m) => getKpiAverage(m.kpis) <= 4
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Mon Equipe
          </h1>
          <span className="text-sm text-gray-400">
            ({teamMembers.length} collaborateurs)
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Suivez la progression de vos collaborateurs dans le programme de coaching.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">
              {activeCount}
            </p>
            <p className="text-xs text-gray-500">Actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">
              {avgKpi}/10
            </p>
            <p className="text-xs text-gray-500">KPI moyen</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-xl font-bold font-heading text-dark">
              {alertCount}
            </p>
            <p className="text-xs text-gray-500">En alerte</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un collaborateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>

      {/* Team members list + detail */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Members list */}
        <div className="lg:w-1/2 space-y-3">
          {filtered.map((member) => {
            const avg = getKpiAverage(member.kpis);
            const kpiColor = getKpiColor(avg);
            const trend = getTrend(member);
            const completedModules = member.module_progress.filter(
              (m) => m.status === "complete"
            ).length;
            const isSelected = selectedMemberId === member.id;

            return (
              <button
                key={member.id}
                onClick={() =>
                  setSelectedMemberId(isSelected ? null : member.id)
                }
                className={cn(
                  "w-full text-left bg-white rounded-xl border p-4 transition-all",
                  isSelected
                    ? "border-accent shadow-sm"
                    : "border-gray-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium shrink-0">
                    {member.first_name[0]}
                    {member.last_name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-dark truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      {trend === "up" && (
                        <TrendingUp className="w-3.5 h-3.5 text-success shrink-0" />
                      )}
                      {trend === "down" && (
                        <TrendingDown className="w-3.5 h-3.5 text-danger shrink-0" />
                      )}
                      {trend === "stable" && (
                        <Minus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          kpiColor === "success" &&
                            "bg-success/10 text-success",
                          kpiColor === "warning" &&
                            "bg-warning/10 text-warning",
                          kpiColor === "danger" && "bg-danger/10 text-danger"
                        )}
                      >
                        KPI: {avg}/10
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {completedModules}/{member.module_progress.length}{" "}
                        modules
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-500">
                Aucun collaborateur ne correspond a la recherche.
              </p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:w-1/2">
          {selectedMember ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20 space-y-6">
              {/* Member header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-medium/10 flex items-center justify-center text-lg font-bold text-primary-medium">
                  {selectedMember.first_name[0]}
                  {selectedMember.last_name[0]}
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-dark">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedMember.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Depuis le{" "}
                    {new Date(selectedMember.start_date).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              {/* KPI Gauges */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Indicateurs
                </h3>
                <div className="flex justify-around">
                  <KpiGauge
                    value={selectedMember.kpis.investissement}
                    label="Invest."
                    size="sm"
                  />
                  <KpiGauge
                    value={selectedMember.kpis.efficacite}
                    label="Efficacite"
                    size="sm"
                  />
                  <KpiGauge
                    value={selectedMember.kpis.participation}
                    label="Particip."
                    size="sm"
                  />
                </div>
              </div>

              {/* Module progress */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Progression modules
                </h3>
                <div className="space-y-2">
                  {selectedMember.module_progress.map((mod) => (
                    <div
                      key={mod.module_id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                          mod.status === "complete" &&
                            "bg-success/10 text-success",
                          mod.status === "en_cours" &&
                            "bg-warning/10 text-warning",
                          mod.status === "a_venir" &&
                            "bg-gray-100 text-gray-400",
                          mod.status === "non_commence" &&
                            "bg-danger/10 text-danger"
                        )}
                      >
                        {mod.status === "complete" ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : mod.status === "en_cours" ? (
                          <BookOpen className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark font-medium truncate">
                          {mod.module_title}
                        </p>
                        <p className="text-[10px] text-gray-500 capitalize">
                          {mod.status === "complete"
                            ? "Termine"
                            : mod.status === "en_cours"
                            ? "En cours"
                            : mod.status === "a_venir"
                            ? "A venir"
                            : "Non commence"}
                          {mod.satisfaction_score !== undefined &&
                            ` · Satisfaction: ${mod.satisfaction_score}/10`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last activity */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Derniere activite:{" "}
                  {new Date(selectedMember.last_activity).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center hidden lg:block">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Selectionnez un collaborateur pour voir ses details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
