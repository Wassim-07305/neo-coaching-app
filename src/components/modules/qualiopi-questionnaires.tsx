"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  getModuleQuestionnaires,
  type ModuleQuestionnaires,
} from "@/lib/mock-data-questionnaires";

interface QualiopiQuestionnairesProps {
  moduleId: string;
  basePath: string; // "/salarie" or "/coaching"
  moduleStarted?: boolean;
  moduleCompleted?: boolean;
}

// Mock user questionnaire status
const mockUserQuestionnaireStatus: Record<
  string,
  { amont: boolean; aval: boolean }
> = {
  "mod-leadership": { amont: true, aval: false },
  "mod-communication": { amont: false, aval: false },
};

export function QualiopiQuestionnaires({
  moduleId,
  basePath,
  moduleStarted = true,
  moduleCompleted = false,
}: QualiopiQuestionnairesProps) {
  const moduleQuestionnaires = getModuleQuestionnaires(moduleId);

  // If no questionnaires configured for this module, don't render
  if (!moduleQuestionnaires) {
    return null;
  }

  const userStatus = mockUserQuestionnaireStatus[moduleId] || {
    amont: false,
    aval: false,
  };

  const { amont, aval } = moduleQuestionnaires;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-lg font-bold text-dark">
          Questionnaires Qualiopi
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Ces questionnaires sont obligatoires pour la conformite Qualiopi. Merci
        de les completer avant et apres le module.
      </p>

      <div className="space-y-3">
        {/* Amont Questionnaire */}
        {amont && (
          <QuestionnaireCard
            questionnaire={amont}
            type="amont"
            completed={userStatus.amont}
            locked={false}
            basePath={basePath}
          />
        )}

        {/* Aval Questionnaire */}
        {aval && (
          <QuestionnaireCard
            questionnaire={aval}
            type="aval"
            completed={userStatus.aval}
            locked={!moduleCompleted}
            basePath={basePath}
          />
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progression</span>
          <span className="font-medium text-dark">
            {(userStatus.amont ? 1 : 0) + (userStatus.aval ? 1 : 0)} / 2
            completes
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${
                ((userStatus.amont ? 1 : 0) + (userStatus.aval ? 1 : 0)) * 50
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Individual questionnaire card
function QuestionnaireCard({
  questionnaire,
  type,
  completed,
  locked,
  basePath,
}: {
  questionnaire: NonNullable<ModuleQuestionnaires["amont"]>;
  type: "amont" | "aval";
  completed: boolean;
  locked: boolean;
  basePath: string;
}) {
  const isGoogleForms = !!questionnaire.googleFormsUrl;

  const cardContent = (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all",
        completed
          ? "bg-success/5 border-success/20"
          : locked
          ? "bg-gray-50 border-gray-200 opacity-60"
          : "bg-white border-gray-200 hover:border-accent/30 hover:shadow-sm cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            completed
              ? "bg-success/10"
              : type === "amont"
              ? "bg-blue-100"
              : "bg-green-100"
          )}
        >
          {completed ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <ClipboardList
              className={cn(
                "w-5 h-5",
                type === "amont" ? "text-blue-600" : "text-green-600"
              )}
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                type === "amont"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              )}
            >
              {type === "amont" ? "Pre-formation" : "Post-formation"}
            </span>
            {isGoogleForms && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                <ExternalLink className="w-2.5 h-2.5" />
                Externe
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-dark mt-0.5">
            {questionnaire.title}
          </p>
          <p className="text-xs text-gray-500">
            {completed
              ? "Complete"
              : locked
              ? "Disponible apres completion du module"
              : `${questionnaire.questions.length} questions`}
          </p>
        </div>
      </div>
      <div>
        {completed ? (
          <span className="text-xs text-success font-medium">Complete</span>
        ) : locked ? (
          <AlertCircle className="w-5 h-5 text-gray-300" />
        ) : (
          <ArrowRight className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );

  // If locked or completed, don't link
  if (locked || completed) {
    return cardContent;
  }

  // If Google Forms, link externally
  if (isGoogleForms && questionnaire.googleFormsUrl) {
    return (
      <a
        href={questionnaire.googleFormsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }

  // Link to internal questionnaire
  return (
    <Link href={`${basePath}/questionnaires/${questionnaire.id}`}>
      {cardContent}
    </Link>
  );
}
