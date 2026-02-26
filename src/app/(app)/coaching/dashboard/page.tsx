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

// Use Isabelle Fontaine as the logged-in individual coachee
const currentUser = mockCoachees[7]; // Isabelle Fontaine (individuel)

// Find current module details
const currentModuleName = currentUser.current_module;
const currentModuleData = mockModules.find((m) => m.title === currentModuleName);
const currentModuleProgress = currentUser.module_progress.find((m) => m.status === "en_cours");

// Calculate parcours progress
const totalModules = currentUser.module_progress.length;
const completedModules = currentUser.module_progress.filter((m) => m.status === "complete").length;
const parcoursProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

// Livrables for current module
const currentModuleLivrables = currentUser.livrables.filter(
  (l) => l.module_title === currentModuleName
);
const delivrablesSubmitted = currentModuleLivrables.length;
const delivrablesTotal = 3; // Typically ecrit + audio + video

// Next call
const nextCall = {
  date: "2026-03-02",
  time: "11:00",
  duration: "1h",
  zoomLink: "https://zoom.us/j/777888999",
  daysUntil: 4,
};

export default function CoachingDashboardPage() {
  const today = new Date("2026-02-26");
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-5">
      {/* 1. Welcome Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
            Bonjour, {currentUser.first_name} !
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
      <ParcoursTimeline modules={currentUser.module_progress} />

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
      {currentModuleName && (
        <LivrablesSection
          livrables={currentUser.livrables}
          currentModuleTitle={currentModuleName}
        />
      )}

      {/* 5 & 6. Certificates + Satisfaction side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CertificatesGallery certificates={currentUser.certificates} />
        <SatisfactionHistory modules={currentUser.module_progress} />
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
