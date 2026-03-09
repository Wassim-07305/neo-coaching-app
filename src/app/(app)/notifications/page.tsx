"use client";

import { useState } from "react";
import {
  Bell,
  Award,
  Clock,
  AlertTriangle,
  MessageSquare,
  Calendar,
  ClipboardList,
  CheckCheck,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/hooks/use-notifications";

const notificationIcons: Record<NotificationType, typeof Award> = {
  module_complete: Award,
  module_reminder: Clock,
  kpi_alert: AlertTriangle,
  message: MessageSquare,
  rdv_reminder: Calendar,
  task_reminder: ClipboardList,
};

const notificationColors: Record<NotificationType, string> = {
  module_complete: "text-success bg-success/10",
  module_reminder: "text-warning bg-warning/10",
  kpi_alert: "text-danger bg-danger/10",
  message: "text-accent bg-accent/10",
  rdv_reminder: "text-blue-500 bg-blue-50",
  task_reminder: "text-purple-500 bg-purple-50",
};

const typeLabels: Record<NotificationType, string> = {
  module_complete: "Modules",
  module_reminder: "Rappels modules",
  kpi_alert: "Alertes KPI",
  message: "Messages",
  rdv_reminder: "Rendez-vous",
  task_reminder: "Travaux",
};

interface FullNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

const allNotifications: FullNotification[] = [
  {
    id: "notif-1",
    type: "module_complete",
    title: "Certificat pret",
    body: "Felicitations ! Votre certificat pour le module 'Intelligence Emotionnelle' est pret a telecharger.",
    link: "/salarie/modules/mod-1",
    read: false,
    createdAt: "2026-03-08T10:00:00",
  },
  {
    id: "notif-2",
    type: "module_reminder",
    title: "Module en attente",
    body: "Vous n'avez pas encore commence le module 'Confiance en soi'. Commencez des maintenant !",
    link: "/salarie/modules/mod-3",
    read: false,
    createdAt: "2026-03-08T08:00:00",
  },
  {
    id: "notif-3",
    type: "kpi_alert",
    title: "Alerte KPI",
    body: "Pierre Leclerc est passe au rouge sur l'indicateur Investissement. Intervention recommandee.",
    link: "/admin/coachees/coach-2",
    read: false,
    createdAt: "2026-03-07T16:00:00",
  },
  {
    id: "notif-4",
    type: "message",
    title: "Nouveau message",
    body: "Sophie Martin a poste un message dans GPE Alpha Corp 2026.",
    link: "/salarie/communaute",
    read: false,
    createdAt: "2026-03-07T14:30:00",
  },
  {
    id: "notif-5",
    type: "rdv_reminder",
    title: "Rappel RDV demain",
    body: "Rappel : votre call coaching est demain a 09h00 avec Marie Dupont.",
    link: "/admin/dashboard",
    read: false,
    createdAt: "2026-03-07T09:00:00",
  },
  {
    id: "notif-6",
    type: "task_reminder",
    title: "Travail a rendre",
    body: "Vous avez un livrable a rendre pour le module 'Confiance en soi'. Date limite : 15 mars.",
    link: "/salarie/modules/mod-3",
    read: false,
    createdAt: "2026-03-06T10:00:00",
  },
  {
    id: "notif-7",
    type: "module_complete",
    title: "Module termine",
    body: "Marie Dupont a termine le module 'Estime de soi' avec un score de 8/10.",
    link: "/admin/coachees/coach-1",
    read: true,
    createdAt: "2026-03-05T15:00:00",
  },
  {
    id: "notif-8",
    type: "message",
    title: "Nouveau message",
    body: "Isabelle Fontaine vous a envoye un message direct.",
    link: "/coaching/communaute",
    read: true,
    createdAt: "2026-03-04T11:00:00",
  },
  {
    id: "notif-9",
    type: "kpi_alert",
    title: "Progression notable",
    body: "Camille Rousseau a atteint un score de 9/10 en investissement. Excellent !",
    link: "/admin/coachees/coach-5",
    read: true,
    createdAt: "2026-03-03T14:00:00",
  },
  {
    id: "notif-10",
    type: "rdv_reminder",
    title: "RDV confirme",
    body: "Votre seance de coaching avec Nicolas Garcia est confirmee pour le 12 mars.",
    link: "/admin/dashboard",
    read: true,
    createdAt: "2026-03-02T09:00:00",
  },
  {
    id: "notif-11",
    type: "task_reminder",
    title: "Livrable en attente",
    body: "Le livrable video de Julie Moreau attend votre validation.",
    link: "/admin/coachees/coach-7",
    read: true,
    createdAt: "2026-03-01T16:00:00",
  },
  {
    id: "notif-12",
    type: "module_reminder",
    title: "Nouveau module disponible",
    body: "Le module 'Prise de parole' est maintenant disponible pour le parcours entreprise.",
    link: "/admin/modules",
    read: true,
    createdAt: "2026-02-28T10:00:00",
  },
  {
    id: "notif-13",
    type: "rdv_reminder",
    title: "RDV annule",
    body: "La seance du 26 fevrier avec Thomas Petit a ete annulee a sa demande.",
    link: "/admin/dashboard",
    read: true,
    createdAt: "2026-02-25T11:00:00",
  },
  {
    id: "notif-14",
    type: "kpi_alert",
    title: "Alerte decrochage",
    body: "Emilie Leroy n'a pas ete active depuis 30 jours. Risque de decrochage.",
    link: "/admin/coachees/coach-10",
    read: true,
    createdAt: "2026-02-20T08:00:00",
  },
];

type FilterType = "tous" | NotificationType;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date("2026-03-08T12:00:00");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "A l'instant";
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<FullNotification[]>(allNotifications);
  const [filterType, setFilterType] = useState<FilterType>("tous");
  const [filterRead, setFilterRead] = useState<"tous" | "non_lues" | "lues">(
    "tous"
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filterType !== "tous" && n.type !== filterType) return false;
    if (filterRead === "non_lues" && n.read) return false;
    if (filterRead === "lues" && !n.read) return false;
    return true;
  });

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Group by date
  const today = new Date("2026-03-08");
  const groups: { label: string; items: FullNotification[] }[] = [];
  const todayItems = filtered.filter(
    (n) => new Date(n.createdAt).toDateString() === today.toDateString()
  );
  const yesterdayItems = filtered.filter((n) => {
    const d = new Date(n.createdAt);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  });
  const olderItems = filtered.filter((n) => {
    const d = new Date(n.createdAt);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return d < yesterday;
  });

  if (todayItems.length > 0) groups.push({ label: "Aujourd'hui", items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: "Hier", items: yesterdayItems });
  if (olderItems.length > 0) groups.push({ label: "Plus ancien", items: olderItems });

  const typeFilters: { key: FilterType; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "kpi_alert", label: "Alertes" },
    { key: "message", label: "Messages" },
    { key: "rdv_reminder", label: "RDV" },
    { key: "module_complete", label: "Modules" },
    { key: "task_reminder", label: "Travaux" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back + Header */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-2xl font-bold text-dark">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-danger text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                filterType === f.key
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-accent/50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 sm:ml-auto">
          {(["tous", "non_lues", "lues"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterRead(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                filterRead === f
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
              )}
            >
              {f === "tous" ? "Toutes" : f === "non_lues" ? "Non lues" : "Lues"}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list grouped */}
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.label}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.label}
            </h2>
            <div className="space-y-2">
              {group.items.map((notif) => {
                const Icon = notificationIcons[notif.type];
                const colorClass = notificationColors[notif.type];

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "bg-white rounded-xl border p-4 flex items-start gap-4 transition-all group",
                      !notif.read
                        ? "border-accent/30 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                        colorClass
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={cn(
                              "text-sm",
                              !notif.read
                                ? "font-semibold text-dark"
                                : "font-medium text-gray-600"
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notif.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && (
                            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 rounded text-gray-300 hover:text-danger hover:bg-danger/5 opacity-0 group-hover:opacity-100 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-400">
                          {formatDate(notif.createdAt)}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                            colorClass
                          )}
                        >
                          {typeLabels[notif.type]}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-[10px] text-accent hover:underline font-medium"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Aucune notification ne correspond aux filtres.
          </p>
          <button
            onClick={() => {
              setFilterType("tous");
              setFilterRead("tous");
            }}
            className="mt-2 text-xs text-accent font-medium hover:underline"
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
}
