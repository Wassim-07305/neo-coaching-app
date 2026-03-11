"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  ChevronRight,
  ClipboardList,
  Award,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserModuleProgress, useModules, useQuestionnaireResponses } from "@/hooks/use-supabase-data";
import { mockModules } from "@/lib/mock-data";
import { getModuleQuestionnaires } from "@/lib/mock-data-questionnaires";

type ModuleStatus = "en_cours" | "complete" | "a_venir";

const statusConfig: Record<ModuleStatus, { label: string; color: string; icon: React.ElementType }> = {
  complete: { label: "Termine", color: "bg-success/10 text-success", icon: CheckCircle },
  en_cours: { label: "En cours", color: "bg-accent/10 text-accent", icon: Play },
  a_venir: { label: "A venir", color: "bg-gray-100 text-gray-500", icon: Clock },
};

// Fallback mock data
const mockUserModules = [
  { moduleId: "mod-1", status: "complete" as const, progress: 100 },
  { moduleId: "mod-2", status: "en_cours" as const, progress: 45 },
  { moduleId: "mod-3", status: "a_venir" as const, progress: 0 },
];

const mockQuestionnaireStatus: Record<string, { amont: boolean; aval: boolean }> = {
  "mod-1": { amont: true, aval: true },
  "mod-2": { amont: true, aval: false },
  "mod-3": { amont: false, aval: false },
};

export default function SalarieModulesPage() {
  const { profile, loading: authLoading } = useAuth();

  // Fetch real data from Supabase
  const { data: moduleProgress, loading: progressLoading } = useUserModuleProgress(profile?.id);
  const { data: allModules } = useModules();
  const { data: questionnaireResponses } = useQuestionnaireResponses({ user_id: profile?.id });

  // Transform module progress data
  const userModules = useMemo(() => {
    if (moduleProgress && moduleProgress.length > 0) {
      return moduleProgress.map((mp) => ({
        moduleId: mp.module_id,
        status: mp.status === "validated" ? "complete" as const
          : mp.status === "in_progress" ? "en_cours" as const
          : mp.status === "submitted" ? "en_cours" as const
          : "a_venir" as const,
        progress: mp.status === "validated" ? 100
          : mp.status === "in_progress" ? 45
          : 0,
      }));
    }
    // Fallback to mock data
    return mockUserModules;
  }, [moduleProgress]);

  // Get questionnaire completion status per module
  const userQuestionnaireStatus = useMemo(() => {
    const status: Record<string, { amont: boolean; aval: boolean }> = {};

    if (questionnaireResponses && questionnaireResponses.length > 0) {
      questionnaireResponses.forEach((resp) => {
        const moduleId = resp.module_progress_id || "";
        if (!status[moduleId]) {
          status[moduleId] = { amont: false, aval: false };
        }
        // Determine if it's amont or aval based on questionnaire type
        // For now, simple assumption based on questionnaire ID pattern
        if (resp.questionnaire_id.includes("amont")) {
          status[moduleId].amont = true;
        } else if (resp.questionnaire_id.includes("aval")) {
          status[moduleId].aval = true;
        }
      });
      return status;
    }
    // Fallback to mock data
    return mockQuestionnaireStatus;
  }, [questionnaireResponses]);

  const assignedModuleIds = userModules.map((m) => m.moduleId);
  const assignedModules = useMemo(() => {
    if (allModules && allModules.length > 0) {
      return allModules.filter((m) => assignedModuleIds.includes(m.id));
    }
    return mockModules.filter((m) => assignedModuleIds.includes(m.id));
  }, [allModules, assignedModuleIds]);

  const getModuleStatus = (moduleId: string): ModuleStatus => {
    return userModules.find((m) => m.moduleId === moduleId)?.status || "a_venir";
  };

  const getModuleProgress = (moduleId: string): number => {
    return userModules.find((m) => m.moduleId === moduleId)?.progress || 0;
  };

  // Stats
  const completedCount = userModules.filter((m) => m.status === "complete").length;
  const totalQuestionnaires = assignedModules.length * 2;
  const completedQuestionnaires = Object.values(userQuestionnaireStatus).reduce(
    (acc, q) => acc + (q.amont ? 1 : 0) + (q.aval ? 1 : 0),
    0
  );

  const isLoading = authLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-accent" />
        <div>
          <h1 className="font-heading text-xl font-bold text-dark">Ma Formation</h1>
          <p className="text-sm text-gray-500">
            Parcours de developpement personnel assigne par votre entreprise
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{completedCount}/{assignedModules.length}</p>
              <p className="text-xs text-gray-500">Modules termines</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{completedQuestionnaires}/{totalQuestionnaires}</p>
              <p className="text-xs text-gray-500">Questionnaires Qualiopi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{completedCount}</p>
              <p className="text-xs text-gray-500">Certificats obtenus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner about questionnaires */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Questionnaires Qualiopi obligatoires
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Chaque module comporte un questionnaire amont (avant) et aval (apres).
              Ces questionnaires sont requis pour la certification Qualiopi.
            </p>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {assignedModules.map((module) => {
          const status = getModuleStatus(module.id);
          const progress = getModuleProgress(module.id);
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const hasQuestionnaires = getModuleQuestionnaires(module.id);
          const qStatus = userQuestionnaireStatus[module.id] || { amont: false, aval: false };
          const qCompleted = (qStatus.amont ? 1 : 0) + (qStatus.aval ? 1 : 0);

          return (
            <Link
              key={module.id}
              href={`/salarie/modules/${module.id}`}
              className={cn(
                "block bg-white rounded-xl border border-gray-200 p-4 transition-all",
                status !== "a_venir"
                  ? "hover:border-accent/30 hover:shadow-sm"
                  : "opacity-75"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    status === "complete"
                      ? "bg-success/10"
                      : status === "en_cours"
                        ? "bg-accent/10"
                        : "bg-gray-100"
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "w-6 h-6",
                      status === "complete"
                        ? "text-success"
                        : status === "en_cours"
                          ? "text-accent"
                          : "text-gray-400"
                    )}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-dark truncate">{module.title}</p>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", config.color)}>
                      {config.label}
                    </span>
                    {/* Questionnaire indicator */}
                    {hasQuestionnaires && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full",
                          qCompleted === 2
                            ? "bg-success/10 text-success"
                            : qCompleted > 0
                              ? "bg-warning/10 text-warning"
                              : "bg-gray-100 text-gray-500"
                        )}
                      >
                        <ClipboardList className="w-3 h-3" />
                        {qCompleted === 2 ? "Qualiopi OK" : `${qCompleted}/2`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {'duration_weeks' in module ? `${module.duration_weeks} semaines` : (module.duration_minutes ? `${Math.round(module.duration_minutes / 60)} heures` : '1 semaine')} &bull; {(module.description || '').slice(0, 50)}...
                  </p>

                  {/* Progress bar for en_cours */}
                  {status === "en_cours" && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {assignedModules.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Aucun module ne vous a ete assigne pour le moment.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Contactez votre responsable RH pour plus d&apos;informations.
          </p>
        </div>
      )}
    </div>
  );
}
