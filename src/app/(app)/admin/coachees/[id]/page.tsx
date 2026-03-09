"use client";

import { use, useState } from "react";
import { cn } from "@/lib/utils";
import { Award, Download, BarChart3, BookOpen, Phone, FileText, StickyNote } from "lucide-react";
import { CoacheeHeader } from "@/components/admin/coachee-header";
import { KpiGauge } from "@/components/ui/kpi-gauge";
import { KpiHistoryChart } from "@/components/admin/kpi-history-chart";
import { ModuleTimeline } from "@/components/admin/module-timeline";
import { LivrablesList } from "@/components/admin/livrables-list";
import { CallHistory } from "@/components/admin/call-history";
import { SatisfactionChart } from "@/components/admin/satisfaction-chart";
import { CoacheeAnnotations } from "@/components/admin/coachee-annotations";
import { mockCoachees, mockAnnotations } from "@/lib/mock-data";

function getCoacheeData(id: string) {
  const coachee = mockCoachees.find((c) => c.id === id) || null;
  const annotations = mockAnnotations.filter((a) => a.coachee_id === id);
  return { coachee, annotations };
}

type Tab = "kpis" | "modules" | "rdv" | "documents" | "notes";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "kpis", label: "Indicateurs", icon: BarChart3 },
  { key: "modules", label: "Modules", icon: BookOpen },
  { key: "rdv", label: "RDV / Appels", icon: Phone },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "notes", label: "Notes", icon: StickyNote },
];

export default function CoacheeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { coachee, annotations } = getCoacheeData(id);
  const [activeTab, setActiveTab] = useState<Tab>("kpis");

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

      {/* KPI Gauges (always visible) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-heading font-semibold text-sm text-dark mb-4">
          Indicateurs actuels
        </h3>
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <KpiGauge value={coachee.kpis.investissement} label="Investissement" size="lg" />
          <KpiGauge value={coachee.kpis.efficacite} label="Efficacite" size="lg" />
          <KpiGauge value={coachee.kpis.participation} label="Participation" size="lg" />
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 overflow-x-auto">
          <nav className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === "notes" && annotations.length > 0 && (
                    <span className="bg-accent/10 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {annotations.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* KPIs tab */}
          {activeTab === "kpis" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KpiHistoryChart data={coachee.kpi_history} />
                <SatisfactionChart modules={coachee.module_progress} />
              </div>
              {/* Profil info */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-heading font-semibold text-sm text-dark mb-3">
                  Informations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm text-dark">{coachee.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Type</p>
                    <p className="text-sm text-dark capitalize">{coachee.type}</p>
                  </div>
                  {coachee.company_name && (
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Entreprise</p>
                      <p className="text-sm text-dark">{coachee.company_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date de debut</p>
                    <p className="text-sm text-dark">
                      {new Date(coachee.start_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Module en cours</p>
                    <p className="text-sm text-dark">
                      {coachee.current_module || "Aucun"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Statut</p>
                    <p className="text-sm text-dark capitalize">{coachee.status}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modules tab */}
          {activeTab === "modules" && (
            <div className="space-y-6">
              <ModuleTimeline modules={coachee.module_progress} />
              {/* Module details */}
              <div className="space-y-3">
                {coachee.module_progress.map((mod) => (
                  <div
                    key={mod.module_id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-dark">{mod.module_title}</p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {mod.status.replace("_", " ")}
                      </p>
                    </div>
                    {mod.satisfaction_score !== undefined && (
                      <div className="text-right">
                        <p className="text-lg font-bold font-heading text-accent">
                          {mod.satisfaction_score}
                        </p>
                        <p className="text-[10px] text-gray-400">/10 satisfaction</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RDV / Appels tab */}
          {activeTab === "rdv" && (
            <CallHistory calls={coachee.calls} />
          )}

          {/* Documents tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <LivrablesList livrables={coachee.livrables} />
              {/* Certificates */}
              <div>
                <h4 className="font-heading font-semibold text-sm text-dark mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  Certificats obtenus
                </h4>
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
          )}

          {/* Notes tab */}
          {activeTab === "notes" && (
            <CoacheeAnnotations annotations={annotations} />
          )}
        </div>
      </div>
    </div>
  );
}
