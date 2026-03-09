"use client";

import { Phone, Calendar, Clock, ExternalLink, Video } from "lucide-react";

interface NextCallProps {
  date: string;
  time: string;
  duration: string;
  zoomLink: string;
  daysUntil: number;
}

export function NextCall({ date, time, duration, zoomLink, daysUntil }: NextCallProps) {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-semibold text-dark text-base">Prochain Call</h2>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 border border-primary/15">
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-dark capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-dark">{time} ({duration})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {daysUntil === 0
              ? "Aujourd'hui"
              : daysUntil === 1
              ? "Demain"
              : `Dans ${daysUntil} jours`}
          </span>
          <a
            href={zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Video className="w-3.5 h-3.5" />
            Lien Zoom
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
