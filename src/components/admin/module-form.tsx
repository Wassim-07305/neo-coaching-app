"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockModule, ParcoursType } from "@/lib/mock-data";
import { upsertModule } from "@/hooks/use-supabase-data";
import { useToast } from "@/components/ui/toast";

interface ModuleFormProps {
  module?: MockModule | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  content_summary: string;
  exercise_json: string;
  order_index: number;
  parcours_type: ParcoursType;
  price: number;
  duration_weeks: number;
}

function getInitialForm(module?: MockModule | null): FormData {
  if (module) {
    return {
      title: module.title,
      description: module.description,
      content_summary: module.content_summary,
      exercise_json: module.exercise_json,
      order_index: module.order_index,
      parcours_type: module.parcours_type,
      price: module.price,
      duration_weeks: module.duration_weeks,
    };
  }
  return {
    title: "",
    description: "",
    content_summary: "",
    exercise_json: "",
    order_index: 1,
    parcours_type: "les_deux",
    price: 490,
    duration_weeks: 4,
  };
}

export function ModuleForm({ module, isOpen, onClose }: ModuleFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  // Use module?.id as key to reset form when module changes
  const initialForm = useMemo(() => getInitialForm(module), [module]);
  const [form, setForm] = useState<FormData>(initialForm);

  // Reset form when module changes
  const moduleId = module?.id ?? null;
  const [prevModuleId, setPrevModuleId] = useState<string | null>(moduleId);
  if (moduleId !== prevModuleId) {
    setPrevModuleId(moduleId);
    setForm(getInitialForm(module));
  }

  if (!isOpen) return null;

  const isEditing = !!module;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsSaving(true);
    try {
      let exerciseObj: Record<string, unknown> | undefined;
      if (form.exercise_json.trim()) {
        try {
          exerciseObj = JSON.parse(form.exercise_json);
        } catch {
          toast("Format JSON des exercices invalide", "error");
          setIsSaving(false);
          return;
        }
      }

      const { error } = await upsertModule({
        id: module?.id,
        title: form.title.trim(),
        description: form.description || undefined,
        content: { summary: form.content_summary },
        exercise: exerciseObj,
        order_index: form.order_index,
        parcours_type: form.parcours_type,
        price_cents: form.price * 100,
        duration_minutes: form.duration_weeks * 7 * 24 * 60,
      });
      if (error) throw error;
      toast(isEditing ? "Module mis a jour" : "Module cree avec succes", "success");
      onClose();
    } catch {
      toast("Erreur lors de la sauvegarde du module", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal / Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-heading font-semibold text-lg text-dark">
            {isEditing ? "Modifier le module" : "Creer un module"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              placeholder="Ex: Intelligence Emotionnelle"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              rows={3}
              placeholder="Description courte du module..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu detaille
            </label>
            <textarea
              value={form.content_summary}
              onChange={(e) => setForm({ ...form, content_summary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              rows={4}
              placeholder="Contenu et programme du module..."
            />
          </div>

          {/* Exercise JSON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercices (JSON)
            </label>
            <textarea
              value={form.exercise_json}
              onChange={(e) => setForm({ ...form, exercise_json: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              rows={3}
              placeholder='{"exercises": [...]}'
            />
          </div>

          {/* Grid: Order + Parcours type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordre
              </label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de parcours
              </label>
              <select
                value={form.parcours_type}
                onChange={(e) => setForm({ ...form, parcours_type: e.target.value as ParcoursType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
              >
                <option value="individuel">Individuel</option>
                <option value="entreprise">Entreprise</option>
                <option value="les_deux">Les deux</option>
              </select>
            </div>
          </div>

          {/* Grid: Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (EUR)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                min={0}
                step={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duree (semaines)
              </label>
              <input
                type="number"
                value={form.duration_weeks}
                onChange={(e) => setForm({ ...form, duration_weeks: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                min={1}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-dark transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !form.title.trim()}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
              "bg-accent hover:bg-accent/90"
            )}
          >
            {isSaving ? "Enregistrement..." : isEditing ? "Enregistrer" : "Creer le module"}
          </button>
        </div>
      </div>
    </>
  );
}
