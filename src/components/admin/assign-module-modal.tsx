"use client";

import { useState } from "react";
import { X, BookOpen, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { mockModules } from "@/lib/mock-data";
import { insertModuleProgress } from "@/hooks/use-supabase-data";

interface AssignModuleModalProps {
  coacheeId: string;
  coacheeName: string;
  currentModules: string[];
  onClose: () => void;
}

export function AssignModuleModal({
  coacheeId,
  coacheeName,
  currentModules,
  onClose,
}: AssignModuleModalProps) {
  const { toast } = useToast();
  const [selectedModules, setSelectedModules] = useState<string[]>(currentModules);
  const [isSaving, setIsSaving] = useState(false);

  const availableModules = mockModules.filter(
    (m) => !currentModules.includes(m.id)
  );

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSave = async () => {
    const newModules = selectedModules.filter(
      (id) => !currentModules.includes(id)
    );

    if (newModules.length === 0) {
      toast("Aucun nouveau module selectionne", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const results = await Promise.all(
        newModules.map((moduleId) =>
          insertModuleProgress({ user_id: coacheeId, module_id: moduleId })
        )
      );
      const firstError = results.find((r) => r.error);
      if (firstError?.error) throw firstError.error;
      toast(
        `${newModules.length} module${newModules.length > 1 ? "s" : ""} attribue${newModules.length > 1 ? "s" : ""} avec succes`,
        "success"
      );
      onClose();
    } catch {
      toast("Erreur lors de l'attribution", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const newSelectionsCount = selectedModules.filter(
    (id) => !currentModules.includes(id)
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-heading font-semibold text-lg text-dark">
              Attribuer des modules
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
        <div className="p-5 overflow-y-auto flex-1">
          {/* Current modules */}
          {currentModules.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Modules actuels
              </p>
              <div className="space-y-2">
                {mockModules
                  .filter((m) => currentModules.includes(m.id))
                  .map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-3 p-3 bg-success/5 border border-success/20 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-success shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark text-sm truncate">
                          {module.title}
                        </p>
                        <p className="text-xs text-gray-500">Deja attribue</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Available modules */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Modules disponibles
            </p>
            {availableModules.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Tous les modules sont deja attribues</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableModules.map((module) => {
                  const isSelected = selectedModules.includes(module.id);
                  return (
                    <button
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      className={cn(
                        "flex items-center gap-3 w-full p-3 rounded-lg border transition-all text-left",
                        isSelected
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "border-accent bg-accent"
                            : "border-gray-300 bg-white"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark text-sm truncate">
                          {module.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {module.parcours_type === "individuel"
                            ? "Individuel"
                            : module.parcours_type === "entreprise"
                              ? "Entreprise"
                              : "Les deux"}{" "}
                          &bull; {module.duration_weeks} semaines &bull;{" "}
                          {module.price} EUR
                        </p>
                      </div>
                      {isSelected && (
                        <Plus className="w-4 h-4 text-accent rotate-45" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={newSelectionsCount === 0 || isSaving}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Attribution...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Attribuer {newSelectionsCount > 0 && `(${newSelectionsCount})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
