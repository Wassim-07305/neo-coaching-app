"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Play,
  ShoppingCart,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { mockModules } from "@/lib/mock-data";
import { getModuleQuestionnaires } from "@/lib/mock-data-questionnaires";

type ModuleStatus = "purchased" | "in_progress" | "completed" | "locked";

interface UserModule {
  moduleId: string;
  status: ModuleStatus;
  progress: number; // 0-100
}

// Mock user's module data
const userModules: UserModule[] = [
  { moduleId: "mod-1", status: "completed", progress: 100 },
  { moduleId: "mod-2", status: "in_progress", progress: 60 },
  { moduleId: "mod-3", status: "locked", progress: 0 },
  { moduleId: "mod-4", status: "locked", progress: 0 },
];

// Mock questionnaire completion status
const userQuestionnaireStatus: Record<string, { amont: boolean; aval: boolean }> = {
  "mod-1": { amont: true, aval: true },
  "mod-2": { amont: true, aval: false },
  "mod-3": { amont: false, aval: false },
  "mod-4": { amont: false, aval: false },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

const statusConfig: Record<ModuleStatus, { label: string; color: string; icon: React.ElementType }> = {
  completed: { label: "Termine", color: "bg-success/10 text-success", icon: CheckCircle },
  in_progress: { label: "En cours", color: "bg-accent/10 text-accent", icon: Play },
  purchased: { label: "Achete", color: "bg-blue-100 text-blue-700", icon: BookOpen },
  locked: { label: "A acheter", color: "bg-gray-100 text-gray-500", icon: Lock },
};

export default function CoachingModulesPage() {
  const { toast } = useToast();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Filter modules for individual coaching
  const availableModules = mockModules.filter(
    (m) => m.parcours_type === "individuel" || m.parcours_type === "les_deux"
  );

  const handlePurchase = async (moduleId: string, moduleTitle: string) => {
    setPurchasingId(moduleId);

    try {
      // TODO: Create Stripe Checkout session via API
      // const response = await fetch('/api/stripe/checkout', {
      //   method: 'POST',
      //   body: JSON.stringify({ moduleId })
      // });
      // const { url } = await response.json();
      // window.location.href = url;

      // For now, simulate
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast(`Redirection vers le paiement pour "${moduleTitle}"...`, "info");

      // Simulate redirect (in production, redirect to Stripe)
      setTimeout(() => {
        toast("Mode demo : Module achete avec succes !", "success");
        setPurchasingId(null);
      }, 1500);
    } catch {
      toast("Erreur lors de la creation du paiement", "error");
      setPurchasingId(null);
    }
  };

  const getModuleStatus = (moduleId: string): ModuleStatus => {
    return userModules.find((m) => m.moduleId === moduleId)?.status || "locked";
  };

  const getModuleProgress = (moduleId: string): number => {
    return userModules.find((m) => m.moduleId === moduleId)?.progress || 0;
  };

  // Separate modules by status
  const activeModules = availableModules.filter((m) => {
    const status = getModuleStatus(m.id);
    return status === "in_progress" || status === "completed" || status === "purchased";
  });

  const availableToBuy = availableModules.filter((m) => getModuleStatus(m.id) === "locked");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">Mes Modules</h1>
      </div>

      {/* My modules */}
      {activeModules.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Mon parcours
          </h2>
          <div className="space-y-3">
            {activeModules.map((module) => {
              const status = getModuleStatus(module.id);
              const progress = getModuleProgress(module.id);
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <Link
                  key={module.id}
                  href={`/coaching/modules/${module.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        status === "completed"
                          ? "bg-success/10"
                          : status === "in_progress"
                            ? "bg-accent/10"
                            : "bg-gray-100"
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "w-6 h-6",
                          status === "completed"
                            ? "text-success"
                            : status === "in_progress"
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
                        {getModuleQuestionnaires(module.id) && (
                          <QuestionnaireIndicator moduleId={module.id} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {module.duration_weeks} semaines
                      </p>

                      {/* Progress bar for in_progress */}
                      {status === "in_progress" && (
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
        </div>
      )}

      {/* Modules to buy */}
      {availableToBuy.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Modules disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {availableToBuy.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                    Module {module.order_index}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-heading font-semibold text-dark mb-1">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                  {module.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {module.duration_weeks} sem.
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xl font-bold text-dark">
                      {formatCurrency(module.price)}
                    </p>
                    <p className="text-[10px] text-gray-400">Paiement unique</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(module.id, module.title)}
                    disabled={purchasingId === module.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {purchasingId === module.id ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Acheter
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {activeModules.length === 0 && availableToBuy.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun module disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}

// Questionnaire status indicator component
function QuestionnaireIndicator({ moduleId }: { moduleId: string }) {
  const qStatus = userQuestionnaireStatus[moduleId] || { amont: false, aval: false };
  const total = 2;
  const completed = (qStatus.amont ? 1 : 0) + (qStatus.aval ? 1 : 0);

  if (completed === total) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">
        <ClipboardList className="w-3 h-3" />
        Qualiopi OK
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning">
      <ClipboardList className="w-3 h-3" />
      {completed}/{total} questionnaires
    </span>
  );
}
