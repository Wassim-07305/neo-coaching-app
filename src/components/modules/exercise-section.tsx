"use client";

import { ClipboardList } from "lucide-react";

interface Exercise {
  title: string;
  type: string;
}

interface ExerciseSectionProps {
  exercises: Exercise[];
  moduleTitle: string;
}

export function ExerciseSection({ exercises, moduleTitle }: ExerciseSectionProps) {
  return (
    <div className="bg-white rounded-xl border-l-4 border-accent p-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="w-6 h-6 text-accent" />
        <h2 className="font-heading text-lg font-bold text-dark">
          Exercice de fin de module
        </h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Completez les exercices suivants pour valider le module &laquo;{" "}
        {moduleTitle} &raquo;. Prenez le temps de reflechir a chaque question
        avant de repondre.
      </p>

      <div className="space-y-4">
        {exercises.map((exercise, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-dark">{exercise.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Type : {exercise.type === "ecrit" && "Exercice ecrit"}
                {exercise.type === "audio" && "Enregistrement audio"}
                {exercise.type === "video" && "Exercice video"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <p className="text-sm text-dark font-medium mb-2">
          Questions de reflexion :
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">&#8226;</span>
            Quels sont les principaux enseignements que vous retirez de ce module ?
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">&#8226;</span>
            Comment comptez-vous appliquer ces apprentissages dans votre quotidien ?
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">&#8226;</span>
            Quelle a ete votre plus grande decouverte personnelle ?
          </li>
        </ul>
      </div>
    </div>
  );
}
