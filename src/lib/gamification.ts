// Gamification system - Badges & achievements (F49b)

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "module" | "community" | "kpi" | "milestone";
  condition: string;
}

export interface UserStats {
  modulesCompleted: number;
  rdvCompleted: number;
  maxKpi: number;
  allKpisAbove9: boolean;
  messagesCount: number;
  livrablesCount: number;
  consecutiveDays: number;
  certificatesCount: number;
}

export const allBadges: Badge[] = [
  {
    id: "premier_module",
    name: "Premier Pas",
    description: "Terminer votre premier module",
    icon: "BookOpen",
    category: "module",
    condition: "modulesCompleted >= 1",
  },
  {
    id: "cinq_modules",
    name: "Expert en Formation",
    description: "Terminer 5 modules de formation",
    icon: "GraduationCap",
    category: "module",
    condition: "modulesCompleted >= 5",
  },
  {
    id: "premier_rdv",
    name: "Premiere Rencontre",
    description: "Completer votre premier rendez-vous",
    icon: "Calendar",
    category: "milestone",
    condition: "rdvCompleted >= 1",
  },
  {
    id: "dix_rdv",
    name: "Fidele",
    description: "Completer 10 rendez-vous de coaching",
    icon: "Heart",
    category: "milestone",
    condition: "rdvCompleted >= 10",
  },
  {
    id: "kpi_huit",
    name: "Performeur",
    description: "Atteindre un KPI de 8 ou plus",
    icon: "TrendingUp",
    category: "kpi",
    condition: "maxKpi >= 8",
  },
  {
    id: "kpi_parfait",
    name: "Excellence",
    description: "Tous vos KPIs au-dessus de 9",
    icon: "Crown",
    category: "kpi",
    condition: "allKpisAbove9",
  },
  {
    id: "premier_message",
    name: "Social",
    description: "Envoyer votre premier message",
    icon: "MessageCircle",
    category: "community",
    condition: "messagesCount >= 1",
  },
  {
    id: "dix_messages",
    name: "Communicant",
    description: "Envoyer 10 messages dans la communaute",
    icon: "MessagesSquare",
    category: "community",
    condition: "messagesCount >= 10",
  },
  {
    id: "premier_livrable",
    name: "Createur",
    description: "Soumettre votre premier livrable",
    icon: "FileCheck",
    category: "module",
    condition: "livrablesCount >= 1",
  },
  {
    id: "streak_7",
    name: "Regulier",
    description: "7 jours consecutifs d'activite",
    icon: "Flame",
    category: "milestone",
    condition: "consecutiveDays >= 7",
  },
  {
    id: "streak_30",
    name: "Marathonien",
    description: "30 jours consecutifs d'activite",
    icon: "Zap",
    category: "milestone",
    condition: "consecutiveDays >= 30",
  },
  {
    id: "certificat",
    name: "Certifie",
    description: "Obtenir votre premier certificat",
    icon: "Award",
    category: "module",
    condition: "certificatesCount >= 1",
  },
];

export function checkBadgeEligibility(stats: UserStats): Badge[] {
  return allBadges.filter((badge) => {
    switch (badge.id) {
      case "premier_module":
        return stats.modulesCompleted >= 1;
      case "cinq_modules":
        return stats.modulesCompleted >= 5;
      case "premier_rdv":
        return stats.rdvCompleted >= 1;
      case "dix_rdv":
        return stats.rdvCompleted >= 10;
      case "kpi_huit":
        return stats.maxKpi >= 8;
      case "kpi_parfait":
        return stats.allKpisAbove9;
      case "premier_message":
        return stats.messagesCount >= 1;
      case "dix_messages":
        return stats.messagesCount >= 10;
      case "premier_livrable":
        return stats.livrablesCount >= 1;
      case "streak_7":
        return stats.consecutiveDays >= 7;
      case "streak_30":
        return stats.consecutiveDays >= 30;
      case "certificat":
        return stats.certificatesCount >= 1;
      default:
        return false;
    }
  });
}
