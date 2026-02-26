"use client";

import { useState } from "react";
import { FileText, Download, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const allReports = [
  { id: "r-1", title: "Rapport mensuel - Fevrier 2026", period: "Fevrier 2026", month: "2026-02", date: "2026-02-28", status: "En preparation" as const },
  { id: "r-2", title: "Rapport mensuel - Janvier 2026", period: "Janvier 2026", month: "2026-01", date: "2026-01-31", status: "Disponible" as const },
  { id: "r-3", title: "Rapport mensuel - Decembre 2025", period: "Decembre 2025", month: "2025-12", date: "2025-12-31", status: "Disponible" as const },
  { id: "r-4", title: "Rapport mensuel - Novembre 2025", period: "Novembre 2025", month: "2025-11", date: "2025-11-30", status: "Disponible" as const },
  { id: "r-5", title: "Rapport mensuel - Octobre 2025", period: "Octobre 2025", month: "2025-10", date: "2025-10-31", status: "Disponible" as const },
  { id: "r-6", title: "Rapport mensuel - Septembre 2025", period: "Septembre 2025", month: "2025-09", date: "2025-09-30", status: "Disponible" as const },
];

const months = [
  { value: "", label: "Tous les mois" },
  { value: "2026-02", label: "Fevrier 2026" },
  { value: "2026-01", label: "Janvier 2026" },
  { value: "2025-12", label: "Decembre 2025" },
  { value: "2025-11", label: "Novembre 2025" },
  { value: "2025-10", label: "Octobre 2025" },
  { value: "2025-09", label: "Septembre 2025" },
];

export default function DirigeantRapportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredReports = selectedMonth
    ? allReports.filter((r) => r.month === selectedMonth)
    : allReports;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dirigeant/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">Rapports</h1>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">{report.title}</p>
                <p className="text-xs text-gray-500">
                  Genere le {new Date(report.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  report.status === "Disponible"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                )}
              >
                {report.status}
              </span>
              {report.status === "Disponible" && (
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Telecharger</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">Aucun rapport pour cette periode.</p>
        </div>
      )}
    </div>
  );
}
