// ===========================================================================
// Mock Data for Questionnaires (Qualiopi compliance)
// Replace with Supabase queries when the database is ready.
// ===========================================================================

export type QuestionType = "text" | "textarea" | "slider" | "radio";
export type QuestionnairePhase = "amont" | "aval" | "mi-parcours";

export interface MockQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface MockQuestionnaire {
  id: string;
  title: string;
  description: string;
  badge: string;
  phase?: QuestionnairePhase;
  googleFormsUrl?: string;
  questions: MockQuestion[];
}

export interface ModuleQuestionnaires {
  moduleId: string;
  moduleName: string;
  amont: MockQuestionnaire | null;
  aval: MockQuestionnaire | null;
}

export const mockQuestionnaires: MockQuestionnaire[] = [
  {
    id: "q-1",
    title: "Evaluation post-formation - Alpha Corp",
    description:
      "Ce questionnaire permet d'evaluer votre experience et vos acquis dans le cadre du parcours de coaching. Vos reponses sont confidentielles et contribuent a l'amelioration continue de nos formations (conformite Qualiopi).",
    badge: "Questionnaire Qualiopi",
    questions: [
      {
        id: "q1",
        label: "Quel etait l'objectif principal de cette mission ?",
        type: "text",
        required: true,
        placeholder: "Decrivez l'objectif principal...",
      },
      {
        id: "q2",
        label:
          "Sur une echelle de 1 a 10, quel est votre niveau de motivation ?",
        type: "slider",
        required: true,
        min: 1,
        max: 10,
      },
      {
        id: "q3",
        label:
          "Comment evaluez-vous votre niveau de developpement individuel ?",
        type: "radio",
        required: true,
        options: ["Debutant", "Intermediaire", "Avance", "Expert"],
      },
      {
        id: "q4",
        label: "Quelles sont les 6 emotions fondamentales ?",
        type: "text",
        required: true,
        placeholder: "Listez les 6 emotions fondamentales...",
      },
      {
        id: "q5",
        label: "Qu'avez-vous appris de plus important ?",
        type: "textarea",
        required: true,
        placeholder: "Decrivez vos apprentissages les plus marquants...",
      },
      {
        id: "q6",
        label: "Score de satisfaction global",
        type: "slider",
        required: true,
        min: 1,
        max: 10,
      },
      {
        id: "q7",
        label: "Commentaires libres",
        type: "textarea",
        required: false,
        placeholder:
          "Partagez vos remarques, suggestions ou commentaires additionnels...",
      },
    ],
  },
  {
    id: "q-2",
    title: "Evaluation mi-parcours - Coaching Individuel",
    description:
      "Ce questionnaire de mi-parcours nous aide a ajuster votre accompagnement. Repondez en toute transparence.",
    badge: "Questionnaire Qualiopi",
    questions: [
      {
        id: "q2-1",
        label: "Comment evaluez-vous la qualite de l'accompagnement recu ?",
        type: "slider",
        required: true,
        min: 1,
        max: 10,
      },
      {
        id: "q2-2",
        label:
          "Les objectifs fixes au debut du parcours sont-ils toujours pertinents ?",
        type: "radio",
        required: true,
        options: [
          "Oui, completement",
          "En partie",
          "Non, ils doivent etre revises",
        ],
      },
      {
        id: "q2-3",
        label: "Quels progres avez-vous realises jusqu'a present ?",
        type: "textarea",
        required: true,
        placeholder: "Decrivez vos progres...",
      },
      {
        id: "q2-4",
        label: "Y a-t-il des sujets que vous aimeriez approfondir ?",
        type: "textarea",
        required: false,
        placeholder: "Decrivez les sujets...",
      },
      {
        id: "q2-5",
        label: "Satisfaction globale a mi-parcours",
        type: "slider",
        required: true,
        min: 1,
        max: 10,
      },
    ],
  },
];

// Helper to get a questionnaire by ID
export function getQuestionnaireById(
  id: string
): MockQuestionnaire | undefined {
  return mockQuestionnaires.find((q) => q.id === id);
}

// Module-grouped questionnaires for admin page
export const moduleQuestionnaires: ModuleQuestionnaires[] = [
  {
    moduleId: "mod-1",
    moduleName: "Intelligence Emotionnelle",
    amont: {
      id: "q-amont-1",
      title: "Evaluation pre-formation IE",
      description: "Questionnaire amont pour le module Intelligence Emotionnelle",
      badge: "Amont",
      phase: "amont",
      questions: mockQuestionnaires[0].questions.slice(0, 3),
    },
    aval: {
      ...mockQuestionnaires[0],
      phase: "aval",
    },
  },
  {
    moduleId: "mod-2",
    moduleName: "Estime de soi",
    amont: null,
    aval: {
      ...mockQuestionnaires[1],
      phase: "aval",
    },
  },
];

// Get questionnaires for a specific module
export function getModuleQuestionnaires(moduleId: string): ModuleQuestionnaires | undefined {
  return moduleQuestionnaires.find((mq) => mq.moduleId === moduleId);
}

// Get all questionnaires flattened
export function getAllQuestionnaires(): MockQuestionnaire[] {
  return mockQuestionnaires.map((q, i) => ({
    ...q,
    phase: i === 0 ? ("aval" as QuestionnairePhase) : ("mi-parcours" as QuestionnairePhase),
  }));
}
