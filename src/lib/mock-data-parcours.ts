// ===========================================================================
// Mock Data for Parcours (Learning Paths) with deadlines
// Replace with Supabase queries when the database is ready.
// ===========================================================================

export type ParcoursStatus = "not_started" | "in_progress" | "completed" | "overdue";

export interface ParcoursModule {
  moduleId: string;
  moduleTitle: string;
  order: number;
  deadline?: string; // ISO date
  completedAt?: string; // ISO date
  status: "locked" | "available" | "in_progress" | "completed";
}

export interface AssignedParcours {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  assignedToName: string;
  assignedBy: string; // Admin ID
  companyId?: string;
  companyName?: string;
  createdAt: string;
  startDate: string;
  endDate: string; // Global deadline
  status: ParcoursStatus;
  modules: ParcoursModule[];
  progress: number; // 0-100
}

// Parcours templates (admin can create from these)
export interface ParcoursTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  durationWeeks: number;
  moduleIds: string[];
  isDefault: boolean;
}

export const parcoursTemplates: ParcoursTemplate[] = [
  {
    id: "tpl-leadership",
    title: "Parcours Leadership",
    description: "Developpez vos competences de leader et apprenez a motiver vos equipes.",
    category: "Management",
    durationWeeks: 12,
    moduleIds: ["mod-1", "mod-2", "mod-3", "mod-4"],
    isDefault: true,
  },
  {
    id: "tpl-communication",
    title: "Parcours Communication",
    description: "Maitrisez l'art de la communication professionnelle et de la prise de parole.",
    category: "Soft Skills",
    durationWeeks: 8,
    moduleIds: ["mod-4", "mod-1"],
    isDefault: true,
  },
  {
    id: "tpl-wellbeing",
    title: "Parcours Bien-etre au travail",
    description: "Apprenez a gerer le stress et a maintenir un equilibre vie pro/perso.",
    category: "Developpement personnel",
    durationWeeks: 6,
    moduleIds: ["mod-2", "mod-3"],
    isDefault: true,
  },
  {
    id: "tpl-onboarding",
    title: "Parcours Integration",
    description: "Parcours d'integration pour les nouveaux collaborateurs.",
    category: "Onboarding",
    durationWeeks: 4,
    moduleIds: ["mod-1", "mod-2"],
    isDefault: false,
  },
];

// Mock assigned parcours
export const mockAssignedParcours: AssignedParcours[] = [
  {
    id: "parcours-1",
    title: "Parcours Leadership",
    description: "Developpez vos competences de leader",
    assignedTo: "user-1",
    assignedToName: "Marie Dupont",
    assignedBy: "admin",
    companyId: "comp-1",
    companyName: "Alpha Corp",
    createdAt: "2026-02-01T10:00:00Z",
    startDate: "2026-02-15",
    endDate: "2026-05-15",
    status: "in_progress",
    progress: 35,
    modules: [
      {
        moduleId: "mod-1",
        moduleTitle: "Intelligence Emotionnelle",
        order: 1,
        deadline: "2026-03-01",
        completedAt: "2026-02-28",
        status: "completed",
      },
      {
        moduleId: "mod-2",
        moduleTitle: "Estime de Soi",
        order: 2,
        deadline: "2026-03-15",
        status: "in_progress",
      },
      {
        moduleId: "mod-3",
        moduleTitle: "Confiance en Soi",
        order: 3,
        deadline: "2026-04-01",
        status: "locked",
      },
      {
        moduleId: "mod-4",
        moduleTitle: "Prise de Parole",
        order: 4,
        deadline: "2026-05-01",
        status: "locked",
      },
    ],
  },
  {
    id: "parcours-2",
    title: "Parcours Communication",
    description: "Maitrisez l'art de la communication",
    assignedTo: "user-2",
    assignedToName: "Pierre Martin",
    assignedBy: "admin",
    companyId: "comp-1",
    companyName: "Alpha Corp",
    createdAt: "2026-01-15T14:00:00Z",
    startDate: "2026-02-01",
    endDate: "2026-04-01",
    status: "in_progress",
    progress: 50,
    modules: [
      {
        moduleId: "mod-4",
        moduleTitle: "Prise de Parole",
        order: 1,
        deadline: "2026-03-01",
        completedAt: "2026-02-25",
        status: "completed",
      },
      {
        moduleId: "mod-1",
        moduleTitle: "Intelligence Emotionnelle",
        order: 2,
        deadline: "2026-04-01",
        status: "in_progress",
      },
    ],
  },
  {
    id: "parcours-3",
    title: "Parcours Bien-etre",
    description: "Gestion du stress et equilibre",
    assignedTo: "user-3",
    assignedToName: "Sophie Bernard",
    assignedBy: "admin",
    companyId: "comp-2",
    companyName: "Beta SA",
    createdAt: "2025-12-01T09:00:00Z",
    startDate: "2025-12-15",
    endDate: "2026-02-15",
    status: "overdue",
    progress: 75,
    modules: [
      {
        moduleId: "mod-2",
        moduleTitle: "Estime de Soi",
        order: 1,
        deadline: "2026-01-15",
        completedAt: "2026-01-10",
        status: "completed",
      },
      {
        moduleId: "mod-3",
        moduleTitle: "Confiance en Soi",
        order: 2,
        deadline: "2026-02-15",
        status: "in_progress",
      },
    ],
  },
  {
    id: "parcours-4",
    title: "Parcours Integration",
    description: "Parcours d'integration nouveau collaborateur",
    assignedTo: "user-4",
    assignedToName: "Lucas Petit",
    assignedBy: "admin",
    companyId: "comp-1",
    companyName: "Alpha Corp",
    createdAt: "2026-01-01T08:00:00Z",
    startDate: "2026-01-15",
    endDate: "2026-02-15",
    status: "completed",
    progress: 100,
    modules: [
      {
        moduleId: "mod-1",
        moduleTitle: "Intelligence Emotionnelle",
        order: 1,
        deadline: "2026-02-01",
        completedAt: "2026-01-28",
        status: "completed",
      },
      {
        moduleId: "mod-2",
        moduleTitle: "Estime de Soi",
        order: 2,
        deadline: "2026-02-15",
        completedAt: "2026-02-12",
        status: "completed",
      },
    ],
  },
];

// Helper functions
export function getAssignedParcoursByUser(userId: string): AssignedParcours[] {
  return mockAssignedParcours.filter((p) => p.assignedTo === userId);
}

export function getAssignedParcoursByCompany(companyId: string): AssignedParcours[] {
  return mockAssignedParcours.filter((p) => p.companyId === companyId);
}

export function getAllAssignedParcours(): AssignedParcours[] {
  return mockAssignedParcours;
}

export function getParcoursById(id: string): AssignedParcours | undefined {
  return mockAssignedParcours.find((p) => p.id === id);
}

export function getParcoursTemplates(): ParcoursTemplate[] {
  return parcoursTemplates;
}

export function getParcoursStats() {
  return {
    total: mockAssignedParcours.length,
    inProgress: mockAssignedParcours.filter((p) => p.status === "in_progress").length,
    completed: mockAssignedParcours.filter((p) => p.status === "completed").length,
    overdue: mockAssignedParcours.filter((p) => p.status === "overdue").length,
    avgProgress: Math.round(
      mockAssignedParcours.reduce((sum, p) => sum + p.progress, 0) /
        mockAssignedParcours.length
    ),
  };
}

// Status labels and colors
export const parcoursStatusConfig: Record<
  ParcoursStatus,
  { label: string; className: string }
> = {
  not_started: {
    label: "Non commence",
    className: "bg-gray-100 text-gray-600",
  },
  in_progress: {
    label: "En cours",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Termine",
    className: "bg-success/10 text-success",
  },
  overdue: {
    label: "En retard",
    className: "bg-danger/10 text-danger",
  },
};
