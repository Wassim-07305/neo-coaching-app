"use client";

import { useState, useCallback } from "react";

export type NotificationType =
  | "module_complete"
  | "module_reminder"
  | "kpi_alert"
  | "message"
  | "rdv_reminder"
  | "task_reminder";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
  timeLabel: string;
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "module_complete",
    title: "Certificat pret",
    body: "Felicitations ! Votre certificat pour le module 'Intelligence Emotionnelle' est pret a telecharger.",
    link: "/salarie/modules/mod-1",
    read: false,
    createdAt: "2026-02-26T10:00:00",
    timeLabel: "Il y a 30 min",
  },
  {
    id: "notif-2",
    type: "module_reminder",
    title: "Module en attente",
    body: "Vous n'avez pas encore commence le module 'Confiance en soi'. Commencez des maintenant !",
    link: "/salarie/modules/mod-3",
    read: false,
    createdAt: "2026-02-26T08:00:00",
    timeLabel: "Il y a 2h",
  },
  {
    id: "notif-3",
    type: "kpi_alert",
    title: "Alerte KPI",
    body: "Pierre Leclerc est passe au rouge sur l'indicateur Investissement.",
    link: "/admin/coachees/coach-2",
    read: false,
    createdAt: "2026-02-25T16:00:00",
    timeLabel: "Hier",
  },
  {
    id: "notif-4",
    type: "message",
    title: "Nouveau message",
    body: "Sophie Martin a poste un message dans GPE Alpha Corp 2026.",
    link: "/salarie/communaute",
    read: false,
    createdAt: "2026-02-25T14:30:00",
    timeLabel: "Hier",
  },
  {
    id: "notif-5",
    type: "rdv_reminder",
    title: "Rappel RDV",
    body: "Rappel : votre call coaching est demain a 14h avec Jean-Claude.",
    link: "/salarie/dashboard",
    read: false,
    createdAt: "2026-02-25T09:00:00",
    timeLabel: "Hier",
  },
  {
    id: "notif-6",
    type: "task_reminder",
    title: "Travail a rendre",
    body: "Vous avez un livrable a rendre pour le module 'Confiance en soi'. Date limite : 1er mars.",
    link: "/salarie/modules/mod-3",
    read: false,
    createdAt: "2026-02-24T10:00:00",
    timeLabel: "Il y a 2 jours",
  },
  {
    id: "notif-7",
    type: "module_complete",
    title: "Module termine",
    body: "Marie Dupont a termine le module 'Estime de soi' avec un score de 8/10.",
    link: "/admin/coachees/coach-1",
    read: true,
    createdAt: "2026-02-23T15:00:00",
    timeLabel: "Il y a 3 jours",
  },
  {
    id: "notif-8",
    type: "message",
    title: "Nouveau message",
    body: "Isabelle Fontaine vous a envoye un message direct.",
    link: "/coaching/communaute",
    read: true,
    createdAt: "2026-02-22T11:00:00",
    timeLabel: "Il y a 4 jours",
  },
  {
    id: "notif-9",
    type: "kpi_alert",
    title: "Progression notable",
    body: "Camille Rousseau a atteint un score de 9/10 en investissement. Excellent !",
    link: "/admin/coachees/coach-5",
    read: true,
    createdAt: "2026-02-21T14:00:00",
    timeLabel: "Il y a 5 jours",
  },
  {
    id: "notif-10",
    type: "rdv_reminder",
    title: "RDV confirme",
    body: "Votre seance de coaching avec Nicolas Garcia est confirmee pour le 28 fevrier.",
    link: "/admin/rdv",
    read: true,
    createdAt: "2026-02-20T09:00:00",
    timeLabel: "Il y a 6 jours",
  },
  {
    id: "notif-11",
    type: "task_reminder",
    title: "Livrable en attente",
    body: "Le livrable video de Julie Moreau attend votre validation.",
    link: "/admin/coachees/coach-7",
    read: true,
    createdAt: "2026-02-19T16:00:00",
    timeLabel: "Il y a 1 semaine",
  },
  {
    id: "notif-12",
    type: "module_reminder",
    title: "Nouveau module disponible",
    body: "Le module 'Prise de parole' est maintenant disponible pour le parcours entreprise.",
    link: "/admin/modules",
    read: true,
    createdAt: "2026-02-18T10:00:00",
    timeLabel: "Il y a 1 semaine",
  },
];

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
