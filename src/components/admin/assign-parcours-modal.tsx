"use client";

import { useState } from "react";
import { format, addWeeks } from "date-fns";
import {
  X,
  Route,
  User,
  Calendar,
  ChevronRight,
  Check,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  getParcoursTemplates,
  type ParcoursTemplate,
} from "@/lib/mock-data-parcours";
import { mockCoachees, mockModules } from "@/lib/mock-data";

type Step = "template" | "user" | "dates" | "confirm";

interface AssignParcoursModalProps {
  onClose: () => void;
  onAssigned?: (data: {
    templateId: string;
    userId: string;
    startDate: string;
    endDate: string;
    moduleDeadlines: { moduleId: string; deadline: string }[];
  }) => void;
}

export function AssignParcoursModal({
  onClose,
  onAssigned,
}: AssignParcoursModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<ParcoursTemplate | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState("");
  const [moduleDeadlines, setModuleDeadlines] = useState<
    { moduleId: string; deadline: string }[]
  >([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const templates = getParcoursTemplates();
  const users = mockCoachees.filter((c) => c.status === "actif");

  const selectedUserData = users.find((u) => u.id === selectedUser);

  // When template is selected, calculate default deadlines
  const handleSelectTemplate = (template: ParcoursTemplate) => {
    setSelectedTemplate(template);
    const start = new Date(startDate);
    const weekInterval = Math.floor(template.durationWeeks / template.moduleIds.length);

    const deadlines = template.moduleIds.map((moduleId, idx) => ({
      moduleId,
      deadline: format(addWeeks(start, (idx + 1) * weekInterval), "yyyy-MM-dd"),
    }));

    setModuleDeadlines(deadlines);
    setEndDate(format(addWeeks(start, template.durationWeeks), "yyyy-MM-dd"));
    setStep("user");
  };

  const handleAssign = async () => {
    if (!selectedTemplate || !selectedUser) return;

    setIsAssigning(true);
    try {
      // TODO: Create assignment in Supabase
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast(
        `Parcours "${selectedTemplate.title}" assigne a ${selectedUserData?.first_name} ${selectedUserData?.last_name}`,
        "success"
      );

      onAssigned?.({
        templateId: selectedTemplate.id,
        userId: selectedUser,
        startDate,
        endDate,
        moduleDeadlines,
      });
      onClose();
    } catch {
      toast("Erreur lors de l'assignation", "error");
    } finally {
      setIsAssigning(false);
    }
  };

  const getModuleTitle = (moduleId: string) => {
    return mockModules.find((m) => m.id === moduleId)?.title || moduleId;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Route className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-dark">
                Assigner un parcours
              </h2>
              <p className="text-xs text-gray-500">
                Etape {step === "template" ? 1 : step === "user" ? 2 : step === "dates" ? 3 : 4} sur 4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step 1: Select template */}
          {step === "template" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Choisissez un modele de parcours a assigner.
              </p>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-accent/30 hover:bg-accent/5 transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-dark">
                          {template.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {template.moduleIds.length} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {template.durationWeeks} semaines
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select user */}
          {step === "user" && (
            <div className="space-y-4">
              <div className="bg-accent/5 rounded-xl p-3 text-sm">
                <span className="font-medium text-accent">Parcours:</span>{" "}
                <span className="text-dark">{selectedTemplate?.title}</span>
              </div>

              <p className="text-sm text-gray-600">
                Selectionnez le salarie a qui assigner ce parcours.
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user.id);
                      setStep("dates");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedUser === user.id
                        ? "border-accent bg-accent/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-medium/10 flex items-center justify-center text-sm font-semibold text-primary-medium shrink-0">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.company_name || "Individuel"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep("template")}
                className="text-sm text-gray-500 hover:text-accent transition-colors"
              >
                ← Retour aux modeles
              </button>
            </div>
          )}

          {/* Step 3: Set dates */}
          {step === "dates" && (
            <div className="space-y-4">
              <div className="bg-accent/5 rounded-xl p-3 text-sm">
                <p>
                  <span className="font-medium text-accent">Parcours:</span>{" "}
                  <span className="text-dark">{selectedTemplate?.title}</span>
                </p>
                <p>
                  <span className="font-medium text-accent">Salarie:</span>{" "}
                  <span className="text-dark">
                    {selectedUserData?.first_name} {selectedUserData?.last_name}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de debut
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite globale
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadlines par module
                </label>
                <div className="space-y-2">
                  {moduleDeadlines.map((md, idx) => (
                    <div
                      key={md.moduleId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-sm text-dark truncate">
                        {getModuleTitle(md.moduleId)}
                      </span>
                      <input
                        type="date"
                        value={md.deadline}
                        onChange={(e) => {
                          const updated = [...moduleDeadlines];
                          updated[idx].deadline = e.target.value;
                          setModuleDeadlines(updated);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("user")}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="font-medium text-dark">
                    Recapitulatif de l'assignation
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parcours</span>
                    <span className="font-medium text-dark">
                      {selectedTemplate?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salarie</span>
                    <span className="font-medium text-dark">
                      {selectedUserData?.first_name} {selectedUserData?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Debut</span>
                    <span className="font-medium text-dark">{startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fin</span>
                    <span className="font-medium text-dark">{endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Modules</span>
                    <span className="font-medium text-dark">
                      {moduleDeadlines.length}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Le salarie recevra une notification avec les details du parcours.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "confirm" && (
          <div className="border-t border-gray-100 p-5 flex gap-3">
            <button
              onClick={() => setStep("dates")}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleAssign}
              disabled={isAssigning}
              className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isAssigning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Assignation...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Assigner le parcours
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
