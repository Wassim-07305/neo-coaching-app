"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, Send, CheckCircle2 } from "lucide-react";

interface SatisfactionFormProps {
  moduleTitle: string;
  onSubmit?: (score: number) => void;
}

export function SatisfactionForm({ moduleTitle, onSubmit }: SatisfactionFormProps) {
  const [score, setScore] = useState<number | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (score === null) return;
    setSubmitted(true);
    onSubmit?.(score);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="font-heading text-lg font-bold text-dark mb-2">
          Merci pour votre evaluation !
        </h3>
        <p className="text-sm text-gray-500">
          Vous avez donne une note de {score}/10 pour le module &laquo;{" "}
          {moduleTitle} &raquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-heading text-lg font-bold text-dark mb-2">
        Notez votre satisfaction (0 a 10)
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Comment evaluez-vous votre experience sur le module &laquo;{" "}
        {moduleTitle} &raquo; ?
      </p>

      {/* Star rating */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active =
            hoveredScore !== null ? n <= hoveredScore : score !== null && n <= score;
          return (
            <button
              key={n}
              onClick={() => setScore(n)}
              onMouseEnter={() => setHoveredScore(n)}
              onMouseLeave={() => setHoveredScore(null)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 transition-colors",
                  active
                    ? "fill-accent text-accent"
                    : "text-gray-200"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Number display */}
      <div className="text-center mb-6">
        {score !== null ? (
          <span className="text-2xl font-heading font-bold text-accent">
            {score}/10
          </span>
        ) : (
          <span className="text-sm text-gray-400">
            Cliquez pour noter
          </span>
        )}
      </div>

      {/* Number selector alternative */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            onClick={() => setScore(n)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-semibold transition-all",
              score === n
                ? "bg-accent text-white scale-110"
                : "bg-gray-100 text-gray-600 hover:bg-accent/10 hover:text-accent"
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={score === null}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
        Envoyer mon evaluation
      </button>
    </div>
  );
}
