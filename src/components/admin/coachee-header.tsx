"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  BookOpen,
  MessageSquare,
  FileText,
} from "lucide-react";
import type { MockCoachee } from "@/lib/mock-data";

interface CoacheeHeaderProps {
  coachee: MockCoachee;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  actif: { label: "Actif", className: "bg-success/10 text-success border-success/30" },
  inactif: { label: "Inactif", className: "bg-gray-100 text-gray-500 border-gray-200" },
  archive: { label: "Archive", className: "bg-gray-100 text-gray-400 border-gray-200" },
};

function getInitials(first: string, last: string): string {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
}

export function CoacheeHeader({ coachee }: CoacheeHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusStyles[coachee.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      {/* Back button */}
      <Link
        href="/admin/coachees"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux coachees
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary-medium/10 flex items-center justify-center text-xl font-bold text-primary-medium font-heading shrink-0">
          {getInitials(coachee.first_name, coachee.last_name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-dark">
            {coachee.first_name} {coachee.last_name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                coachee.type === "individuel"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-success/10 text-success"
              )}
            >
              {coachee.type === "individuel" ? "Individuel" : "Entreprise"}
            </span>
            {coachee.company_name && (
              <span className="text-sm text-gray-500">{coachee.company_name}</span>
            )}
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              Debut: {new Date(coachee.start_date).toLocaleDateString("fr-FR")}
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                status.className
              )}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
            Actions
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-52">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Modifier indicateurs
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <BookOpen className="w-4 h-4" />
                  Attribuer module
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  Envoyer message
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  Generer rapport
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
