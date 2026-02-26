"use client";

import { use } from "react";
import { QuestionnaireForm } from "@/components/questionnaires/questionnaire-form";
import { getQuestionnaireById } from "@/lib/mock-data-questionnaires";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function SalarieQuestionnairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const questionnaire = getQuestionnaireById(id);

  if (!questionnaire) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-accent" />
          <h1 className="font-heading text-xl font-bold text-dark">
            Questionnaire
          </h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Questionnaire introuvable.</p>
          <Link
            href="/salarie/dashboard"
            className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:underline"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <QuestionnaireForm
      questionnaire={questionnaire}
      backHref="/salarie/dashboard"
    />
  );
}
