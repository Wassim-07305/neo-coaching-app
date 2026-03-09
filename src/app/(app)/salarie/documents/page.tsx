"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Award,
  File,
  FileAudio,
  FileVideo,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCoachees } from "@/lib/mock-data";
import type { LivrableStatus, LivrableType } from "@/lib/mock-data";

const currentUser = mockCoachees[0]; // Marie Dupont

type DocFilter = "tous" | "livrables" | "certificats";

const statusConfig: Record<
  LivrableStatus,
  { label: string; icon: React.ElementType; bgClass: string; textClass: string }
> = {
  valide: {
    label: "Valide",
    icon: CheckCircle2,
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  en_attente: {
    label: "En attente",
    icon: Clock,
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  soumis: {
    label: "Soumis",
    icon: AlertCircle,
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
  },
};

const typeIcons: Record<LivrableType, React.ElementType> = {
  ecrit: File,
  audio: FileAudio,
  video: FileVideo,
};

export default function SalarieDocumentsPage() {
  const [filter, setFilter] = useState<DocFilter>("tous");

  const livrables = currentUser.livrables.sort(
    (a, b) =>
      new Date(b.submission_date).getTime() -
      new Date(a.submission_date).getTime()
  );
  const certificates = currentUser.certificates.sort(
    (a, b) =>
      new Date(b.earned_date).getTime() - new Date(a.earned_date).getTime()
  );

  const filters: { key: DocFilter; label: string; count: number }[] = [
    { key: "tous", label: "Tous", count: livrables.length + certificates.length },
    { key: "livrables", label: "Livrables", count: livrables.length },
    { key: "certificats", label: "Certificats", count: certificates.length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-xl font-bold text-dark">
            Mes Documents
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Retrouvez vos livrables soumis et vos certificats obtenus.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold font-heading text-accent">
            {livrables.length}
          </p>
          <p className="text-[10px] text-gray-500">Livrables</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold font-heading text-success">
            {livrables.filter((l) => l.status === "valide").length}
          </p>
          <p className="text-[10px] text-gray-500">Valides</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold font-heading text-warning">
            {certificates.length}
          </p>
          <p className="text-[10px] text-gray-500">Certificats</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              filter === f.key
                ? "bg-accent text-white border-accent"
                : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Certificates section */}
      {(filter === "tous" || filter === "certificats") &&
        certificates.length > 0 && (
          <div>
            {filter === "tous" && (
              <h2 className="font-heading text-sm font-semibold text-dark mb-3">
                Certificats
              </h2>
            )}
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-accent/20 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-dark text-sm">
                        Certificat — {cert.module_title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Obtenu le{" "}
                        {new Date(cert.earned_date).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                    </div>
                    <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 text-xs font-medium text-accent hover:bg-accent/10 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Livrables section */}
      {(filter === "tous" || filter === "livrables") &&
        livrables.length > 0 && (
          <div>
            {filter === "tous" && (
              <h2 className="font-heading text-sm font-semibold text-dark mb-3">
                Livrables
              </h2>
            )}
            <div className="space-y-3">
              {livrables.map((liv) => {
                const config = statusConfig[liv.status];
                const StatusIcon = config.icon;
                const TypeIcon = typeIcons[liv.type];
                return (
                  <div
                    key={liv.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <TypeIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-dark text-sm truncate">
                            {liv.file_name}
                          </h3>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0",
                              config.bgClass,
                              config.textClass
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Module: {liv.module_title}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-400">
                            Soumis le{" "}
                            {new Date(liv.submission_date).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">
                            {liv.type}
                          </span>
                        </div>
                      </div>
                      <button className="shrink-0 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Empty state */}
      {filter === "certificats" && certificates.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Aucun certificat obtenu pour le moment.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Terminez un module pour obtenir votre premier certificat.
          </p>
        </div>
      )}
      {filter === "livrables" && livrables.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Aucun livrable soumis pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
