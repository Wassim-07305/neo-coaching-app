"use client";

import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Download,
  Search,
  AlertTriangle,
  TrendingUp,
  UserX,
} from "lucide-react";
import { CoacheeTable } from "@/components/admin/coachee-table";
import { mockCoachees } from "@/lib/mock-data";

function getCoacheesData() {
  const coachees = mockCoachees;
  const companyNames = [
    ...new Set(
      coachees.filter((c) => c.company_name).map((c) => c.company_name as string)
    ),
  ];
  const actifs = coachees.filter((c) => c.status === "actif").length;
  const inactifs = coachees.filter((c) => c.status === "inactif").length;
  const alertes = coachees.filter(
    (c) =>
      c.kpis.investissement <= 3 ||
      c.kpis.efficacite <= 3 ||
      c.kpis.participation <= 3
  ).length;
  const avgKpi =
    coachees.length > 0
      ? (
          coachees.reduce(
            (sum, c) =>
              sum +
              (c.kpis.investissement + c.kpis.efficacite + c.kpis.participation) / 3,
            0
          ) / coachees.length
        ).toFixed(1)
      : "0";

  return { coachees, companyNames, actifs, inactifs, alertes, avgKpi };
}

export default function CoacheesPage() {
  const data = getCoacheesData();
  const [search, setSearch] = useState("");

  const filteredCoachees = useMemo(() => {
    if (!search.trim()) return data.coachees;
    const q = search.toLowerCase();
    return data.coachees.filter(
      (c) =>
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company_name && c.company_name.toLowerCase().includes(q))
    );
  }, [data.coachees, search]);

  const stats = [
    {
      label: "Actifs",
      value: data.actifs,
      icon: Users,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Inactifs",
      value: data.inactifs,
      icon: UserX,
      color: "text-gray-500",
      bg: "bg-gray-100",
    },
    {
      label: "En alerte",
      value: data.alertes,
      icon: AlertTriangle,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: "KPI moyen",
      value: `${data.avgKpi}/10`,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">Coachees</h1>
          <span className="text-sm text-gray-400">
            ({data.coachees.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un coachee</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold font-heading text-dark">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email ou entreprise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-accent"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <CoacheeTable coachees={filteredCoachees} companies={data.companyNames} />
    </div>
  );
}
