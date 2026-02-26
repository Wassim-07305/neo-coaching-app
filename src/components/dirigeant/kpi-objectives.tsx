"use client";

import { Target } from "lucide-react";

interface KpiObjectivesProps {
  objectives: string[];
  missionStart: string;
  missionEnd: string;
}

export function KpiObjectives({ objectives, missionStart, missionEnd }: KpiObjectivesProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-accent/30 p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
          <Target className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-dark text-base">
            Objectifs de la mission
          </h2>
          <p className="text-xs text-gray-500">
            Du {new Date(missionStart).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} au{" "}
            {new Date(missionEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {objectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0 mt-0.5">
              {index + 1}
            </span>
            <span className="text-sm text-dark leading-relaxed">{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
