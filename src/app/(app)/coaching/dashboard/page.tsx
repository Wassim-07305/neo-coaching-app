"use client";

import { Sparkles, MessageCircle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { ParcoursTimeline } from "@/components/coaching/parcours-timeline";
import { CurrentModuleCard } from "@/components/coaching/current-module-card";
import { LivrablesSection } from "@/components/coaching/livrables-section";
import { CertificatesGallery } from "@/components/coaching/certificates-gallery";
import { SatisfactionHistory } from "@/components/coaching/satisfaction-history";
import { NextCall } from "@/components/coaching/next-call";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useUserModuleProgress,
  useModules,
  useUpcomingAppointments,
} from "@/hooks/use-supabase-data";
import { mockCoachees, mockModules } from "@/lib/mock-data";
import { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export default function CoachingDashboardPage() {
  const { profile, loading: authLoading } = useAuth();

  // Fetch real data from Supabase
  const { data: moduleProgress, loading: modulesLoading } = useUserModuleProgress(profile?.id);
  const { data: allModules } = useModules();
  const { data: appointments } = useUpcomingAppointments();

  // Fallback to mock user if not logged in (Isabelle Fontaine - individual coachee)
  const mockUser = mockCoachees[7];

  // Transform module progress data
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
    return mockUser.module_progress;
  }, [moduleProgress]);

  // Calculate parcours progress
  const totalModules = modules.length || 1;
  const completedModules = modules.filter((m) => m.status === "complete").length;
  const parcoursProgress = Math.round((completedModules / totalModules) * 100);

  // Find current module (in progress)
  const currentModuleProgress = modules.find((m) => m.status === "en_cours");
  const currentModuleName = currentModuleProgress?.module_title;
  const currentModuleData = useMemo(() => {
    if (currentModuleName && allModules) {
      return allModules.find((m) => m.title === currentModuleName);
    }
    return mockModules.find((m) => m.title === currentModuleName);
  }, [currentModuleName, allModules]);

  // Livrables (using mock for now as we don't have real livrables data structure)
  const livrables = mockUser.livrables;
  const currentModuleLivrables = livrables.filter((l) => l.module_title === currentModuleName);
  const delivrablesSubmitted = currentModuleLivrables.length;
  const delivrablesTotal = 3;

  // Certificates (using mock for now)
  const certificates = mockUser.certificates;

  // Next call
  const nextCall = useMemo(() => {
    if (appointments && appointments.length > 0) {
      const appt = appointments[0];
      const apptDate = new Date(appt.datetime_start);
      const endDate = new Date(appt.datetime_end);
      const durationMs = endDate.getTime() - apptDate.getTime();
      const durationMinutes = Math.round(durationMs / 60000);
      const durationStr = durationMinutes >= 60 ? `${Math.round(durationMinutes / 60)}h` : `${durationMinutes}min`;

      return {
        date: format(apptDate, "yyyy-MM-dd"),
        time: format(apptDate, "HH:mm"),
        duration: durationStr,
        zoomLink: appt.zoom_link || "https://zoom.us",
        daysUntil: differenceInDays(apptDate, new Date()),
      };
    }
    return {
      date: "2026-03-02",
      time: "11:00",
      duration: "1h",
      zoomLink: "https://zoom.us/j/777888999",
      daysUntil: 4,
    };
  }, [appointments]);

  const isLoading = authLoading || modulesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const firstName = profile?.first_name || mockUser.first_name;
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM", { locale: fr });

  return (
    <div className="space-y-5">
      {/* 1. Welcome Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
            Bonjour, {firstName} !
          </h1>
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <p className="text-sm text-gray-500 capitalize mt-0.5">{formattedDate}</p>

        {/* Parcours progress indicator */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${parcoursProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-accent shrink-0">
            {parcoursProgress}% du parcours
          </span>
        </div>
      </div>

      {/* 2. Mon Parcours (Timeline) */}
      <ParcoursTimeline modules={modules} />

      {/* 3. Module en cours */}
      {currentModuleData && currentModuleProgress && (
        <CurrentModuleCard
          title={currentModuleData.title}
          description={'content_summary' in currentModuleData ? currentModuleData.content_summary : (currentModuleData.description || "")}
          delivrablesSubmitted={delivrablesSubmitted}
          delivrablesTotal={delivrablesTotal}
          estimatedDeadline="2026-04-15"
          moduleId={currentModuleData.id}
        />
      )}

      {/* 4. Mes Livrables */}
      {currentModuleName && (
        <LivrablesSection
          livrables={livrables}
          currentModuleTitle={currentModuleName}
        />
      )}

      {/* 5 & 6. Certificates + Satisfaction side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CertificatesGallery
          certificates={certificates}
          coacheeName={`${profile?.first_name || mockUser.first_name} ${profile?.last_name || mockUser.last_name}`}
        />
        <SatisfactionHistory modules={modules} />
      </div>

      {/* 7 & 8. Prochain Call + Communaute side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NextCall
          date={nextCall.date}
          time={nextCall.time}
          duration={nextCall.duration}
          zoomLink={nextCall.zoomLink}
          daysUntil={nextCall.daysUntil}
        />

        {/* 8. Communaute */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-primary-medium" />
            <h2 className="font-heading font-semibold text-dark text-base">Communaute</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Echangez avec les autres coachees, partagez vos experiences et progressez ensemble.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              2 messages non lus
            </span>
            <Link
              href="/coaching/communaute"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Acceder a la communaute
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
