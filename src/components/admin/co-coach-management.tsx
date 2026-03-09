"use client";

import { useState } from "react";
import { Users, Shield, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Permission =
  | "view_coachees"
  | "edit_coachees"
  | "view_kpi"
  | "edit_kpi"
  | "manage_rdv"
  | "view_messages"
  | "send_messages"
  | "view_reports"
  | "manage_modules";

const permissionLabels: Record<Permission, string> = {
  view_coachees: "Voir les coachés",
  edit_coachees: "Modifier les coachés",
  view_kpi: "Voir les KPIs",
  edit_kpi: "Modifier les KPIs",
  manage_rdv: "Gérer les RDV",
  view_messages: "Voir les messages",
  send_messages: "Envoyer des messages",
  view_reports: "Voir les rapports",
  manage_modules: "Gérer les modules",
};

interface CoCoach {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
  assignedGroups: string[];
  active: boolean;
}

const mockCoCoaches: CoCoach[] = [
  {
    id: "cc1",
    name: "Sophie Martin",
    email: "sophie.martin@neo-coaching.fr",
    permissions: ["view_coachees", "view_kpi", "manage_rdv", "view_messages", "send_messages"],
    assignedGroups: ["Groupe A - Techniciens", "Groupe B - Managers"],
    active: true,
  },
  {
    id: "cc2",
    name: "Thomas Durand",
    email: "thomas.durand@neo-coaching.fr",
    permissions: ["view_coachees", "view_kpi", "view_messages"],
    assignedGroups: ["Groupe C - Direction"],
    active: true,
  },
];

export function CoCoachManagement() {
  const [coaches, setCoaches] = useState<CoCoach[]>(mockCoCoaches);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const togglePermission = (coachId: string, perm: Permission) => {
    setCoaches((prev) =>
      prev.map((c) => {
        if (c.id !== coachId) return c;
        const has = c.permissions.includes(perm);
        return {
          ...c,
          permissions: has
            ? c.permissions.filter((p) => p !== perm)
            : [...c.permissions, perm],
        };
      })
    );
  };

  const toggleActive = (coachId: string) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === coachId ? { ...c, active: !c.active } : c))
    );
  };

  const removeCoach = (coachId: string) => {
    setCoaches((prev) => prev.filter((c) => c.id !== coachId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-[#D4A843]" />
          <h3 className="font-heading text-lg font-bold text-dark">
            Co-coachs & Permissions
          </h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-medium text-white hover:bg-[#c49a3a]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un co-coach
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[#D4A843]/30 bg-[#D4A843]/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Nom complet"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
            />
            <input
              placeholder="Email"
              type="email"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-medium text-white hover:bg-[#c49a3a]"
            >
              Inviter
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className={cn(
              "rounded-xl border bg-white p-5 space-y-4 transition-opacity",
              !coach.active && "opacity-60"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-dark">{coach.name}</h4>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      coach.active
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {coach.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{coach.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setEditingId(editingId === coach.id ? null : coach.id)
                  }
                  className="p-2 text-gray-400 hover:text-[#D4A843] transition-colors"
                  title="Modifier les permissions"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleActive(coach.id)}
                  className="p-2 text-gray-400 hover:text-[#F39C12] transition-colors"
                  title={coach.active ? "Désactiver" : "Activer"}
                >
                  {coach.active ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => removeCoach(coach.id)}
                  className="p-2 text-gray-400 hover:text-[#E74C3C] transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Assigned groups */}
            <div className="flex flex-wrap gap-1.5">
              {coach.assignedGroups.map((g) => (
                <span
                  key={g}
                  className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Permissions grid */}
            {editingId === coach.id && (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Permissions
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(permissionLabels) as Permission[]).map(
                    (perm) => {
                      const has = coach.permissions.includes(perm);
                      return (
                        <button
                          key={perm}
                          onClick={() => togglePermission(coach.id, perm)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-xs text-left transition-colors",
                            has
                              ? "border-[#2D8C4E] bg-[#2D8C4E]/5 text-[#2D8C4E]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          )}
                        >
                          {permissionLabels[perm]}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
