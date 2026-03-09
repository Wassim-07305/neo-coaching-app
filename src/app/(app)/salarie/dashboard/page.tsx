"use client";

import Link from "next/link";
import { Building2, FileText, ChevronRight } from "lucide-react";
import { MyIndicators } from "@/components/salarie/my-indicators";
import { MyModules } from "@/components/salarie/my-modules";
import { MyTasks } from "@/components/salarie/my-tasks";
import { NextRdv } from "@/components/salarie/next-rdv";
import { MyGroup } from "@/components/salarie/my-group";
import { PushPermissionCard } from "@/components/ui/push-permission-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLatestKpi, useKpiHistory, useMyModuleProgress, useMyTasks, useMyAppointments } from "@/lib/supabase/hooks";
import { mockCoachees, mockCompanies } from "@/lib/mock-data";
import type { MockModuleProgress } from "@/lib/mock-data";

// Fallback mock data
const fallbackUser = mockCoachees[0];
const fallbackCompany = mockCompanies.find((c) => c.id === fallbackUser.company_id);

const fallbackTasks = [
  { id: "t-1", title: "Completer l'exercice de confiance en soi", dueDate: "2026-02-28", completed: false },
  { id: "t-2", title: "Remplir le questionnaire de mi-parcours", dueDate: "2026-02-25", completed: false },
  { id: "t-3", title: "Soumettre le resume du module IE", dueDate: "2026-02-20", completed: true },
  { id: "t-4", title: "Regarder la video: Gestion du stress", dueDate: "2026-03-05", completed: false },
  { id: "t-5", title: "Exercice: Journal emotionnel semaine 4", dueDate: "2026-02-10", completed: true },
];

export default function SalarieDashboardPage() {
  const { profile } = useAuth();
  const { data: latestKpi } = useLatestKpi();
  const { data: kpiHistory } = useKpiHistory(undefined, 6);
  const { data: moduleProgress } = useMyModuleProgress();
  const { data: supaTasks } = useMyTasks();
  const { data: supaAppointments } = useMyAppointments();

  const firstName = profile?.first_name || fallbackUser.first_name;
  const companyName = profile?.company_id ? null : fallbackCompany?.name;

  const kpis = latestKpi
    ? { investissement: latestKpi.investissement, efficacite: latestKpi.efficacite, participation: latestKpi.participation }
    : fallbackUser.kpis;

  const history = kpiHistory
    ? (kpiHistory as { scored_at: string; investissement: number; efficacite: number; participation: number }[]).map((k) => ({
        month: new Date(k.scored_at).toLocaleDateString("fr-FR", { month: "short" }),
        investissement: k.investissement,
        efficacite: k.efficacite,
        participation: k.participation,
      }))
    : fallbackUser.kpi_history;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: MockModuleProgress[] = moduleProgress
    ? (moduleProgress as any[]).map((mp) => ({
        module_id: mp.module_id,
        module_title: mp.modules?.title || "Module",
        status: mp.status || "non_commence",
        satisfaction_score: mp.satisfaction_score ?? undefined,
      }))
    : fallbackUser.module_progress;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks = supaTasks
    ? (supaTasks as any[]).map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.due_date || "",
        completed: t.status === "completed",
      }))
    : fallbackTasks;

  // Find next upcoming appointment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apptList = supaAppointments as any[] | null;
  const nextAppt = apptList
    ? apptList.find((a) => new Date(a.datetime_start) > new Date())
    : null;

  const nextAppointment = nextAppt
    ? {
        date: nextAppt.datetime_start.split("T")[0],
        time: new Date(nextAppt.datetime_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        type: nextAppt.type,
        daysUntil: Math.ceil((new Date(nextAppt.datetime_start).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }
    : { date: "2026-02-27", time: "09:00", type: "coaching", daysUntil: 1 };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-5">
      <PushPermissionCard />
      {/* 1. Welcome Header */}
      <div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
          Bonjour, {firstName} !
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
          {companyName && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Building2 className="w-3 h-3" />
              {companyName}
            </div>
          )}
        </div>
      </div>

      {/* 2. Mes Indicateurs */}
      <MyIndicators kpis={kpis} history={history} />

      {/* 3. Mes Modules */}
      <MyModules modules={modules} />

      {/* 4. Mes Travaux */}
      <MyTasks initialTasks={tasks} />

      {/* 5 & 6. Prochain RDV + Mon Groupe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NextRdv
          date={nextAppointment.date}
          time={nextAppointment.time}
          type={nextAppointment.type}
          daysUntil={nextAppointment.daysUntil}
        />
        <MyGroup groupName="Equipe Alpha Corp" unreadMessages={3} />
      </div>

      {/* 7. Mes Documents shortcut */}
      <Link
        href="/salarie/documents"
        className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Mes Documents</p>
            <p className="text-xs text-gray-500">Livrables et certificats</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Link>
    </div>
  );
}
