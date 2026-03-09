"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Video,
  ExternalLink,
} from "lucide-react";
import {
  getIntervenantStats,
  getIntervenantReservations,
  formatCurrency,
  type IntervenantReservation,
} from "@/lib/mock-data-intervenant";
import { cn } from "@/lib/utils";
import { format, isAfter, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

const statusConfig: Record<
  IntervenantReservation["status"],
  { label: string; color: string }
> = {
  scheduled: { label: "Planifiee", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminee", color: "bg-success/10 text-success" },
  cancelled: { label: "Annulee", color: "bg-gray-100 text-gray-500" },
  no_show: { label: "Absent", color: "bg-danger/10 text-danger" },
};

export default function IntervenantDashboardPage() {
  const stats = getIntervenantStats();
  const reservations = getIntervenantReservations();
  const now = new Date();

  // Next upcoming session
  const upcomingSessions = reservations
    .filter((r) => r.status === "scheduled" && isAfter(parseISO(r.datetime_start), now))
    .sort((a, b) => parseISO(a.datetime_start).getTime() - parseISO(b.datetime_start).getTime());

  const nextSession = upcomingSessions[0];

  // Recent completed
  const recentCompleted = reservations
    .filter((r) => r.status === "completed")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-dark">
          Tableau de bord
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenue sur votre espace intervenant Neo-Coaching
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total_reservations}</p>
              <p className="text-xs text-gray-500">Reservations totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.completed_sessions}</p>
              <p className="text-xs text-gray-500">Sessions terminees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total_hours}h</p>
              <p className="text-xs text-gray-500">Heures dispensees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">
                {formatCurrency(stats.revenue_cents)}
              </p>
              <p className="text-xs text-gray-500">Revenus (part 50%)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next session */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Prochaine session
            </h2>

            {nextSession ? (
              <div className="bg-gradient-to-r from-primary to-primary-medium rounded-xl p-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-accent font-semibold text-lg">
                      {nextSession.client_name}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      {format(parseISO(nextSession.datetime_start), "EEEE d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                    <p className="text-white font-medium mt-1">
                      {format(parseISO(nextSession.datetime_start), "HH:mm")} -{" "}
                      {format(parseISO(nextSession.datetime_end), "HH:mm")}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Package {nextSession.package_hours}h
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {nextSession.zoom_link && (
                      <a
                        href={nextSession.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        Rejoindre Zoom
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Link
                      href="/intervenant/reservations"
                      className="text-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Voir les details
                    </Link>
                  </div>
                </div>

                {nextSession.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400">Notes :</p>
                    <p className="text-sm text-gray-300 mt-1">{nextSession.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucune session planifiee</p>
              </div>
            )}

            {/* Upcoming list */}
            {upcomingSessions.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3">Sessions a venir</p>
                <div className="space-y-2">
                  {upcomingSessions.slice(1, 4).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-dark">
                          {session.client_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(session.datetime_start), "d MMM - HH:mm", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {session.package_hours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats + rating */}
        <div className="space-y-4">
          {/* Rating */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-heading font-semibold text-dark mb-3">
              Note moyenne
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-6 h-6",
                      star <= Math.floor(stats.average_rating)
                        ? "text-accent fill-accent"
                        : "text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-dark">
                {stats.average_rating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Basee sur {stats.completed_sessions} sessions
            </p>
          </div>

          {/* Recent completed */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-heading font-semibold text-dark mb-3">
              Sessions recentes
            </h3>
            <div className="space-y-3">
              {recentCompleted.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-dark">
                      {session.client_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(parseISO(session.datetime_start), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      statusConfig[session.status].color
                    )}
                  >
                    {statusConfig[session.status].label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/intervenant/reservations"
              className="block text-center text-sm text-accent hover:text-accent/80 mt-4 pt-3 border-t border-gray-100"
            >
              Voir tout l&apos;historique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
