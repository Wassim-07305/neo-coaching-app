"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Phone,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCoachees } from "@/lib/mock-data";
import type { CallType } from "@/lib/mock-data";

const currentUser = mockCoachees[0]; // Marie Dupont

// Mock upcoming appointments for this salarie
const mockSalarieAppointments = [
  {
    id: "sa-1",
    date: "2026-03-10",
    time: "09:00",
    duration: 60,
    type: "coaching" as CallType,
    coach: "Jean-Claude Yekpe",
    topic: "Bilan module Confiance en soi",
    zoomLink: "https://zoom.us/j/123456789",
  },
  {
    id: "sa-2",
    date: "2026-03-17",
    time: "14:00",
    duration: 45,
    type: "coaching" as CallType,
    coach: "Jean-Claude Yekpe",
    topic: "Exercices pratiques - Confiance",
    zoomLink: "https://zoom.us/j/987654321",
  },
  {
    id: "sa-3",
    date: "2026-03-24",
    time: "10:00",
    duration: 60,
    type: "review" as CallType,
    coach: "Jean-Claude Yekpe",
    topic: "Review mi-parcours",
    zoomLink: "https://zoom.us/j/111222333",
  },
  {
    id: "sa-4",
    date: "2026-04-07",
    time: "09:00",
    duration: 60,
    type: "coaching" as CallType,
    coach: "Jean-Claude Yekpe",
    topic: "Debut module Prise de parole",
    zoomLink: "https://zoom.us/j/444555666",
  },
];

const typeConfig: Record<CallType, { label: string; bgClass: string; textClass: string }> = {
  decouverte: { label: "Decouverte", bgClass: "bg-blue-50", textClass: "text-blue-600" },
  coaching: { label: "Coaching", bgClass: "bg-accent/10", textClass: "text-accent" },
  review: { label: "Bilan", bgClass: "bg-success/10", textClass: "text-success" },
};

function getDaysUntil(dateStr: string): number {
  const now = new Date("2026-03-08");
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function SalarieAgendaPage() {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");

  const upcoming = mockSalarieAppointments.filter(
    (a) => getDaysUntil(a.date) >= 0
  );
  const pastCalls = currentUser.calls.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <CalendarDays className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-xl font-bold text-dark">
            Mon Agenda
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Vos rendez-vous de coaching passes et a venir.
        </p>
      </div>

      {/* Next appointment highlight */}
      {upcoming.length > 0 && (
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 p-5">
          <p className="text-xs font-medium text-accent mb-2">
            Prochain rendez-vous
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex-1">
              <h3 className="font-heading font-bold text-dark text-base">
                {upcoming[0].topic}
              </h3>
              <p className="text-sm text-gray-600 mt-1 capitalize">
                {formatDate(upcoming[0].date)} a {upcoming[0].time}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {upcoming[0].duration} min
                </span>
                <span className="text-xs text-gray-500">
                  avec {upcoming[0].coach}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-accent border border-accent/20">
                Dans {getDaysUntil(upcoming[0].date)} jour{getDaysUntil(upcoming[0].date) > 1 ? "s" : ""}
              </span>
              <a
                href={upcoming[0].zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                Rejoindre
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("upcoming")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            view === "upcoming"
              ? "bg-accent text-white border-accent"
              : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
          )}
        >
          A venir ({upcoming.length})
        </button>
        <button
          onClick={() => setView("past")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            view === "past"
              ? "bg-accent text-white border-accent"
              : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
          )}
        >
          Passes ({pastCalls.length})
        </button>
      </div>

      {/* Content */}
      {view === "upcoming" ? (
        <div className="space-y-3">
          {upcoming.map((apt) => {
            const config = typeConfig[apt.type];
            const days = getDaysUntil(apt.date);
            return (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          config.bgClass,
                          config.textClass
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Dans {days} jour{days > 1 ? "s" : ""}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-dark text-sm">
                      {apt.topic}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500 capitalize">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(apt.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {apt.time} ({apt.duration} min)
                      </span>
                    </div>
                  </div>
                  <a
                    href={apt.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Zoom
                  </a>
                </div>
              </div>
            );
          })}
          {upcoming.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Aucun rendez-vous a venir pour le moment.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {pastCalls.map((call) => {
            const config = typeConfig[call.type];
            return (
              <div
                key={call.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          config.bgClass,
                          config.textClass
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(call.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {call.notes}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 inline-block">
                      Duree: {call.duration_minutes} min
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
