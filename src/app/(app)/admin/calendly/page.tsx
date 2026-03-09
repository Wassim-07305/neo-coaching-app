"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Mail,
  User,
  ExternalLink,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockCalendlyEvents,
  getUpcomingCalendlyEvents,
  getPastCalendlyEvents,
  getCalendlyStats,
  locationTypeLabels,
  type CalendlyEvent,
} from "@/lib/mock-data-calendly";
import { useToast } from "@/components/ui/toast";

type TabFilter = "upcoming" | "past" | "all";

const locationIcons: Record<string, typeof Video> = {
  zoom: Video,
  google_conference: Video,
  teams: Video,
  outbound_call: Phone,
  inbound_call: Phone,
  physical: MapPin,
};

export default function CalendlyPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<TabFilter>("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<CalendlyEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = getCalendlyStats();

  const events =
    tab === "upcoming"
      ? getUpcomingCalendlyEvents()
      : tab === "past"
      ? getPastCalendlyEvents()
      : mockCalendlyEvents;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Call Calendly API to refresh events
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast("Donnees Calendly synchronisees", "success");
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Calendly
            </h1>
            <p className="text-sm text-gray-500">
              Reservations et reponses des accompagnements individuels
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <RefreshCw
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
            />
            Synchroniser
          </button>
          <button
            onClick={() => toast("Configuration Calendly a venir", "info")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configurer
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.upcoming}</p>
              <p className="text-xs text-gray-500">A venir</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.thisMonth}</p>
              <p className="text-xs text-gray-500">Ce mois</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.canceled}</p>
              <p className="text-xs text-gray-500">Annulees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["upcoming", "past", "all"] as TabFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "upcoming"
              ? "A venir"
              : t === "past"
              ? "Passees"
              : "Toutes"}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {events.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Aucune reservation {tab === "upcoming" ? "a venir" : ""}.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((event) => {
              const LocationIcon =
                locationIcons[event.location?.type || ""] || Calendar;
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Date block */}
                    <div className="text-center w-14 shrink-0">
                      <p className="text-xs text-gray-500 uppercase">
                        {format(new Date(event.start_time), "EEE", {
                          locale: fr,
                        })}
                      </p>
                      <p className="text-2xl font-bold text-dark">
                        {format(new Date(event.start_time), "d")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.start_time), "MMM", {
                          locale: fr,
                        })}
                      </p>
                    </div>

                    {/* Event info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                            event.status === "active"
                              ? "bg-success/10 text-success"
                              : event.status === "canceled"
                              ? "bg-danger/10 text-danger"
                              : "bg-warning/10 text-warning"
                          )}
                        >
                          {event.status === "active"
                            ? "Confirmee"
                            : event.status === "canceled"
                            ? "Annulee"
                            : "Reportee"}
                        </span>
                        {event.invitee.questions_and_answers &&
                          event.invitee.questions_and_answers.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-accent">
                              <MessageSquare className="w-3 h-3" />
                              {event.invitee.questions_and_answers.length}{" "}
                              reponses
                            </span>
                          )}
                      </div>
                      <p className="text-sm font-medium text-dark">
                        {event.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {event.invitee.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(event.start_time), "HH:mm")} -{" "}
                          {format(new Date(event.end_time), "HH:mm")}
                        </span>
                        <span className="flex items-center gap-1">
                          <LocationIcon className="w-3 h-3" />
                          {locationTypeLabels[event.location?.type || ""] ||
                            "Non defini"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

// Event detail modal
function EventDetailModal({
  event,
  onClose,
}: {
  event: CalendlyEvent;
  onClose: () => void;
}) {
  const LocationIcon = locationIcons[event.location?.type || ""] || Calendar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-start justify-between sticky top-0 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                  event.status === "active"
                    ? "bg-success/10 text-success"
                    : event.status === "canceled"
                    ? "bg-danger/10 text-danger"
                    : "bg-warning/10 text-warning"
                )}
              >
                {event.status === "active"
                  ? "Confirmee"
                  : event.status === "canceled"
                  ? "Annulee"
                  : "Reportee"}
              </span>
            </div>
            <h2 className="font-heading font-semibold text-lg text-dark">
              {event.name}
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
          {/* Date and time */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-center shrink-0">
                <p className="text-xs text-gray-500 uppercase">
                  {format(new Date(event.start_time), "EEEE", { locale: fr })}
                </p>
                <p className="text-3xl font-bold text-dark">
                  {format(new Date(event.start_time), "d")}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.start_time), "MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="flex-1 border-l border-gray-200 pl-4">
                <div className="flex items-center gap-2 text-dark">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="font-medium">
                    {format(new Date(event.start_time), "HH:mm")} -{" "}
                    {format(new Date(event.end_time), "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <LocationIcon className="w-4 h-4" />
                  <span>
                    {locationTypeLabels[event.location?.type || ""] ||
                      "Non defini"}
                  </span>
                </div>
                {event.location?.location && (
                  <p className="text-xs text-gray-400 mt-1">
                    {event.location.location}
                  </p>
                )}
                {event.location?.join_url && (
                  <a
                    href={event.location.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                  >
                    Rejoindre <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Invitee info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Participant
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium">
                  {event.invitee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-dark">{event.invitee.name}</p>
                  <p className="text-xs text-gray-500">
                    {event.invitee.timezone}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {event.invitee.email}
                </div>
                {event.invitee.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {event.invitee.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Questions and answers */}
          {event.invitee.questions_and_answers &&
            event.invitee.questions_and_answers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Reponses du formulaire
                </h3>
                <div className="space-y-3">
                  {event.invitee.questions_and_answers.map((qa, idx) => (
                    <div
                      key={idx}
                      className="bg-accent/5 border border-accent/10 rounded-xl p-4"
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {qa.question}
                      </p>
                      <p className="text-sm text-dark">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Actions */}
          {event.status === "active" && (
            <div className="flex gap-3 pt-2">
              {event.reschedule_url && (
                <a
                  href={event.reschedule_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium text-center hover:bg-gray-50 transition-colors"
                >
                  Reporter
                </a>
              )}
              {event.cancel_url && (
                <a
                  href={event.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 border border-danger/30 text-danger rounded-lg text-sm font-medium text-center hover:bg-danger/5 transition-colors"
                >
                  Annuler
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
