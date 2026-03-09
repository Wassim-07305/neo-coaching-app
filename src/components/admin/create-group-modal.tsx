"use client";

import { useState } from "react";
import { X, Users, Hash, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type GroupType = "entreprise" | "coaching_individuel" | "general";

interface CreateGroupModalProps {
  onClose: () => void;
  onCreated?: (group: { name: string; type: GroupType }) => void;
}

const typeOptions: { value: GroupType; label: string; description: string; icon: typeof Users }[] = [
  {
    value: "entreprise",
    label: "Groupe Entreprise",
    description: "Pour une mission en entreprise (ex: GPE Alpha 2026)",
    icon: Building2,
  },
  {
    value: "coaching_individuel",
    label: "Cohorte Coaching",
    description: "Pour un groupe de coachees individuelles",
    icon: Users,
  },
  {
    value: "general",
    label: "Canal General",
    description: "Pour les annonces globales a tous les utilisateurs",
    icon: Hash,
  },
];

export function CreateGroupModal({ onClose, onCreated }: CreateGroupModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [type, setType] = useState<GroupType>("entreprise");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast("Veuillez entrer un nom pour le groupe", "warning");
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Create in Supabase groups table
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast(`Groupe "${name}" cree avec succes`, "success");
      onCreated?.({ name, type });
      onClose();
    } catch {
      toast("Erreur lors de la creation du groupe", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-lg text-dark">
            Creer un groupe
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: GPE Entreprise Alpha 2026"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
          </div>

          {/* Type selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de groupe
            </label>
            <div className="space-y-2">
              {typeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = type === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setType(option.value)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                      isSelected
                        ? "border-accent bg-accent/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-accent text-white" : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm">{option.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creation...
              </>
            ) : (
              "Creer le groupe"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
