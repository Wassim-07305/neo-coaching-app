// ===========================================================================
// Mock Data for Community / Messaging
// Replace with Supabase real-time queries when the database is ready.
// ===========================================================================

export interface MockGroup {
  id: string;
  name: string;
  type: "general" | "gpe" | "coaching" | "dm";
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  members: string[];
}

export interface MockMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  timeLabel: string;
  isPinned: boolean;
  attachment?: {
    name: string;
    type: "pdf" | "image" | "audio";
    size: string;
  };
}

export const mockGroups: MockGroup[] = [
  {
    id: "grp-general",
    name: "Canal General",
    type: "general",
    memberCount: 15,
    lastMessage: "Bienvenue a tous ! N'hesitez pas a partager vos experiences.",
    lastMessageTime: "10:30",
    unreadCount: 3,
    members: [
      "Jean-Claude",
      "Marie Dupont",
      "Pierre Leclerc",
      "Sophie Martin",
      "Camille Rousseau",
      "Isabelle Fontaine",
    ],
  },
  {
    id: "grp-gpe",
    name: "GPE Alpha Corp 2026",
    type: "gpe",
    memberCount: 5,
    lastMessage: "Le prochain atelier collectif est prevu le 5 mars.",
    lastMessageTime: "Hier",
    unreadCount: 1,
    members: [
      "Jean-Claude",
      "Marie Dupont",
      "Pierre Leclerc",
      "Sophie Martin",
      "Antoine Bernard",
    ],
  },
  {
    id: "grp-coaching",
    name: "Coaching Individuel Jan 2026",
    type: "coaching",
    memberCount: 4,
    lastMessage: "Isabelle, ton dernier livrable est excellent !",
    lastMessageTime: "Lun",
    unreadCount: 0,
    members: [
      "Jean-Claude",
      "Isabelle Fontaine",
      "Nicolas Garcia",
      "Camille Rousseau",
    ],
  },
];

export const mockMessages: MockMessage[] = [
  // Canal General messages
  {
    id: "msg-1",
    groupId: "grp-general",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Bienvenue dans le Canal General ! Cet espace est dedie aux echanges entre tous les coachees. N'hesitez pas a partager vos experiences et poser vos questions.",
    timestamp: "2026-02-20T09:00:00",
    timeLabel: "Jeu 09:00",
    isPinned: true,
  },
  {
    id: "msg-2",
    groupId: "grp-general",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Rappel : le webinaire collectif sur l'intelligence emotionnelle a lieu vendredi a 14h. Le lien Zoom vous sera envoye par email.",
    timestamp: "2026-02-23T10:00:00",
    timeLabel: "Lun 10:00",
    isPinned: true,
  },
  {
    id: "msg-3",
    groupId: "grp-general",
    senderId: "coach-1",
    senderName: "Marie Dupont",
    senderInitials: "MD",
    content:
      "Bonjour a tous ! Je voulais partager mon experience avec le journal emotionnel. Ca a ete un vrai declencheur pour moi.",
    timestamp: "2026-02-24T14:30:00",
    timeLabel: "Mer 14:30",
    isPinned: false,
  },
  {
    id: "msg-4",
    groupId: "grp-general",
    senderId: "coach-8",
    senderName: "Isabelle Fontaine",
    senderInitials: "IF",
    content:
      "Totalement d'accord Marie ! Le journal emotionnel m'a aussi beaucoup aide. Je le recommande a tout le monde.",
    timestamp: "2026-02-24T15:05:00",
    timeLabel: "Mer 15:05",
    isPinned: false,
  },
  {
    id: "msg-5",
    groupId: "grp-general",
    senderId: "coach-5",
    senderName: "Camille Rousseau",
    senderInitials: "CR",
    content: "Est-ce que quelqu'un a des conseils pour gerer le stress avant une prise de parole ?",
    timestamp: "2026-02-25T09:15:00",
    timeLabel: "Hier 09:15",
    isPinned: false,
  },
  {
    id: "msg-6",
    groupId: "grp-general",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Camille, excellente question ! La technique de respiration 4-7-8 est tres efficace : inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes. A pratiquer 5 minutes avant.",
    timestamp: "2026-02-25T09:45:00",
    timeLabel: "Hier 09:45",
    isPinned: false,
  },
  {
    id: "msg-7",
    groupId: "grp-general",
    senderId: "coach-3",
    senderName: "Sophie Martin",
    senderInitials: "SM",
    content: "Merci Jean-Claude, je note cette technique !",
    timestamp: "2026-02-25T10:00:00",
    timeLabel: "Hier 10:00",
    isPinned: false,
  },
  {
    id: "msg-8",
    groupId: "grp-general",
    senderId: "coach-9",
    senderName: "Nicolas Garcia",
    senderInitials: "NG",
    content:
      "Bonjour, est-ce normal de se sentir un peu perdu au debut du module sur l'intelligence emotionnelle ?",
    timestamp: "2026-02-26T08:30:00",
    timeLabel: "10:30",
    isPinned: false,
  },
  {
    id: "msg-9",
    groupId: "grp-general",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Bienvenue a tous ! N'hesitez pas a partager vos experiences. Nicolas, c'est tout a fait normal, le module est dense. Prenez votre temps et n'hesitez pas a revenir sur les sections.",
    timestamp: "2026-02-26T10:30:00",
    timeLabel: "10:30",
    isPinned: false,
  },

  // GPE Alpha Corp messages
  {
    id: "msg-10",
    groupId: "grp-gpe",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Bonjour equipe Alpha Corp ! Voici le planning des prochaines semaines pour votre parcours de coaching.",
    timestamp: "2026-02-18T09:00:00",
    timeLabel: "Mar 09:00",
    isPinned: true,
    attachment: {
      name: "planning_alpha_mars2026.pdf",
      type: "pdf",
      size: "245 Ko",
    },
  },
  {
    id: "msg-11",
    groupId: "grp-gpe",
    senderId: "coach-1",
    senderName: "Marie Dupont",
    senderInitials: "MD",
    content: "Merci Jean-Claude ! Le module confiance en soi avance bien de mon cote.",
    timestamp: "2026-02-20T11:30:00",
    timeLabel: "Jeu 11:30",
    isPinned: false,
  },
  {
    id: "msg-12",
    groupId: "grp-gpe",
    senderId: "coach-2",
    senderName: "Pierre Leclerc",
    senderInitials: "PL",
    content:
      "J'ai un peu de retard sur le module Intelligence Emotionnelle. Est-ce qu'il y a un delai pour rendre les livrables ?",
    timestamp: "2026-02-23T16:00:00",
    timeLabel: "Lun 16:00",
    isPinned: false,
  },
  {
    id: "msg-13",
    groupId: "grp-gpe",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Pierre, pas de stress ! Le plus important est la qualite, pas la rapidite. On peut en discuter lors de notre prochain call.",
    timestamp: "2026-02-24T09:00:00",
    timeLabel: "Mer 09:00",
    isPinned: false,
  },
  {
    id: "msg-14",
    groupId: "grp-gpe",
    senderId: "coach-3",
    senderName: "Sophie Martin",
    senderInitials: "SM",
    content:
      "Le prochain atelier collectif est prevu le 5 mars. J'ai hate !",
    timestamp: "2026-02-25T14:00:00",
    timeLabel: "Hier 14:00",
    isPinned: false,
  },
  {
    id: "msg-15",
    groupId: "grp-gpe",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Le prochain atelier collectif est prevu le 5 mars. On travaillera sur la confiance en equipe.",
    timestamp: "2026-02-25T15:00:00",
    timeLabel: "Hier 15:00",
    isPinned: false,
  },

  // Coaching Individuel messages
  {
    id: "msg-16",
    groupId: "grp-coaching",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Bienvenue dans votre espace de coaching individuel. Ici vous pouvez echanger librement entre les sessions.",
    timestamp: "2026-01-15T09:00:00",
    timeLabel: "15 Jan",
    isPinned: true,
  },
  {
    id: "msg-17",
    groupId: "grp-coaching",
    senderId: "coach-8",
    senderName: "Isabelle Fontaine",
    senderInitials: "IF",
    content:
      "Jean-Claude, j'ai termine mon pitch de 2 minutes pour le module confiance. Puis-je vous l'envoyer avant notre prochaine session ?",
    timestamp: "2026-02-20T17:00:00",
    timeLabel: "Jeu",
    isPinned: false,
  },
  {
    id: "msg-18",
    groupId: "grp-coaching",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Isabelle, ton dernier livrable est excellent ! Oui, envoie-le moi, je le regarderai avant notre session.",
    timestamp: "2026-02-24T10:00:00",
    timeLabel: "Lun",
    isPinned: false,
  },
  {
    id: "msg-19",
    groupId: "grp-coaching",
    senderId: "coach-9",
    senderName: "Nicolas Garcia",
    senderInitials: "NG",
    content:
      "J'ai besoin d'aide pour l'exercice du scan corporel. Je n'arrive pas a me concentrer.",
    timestamp: "2026-02-24T14:00:00",
    timeLabel: "Lun",
    isPinned: false,
  },
  {
    id: "msg-20",
    groupId: "grp-coaching",
    senderId: "admin",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Nicolas, c'est normal au debut. Essaie de commencer par 5 minutes seulement et augmente progressivement. On en reparlera lors de notre prochaine seance.",
    timestamp: "2026-02-24T14:30:00",
    timeLabel: "Lun",
    isPinned: false,
  },
];

// Helper to get messages for a group
export function getMessagesForGroup(groupId: string): MockMessage[] {
  return mockMessages.filter((m) => m.groupId === groupId);
}

// Helper to get pinned messages for a group
export function getPinnedMessages(groupId: string): MockMessage[] {
  return mockMessages.filter((m) => m.groupId === groupId && m.isPinned);
}
