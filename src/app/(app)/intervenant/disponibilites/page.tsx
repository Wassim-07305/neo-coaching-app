"use client";

import { useState } from "react";
import { Clock, Plus, Save, Trash2, Check } from "lucide-react";
import {
  getIntervenantDisponibilites,
  getDayName,
  type IntervenantDisponibilite,
} from "@/lib/mock-data-intervenant";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function IntervenantDisponibilitesPage() {
  const { toast } = useToast();
  const initialDispos = getIntervenantDisponibilites();
  const [disponibilites, setDisponibilites] = useState<IntervenantDisponibilite[]>(initialDispos);
  const [hasChanges, setHasChanges] = useState(false);

  // Group by day
  const groupedByDay = disponibilites.reduce(
    (acc, dispo) => {
      if (!acc[dispo.day_of_week]) {
        acc[dispo.day_of_week] = [];
      }
      acc[dispo.day_of_week].push(dispo);
      return acc;
    },
    {} as Record<number, IntervenantDisponibilite[]>
  );

  const handleToggle = (id: string) => {
    setDisponibilites((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
    setHasChanges(true);
  };

  const handleUpdateTime = (id: string, field: "start_time" | "end_time", value: string) => {
    setDisponibilites((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    setDisponibilites((prev) => prev.filter((d) => d.id !== id));
    setHasChanges(true);
  };

  const handleAddSlot = (dayOfWeek: number) => {
    const newSlot: IntervenantDisponibilite = {
      id: `new-${Date.now()}`,
      day_of_week: dayOfWeek,
      start_time: "09:00",
      end_time: "12:00",
      is_active: true,
    };
    setDisponibilites((prev) => [...prev, newSlot]);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    toast("Disponibilites enregistrees avec succes", "success");
    setHasChanges(false);
  };

  // Days to show (Mon-Fri)
  const workDays = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">
            Mes disponibilites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Definissez vos creneaux disponibles pour les reservations
          </p>
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/90 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-sm text-dark">
          <p className="font-medium">Fonctionnement</p>
          <p className="text-gray-600 mt-1">
            Les clients peuvent reserver uniquement sur les creneaux actifs. Vous pouvez
            definir plusieurs plages horaires par jour. Les reservations existantes ne
            seront pas affectees par les modifications.
          </p>
        </div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workDays.map((dayOfWeek) => {
          const daySlots = groupedByDay[dayOfWeek] || [];
          const activeSlots = daySlots.filter((d) => d.is_active);

          return (
            <div
              key={dayOfWeek}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-dark">
                  {getDayName(dayOfWeek)}
                </h3>
                <span className="text-xs text-gray-400">
                  {activeSlots.length} creneau{activeSlots.length !== 1 ? "x" : ""} actif
                  {activeSlots.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      slot.is_active
                        ? "border-accent/30 bg-accent/5"
                        : "border-gray-200 bg-gray-50 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(slot.id)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          slot.is_active
                            ? "border-success bg-success text-white"
                            : "border-gray-300 bg-white"
                        )}
                      >
                        {slot.is_active && <Check className="w-4 h-4" />}
                      </button>

                      {/* Time inputs */}
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) =>
                            handleUpdateTime(slot.id, "start_time", e.target.value)
                          }
                          className="px-2 py-1 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) =>
                            handleUpdateTime(slot.id, "end_time", e.target.value)
                          }
                          className="px-2 py-1 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-gray-400 hover:text-danger transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add slot button */}
                <button
                  onClick={() => handleAddSlot(dayOfWeek)}
                  className="w-full p-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un creneau
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button (mobile) */}
      {hasChanges && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success hover:bg-success/90 text-white rounded-xl font-medium shadow-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Enregistrer les modifications
          </button>
        </div>
      )}
    </div>
  );
}
