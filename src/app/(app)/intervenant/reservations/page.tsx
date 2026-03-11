"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Video,
  XCircle,
  AlertCircle,
  Filter,
  Loader2,
} from "lucide-react";
import {
  getIntervenantReservations,
  type IntervenantReservation,
} from "@/lib/mock-data-intervenant";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useAppointments, updateAppointmentStatus } from "@/hooks/use-supabase-data";

type StatusFilter = "all" | "scheduled" | "completed" | "cancelled" | "no_show";

const statusConfig: Record<
  IntervenantReservation["status"],
  { label: string; color: string; icon: React.ElementType }
> = {
  scheduled: { label: "Planifiee", color: "bg-blue-100 text-blue-700", icon: Clock },
  completed: { label: "Terminee", color: "bg-success/10 text-success", icon: CheckCircle },
  cancelled: { label: "Annulee", color: "bg-gray-100 text-gray-500", icon: XCircle },
  no_show: { label: "Absent", color: "bg-danger/10 text-danger", icon: AlertCircle },
};

export default function IntervenantReservationsPage() {
  const { toast } = useToast();
  const { profile, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedReservation, setSelectedReservation] = useState<IntervenantReservation | null>(
    null
  );

  // Fetch appointments for this intervenant (coach)
  const { data: appointments, loading: appointmentsLoading } = useAppointments({
    coach_id: profile?.id,
  });

  // Transform Supabase appointments to IntervenantReservation format
  const reservations = useMemo<IntervenantReservation[]>(() => {
    if (appointments && appointments.length > 0) {
      return appointments.map((appt) => {
        const durationMinutes = differenceInMinutes(
          new Date(appt.datetime_end),
          new Date(appt.datetime_start)
        );
        const hours = Math.ceil(durationMinutes / 60);
        const packageHours = (hours <= 2 ? 2 : hours <= 4 ? 4 : 6) as 2 | 4 | 6;

        return {
          id: appt.id,
          client_name: appt.client ? `${appt.client.first_name} ${appt.client.last_name}` : "Client",
          client_email: appt.client?.email || "",
          client_phone: "",
          datetime_start: appt.datetime_start,
          datetime_end: appt.datetime_end,
          status: (appt.status || "scheduled") as IntervenantReservation["status"],
          zoom_link: appt.zoom_link || null,
          notes: appt.notes || null,
          package_hours: packageHours,
        };
      });
    }
    // Fallback to mock data
    return getIntervenantReservations();
  }, [appointments]);

  const isLoading = authLoading || appointmentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const now = new Date();

  const filteredReservations = reservations
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => parseISO(b.datetime_start).getTime() - parseISO(a.datetime_start).getTime());

  // Separate upcoming vs past
  const upcoming = filteredReservations.filter(
    (r) => r.status === "scheduled" && isAfter(parseISO(r.datetime_start), now)
  );
  const past = filteredReservations.filter(
    (r) => r.status !== "scheduled" || isBefore(parseISO(r.datetime_start), now)
  );

  const handleMarkCompleted = async (reservation: IntervenantReservation) => {
    try {
      const { error } = await updateAppointmentStatus(reservation.id, "completed");
      if (error) throw error;
      toast(`Session avec ${reservation.client_name} marquee comme terminee`, "success");
      setSelectedReservation(null);
    } catch {
      toast("Erreur lors de la mise a jour", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">
            Mes reservations
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerez vos sessions de coaching
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="all">Toutes</option>
            <option value="scheduled">Planifiees</option>
            <option value="completed">Terminees</option>
            <option value="cancelled">Annulees</option>
            <option value="no_show">Absents</option>
          </select>
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Sessions a venir ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onSelect={() => setSelectedReservation(reservation)}
                isUpcoming
              />
            ))}
          </div>
        </div>
      )}

      {/* Past / All */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Historique ({past.length})
        </h2>
        {past.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune reservation trouvee</p>
          </div>
        ) : (
          <div className="space-y-3">
            {past.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onSelect={() => setSelectedReservation(reservation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-dark">
                  Details de la reservation
                </h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Client info */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="font-medium text-dark text-lg">
                    {selectedReservation.client_name}
                  </p>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`mailto:${selectedReservation.client_email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedReservation.client_email}
                  </a>
                </div>

                <a
                  href={`tel:${selectedReservation.client_phone}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent"
                >
                  <Phone className="w-4 h-4" />
                  {selectedReservation.client_phone}
                </a>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-dark">
                      {format(parseISO(selectedReservation.datetime_start), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Horaire</p>
                    <p className="font-medium text-dark">
                      {format(parseISO(selectedReservation.datetime_start), "HH:mm")} -{" "}
                      {format(parseISO(selectedReservation.datetime_end), "HH:mm")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Package</p>
                    <p className="font-medium text-dark">
                      {selectedReservation.package_hours} heures
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    <span
                      className={cn(
                        "inline-block text-xs px-2 py-1 rounded-full mt-1",
                        statusConfig[selectedReservation.status].color
                      )}
                    >
                      {statusConfig[selectedReservation.status].label}
                    </span>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedReservation.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                {selectedReservation.status === "scheduled" &&
                  selectedReservation.zoom_link && (
                    <a
                      href={selectedReservation.zoom_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      Rejoindre la session Zoom
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                {selectedReservation.status === "scheduled" && (
                  <button
                    onClick={() => handleMarkCompleted(selectedReservation)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success hover:bg-success/90 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Marquer comme terminee
                  </button>
                )}

                <button
                  onClick={() => setSelectedReservation(null)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationCard({
  reservation,
  onSelect,
  isUpcoming,
}: {
  reservation: IntervenantReservation;
  onSelect: () => void;
  isUpcoming?: boolean;
}) {
  const config = statusConfig[reservation.status];
  const StatusIcon = config.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all",
        isUpcoming
          ? "border-accent/30 bg-accent/5 hover:border-accent"
          : "border-gray-100 bg-gray-50 hover:border-gray-200"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-dark">{reservation.client_name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {format(parseISO(reservation.datetime_start), "EEEE d MMMM yyyy - HH:mm", {
              locale: fr,
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Package {reservation.package_hours}h
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={cn("text-xs px-2 py-1 rounded-full flex items-center gap-1", config.color)}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
          {isUpcoming && reservation.zoom_link && (
            <span className="text-xs text-accent flex items-center gap-1">
              <Video className="w-3 h-3" />
              Zoom
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
