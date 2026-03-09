"use client";

import { useState } from "react";
import { X, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type CoacheeType = "individuel" | "entreprise";

interface CreateCoacheeModalProps {
  onClose: () => void;
  onCreated?: (coachee: {
    first_name: string;
    last_name: string;
    email: string;
    type: CoacheeType;
    company_name?: string;
  }) => void;
}

export function CreateCoacheeModal({ onClose, onCreated }: CreateCoacheeModalProps) {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<CoacheeType>("individuel");
  const [companyName, setCompanyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast("Veuillez remplir tous les champs obligatoires", "warning");
      return;
    }

    if (type === "entreprise" && !companyName.trim()) {
      toast("Veuillez indiquer le nom de l'entreprise", "warning");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Veuillez entrer une adresse email valide", "warning");
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Create in Supabase profiles table with role 'coachee'
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast(`Coachee ${firstName} ${lastName} cree avec succes`, "success");
      onCreated?.({
        first_name: firstName,
        last_name: lastName,
        email,
        type,
        company_name: type === "entreprise" ? companyName : undefined,
      });
      onClose();
    } catch {
      toast("Erreur lors de la creation du coachee", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-heading font-semibold text-lg text-dark">
            Nouveau coachee
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
          {/* Type selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de coachee
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("individuel")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                  type === "individuel"
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    type === "individuel"
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-dark text-sm">Individuel</p>
                  <p className="text-xs text-gray-500">Client particulier</p>
                </div>
              </button>
              <button
                onClick={() => setType("entreprise")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                  type === "entreprise"
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    type === "entreprise"
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-dark text-sm">Entreprise</p>
                  <p className="text-xs text-gray-500">Salarie en mission</p>
                </div>
              </button>
            </div>
          </div>

          {/* First name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prenom <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: Marie"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
          </div>

          {/* Last name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Dupont"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: marie.dupont@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            />
          </div>

          {/* Company name (only for entreprise) */}
          {type === "entreprise" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Acme Corp"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
              />
            </div>
          )}
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
            disabled={!firstName.trim() || !lastName.trim() || !email.trim() || isCreating}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creation...
              </>
            ) : (
              "Creer le coachee"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
