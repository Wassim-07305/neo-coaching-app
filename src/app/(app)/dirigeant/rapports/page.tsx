"use client";

import { useState } from "react";
import { FileText, Download, Filter, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { YearComparison } from "@/components/dirigeant/year-comparison";
import { CustomReport } from "@/components/admin/custom-report";

type ReportStatus = "En preparation" | "Disponible";
type ReportType = "mensuel" | "individuel" | "certificat";

interface Report {
  id: string;
  title: string;
  period: string;
  month: string;
  date: string;
  status: ReportStatus;
  type: ReportType;
}

const allReports: Report[] = [
  { id: "r-1", title: "Rapport mensuel - Fevrier 2026", period: "Fevrier 2026", month: "2026-02", date: "2026-02-28", status: "En preparation", type: "mensuel" },
  { id: "r-2", title: "Rapport mensuel - Janvier 2026", period: "Janvier 2026", month: "2026-01", date: "2026-01-31", status: "Disponible", type: "mensuel" },
  { id: "r-3", title: "Rapport individuel - Marie Dupont", period: "Janvier 2026", month: "2026-01", date: "2026-01-15", status: "Disponible", type: "individuel" },
  { id: "r-4", title: "Rapport mensuel - Decembre 2025", period: "Decembre 2025", month: "2025-12", date: "2025-12-31", status: "Disponible", type: "mensuel" },
  { id: "r-5", title: "Certificat - Module Leadership", period: "Decembre 2025", month: "2025-12", date: "2025-12-20", status: "Disponible", type: "certificat" },
  { id: "r-6", title: "Rapport mensuel - Novembre 2025", period: "Novembre 2025", month: "2025-11", date: "2025-11-30", status: "Disponible", type: "mensuel" },
  { id: "r-7", title: "Rapport mensuel - Octobre 2025", period: "Octobre 2025", month: "2025-10", date: "2025-10-31", status: "Disponible", type: "mensuel" },
  { id: "r-8", title: "Rapport mensuel - Septembre 2025", period: "Septembre 2025", month: "2025-09", date: "2025-09-30", status: "Disponible", type: "mensuel" },
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

const reportTypeLabels: Record<ReportType, string> = {
  mensuel: "Mensuel",
  individuel: "Individuel",
  certificat: "Certificat",
};

const reportTypeColors: Record<ReportType, string> = {
  mensuel: "bg-blue-50 text-blue-700",
  individuel: "bg-purple-50 text-purple-700",
  certificat: "bg-amber-50 text-amber-700",
};

export default function DirigeantRapportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const { toast } = useToast();

  const filteredReports = selectedMonth
    ? allReports.filter((r) => r.month === selectedMonth)
    : allReports;

  function handleDownload(report: Report) {
    toast("Telechargement en cours...", "info");

    // Simulate PDF download delay
    setTimeout(() => {
      toast(`"${report.title}" telecharge avec succes.`, "success");
    }, 1500);
  }

  function handleGenerateReport() {
    toast("Generation du rapport en cours...", "info");

    // Simulate report generation delay
    setTimeout(() => {
      toast("Nouveau rapport genere avec succes.", "success");
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
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

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Generer un nouveau rapport</span>
        </button>
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
              {/* Report type badge */}
              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full hidden md:inline-block",
                  reportTypeColors[report.type]
                )}
              >
                {reportTypeLabels[report.type]}
              </span>

              {/* Status badge */}
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

              {/* Download button */}
              {report.status === "Disponible" && (
                <button
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Telecharger PDF</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Year Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <YearComparison />
      </div>

      {/* Custom Reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CustomReport />
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">Aucun rapport pour cette periode.</p>
        </div>
      )}
    </div>
  );
}
