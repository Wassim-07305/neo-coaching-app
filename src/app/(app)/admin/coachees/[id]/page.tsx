"use client";

import { use, useState, useMemo, useCallback } from "react";
import { Award, Download, Loader2 } from "lucide-react";
import { CoacheeHeader } from "@/components/admin/coachee-header";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiHistoryChart } from "@/components/admin/kpi-history-chart";
import { ModuleTimeline } from "@/components/admin/module-timeline";
import { LivrablesList } from "@/components/admin/livrables-list";
import { CallHistory } from "@/components/admin/call-history";
import { SatisfactionChart } from "@/components/admin/satisfaction-chart";
import { KpiScoringModal } from "@/components/admin/kpi-scoring-modal";
import { AssignModuleModal } from "@/components/admin/assign-module-modal";
import { SendMessageModal } from "@/components/admin/send-message-modal";
import { useProfile, useUserModuleProgress, useLatestKpiScore, useKpiScores, useCompany } from "@/hooks/use-supabase-data";
import { mockCoachees } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { pdf } from "@react-pdf/renderer";
import { IndividualReportPDF } from "@/components/reports/individual-report-pdf";
import type { IndividualReportData } from "@/components/reports/individual-report-pdf";

export default function CoacheeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();

  // Fetch real data from Supabase
  const { data: profile, loading: profileLoading } = useProfile(id);
  const { data: moduleProgress } = useUserModuleProgress(id);
  const { data: latestKpi } = useLatestKpiScore(id);
  const { data: kpiHistory } = useKpiScores({ user_id: id });
  const { data: company } = useCompany(profile?.company_id || undefined);

  // Fallback mock coachee
  const mockCoachee = mockCoachees.find((c) => c.id === id);

  // Transform Supabase data to match component props
  const coachee = useMemo(() => {
    if (profile) {
      return {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        type: (profile.coaching_type || "individuel") as "individuel" | "entreprise",
        status: profile.status === "active" ? "actif" as const : profile.status === "inactive" ? "inactif" as const : "archive" as const,
        company_id: profile.company_id,
        company_name: company?.name || null,
        start_date: profile.created_at,
        current_module: null,
        kpis: latestKpi
          ? {
              investissement: latestKpi.investissement,
              efficacite: latestKpi.efficacite,
              participation: latestKpi.participation,
            }
          : { investissement: 7, efficacite: 7, participation: 7 },
        kpi_history: kpiHistory?.map((k) => ({
          month: format(new Date(k.scored_at), "MMM yyyy", { locale: fr }),
          investissement: k.investissement,
          efficacite: k.efficacite,
          participation: k.participation,
        })) || [],
        module_progress: moduleProgress?.map((mp) => ({
          module_id: mp.module_id,
          module_title: mp.module?.title || "Module",
          status: mp.status === "validated" ? "complete" as const : mp.status === "in_progress" ? "en_cours" as const : "non_commence" as const,
          satisfaction_score: mp.satisfaction_score || undefined,
        })) || [],
        livrables: [],
        calls: [],
        certificates: [],
        last_activity: profile.updated_at,
      };
    }
    return mockCoachee;
  }, [profile, company, latestKpi, kpiHistory, moduleProgress, mockCoachee]);

  const [showKpiModal, setShowKpiModal] = useState(false);
  const [showAssignModule, setShowAssignModule] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [kpis, setKpis] = useState(coachee?.kpis || { investissement: 0, efficacite: 0, participation: 0 });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGenerateReport = useCallback(async () => {
    if (!coachee) return;

    setIsGeneratingPdf(true);
    toast("Generation du rapport PDF en cours...", "info");

    try {
      const reportData: IndividualReportData = {
        firstName: coachee.first_name,
        lastName: coachee.last_name,
        email: coachee.email,
        type: coachee.type,
        companyName: coachee.company_name,
        startDate: format(new Date(coachee.start_date), "d MMMM yyyy", { locale: fr }),
        currentModule: coachee.module_progress.find((m) => m.status === "en_cours")?.module_title || null,
        kpis: kpis,
        kpiHistory: coachee.kpi_history.map((k) => ({
          month: k.month,
          investissement: k.investissement,
          efficacite: k.efficacite,
          participation: k.participation,
        })),
        moduleProgress: coachee.module_progress.map((m) => ({
          moduleTitle: m.module_title,
          status: m.status as "complete" | "en_cours" | "non_commence" | "a_venir",
          satisfactionScore: m.satisfaction_score,
        })),
        livrables: coachee.livrables.map((l) => ({
          moduleTitle: l.module_title,
          type: l.type as "ecrit" | "audio" | "video",
          submissionDate: l.submission_date,
          status: l.status as "soumis" | "en_attente" | "valide",
          fileName: l.file_name,
        })),
        satisfactionScores: coachee.module_progress
          .filter((m) => m.satisfaction_score != null)
          .map((m) => ({
            moduleTitle: m.module_title,
            score: m.satisfaction_score!,
          })),
        coachNotes: "",
      };

      const blob = await pdf(<IndividualReportPDF data={reportData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rapport-${coachee.first_name}-${coachee.last_name}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast("Rapport PDF telecharge avec succes !", "success");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast("Erreur lors de la generation du rapport", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [coachee, kpis, toast]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!coachee) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Coachee introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <CoacheeHeader
        coachee={coachee}
        onEditKpis={() => setShowKpiModal(true)}
        onAssignModule={() => setShowAssignModule(true)}
        onSendMessage={() => setShowSendMessage(true)}
        onGenerateReport={handleGenerateReport}
      />

      {/* KPI Gauges */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm text-dark">
            Indicateurs actuels
          </h3>
          <button
            onClick={() => setShowKpiModal(true)}
            className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Modifier
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <KpiGauge
            value={kpis.investissement}
            label="Investissement"
            size="lg"
          />
          <KpiGauge
            value={kpis.efficacite}
            label="Efficacite"
            size="lg"
          />
          <KpiGauge
            value={kpis.participation}
            label="Participation"
            size="lg"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KpiHistoryChart data={coachee.kpi_history} />
        <SatisfactionChart modules={coachee.module_progress} />
      </div>

      {/* Module timeline */}
      <ModuleTimeline modules={coachee.module_progress} />

      {/* Livrables and Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LivrablesList livrables={coachee.livrables} />
        <CallHistory calls={coachee.calls} />
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Certificats obtenus
        </h3>
        {coachee.certificates.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Aucun certificat obtenu pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {coachee.certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-accent/20 bg-accent/5"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">
                    {cert.module_title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(cert.earned_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-accent transition-colors shrink-0">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showKpiModal && (
        <KpiScoringModal
          coacheeId={coachee.id}
          coacheeName={`${coachee.first_name} ${coachee.last_name}`}
          currentKpis={kpis}
          onClose={() => setShowKpiModal(false)}
          onSave={(newKpis) => {
            setKpis({
              investissement: newKpis.investissement,
              efficacite: newKpis.efficacite,
              participation: newKpis.participation,
            });
          }}
        />
      )}

      {showAssignModule && (
        <AssignModuleModal
          coacheeId={coachee.id}
          coacheeName={`${coachee.first_name} ${coachee.last_name}`}
          currentModules={coachee.module_progress.map((m) => m.module_id)}
          onClose={() => setShowAssignModule(false)}
        />
      )}

      {showSendMessage && (
        <SendMessageModal
          recipientId={coachee.id}
          recipientName={`${coachee.first_name} ${coachee.last_name}`}
          onClose={() => setShowSendMessage(false)}
        />
      )}
    </div>
  );
}
