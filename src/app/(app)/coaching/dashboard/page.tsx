"use client";

import { Sparkles, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ParcoursTimeline } from "@/components/coaching/parcours-timeline";
import { CurrentModuleCard } from "@/components/coaching/current-module-card";
import { LivrablesSection } from "@/components/coaching/livrables-section";
import { CertificatesGallery } from "@/components/coaching/certificates-gallery";
import { SatisfactionHistory } from "@/components/coaching/satisfaction-history";
import { NextCall } from "@/components/coaching/next-call";
import { mockCoachees, mockModules } from "@/lib/mock-data";
import type { MockModuleProgress, MockLivrable } from "@/lib/mock-data";
import { PushPermissionCard } from "@/components/ui/push-permission-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useProfile, useMyModuleProgress, useMyAppointments } from "@/lib/supabase/hooks";

// Fallback mock data
const fallbackUser = mockCoachees[7]; // Isabelle Fontaine (individuel)

export default function CoachingDashboardPage() {
  const { profile: authProfile } = useAuth();
  const { data: supaProfile } = useProfile();
  const { data: moduleProgress } = useMyModuleProgress();
  const { data: supaAppointments } = useMyAppointments();

  // ── User name ──────────────────────────────────────────────
  const firstName = supaProfile?.first_name ?? authProfile?.first_name ?? fallbackUser.first_name;

  // ── Date ───────────────────────────────────────────────────
  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // ── Module progress (parcours) ─────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: MockModuleProgress[] = moduleProgress
    ? (moduleProgress as any[]).map((mp) => ({
        module_id: mp.module_id,
        module_title: mp.modules?.title || "Module",
        status: mp.status === "in_progress"
          ? "en_cours"
          : mp.status === "validated"
            ? "complete"
            : mp.status === "submitted"
              ? "en_cours"
              : "non_commence",
        satisfaction_score: mp.satisfaction_score ?? undefined,
      }))
    : fallbackUser.module_progress;

  // ── Parcours progress ──────────────────────────────────────
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.status === "complete").length;
  const parcoursProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // ── Current module (in_progress) ───────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mpList = moduleProgress as any[] | null;
  const currentMp = mpList?.find((mp) => mp.status === "in_progress");
  const currentModuleTitle = currentMp?.modules?.title
    ?? fallbackUser.current_module;

  const currentModuleData = currentModuleTitle
    ? mockModules.find((m) => m.title === currentModuleTitle)
    : null;

  const currentModuleProgress = modules.find((m) => m.status === "en_cours");

  // ── Livrables ──────────────────────────────────────────────
  // Build livrables from Supabase module_progress (written_summary_url, audio_url, video_url)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const livrables: MockLivrable[] = mpList
    ? mpList.flatMap((mp: any) => {
        const items: MockLivrable[] = [];
        const title = mp.modules?.title || "Module";
        const status = mp.status === "validated" ? "valide" as const : "en_attente" as const;
        const date = mp.submitted_at || mp.created_at;
        if (mp.written_summary_url) {
          items.push({
            id: `${mp.id}-ecrit`,
            module_title: title,
            type: "ecrit" as const,
            submission_date: date,
            status,
            file_name: mp.written_summary_url.split("/").pop() || "resume.pdf",
          });
        }
        if (mp.audio_url) {
          items.push({
            id: `${mp.id}-audio`,
            module_title: title,
            type: "audio" as const,
            submission_date: date,
            status,
            file_name: mp.audio_url.split("/").pop() || "audio.mp3",
          });
        }
        if (mp.video_url) {
          items.push({
            id: `${mp.id}-video`,
            module_title: title,
            type: "video" as const,
            submission_date: date,
            status,
            file_name: mp.video_url.split("/").pop() || "video.mp4",
          });
        }
        return items;
      })
    : fallbackUser.livrables;

  const delivrablesSubmitted = currentModuleTitle
    ? livrables.filter((l) => l.module_title === currentModuleTitle).length
    : 0;
  const delivrablesTotal = 3; // ecrit + audio + video

  // ── Certificates ───────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const certificates = mpList
    ? mpList
        .filter((mp: any) => mp.status === "validated" && mp.certificate_url)
        .map((mp: any) => ({
          id: mp.id,
          module_title: mp.modules?.title || "Module",
          earned_date: mp.validated_at || mp.created_at,
        }))
    : fallbackUser.certificates;

  // ── Next call ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apptList = supaAppointments as any[] | null;
  const nextAppt = apptList
    ? apptList.find((a) => new Date(a.datetime_start) > new Date() && a.status === "scheduled")
    : null;

  const nextCall = nextAppt
    ? {
        date: nextAppt.datetime_start.split("T")[0],
        time: new Date(nextAppt.datetime_start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        duration: "1h",
        zoomLink: nextAppt.zoom_link || "https://zoom.us/j/000000000",
        daysUntil: Math.ceil((new Date(nextAppt.datetime_start).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }
    : {
        date: "2026-03-02",
        time: "11:00",
        duration: "1h",
        zoomLink: "https://zoom.us/j/777888999",
        daysUntil: 4,
      };

  return (
    <div className="space-y-5">
      <PushPermissionCard />
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
          description={currentModuleData.content_summary}
          delivrablesSubmitted={delivrablesSubmitted}
          delivrablesTotal={delivrablesTotal}
          estimatedDeadline="2026-04-15"
          moduleId={currentModuleData.id}
        />
      )}

      {/* 4. Mes Livrables */}
      {currentModuleTitle && (
        <LivrablesSection
          livrables={livrables}
          currentModuleTitle={currentModuleTitle}
        />
      )}

      {/* 5 & 6. Certificates + Satisfaction side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CertificatesGallery certificates={certificates} />
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
