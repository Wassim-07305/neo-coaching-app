"use client";

import { FileText, Headphones, Video, Upload, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockLivrable, LivrableStatus, LivrableType } from "@/lib/mock-data";

interface LivrablesSectionProps {
  livrables: MockLivrable[];
  currentModuleTitle: string;
}

function getTypeConfig(type: LivrableType) {
  switch (type) {
    case "ecrit":
      return { icon: FileText, label: "Resume ecrit", color: "text-primary" };
    case "audio":
      return { icon: Headphones, label: "Audio", color: "text-accent" };
    case "video":
      return { icon: Video, label: "Video", color: "text-primary-medium" };
  }
}

function getStatusConfig(status: LivrableStatus) {
  switch (status) {
    case "valide":
      return { label: "Valide", bgClass: "bg-success/10", textClass: "text-success", icon: CheckCircle2 };
    case "soumis":
      return { label: "Soumis", bgClass: "bg-warning/10", textClass: "text-warning", icon: Clock };
    case "en_attente":
      return { label: "En attente", bgClass: "bg-gray-100", textClass: "text-gray-500", icon: Clock };
  }
}

export function LivrablesSection({ livrables, currentModuleTitle }: LivrablesSectionProps) {
  // Filter livrables for current module
  const currentLivrables = livrables.filter((l) => l.module_title === currentModuleTitle);

  // Available types that could still be uploaded
  const submittedTypes = new Set(currentLivrables.map((l) => l.type));
  const allTypes: LivrableType[] = ["ecrit", "audio", "video"];
  const missingTypes = allTypes.filter((t) => !submittedTypes.has(t));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Mes Livrables</h2>

      {/* Submitted livrables */}
      {currentLivrables.length > 0 && (
        <div className="space-y-3 mb-4">
          {currentLivrables.map((livrable) => {
            const typeConfig = getTypeConfig(livrable.type);
            const statusConfig = getStatusConfig(livrable.status);
            const TypeIcon = typeConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={livrable.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
              >
                <div className={cn("w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0")}>
                  <TypeIcon className={cn("w-4 h-4", typeConfig.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{livrable.file_name}</p>
                  <p className="text-xs text-gray-500">{typeConfig.label}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0",
                    statusConfig.bgClass,
                    statusConfig.textClass
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload zones for missing types */}
      {missingTypes.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            A soumettre
          </p>
          {missingTypes.map((type) => {
            const typeConfig = getTypeConfig(type);
            const TypeIcon = typeConfig.icon;
            return (
              <button
                key={type}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-accent/40 hover:bg-accent/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <TypeIcon className={cn("w-5 h-5 text-gray-400 group-hover:text-accent transition-colors")} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-dark transition-colors">
                    {typeConfig.label}
                  </p>
                  <p className="text-xs text-gray-400">Cliquez pour telecharger</p>
                </div>
                <Upload className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
              </button>
            );
          })}
        </div>
      )}

      {currentLivrables.length === 0 && missingTypes.length === 0 && (
        <div className="text-center py-6">
          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Aucun livrable requis pour le moment</p>
        </div>
      )}
    </div>
  );
}
