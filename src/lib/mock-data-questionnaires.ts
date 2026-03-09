// ===========================================================================
// Mock Data for Questionnaires (Qualiopi compliance)
// Replace with Supabase queries when the database is ready.
// ===========================================================================

export type QuestionType = "text" | "textarea" | "slider" | "radio" | "checkbox";
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
  phase: QuestionnairePhase;
  moduleId?: string; // Link to a specific module
  googleFormsUrl?: string; // Optional external Google Forms link
  questions: MockQuestion[];
}

export interface ModuleQuestionnaires {
  moduleId: string;
  moduleName: string;
  amont?: MockQuestionnaire;
  aval?: MockQuestionnaire;
}

// Qualiopi-compliant pre-training questionnaire template (amont)
const amontQuestionsTemplate: MockQuestion[] = [
  {
    id: "amont-1",
    label: "Quelles sont vos attentes principales pour cette formation ?",
    type: "textarea",
    required: true,
    placeholder: "Decrivez vos attentes...",
  },
  {
    id: "amont-2",
    label: "Quel est votre niveau actuel dans ce domaine ?",
    type: "radio",
    required: true,
    options: ["Debutant", "Intermediaire", "Avance", "Expert"],
  },
  {
    id: "amont-3",
    label: "Avez-vous deja suivi une formation similaire ?",
    type: "radio",
    required: true,
    options: ["Oui", "Non"],
  },
  {
    id: "amont-4",
    label: "Quels objectifs professionnels souhaitez-vous atteindre grace a cette formation ?",
    type: "textarea",
    required: true,
    placeholder: "Decrivez vos objectifs...",
  },
  {
    id: "amont-5",
    label: "Niveau de motivation avant la formation",
    type: "slider",
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: "amont-6",
    label: "Y a-t-il des contraintes particulieres dont nous devrions tenir compte ?",
    type: "textarea",
    required: false,
    placeholder: "Horaires, accessibilite, besoins specifiques...",
  },
];

// Qualiopi-compliant post-training questionnaire template (aval)
const avalQuestionsTemplate: MockQuestion[] = [
  {
    id: "aval-1",
    label: "Les objectifs de la formation ont-ils ete atteints ?",
    type: "radio",
    required: true,
    options: ["Oui, completement", "Partiellement", "Non"],
  },
  {
    id: "aval-2",
    label: "Comment evaluez-vous la qualite du contenu pedagogique ?",
    type: "slider",
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: "aval-3",
    label: "Comment evaluez-vous la qualite de l'accompagnement du formateur ?",
    type: "slider",
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: "aval-4",
    label: "Les moyens pedagogiques (supports, outils) etaient-ils adaptes ?",
    type: "radio",
    required: true,
    options: ["Tres adaptes", "Adaptes", "Peu adaptes", "Pas du tout adaptes"],
  },
  {
    id: "aval-5",
    label: "Quelles competences avez-vous acquises ou developpees ?",
    type: "textarea",
    required: true,
    placeholder: "Listez les competences acquises...",
  },
  {
    id: "aval-6",
    label: "Comment comptez-vous appliquer ces acquis dans votre quotidien professionnel ?",
    type: "textarea",
    required: true,
    placeholder: "Decrivez vos projets d'application...",
  },
  {
    id: "aval-7",
    label: "Satisfaction globale de la formation",
    type: "slider",
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: "aval-8",
    label: "Recommanderiez-vous cette formation a un collegue ?",
    type: "radio",
    required: true,
    options: ["Oui, certainement", "Probablement", "Probablement pas", "Non"],
  },
  {
    id: "aval-9",
    label: "Commentaires et suggestions d'amelioration",
    type: "textarea",
    required: false,
    placeholder: "Partagez vos remarques...",
  },
];

// Module-specific questionnaires - mapped to actual module IDs from mock-data.ts
export const moduleQuestionnaires: ModuleQuestionnaires[] = [
  {
    moduleId: "mod-1",
    moduleName: "Intelligence Emotionnelle",
    amont: {
      id: "q-ie-amont",
      title: "Questionnaire pre-formation - Intelligence Emotionnelle",
      description:
        "Ce questionnaire permet d'evaluer vos attentes et votre niveau avant de debuter le module. Vos reponses nous aident a personnaliser votre accompagnement (conformite Qualiopi).",
      badge: "Questionnaire Amont",
      phase: "amont",
      moduleId: "mod-1",
      questions: amontQuestionsTemplate.map((q) => ({
        ...q,
        id: `ie-${q.id}`,
      })),
    },
    aval: {
      id: "q-ie-aval",
      title: "Questionnaire post-formation - Intelligence Emotionnelle",
      description:
        "Ce questionnaire d'evaluation permet de mesurer votre satisfaction et vos acquis. Vos reponses contribuent a l'amelioration continue (conformite Qualiopi).",
      badge: "Questionnaire Aval",
      phase: "aval",
      moduleId: "mod-1",
      questions: avalQuestionsTemplate.map((q) => ({
        ...q,
        id: `ie-${q.id}`,
      })),
    },
  },
  {
    moduleId: "mod-2",
    moduleName: "Estime de soi",
    amont: {
      id: "q-estime-amont",
      title: "Questionnaire pre-formation - Estime de soi",
      description:
        "Ce questionnaire permet d'evaluer vos attentes et votre niveau avant de debuter le module. Vos reponses nous aident a personnaliser votre accompagnement (conformite Qualiopi).",
      badge: "Questionnaire Amont",
      phase: "amont",
      moduleId: "mod-2",
      questions: amontQuestionsTemplate.map((q) => ({
        ...q,
        id: `estime-${q.id}`,
      })),
    },
    aval: {
      id: "q-estime-aval",
      title: "Questionnaire post-formation - Estime de soi",
      description:
        "Ce questionnaire d'evaluation permet de mesurer votre satisfaction et vos acquis. Vos reponses contribuent a l'amelioration continue (conformite Qualiopi).",
      badge: "Questionnaire Aval",
      phase: "aval",
      moduleId: "mod-2",
      questions: avalQuestionsTemplate.map((q) => ({
        ...q,
        id: `estime-${q.id}`,
      })),
    },
  },
  {
    moduleId: "mod-3",
    moduleName: "Confiance en soi",
    amont: {
      id: "q-confiance-amont",
      title: "Questionnaire pre-formation - Confiance en soi",
      description:
        "Ce questionnaire permet d'evaluer vos attentes et votre niveau avant de debuter le module (conformite Qualiopi).",
      badge: "Questionnaire Amont",
      phase: "amont",
      moduleId: "mod-3",
      questions: amontQuestionsTemplate.map((q) => ({
        ...q,
        id: `confiance-${q.id}`,
      })),
    },
    aval: {
      id: "q-confiance-aval",
      title: "Questionnaire post-formation - Confiance en soi",
      description:
        "Ce questionnaire d'evaluation permet de mesurer votre satisfaction et vos acquis (conformite Qualiopi).",
      badge: "Questionnaire Aval",
      phase: "aval",
      moduleId: "mod-3",
      googleFormsUrl: "https://forms.google.com/d/e/example-confiance", // Example external Google Forms
      questions: avalQuestionsTemplate.map((q) => ({
        ...q,
        id: `confiance-${q.id}`,
      })),
    },
  },
  {
    moduleId: "mod-4",
    moduleName: "Prise de parole",
    amont: {
      id: "q-parole-amont",
      title: "Questionnaire pre-formation - Prise de parole",
      description:
        "Evaluez vos attentes et votre niveau actuel en prise de parole (conformite Qualiopi).",
      badge: "Questionnaire Amont",
      phase: "amont",
      moduleId: "mod-4",
      questions: amontQuestionsTemplate.map((q) => ({
        ...q,
        id: `parole-${q.id}`,
      })),
    },
    aval: {
      id: "q-parole-aval",
      title: "Questionnaire post-formation - Prise de parole",
      description:
        "Evaluez votre satisfaction et vos acquis en prise de parole (conformite Qualiopi).",
      badge: "Questionnaire Aval",
      phase: "aval",
      moduleId: "mod-4",
      questions: avalQuestionsTemplate.map((q) => ({
        ...q,
        id: `parole-${q.id}`,
      })),
    },
  },
];

// Legacy questionnaires (for backwards compatibility)
export const mockQuestionnaires: MockQuestionnaire[] = [
  {
    id: "q-1",
    title: "Evaluation post-formation - Alpha Corp",
    description:
      "Ce questionnaire permet d'evaluer votre experience et vos acquis dans le cadre du parcours de coaching. Vos reponses sont confidentielles et contribuent a l'amelioration continue de nos formations (conformite Qualiopi).",
    badge: "Questionnaire Qualiopi",
    phase: "aval",
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
    phase: "mi-parcours",
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
  // Check module questionnaires first
  for (const mq of moduleQuestionnaires) {
    if (mq.amont?.id === id) return mq.amont;
    if (mq.aval?.id === id) return mq.aval;
  }
  // Fall back to legacy questionnaires
  return mockQuestionnaires.find((q) => q.id === id);
}

// Get questionnaires for a specific module
export function getModuleQuestionnaires(
  moduleId: string
): ModuleQuestionnaires | undefined {
  return moduleQuestionnaires.find((mq) => mq.moduleId === moduleId);
}

// Get all questionnaires for admin management
export function getAllQuestionnaires(): MockQuestionnaire[] {
  const all: MockQuestionnaire[] = [...mockQuestionnaires];
  for (const mq of moduleQuestionnaires) {
    if (mq.amont) all.push(mq.amont);
    if (mq.aval) all.push(mq.aval);
  }
  return all;
}

// User questionnaire responses (mock)
export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  userId: string;
  moduleId?: string;
  submittedAt: string;
  answers: Record<string, string | number>;
}

export const mockQuestionnaireResponses: QuestionnaireResponse[] = [
  {
    id: "resp-1",
    questionnaireId: "q-ie-amont",
    userId: "user-1",
    moduleId: "mod-1",
    submittedAt: "2026-03-01T10:00:00Z",
    answers: {
      "ie-amont-1": "Developper ma conscience emotionnelle et mieux gerer mes emotions",
      "ie-amont-2": "Intermediaire",
      "ie-amont-3": "Non",
      "ie-amont-4": "Devenir plus empathique et mieux communiquer",
      "ie-amont-5": 8,
    },
  },
  {
    id: "resp-2",
    questionnaireId: "q-confiance-amont",
    userId: "user-2",
    moduleId: "mod-3",
    submittedAt: "2026-03-05T14:30:00Z",
    answers: {
      "confiance-amont-1": "Gagner en assurance lors de presentations",
      "confiance-amont-2": "Debutant",
      "confiance-amont-3": "Oui",
      "confiance-amont-4": "Prendre la parole en public sans stress",
      "confiance-amont-5": 7,
    },
  },
];
