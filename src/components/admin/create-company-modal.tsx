"use client";

import { useState } from "react";
import { X, Building2, User, Mail, Calendar, Target, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CreateCompanyModalProps {
  onClose: () => void;
  onCreated?: (company: {
    name: string;
    dirigeant_name: string;
    dirigeant_email: string;
    mission_start: string;
    mission_end: string;
    objectives: string[];
  }) => void;
}

export function CreateCompanyModal({ onClose, onCreated }: CreateCompanyModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dirigeantName, setDirigeantName] = useState("");
  const [dirigeantEmail, setDirigeantEmail] = useState("");
  const [missionStart, setMissionStart] = useState("");
  const [missionEnd, setMissionEnd] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [isCreating, setIsCreating] = useState(false);

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const updateObjective = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !dirigeantName.trim() || !dirigeantEmail.trim()) {
      toast("Veuillez remplir tous les champs obligatoires", "warning");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dirigeantEmail)) {
      toast("Veuillez entrer une adresse email valide", "warning");
      return;
    }

    setIsCreating(true);
    try {
      // Split dirigeant name into first and last
      const nameParts = dirigeantName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || firstName;

      // Build KPI objectives object
      const kpiObjectives: Record<string, boolean> = {};
      objectives.filter((o) => o.trim()).forEach((o) => {
        kpiObjectives[o.trim()] = false;
      });

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          dirigeantEmail: dirigeantEmail.trim(),
          dirigeantFirstName: firstName,
          dirigeantLastName: lastName,
          missionStartDate: missionStart || null,
          missionEndDate: missionEnd || null,
          kpiObjectives: Object.keys(kpiObjectives).length > 0 ? kpiObjectives : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de la creation");
      }

      const tempPassword = result.data?.dirigeant?.tempPassword;
      let successMessage = `Entreprise "${name}" creee avec succes.`;
      if (tempPassword) {
        successMessage += ` Mot de passe temporaire du dirigeant: ${tempPassword}`;
      }

      toast(successMessage, "success");
      onCreated?.({
        name,
        dirigeant_name: dirigeantName,
        dirigeant_email: dirigeantEmail,
        mission_start: missionStart,
        mission_end: missionEnd,
        objectives: objectives.filter((o) => o.trim()),
      });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la creation de l'entreprise";
      toast(message, "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-heading font-semibold text-lg text-dark">
              Nouvelle entreprise
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Nom de l&apos;entreprise <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Acme Corporation"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
          </div>

          {/* Dirigeant section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-dark flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact dirigeant
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={dirigeantName}
                onChange={(e) => setDirigeantName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={dirigeantEmail}
                onChange={(e) => setDirigeantEmail(e.target.value)}
                placeholder="Ex: jean.dupont@entreprise.fr"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Une invitation sera envoyee a cette adresse pour creer son compte.
              </p>
            </div>
          </div>

          {/* Mission dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Debut mission
              </label>
              <input
                type="date"
                value={missionStart}
                onChange={(e) => setMissionStart(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fin mission
              </label>
              <input
                type="date"
                value={missionEnd}
                onChange={(e) => setMissionEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Objectifs de la mission
            </label>
            <div className="space-y-2">
              {objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Objectif ${index + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                  {objectives.length > 1 && (
                    <button
                      onClick={() => removeObjective(index)}
                      className="px-3 text-gray-400 hover:text-danger transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addObjective}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <Plus className="w-3 h-3" />
                Ajouter un objectif
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || !dirigeantName.trim() || !dirigeantEmail.trim() || isCreating}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creation...
              </>
            ) : (
              "Creer l&apos;entreprise"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
