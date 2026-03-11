"use client";

import { useState, useCallback, useEffect } from "react";
import { createUntypedClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from Supabase
  useEffect(() => {
    async function fetchNotifications() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createUntypedClient();
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Error fetching notifications:", error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const transformed: Notification[] = data.map((n: {
            id: string;
            type: string;
            title: string;
            body: string;
            link: string;
            is_read: boolean;
            created_at: string;
          }) => ({
            id: n.id,
            type: n.type as NotificationType,
            title: n.title,
            body: n.body,
            link: n.link || "#",
            read: n.is_read,
            createdAt: n.created_at,
            timeLabel: formatDistanceToNow(new Date(n.created_at), {
              addSuffix: false,
              locale: fr,
            }).replace("environ ", ""),
          }));
          setNotifications(transformed);
        }
      } catch (err) {
        console.error("Error in useNotifications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(async (id: string) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // Update in Supabase if userId is provided
    if (userId) {
      try {
        const supabase = createUntypedClient();
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", id);
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
  }, [userId]);

  const markAllAsRead = useCallback(async () => {
    // Optimistically update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Update in Supabase if userId is provided
    if (userId) {
      try {
        const supabase = createUntypedClient();
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", userId)
          .eq("is_read", false);
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
      }
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
  };
}
