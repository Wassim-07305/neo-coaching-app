"use client";

import { use } from "react";
import { Award, Download } from "lucide-react";
import { CoacheeHeader } from "@/components/admin/coachee-header";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiHistoryChart } from "@/components/admin/kpi-history-chart";
import { ModuleTimeline } from "@/components/admin/module-timeline";
import { LivrablesList } from "@/components/admin/livrables-list";
import { CallHistory } from "@/components/admin/call-history";
import { SatisfactionChart } from "@/components/admin/satisfaction-chart";
import { mockCoachees } from "@/lib/mock-data";

// Replace with Supabase query when ready
function getCoacheeData(id: string) {
  return mockCoachees.find((c) => c.id === id) || null;
}

export default function CoacheeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const coachee = getCoacheeData(id);

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
      <CoacheeHeader coachee={coachee} />

      {/* KPI Gauges */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Indicateurs actuels
        </h3>
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <KpiGauge
            value={coachee.kpis.investissement}
            label="Investissement"
            size="lg"
          />
          <KpiGauge
            value={coachee.kpis.efficacite}
            label="Efficacite"
            size="lg"
          />
          <KpiGauge
            value={coachee.kpis.participation}
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
    </div>
  );
}
