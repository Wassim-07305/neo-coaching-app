"use client";

import { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface KpiScoringModalProps {
  coacheeId: string;
  coacheeName: string;
  currentKpis: {
    investissement: number;
    efficacite: number;
    participation: number;
  };
  onClose: () => void;
  onSave: (kpis: { investissement: number; efficacite: number; participation: number; notes: string }) => void;
}

function KpiSlider({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const getColor = (val: number) => {
    if (val <= 3) return "danger";
    if (val <= 6) return "warning";
    return "success";
  };

  const color = getColor(value);
  const colorClasses = {
    danger: "bg-danger",
    warning: "bg-warning",
    success: "bg-success",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-dark">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white",
            colorClasses[color]
          )}
        >
          {value}
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-danger">0</span>
          <span className="text-xs text-warning">5</span>
          <span className="text-xs text-success">10</span>
        </div>
      </div>

      {/* Quick buttons */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={cn(
              "flex-1 py-1.5 rounded text-xs font-medium transition-colors",
              value === num
                ? cn(colorClasses[getColor(num)], "text-white")
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export function KpiScoringModal({
  coacheeName,
  currentKpis,
  onClose,
  onSave,
}: KpiScoringModalProps) {
  const { toast } = useToast();
  const [investissement, setInvestissement] = useState(currentKpis.investissement);
  const [efficacite, setEfficacite] = useState(currentKpis.efficacite);
  const [participation, setParticipation] = useState(currentKpis.participation);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    investissement !== currentKpis.investissement ||
    efficacite !== currentKpis.efficacite ||
    participation !== currentKpis.participation;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to Supabase kpi_scores table
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      onSave({ investissement, efficacite, participation, notes });
      toast("Indicateurs mis a jour avec succes", "success");
      onClose();
    } catch {
      toast("Erreur lors de la mise a jour", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if any score is critical
  const hasCritical = investissement <= 3 || efficacite <= 3 || participation <= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-semibold text-lg text-dark">
              Noter les indicateurs
            </h2>
            <p className="text-sm text-gray-500">{coacheeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Warning if critical */}
          {hasCritical && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-danger">Score critique detecte</p>
                <p className="text-gray-600 mt-1">
                  Un ou plusieurs indicateurs sont en zone rouge. Une notification
                  sera envoyee automatiquement pour signaler un risque de decrochage.
                </p>
              </div>
            </div>
          )}

          {/* KPI Sliders */}
          <KpiSlider
            label="Investissement"
            description="Rapidite et qualite du travail rendu"
            value={investissement}
            onChange={setInvestissement}
          />

          <div className="border-t border-gray-100" />

          <KpiSlider
            label="Efficacite"
            description="Capacite a suivre les consignes et produire des resultats"
            value={efficacite}
            onChange={setEfficacite}
          />

          <div className="border-t border-gray-100" />

          <KpiSlider
            label="Participation"
            description="Engagement dans les sessions collectives et individuelles"
            value={participation}
            onChange={setParticipation}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes privees (facultatif)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, points d'attention, actions a prendre..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Ces notes sont visibles uniquement par vous.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
