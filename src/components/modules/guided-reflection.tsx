"use client";

import { useState } from "react";
import {
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReflectionQuestion {
  id: string;
  question: string;
  hint?: string;
  type: "textarea" | "scale" | "choice";
  options?: string[];
}

interface GuidedReflectionProps {
  title: string;
  questions: ReflectionQuestion[];
  onComplete: (answers: Record<string, string>) => void;
}

const defaultReflections: ReflectionQuestion[] = [
  {
    id: "r1",
    question:
      "En repensant à cette semaine, quelle situation a déclenché une émotion forte chez vous ?",
    hint: "Décrivez la situation brièvement : lieu, personnes impliquées, contexte.",
    type: "textarea",
  },
  {
    id: "r2",
    question: "Quelle émotion avez-vous ressentie à ce moment-là ?",
    type: "choice",
    options: [
      "Joie",
      "Colère",
      "Tristesse",
      "Peur",
      "Surprise",
      "Frustration",
      "Fierté",
      "Anxiété",
    ],
  },
  {
    id: "r3",
    question:
      "Sur une échelle de 1 à 10, quelle était l'intensité de cette émotion ?",
    type: "scale",
  },
  {
    id: "r4",
    question: "Comment avez-vous réagi sur le moment ? Qu'avez-vous fait ou dit ?",
    hint: "Soyez honnête avec vous-même, il n'y a pas de mauvaise réponse.",
    type: "textarea",
  },
  {
    id: "r5",
    question:
      "Avec le recul, que feriez-vous différemment si la même situation se reproduisait ?",
    hint: "Pensez aux techniques vues dans le module : respiration, reformulation, prise de recul.",
    type: "textarea",
  },
];

export function GuidedReflection({
  title = "Réflexion guidée",
  questions = defaultReflections,
  onComplete,
}: GuidedReflectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const question = questions[currentStep];
  const currentAnswer = answers[question.id] || "";
  const canProceed = currentAnswer.trim().length > 0;

  const updateAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleFinish = () => {
    setCompleted(true);
    onComplete(answers);
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2D8C4E]/10">
          <CheckCircle2 className="h-8 w-8 text-[#2D8C4E]" />
        </div>
        <h3 className="font-heading text-xl font-bold text-dark">
          Réflexion terminée
        </h3>
        <p className="text-sm text-gray-500">
          Bravo pour cet exercice d&apos;introspection ! Vos réponses ont été
          enregistrées. Vous pouvez les relire dans votre journal personnel.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lightbulb className="h-5 w-5 text-[#D4A843]" />
        <h3 className="font-heading text-lg font-bold text-dark">{title}</h3>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < currentStep
                ? "bg-[#2D8C4E]"
                : i === currentStep
                  ? "bg-[#D4A843]"
                  : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Question {currentStep + 1} sur {questions.length}
      </p>

      {/* Question */}
      <div className="space-y-3">
        <h4 className="text-base font-medium text-dark leading-relaxed">
          {question.question}
        </h4>
        {question.hint && (
          <p className="text-xs text-gray-400 italic">{question.hint}</p>
        )}
      </div>

      {/* Answer input */}
      <div>
        {question.type === "textarea" && (
          <textarea
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm leading-relaxed focus:border-[#D4A843] focus:outline-none resize-none"
            rows={5}
            placeholder="Écrivez votre réponse ici..."
          />
        )}

        {question.type === "scale" && (
          <div className="space-y-3">
            <div className="flex justify-between px-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => updateAnswer(String(n))}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                    currentAnswer === String(n)
                      ? "border-[#D4A843] bg-[#D4A843] text-white"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 px-2">
              <span>Faible</span>
              <span>Très intense</span>
            </div>
          </div>
        )}

        {question.type === "choice" && question.options && (
          <div className="flex flex-wrap gap-2">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => updateAnswer(opt)}
                className={cn(
                  "rounded-full border-2 px-4 py-2 text-sm transition-all",
                  currentAnswer === opt
                    ? "border-[#D4A843] bg-[#D4A843]/10 text-[#D4A843] font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 0}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-dark disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </button>

        {currentStep < questions.length - 1 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed}
            className="flex items-center gap-2 rounded-lg bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a] disabled:opacity-50"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!canProceed}
            className="flex items-center gap-2 rounded-lg bg-[#2D8C4E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2D8C4E]/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Terminer
          </button>
        )}
      </div>
    </div>
  );
}

export { defaultReflections };
export type { ReflectionQuestion };
