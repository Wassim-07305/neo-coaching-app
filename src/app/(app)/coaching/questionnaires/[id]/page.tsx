"use client";

import { use } from "react";
import { QuestionnaireForm } from "@/components/questionnaires/questionnaire-form";
import { useQuestionnaire } from "@/hooks/use-supabase-data";
import { getQuestionnaireById } from "@/lib/mock-data-questionnaires";
import { FileText, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CoachingQuestionnairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Try to load from Supabase first
  const { data: supabaseQuestionnaire, loading } = useQuestionnaire(id);

  // Fallback to mock data if Supabase doesn't have it
  const mockQuestionnaire = getQuestionnaireById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const questionnaire = supabaseQuestionnaire || mockQuestionnaire;

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
            href="/coaching/dashboard"
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
      backHref="/coaching/dashboard"
    />
  );
}
