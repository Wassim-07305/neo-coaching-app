"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  useProfiles,
} from "@/hooks/use-supabase-data";
import type { Appointment, Profile, AppointmentType } from "@/lib/supabase/types";

interface AppointmentFormModalProps {
  appointment?: Appointment & { client?: Profile };
  coachId: string;
  onClose: () => void;
  onSaved: () => void;
}

const appointmentTypes: { value: AppointmentType; label: string }[] = [
  { value: "discovery", label: "Decouverte" },
  { value: "coaching", label: "Coaching" },
  { value: "module_review", label: "Review module" },
  { value: "intervenant", label: "Intervenant" },
];

export function AppointmentFormModal({
  appointment,
  coachId,
  onClose,
  onSaved,
}: AppointmentFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: profiles } = useProfiles({ status: "active" });
  const clients = profiles?.filter((p) =>
    ["coachee", "salarie"].includes(p.role)
  );

  // Form state
  const [clientId, setClientId] = useState(appointment?.client_id || "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<AppointmentType>(appointment?.type || "coaching");
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [zoomLink, setZoomLink] = useState(appointment?.zoom_link || "");

  // Initialize form with appointment data
  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.datetime_start);
      setDate(startDate.toISOString().split("T")[0]);
      setStartTime(
        startDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      // Calculate duration
      const endDate = new Date(appointment.datetime_end);
      const durationMinutes = Math.round(
        (endDate.getTime() - startDate.getTime()) / 60000
      );
      setDuration(durationMinutes);
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime) {
      toast("Veuillez remplir la date et l'heure", "error");
      return;
    }

    setLoading(true);

    try {
      const datetimeStart = new Date(`${date}T${startTime}:00`);
      const datetimeEnd = new Date(datetimeStart.getTime() + duration * 60000);

      if (appointment) {
        // Update existing appointment
        const { error } = await updateAppointment(appointment.id, {
          client_id: clientId || undefined,
          datetime_start: datetimeStart.toISOString(),
          datetime_end: datetimeEnd.toISOString(),
          type,
          notes: notes || undefined,
          zoom_link: zoomLink || undefined,
        });

        if (error) throw error;
        toast("Rendez-vous mis a jour", "success");
      } else {
        // Create new appointment
        const { error } = await createAppointment({
          client_id: clientId || undefined,
          coach_id: coachId,
          datetime_start: datetimeStart.toISOString(),
          datetime_end: datetimeEnd.toISOString(),
          type,
          notes: notes || undefined,
        });

        if (error) throw error;
        toast("Rendez-vous cree", "success");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast("Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!appointment) return;

    setDeleting(true);

    try {
      const { error } = await deleteAppointment(appointment.id);
      if (error) throw error;

      toast("Rendez-vous supprime", "success");
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const isEditing = !!appointment;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark">
                {isEditing ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
              </h2>
              {isEditing && appointment.client && (
                <p className="text-xs text-gray-500">
                  avec {appointment.client.first_name} {appointment.client.last_name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {showDeleteConfirm ? (
            <div className="space-y-4">
              <div className="p-4 bg-danger/10 rounded-lg">
                <p className="text-sm text-danger font-medium">
                  Etes-vous sur de vouloir supprimer ce rendez-vous ?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Cette action est irreversible.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Client (optionnel)
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">-- Prospect externe --</option>
                  {clients?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Type de rendez-vous
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AppointmentType)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {appointmentTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Duree
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h30</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>

              {/* Zoom Link */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Lien Zoom (optionnel)
                </label>
                <input
                  type="url"
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Notes (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Informations supplementaires..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  {isEditing ? "Enregistrer" : "Creer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
