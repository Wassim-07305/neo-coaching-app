"use client";

import { Building2, Loader2 } from "lucide-react";
import { MyIndicators } from "@/components/salarie/my-indicators";
import { MyModules } from "@/components/salarie/my-modules";
import { MyTasks } from "@/components/salarie/my-tasks";
import { NextRdv } from "@/components/salarie/next-rdv";
import { MyGroup } from "@/components/salarie/my-group";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useCompany,
  useUserModuleProgress,
  useLatestKpiScore,
  useKpiScores,
  useTasks,
  useUpcomingAppointments,
} from "@/hooks/use-supabase-data";
import { mockCoachees } from "@/lib/mock-data";
import { useMemo } from "react";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SalarieDashboardPage() {
  const { profile, loading: authLoading } = useAuth();

  // Fetch real data from Supabase
  const { data: company, loading: companyLoading } = useCompany(profile?.company_id || undefined);
  const { data: moduleProgress, loading: modulesLoading } = useUserModuleProgress(profile?.id);
  const { data: latestKpi } = useLatestKpiScore(profile?.id);
  const { data: kpiHistory } = useKpiScores({ user_id: profile?.id });
  const { data: tasks } = useTasks({ user_id: profile?.id, status: "pending" });
  const { data: appointments } = useUpcomingAppointments();

  // Transform data for components
  const kpis = useMemo(() => {
    if (latestKpi) {
      return {
        investissement: latestKpi.investissement,
        efficacite: latestKpi.efficacite,
        participation: latestKpi.participation,
      };
    }
    // Fallback to mock data
    return mockCoachees[0].kpis;
  }, [latestKpi]);

  const kpiHistoryData = useMemo(() => {
    if (kpiHistory && kpiHistory.length > 0) {
      return kpiHistory.slice(0, 6).map((k) => ({
        month: format(new Date(k.scored_at), "MMM yyyy", { locale: fr }),
        investissement: k.investissement,
        efficacite: k.efficacite,
        participation: k.participation,
      })).reverse();
    }
    // Fallback to mock data
    return mockCoachees[0].kpi_history;
  }, [kpiHistory]);

  const modules = useMemo(() => {
    if (moduleProgress && moduleProgress.length > 0) {
      return moduleProgress.map((mp) => ({
        module_id: mp.module_id,
        module_title: mp.module?.title || "Module",
        status: mp.status === "validated" ? "complete" as const
          : mp.status === "in_progress" ? "en_cours" as const
          : mp.status === "submitted" ? "en_cours" as const
          : "non_commence" as const,
        satisfaction_score: mp.satisfaction_score || undefined,
      }));
    }
    // Fallback to mock data
    return mockCoachees[0].module_progress;
  }, [moduleProgress]);

  const tasksData = useMemo(() => {
    if (tasks && tasks.length > 0) {
      return tasks.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.due_date || "",
        completed: t.status === "completed",
      }));
    }
    // Fallback to mock data
    return [
      { id: "t-1", title: "Completer l'exercice de confiance en soi", dueDate: "2026-02-28", completed: false },
      { id: "t-2", title: "Remplir le questionnaire de mi-parcours", dueDate: "2026-02-25", completed: false },
      { id: "t-3", title: "Soumettre le resume du module IE", dueDate: "2026-02-20", completed: true },
    ];
  }, [tasks]);

  const nextAppointment = useMemo(() => {
    if (appointments && appointments.length > 0) {
      const appt = appointments[0];
      const apptDate = new Date(appt.datetime_start);
      return {
        date: format(apptDate, "yyyy-MM-dd"),
        time: format(apptDate, "HH:mm"),
        type: appt.type,
        daysUntil: differenceInDays(apptDate, new Date()),
      };
    }
    // Fallback to mock data
    return { date: "2026-02-27", time: "09:00", type: "coaching", daysUntil: 1 };
  }, [appointments]);

  const isLoading = authLoading || companyLoading || modulesLoading;

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM", { locale: fr });

  return (
    <div className="space-y-5">
      {/* 1. Welcome Header */}
      <div>
        <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
          Bonjour, {profile.first_name} !
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
          {company && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              <Building2 className="w-3 h-3" />
              {company.name}
            </div>
          )}
        </div>
      </div>

      {/* 2. Mes Indicateurs */}
      <MyIndicators kpis={kpis} history={kpiHistoryData} />

      {/* 3. Mes Modules */}
      <MyModules modules={modules} />

      {/* 4. Mes Travaux */}
      <MyTasks initialTasks={tasksData} />

      {/* 5 & 6. Prochain RDV + Mon Groupe side by side on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 5. Prochain RDV */}
        <NextRdv
          date={nextAppointment.date}
          time={nextAppointment.time}
          type={nextAppointment.type}
          daysUntil={nextAppointment.daysUntil}
        />

        {/* 6. Mon Groupe */}
        <MyGroup groupName={company?.name ? `Equipe ${company.name}` : "Mon groupe"} unreadMessages={0} />
      </div>
    </div>
  );
}
