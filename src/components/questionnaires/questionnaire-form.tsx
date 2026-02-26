"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type MockQuestionnaire,
  type MockQuestion,
} from "@/lib/mock-data-questionnaires";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Send,
  Award,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

interface QuestionnaireFormProps {
  questionnaire: MockQuestionnaire;
  backHref: string;
}

export function QuestionnaireForm({
  questionnaire,
  backHref,
}: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = questionnaire.questions;
  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = questions[currentStep];

  function setAnswer(questionId: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function canProceed(): boolean {
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.id];
    if (answer === undefined || answer === "") return false;
    return true;
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-dark mb-2">
            Merci pour vos reponses !
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Votre questionnaire &laquo; {questionnaire.title} &raquo; a ete
            soumis avec succes. Vos reponses contribuent a l&apos;amelioration
            continue de nos formations.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg text-sm font-medium text-accent">
            <Award className="w-4 h-4" />
            Questionnaire complete
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
            <Award className="w-3 h-3" />
            {questionnaire.badge}
          </span>
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-dark mb-2">
          {questionnaire.title}
        </h1>
        <p className="text-sm text-gray-500">{questionnaire.description}</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Question {currentStep + 1} sur {totalSteps}
          </span>
          <span className="text-xs font-medium text-accent">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[280px] flex flex-col">
        <QuestionRenderer
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={(val) => setAnswer(currentQuestion.id, val)}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Precedent
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            Soumettre
          </button>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              idx === currentStep
                ? "bg-accent w-6"
                : idx < currentStep && answers[questions[idx].id] !== undefined
                ? "bg-success"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Question Renderer ----

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: MockQuestion;
  value: string | number | undefined;
  onChange: (val: string | number) => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="font-heading text-base sm:text-lg font-semibold text-dark mb-1">
        {question.label}
        {question.required && <span className="text-danger ml-1">*</span>}
      </label>

      {!question.required && (
        <p className="text-xs text-gray-400 mb-4">Optionnel</p>
      )}
      {question.required && <div className="mb-4" />}

      <div className="flex-1 flex flex-col justify-center">
        {question.type === "text" && (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        )}

        {question.type === "textarea" && (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
          />
        )}

        {question.type === "slider" && (
          <SliderQuestion
            min={question.min || 1}
            max={question.max || 10}
            value={value as number | undefined}
            onChange={onChange}
          />
        )}

        {question.type === "radio" && question.options && (
          <RadioQuestion
            options={question.options}
            value={value as string | undefined}
            onChange={(v) => onChange(v)}
          />
        )}
      </div>
    </div>
  );
}

function SliderQuestion({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number | undefined;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Number selector */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              "w-10 h-10 rounded-xl text-sm font-semibold transition-all",
              value === n
                ? "bg-accent text-white scale-110 shadow-lg shadow-accent/20"
                : "bg-gray-100 text-gray-600 hover:bg-accent/10 hover:text-accent"
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>Pas du tout</span>
        <span>Neutre</span>
        <span>Tout a fait</span>
      </div>

      {/* Selected value display */}
      {value !== undefined && (
        <div className="text-center">
          <span className="text-2xl font-heading font-bold text-accent">
            {value}
          </span>
          <span className="text-sm text-gray-400 ml-1">/ {max}</span>
        </div>
      )}
    </div>
  );
}

function RadioQuestion({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all",
            value === option
              ? "border-accent bg-accent/5 text-dark"
              : "border-gray-200 text-gray-600 hover:border-accent/30 hover:bg-gray-50"
          )}
        >
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
              value === option ? "border-accent" : "border-gray-300"
            )}
          >
            {value === option && (
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            )}
          </div>
          {option}
        </button>
      ))}
    </div>
  );
}
