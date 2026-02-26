"use client";

import { Calendar, Clock, Video } from "lucide-react";

interface NextRdvProps {
  date: string;
  time: string;
  type: string;
  daysUntil: number;
}

export function NextRdv({ date, time, type, daysUntil }: NextRdvProps) {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const typeLabels: Record<string, string> = {
    decouverte: "Seance decouverte",
    coaching: "Seance de coaching",
    review: "Bilan",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Prochain RDV</h2>

      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">
            {typeLabels[type] || type}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-dark capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-dark">{time}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-accent/10">
          <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            Dans {daysUntil} jour{daysUntil > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
