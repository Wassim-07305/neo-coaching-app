"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, UserPlus } from "lucide-react";
import { KpiDotGroup } from "@/components/ui/kpi-badge";
import type { MockCoachee } from "@/lib/mock-data";
import { daysAgo } from "@/lib/mock-data";

type SortField = "name" | "type" | "company" | "module" | "last_activity";
type SortDir = "asc" | "desc";

interface CoacheeTableProps {
  coachees: MockCoachee[];
  companies: string[];
}

function getInitials(first: string, last: string): string {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
}

const statusColors: Record<string, string> = {
  actif: "bg-success/10 text-success",
  inactif: "bg-gray-100 text-gray-500",
  archive: "bg-gray-100 text-gray-400",
};

export function CoacheeTable({ coachees, companies }: CoacheeTableProps) {
  const [filter, setFilter] = useState<string>("tous");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filters = useMemo(() => {
    const items = [
      { key: "tous", label: "Tous" },
      { key: "individuel", label: "Individuels" },
      ...companies.map((c) => ({ key: `enterprise:${c}`, label: `Entreprise: ${c}` })),
    ];
    return items;
  }, [companies]);

  const filtered = useMemo(() => {
    let list = [...coachees];
    if (filter === "individuel") {
      list = list.filter((c) => c.type === "individuel");
    } else if (filter.startsWith("enterprise:")) {
      const companyName = filter.replace("enterprise:", "");
      list = list.filter((c) => c.company_name === companyName);
    }
    return list;
  }, [coachees, filter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "company":
          cmp = (a.company_name || "").localeCompare(b.company_name || "");
          break;
        case "module":
          cmp = (a.current_module || "").localeCompare(b.current_module || "");
          break;
        case "last_activity":
          cmp = new Date(a.last_activity).getTime() - new Date(b.last_activity).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-accent" />
    ) : (
      <ChevronDown className="w-3 h-3 text-accent" />
    );
  }

  if (coachees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-dark mb-1">
              Aucun coachee pour le moment
            </h3>
            <p className="text-gray-500 text-sm">
              Commencez par ajouter votre premier client.
            </p>
          </div>
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            Ajouter un coachee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors border",
              filter === f.key
                ? "bg-accent text-white border-accent"
                : "bg-white text-gray-600 border-gray-200 hover:border-accent/50 hover:text-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                  &nbsp;
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-accent"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center gap-1">
                    Nom <SortIcon field="name" />
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-accent"
                  onClick={() => toggleSort("type")}
                >
                  <span className="flex items-center gap-1">
                    Type <SortIcon field="type" />
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-accent"
                  onClick={() => toggleSort("company")}
                >
                  <span className="flex items-center gap-1">
                    Entreprise <SortIcon field="company" />
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-accent"
                  onClick={() => toggleSort("module")}
                >
                  <span className="flex items-center gap-1">
                    Module en cours <SortIcon field="module" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Indicateurs
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-accent"
                  onClick={() => toggleSort("last_activity")}
                >
                  <span className="flex items-center gap-1">
                    Derniere activite <SortIcon field="last_activity" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((coachee) => (
                <tr key={coachee.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-primary-medium/10 flex items-center justify-center text-xs font-semibold text-primary-medium">
                      {getInitials(coachee.first_name, coachee.last_name)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/coachees/${coachee.id}`}
                      className="text-sm font-medium text-dark hover:text-accent transition-colors"
                    >
                      {coachee.first_name} {coachee.last_name}
                    </Link>
                    <span
                      className={cn(
                        "ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        statusColors[coachee.status]
                      )}
                    >
                      {coachee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        coachee.type === "individuel"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-success/10 text-success"
                      )}
                    >
                      {coachee.type === "individuel" ? "Individuel" : "Entreprise"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coachee.company_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coachee.current_module || (
                      <span className="text-gray-400">Aucun</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <KpiDotGroup
                      investissement={coachee.kpis.investissement}
                      efficacite={coachee.kpis.efficacite}
                      participation={coachee.kpis.participation}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {daysAgo(coachee.last_activity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {sorted.map((coachee) => (
          <Link
            key={coachee.id}
            href={`/admin/coachees/${coachee.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium shrink-0">
                {getInitials(coachee.first_name, coachee.last_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-dark text-sm truncate">
                    {coachee.first_name} {coachee.last_name}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                      statusColors[coachee.status]
                    )}
                  >
                    {coachee.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                      coachee.type === "individuel"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {coachee.type === "individuel" ? "Individuel" : "Entreprise"}
                  </span>
                  {coachee.company_name && (
                    <span className="text-xs text-gray-500">{coachee.company_name}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <KpiDotGroup
                    investissement={coachee.kpis.investissement}
                    efficacite={coachee.kpis.efficacite}
                    participation={coachee.kpis.participation}
                  />
                  <span className="text-xs text-gray-400">
                    {daysAgo(coachee.last_activity)}
                  </span>
                </div>
                {coachee.current_module && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    Module: {coachee.current_module}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">
            Aucun coachee ne correspond a ce filtre.
          </p>
          <button
            onClick={() => setFilter("tous")}
            className="mt-3 text-accent text-sm font-medium hover:underline"
          >
            Voir tous les coachees
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-right">
        {sorted.length} coachee{sorted.length > 1 ? "s" : ""} affiche{sorted.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
