"use client";

import { useState } from "react";
import { FileText, Download, Filter, Calendar, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportType = "kpi_summary" | "progression" | "rdv_history" | "engagement" | "module_completion";

interface ReportConfig {
  type: ReportType;
  label: string;
  description: string;
  icon: typeof FileText;
}

const reportTypes: ReportConfig[] = [
  {
    type: "kpi_summary",
    label: "Synthèse KPIs",
    description: "Résumé des indicateurs clés par coaché ou groupe",
    icon: BarChart3,
  },
  {
    type: "progression",
    label: "Progression des parcours",
    description: "Avancement des modules et scores de quiz",
    icon: FileText,
  },
  {
    type: "rdv_history",
    label: "Historique des RDV",
    description: "Liste des rendez-vous passés et à venir",
    icon: Calendar,
  },
  {
    type: "engagement",
    label: "Engagement",
    description: "Taux de connexion, messages, livrables déposés",
    icon: Users,
  },
  {
    type: "module_completion",
    label: "Complétion des modules",
    description: "Taux de complétion par module et par groupe",
    icon: BarChart3,
  },
];

interface Filters {
  dateFrom: string;
  dateTo: string;
  group: string;
  format: "pdf" | "csv" | "xlsx";
}

export function CustomReport() {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    group: "",
    format: "pdf",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!selectedType) return;
    setGenerating(true);
    setGenerated(false);
    // Simulate generation
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-[#D4A843]" />
        <h3 className="font-heading text-lg font-bold text-dark">
          Rapports personnalisés
        </h3>
      </div>

      {/* Report type selection */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">
          Type de rapport
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportTypes.map((rt) => {
            const Icon = rt.icon;
            const isSelected = selectedType === rt.type;
            return (
              <button
                key={rt.type}
                onClick={() => {
                  setSelectedType(rt.type);
                  setGenerated(false);
                }}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[#D4A843] bg-[#D4A843]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mb-2",
                    isSelected ? "text-[#D4A843]" : "text-gray-400"
                  )}
                />
                <p className="text-sm font-medium text-dark">{rt.label}</p>
                <p className="text-xs text-gray-500 mt-1">{rt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      {selectedType && (
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filtres</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date début
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date fin
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Groupe
              </label>
              <select
                value={filters.group}
                onChange={(e) =>
                  setFilters({ ...filters, group: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-[#D4A843] focus:outline-none"
              >
                <option value="">Tous les groupes</option>
                <option value="g1">Groupe A - Techniciens</option>
                <option value="g2">Groupe B - Managers</option>
                <option value="g3">Groupe C - Direction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Format
              </label>
              <select
                value={filters.format}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    format: e.target.value as Filters["format"],
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-[#D4A843] focus:outline-none"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 rounded-lg bg-[#D4A843] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c49a3a] disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Générer le rapport
                </>
              )}
            </button>

            {generated && (
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Télécharger ({filters.format.toUpperCase()})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generated report preview */}
      {generated && (
        <div className="rounded-xl border border-[#2D8C4E]/20 bg-[#2D8C4E]/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-[#2D8C4E]" />
            <span className="text-sm font-medium text-[#2D8C4E]">
              Rapport généré avec succès
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {reportTypes.find((r) => r.type === selectedType)?.label} —{" "}
            {filters.dateFrom || "début"} au {filters.dateTo || "aujourd'hui"}
            {filters.group && " — Groupe filtré"}
          </p>
        </div>
      )}
    </div>
  );
}
