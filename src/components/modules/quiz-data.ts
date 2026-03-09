export interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "multiple" | "true_false";
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
  points: number;
}

export const intelligenceEmotionnelleQuiz: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "Quelle est la premiere etape de la gestion emotionnelle selon Daniel Goleman ?",
    type: "single",
    options: [
      { id: "q1a", text: "Reguler ses emotions", isCorrect: false },
      { id: "q1b", text: "Identifier et nommer ses emotions", isCorrect: true },
      { id: "q1c", text: "Ignorer les emotions negatives", isCorrect: false },
      { id: "q1d", text: "Exprimer toutes ses emotions", isCorrect: false },
    ],
    explanation:
      "La conscience de soi emotionnelle est le fondement de l'intelligence emotionnelle. Il faut d'abord savoir identifier et nommer ses emotions avant de pouvoir les gerer.",
    points: 2,
  },
  {
    id: "q2",
    question:
      "L'empathie est une composante de l'intelligence emotionnelle.",
    type: "true_false",
    options: [
      { id: "q2a", text: "Vrai", isCorrect: true },
      { id: "q2b", text: "Faux", isCorrect: false },
    ],
    explanation:
      "L'empathie est l'une des 5 composantes de l'intelligence emotionnelle selon Goleman : conscience de soi, maitrise de soi, motivation, empathie et competences sociales.",
    points: 1,
  },
  {
    id: "q3",
    question:
      "Quels sont les benefices d'un journal emotionnel ? (plusieurs reponses)",
    type: "multiple",
    options: [
      { id: "q3a", text: "Meilleure conscience de ses patterns emotionnels", isCorrect: true },
      { id: "q3b", text: "Reduction du stress", isCorrect: true },
      { id: "q3c", text: "Elimination totale des emotions negatives", isCorrect: false },
      { id: "q3d", text: "Prise de recul sur les situations", isCorrect: true },
    ],
    explanation:
      "Le journal emotionnel aide a mieux se connaitre et a reduire le stress. Il ne supprime pas les emotions negatives mais aide a les comprendre et les gerer.",
    points: 3,
  },
  {
    id: "q4",
    question:
      "Quelle technique est recommandee pour calmer une emotion intense sur le moment ?",
    type: "single",
    options: [
      { id: "q4a", text: "Fuir la situation immediatement", isCorrect: false },
      { id: "q4b", text: "Respiration profonde et ancrage corporel", isCorrect: true },
      { id: "q4c", text: "Refouler l'emotion et continuer", isCorrect: false },
      { id: "q4d", text: "Exprimer violemment sa frustration", isCorrect: false },
    ],
    explanation:
      "La respiration profonde active le systeme nerveux parasympathique, ce qui calme la reponse de stress. L'ancrage corporel (sentir ses pieds au sol, etc.) aide a revenir au moment present.",
    points: 2,
  },
  {
    id: "q5",
    question:
      "Le scan corporel est une technique qui consiste a porter attention aux sensations physiques liees aux emotions.",
    type: "true_false",
    options: [
      { id: "q5a", text: "Vrai", isCorrect: true },
      { id: "q5b", text: "Faux", isCorrect: false },
    ],
    explanation:
      "Le scan corporel est une pratique de pleine conscience qui consiste a parcourir mentalement chaque partie du corps pour identifier les tensions et sensations liees aux emotions.",
    points: 1,
  },
];
