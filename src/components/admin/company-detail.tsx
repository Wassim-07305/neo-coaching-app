"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiDotGroup } from "@/components/ui/kpi-badge";
import {
  getCompanyAverageKpis,
  mockCoachees,
  daysAgo,
} from "@/lib/mock-data";
import type { MockCompany } from "@/lib/mock-data";

interface CompanyDetailProps {
  company: MockCompany;
}

const missionStatusStyles: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/30" },
  completed: { label: "Terminee", className: "bg-gray-100 text-gray-600 border-gray-200" },
  paused: { label: "En pause", className: "bg-warning/10 text-warning border-warning/30" },
};

function getInitials(first: string, last: string): string {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
}

export function CompanyDetail({ company }: CompanyDetailProps) {
  const kpis = getCompanyAverageKpis(company.id);
  const employees = mockCoachees.filter((c) => c.company_id === company.id);
  const status = missionStatusStyles[company.mission_status];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/entreprises"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux entreprises
      </Link>

      {/* Company header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary font-heading shrink-0">
            {company.logo_placeholder}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
                {company.name}
              </h1>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium border",
                  status.className
                )}
              >
                {status.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>
                Mission: {new Date(company.mission_start).toLocaleDateString("fr-FR")} -{" "}
                {new Date(company.mission_end).toLocaleDateString("fr-FR")}
              </span>
              <span className="text-gray-300">|</span>
              <span>{company.employee_count} collaborateurs</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors self-start">
            <FileText className="w-4 h-4" />
            Rapport mensuel
          </button>
        </div>
      </div>

      {/* Dirigeant info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-3">
          Dirigeant
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-semibold text-accent">
            {company.dirigeant_name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-dark">{company.dirigeant_name}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Mail className="w-3 h-3" />
              {company.dirigeant_email}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Objectives (Paperboard numerique) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-3">
          Paperboard numerique - Objectifs de mission
        </h3>
        <ul className="space-y-2">
          {company.objectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-700">{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Average KPIs */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          KPIs moyens de l&apos;entreprise
        </h3>
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <KpiGauge value={kpis.investissement} label="Investissement" size="lg" />
          <KpiGauge value={kpis.efficacite} label="Efficacite" size="lg" />
          <KpiGauge value={kpis.participation} label="Participation" size="lg" />
        </div>
      </div>

      {/* Employee list */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Collaborateurs ({employees.length})
        </h3>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">&nbsp;</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Module en cours</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Indicateurs</th>
                <th className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase">Derniere activite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-2">
                    <div className="w-8 h-8 rounded-full bg-primary-medium/10 flex items-center justify-center text-xs font-semibold text-primary-medium">
                      {getInitials(emp.first_name, emp.last_name)}
                    </div>
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/coachees/${emp.id}`}
                      className="text-sm font-medium text-dark hover:text-accent transition-colors"
                    >
                      {emp.first_name} {emp.last_name}
                    </Link>
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {emp.current_module || <span className="text-gray-400">Aucun</span>}
                  </td>
                  <td className="py-3">
                    <KpiDotGroup
                      investissement={emp.kpis.investissement}
                      efficacite={emp.kpis.efficacite}
                      participation={emp.kpis.participation}
                    />
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {daysAgo(emp.last_activity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {employees.map((emp) => (
            <Link
              key={emp.id}
              href={`/admin/coachees/${emp.id}`}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-9 h-9 rounded-full bg-primary-medium/10 flex items-center justify-center text-xs font-semibold text-primary-medium shrink-0">
                {getInitials(emp.first_name, emp.last_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {emp.first_name} {emp.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {emp.current_module || "Aucun module"}
                </p>
              </div>
              <KpiDotGroup
                investissement={emp.kpis.investissement}
                efficacite={emp.kpis.efficacite}
                participation={emp.kpis.participation}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
