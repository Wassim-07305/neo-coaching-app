"use client";

import { useState, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "./quiz-data";

interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizInteractiveProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number, answers: QuizAnswer[]) => void;
}

export function QuizInteractive({ questions, onComplete }: QuizInteractiveProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [finished, setFinished] = useState(false);
  const questionStartRef = useRef(Date.now());

  const question = questions[currentIndex];
  const totalPoints = questions.reduce((s, q) => s + q.points, 0);
  const earnedPoints = answers.reduce(
    (s, a) => s + (a.isCorrect ? questions.find((q) => q.id === a.questionId)?.points || 0 : 0),
    0
  );

  const toggleOption = (optId: string) => {
    if (validated) return;
    if (question.type === "single" || question.type === "true_false") {
      setSelectedIds([optId]);
    } else {
      setSelectedIds((prev) =>
        prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
      );
    }
  };

  const validate = () => {
    const correctIds = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);
    const isCorrect =
      correctIds.length === selectedIds.length &&
      correctIds.every((id) => selectedIds.includes(id));

    const answer: QuizAnswer = {
      questionId: question.id,
      selectedOptionIds: selectedIds,
      isCorrect,
      timeSpent: Math.round((Date.now() - questionStartRef.current) / 1000),
    };
    setAnswers([...answers, answer]);
    setValidated(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedIds([]);
      setValidated(false);
      questionStartRef.current = Date.now();
    } else {
      const finalAnswers = [...answers];
      const finalScore = finalAnswers.reduce(
        (s, a) =>
          s + (a.isCorrect ? questions.find((q) => q.id === a.questionId)?.points || 0 : 0),
        0
      );
      setFinished(true);
      onComplete(finalScore, totalPoints, finalAnswers);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedIds([]);
    setValidated(false);
    setAnswers([]);
    setFinished(false);
    questionStartRef.current = Date.now();
  };

  if (finished) {
    const pct = Math.round((earnedPoints / totalPoints) * 100);
    const color = pct >= 70 ? "#2D8C4E" : pct >= 50 ? "#F39C12" : "#E74C3C";

    return (
      <div className="mx-auto max-w-md space-y-6 text-center py-8">
        <div
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4"
          style={{ borderColor: color }}
        >
          <div>
            <p className="text-3xl font-bold" style={{ color }}>
              {earnedPoints}/{totalPoints}
            </p>
            <p className="text-xs text-gray-500">{pct}%</p>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold text-dark">
            {pct >= 70 ? "Felicitations !" : pct >= 50 ? "Bon effort !" : "Continuez vos efforts"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {pct >= 70
              ? "Vous maitrisez bien ce module."
              : "Revisez le contenu et reessayez pour ameliorer votre score."}
          </p>
        </div>

        <div className="space-y-2 text-left">
          {questions.map((q, i) => {
            const a = answers[i];
            return (
              <div
                key={q.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                {a?.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2D8C4E]" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-[#E74C3C]" />
                )}
                <span className="text-sm text-gray-700 flex-1">
                  {q.question.slice(0, 60)}
                  {q.question.length > 60 && "..."}
                </span>
                <span className="text-xs text-gray-400">
                  {a?.isCorrect ? q.points : 0}/{q.points} pts
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={restart}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#D4A843]" />
          <span className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {question.points} point{question.points > 1 ? "s" : ""}
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-[#D4A843] transition-all duration-300"
          style={{
            width: `${((currentIndex + (validated ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-dark leading-snug">
        {question.question}
      </h3>

      {question.type === "multiple" && (
        <p className="text-xs text-gray-400">Plusieurs reponses possibles</p>
      )}

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          let optionStyle = "";
          if (validated) {
            if (opt.isCorrect) optionStyle = "border-[#2D8C4E] bg-[#2D8C4E]/5";
            else if (isSelected) optionStyle = "border-[#E74C3C] bg-[#E74C3C]/5";
          }

          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              disabled={validated}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left text-sm transition-all",
                !validated && isSelected
                  ? "border-[#D4A843] bg-[#D4A843]/5"
                  : !validated
                    ? "border-gray-200 hover:border-gray-300"
                    : "",
                optionStyle
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                    isSelected && !validated
                      ? "border-[#D4A843] bg-[#D4A843] text-white"
                      : validated && opt.isCorrect
                        ? "border-[#2D8C4E] bg-[#2D8C4E] text-white"
                        : validated && isSelected
                          ? "border-[#E74C3C] bg-[#E74C3C] text-white"
                          : "border-gray-300"
                  )}
                >
                  {validated && opt.isCorrect && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {validated && isSelected && !opt.isCorrect && <XCircle className="h-3.5 w-3.5" />}
                </div>
                <span className="text-gray-700">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {validated && question.explanation && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!validated ? (
          <button
            onClick={validate}
            disabled={selectedIds.length === 0}
            className="rounded-lg bg-[#D4A843] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a] disabled:opacity-50"
          >
            Valider
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 rounded-lg bg-[#D4A843] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a]"
          >
            {currentIndex < questions.length - 1 ? "Question suivante" : "Voir les resultats"}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
