"use client";

import { BookOpen, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

interface CurrentModuleCardProps {
  title: string;
  description: string;
  delivrablesSubmitted: number;
  delivrablesTotal: number;
  estimatedDeadline: string;
  moduleId: string;
}

export function CurrentModuleCard({
  title,
  description,
  delivrablesSubmitted,
  delivrablesTotal,
  estimatedDeadline,
  moduleId,
}: CurrentModuleCardProps) {
  const progress = delivrablesTotal > 0 ? Math.round((delivrablesSubmitted / delivrablesTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border-2 border-accent/30 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-accent" />
        <span className="text-xs font-medium text-accent uppercase tracking-wider">
          Module en cours
        </span>
      </div>

      <h2 className="font-heading text-xl md:text-2xl font-bold text-dark mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600">
            {delivrablesSubmitted}/{delivrablesTotal} livrables soumis
          </span>
          <span className="text-xs font-bold text-accent">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>
          Date limite estimee :{" "}
          {new Date(estimatedDeadline).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* CTA Button */}
      <Link
        href={`/coaching/modules/${moduleId}`}
        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors"
      >
        Acceder au contenu
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
