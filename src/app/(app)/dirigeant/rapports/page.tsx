"use client";

import { useState, useCallback, useMemo } from "react";
import { FileText, Download, Filter, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useCompany, useKpiScores, useProfiles, useModuleProgress } from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";
import { pdf } from "@react-pdf/renderer";
import { MonthlyReportPDF } from "@/components/reports/monthly-report-pdf";
import type { MonthlyReportData, MonthlyReportKpi, MonthlyReportEvolution } from "@/components/reports/monthly-report-pdf";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

interface ReportEntry {
  id: string;
  title: string;
  period: string;
  month: string;
  date: string;
  status: "Disponible" | "En preparation";
}

// Generate last 6 months of report entries
function generateReportEntries(): ReportEntry[] {
  const now = new Date();
  const entries: ReportEntry[] = [];

  for (let i = 0; i < 6; i++) {
    const d = subMonths(now, i);
    const monthStr = format(d, "yyyy-MM");
    const periodLabel = format(d, "MMMM yyyy", { locale: fr });
    const title = `Rapport mensuel - ${periodLabel.charAt(0).toUpperCase() + periodLabel.slice(1)}`;
    const endDate = endOfMonth(d);

    entries.push({
      id: `r-${monthStr}`,
      title,
      period: periodLabel,
      month: monthStr,
      date: format(endDate, "yyyy-MM-dd"),
      status: i === 0 ? "En preparation" : "Disponible",
    });
  }

  return entries;
}

export default function DirigeantRapportsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const companyId = profile?.company_id || undefined;

  const { data: company } = useCompany(companyId);
  const { data: kpiHistory } = useKpiScores({ company_id: companyId });
  const { data: employees } = useProfiles({ company_id: companyId, role: "salarie" });
  const { data: moduleProgressData } = useModuleProgress({ company_id: companyId });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const reports = useMemo(() => generateReportEntries(), []);

  const months = useMemo(() => {
    return [
      { value: "", label: "Tous les mois" },
      ...reports.map((r) => ({
        value: r.month,
        label: r.period.charAt(0).toUpperCase() + r.period.slice(1),
      })),
    ];
  }, [reports]);

  const filteredReports = selectedMonth
    ? reports.filter((r) => r.month === selectedMonth)
    : reports;

  const companyName = company?.name || profile?.last_name || "Entreprise";

  const handleDownload = useCallback(
    async (report: ReportEntry) => {
      setGeneratingId(report.id);
      toast("Generation du rapport PDF en cours...", "info");

      try {
        // Build KPI data from Supabase
        const kpis: MonthlyReportKpi[] = [];
        const evolution: MonthlyReportEvolution[] = [];

        if (kpiHistory && kpiHistory.length > 0) {
          // Aggregate KPI scores for the report month
          const monthStart = startOfMonth(new Date(report.month + "-01"));
          const monthEnd = endOfMonth(monthStart);
          const prevMonthStart = startOfMonth(subMonths(monthStart, 1));
          const prevMonthEnd = endOfMonth(prevMonthStart);

          const currentMonthScores = kpiHistory.filter((k) => {
            const d = new Date(k.scored_at);
            return d >= monthStart && d <= monthEnd;
          });

          const prevMonthScores = kpiHistory.filter((k) => {
            const d = new Date(k.scored_at);
            return d >= prevMonthStart && d <= prevMonthEnd;
          });

          const avg = (arr: number[]) =>
            arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 5;

          const currentInv = avg(currentMonthScores.map((k) => k.investissement));
          const currentEff = avg(currentMonthScores.map((k) => k.efficacite));
          const currentPart = avg(currentMonthScores.map((k) => k.participation));

          const prevInv = avg(prevMonthScores.map((k) => k.investissement));
          const prevEff = avg(prevMonthScores.map((k) => k.efficacite));
          const prevPart = avg(prevMonthScores.map((k) => k.participation));

          kpis.push(
            { label: "Investissement", value: Math.round(currentInv * 10) / 10, previousValue: Math.round(prevInv * 10) / 10 },
            { label: "Efficacite", value: Math.round(currentEff * 10) / 10, previousValue: Math.round(prevEff * 10) / 10 },
            { label: "Participation", value: Math.round(currentPart * 10) / 10, previousValue: Math.round(prevPart * 10) / 10 }
          );

          // Build evolution over last months
          const monthsToShow = 6;
          for (let i = monthsToShow - 1; i >= 0; i--) {
            const m = subMonths(monthStart, i);
            const mStart = startOfMonth(m);
            const mEnd = endOfMonth(m);
            const scores = kpiHistory.filter((k) => {
              const d = new Date(k.scored_at);
              return d >= mStart && d <= mEnd;
            });
            evolution.push({
              month: format(m, "MMM", { locale: fr }),
              investissement: Math.round(avg(scores.map((k) => k.investissement)) * 10) / 10,
              efficacite: Math.round(avg(scores.map((k) => k.efficacite)) * 10) / 10,
              participation: Math.round(avg(scores.map((k) => k.participation)) * 10) / 10,
            });
          }
        } else {
          // Fallback mock KPI data
          kpis.push(
            { label: "Investissement", value: 7.5, previousValue: 6.8 },
            { label: "Efficacite", value: 7.2, previousValue: 6.5 },
            { label: "Participation", value: 8.0, previousValue: 7.3 }
          );
        }

        // Compute stats for summary
        const totalEmployees = employees?.length || 0;
        const completedModules = moduleProgressData?.filter((mp) => mp.status === "validated").length || 0;
        const totalModules = moduleProgressData?.length || 0;
        const completionRate = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        const avgKpi = kpis.length > 0
          ? Math.round((kpis.reduce((s, k) => s + k.value, 0) / kpis.length) * 10) / 10
          : 7;

        const reportData: MonthlyReportData = {
          companyName,
          dateRange: `1 - ${format(endOfMonth(new Date(report.month + "-01")), "d MMMM yyyy", { locale: fr })}`,
          month: report.period.charAt(0).toUpperCase() + report.period.slice(1),
          executiveSummary: `Ce rapport presente l'avancement de ${totalEmployees} collaborateur${totalEmployees > 1 ? "s" : ""} de ${companyName}. Le taux de completion des modules est de ${completionRate}%. La moyenne des indicateurs KPI est de ${avgKpi}/10.`,
          kpis,
          evolution,
          pointsForts: [
            avgKpi >= 7 ? "Indicateurs KPI en progression" : "Stabilite des indicateurs KPI",
            completionRate >= 50 ? `Bon taux de completion des modules (${completionRate}%)` : "Engagement initial des collaborateurs",
            "Communication reguliere avec l'equipe de coaching",
          ],
          pointsAttention: [
            completionRate < 50 ? `Taux de completion des modules a ameliorer (${completionRate}%)` : "Maintenir le rythme de progression",
            avgKpi < 7 ? "Indicateurs KPI en dessous de l'objectif" : "Continuer a renforcer l'investissement",
          ],
          recommandations: [
            "Poursuivre les sessions de coaching individuelles",
            "Organiser une session de feedback collectif",
            "Planifier les objectifs du prochain trimestre",
          ],
        };

        const blob = await pdf(<MonthlyReportPDF data={reportData} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `rapport-${companyName.toLowerCase().replace(/\s+/g, "-")}-${report.month}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast("Rapport PDF telecharge avec succes !", "success");
      } catch (err) {
        console.error("PDF generation error:", err);
        toast("Erreur lors de la generation du rapport", "error");
      } finally {
        setGeneratingId(null);
      }
    },
    [companyName, kpiHistory, employees, moduleProgressData, toast]
  );

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
                <p className="text-sm font-medium text-dark truncate">
                  {report.title}
                </p>
                <p className="text-xs text-gray-500">
                  Genere le{" "}
                  {new Date(report.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
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
                <button
                  onClick={() => handleDownload(report)}
                  disabled={generatingId === report.id}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60"
                >
                  {generatingId === report.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Telecharger</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">
            Aucun rapport pour cette periode.
          </p>
        </div>
      )}
    </div>
  );
}
