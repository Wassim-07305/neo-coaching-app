"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Plus,
  ExternalLink,
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  moduleQuestionnaires,
  getAllQuestionnaires,
  type MockQuestionnaire,
  type QuestionnairePhase,
} from "@/lib/mock-data-questionnaires";
import { useToast } from "@/components/ui/toast";
import { useQuestionnaireResponses } from "@/hooks/use-supabase-data";
import { createUntypedClient } from "@/lib/supabase/client";

type FilterPhase = "all" | QuestionnairePhase;

// Default stats for when no data is available
const defaultStats = {
  total: 8,
  completed: 0,
  pending: 0,
  avgSatisfaction: 0,
};

export default function QuestionnairesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterPhase, setFilterPhase] = useState<FilterPhase>("all");
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<MockQuestionnaire | null>(null);

  // Fetch real questionnaire responses from Supabase
  const { data: responses, loading: responsesLoading } = useQuestionnaireResponses({});

  const allQuestionnaires = getAllQuestionnaires();

  // Calculate real stats from responses
  const stats = useMemo(() => {
    if (!responses || responses.length === 0) {
      return { ...defaultStats, total: allQuestionnaires.length };
    }

    // Calculate average satisfaction from numeric answers (slider questions)
    const satisfactionScores: number[] = [];
    responses.forEach((r) => {
      const answers = r.answers as Record<string, string | number>;
      Object.values(answers).forEach((v) => {
        if (typeof v === "number" && v >= 1 && v <= 10) {
          satisfactionScores.push(v);
        }
      });
    });

    const avgSatisfaction = satisfactionScores.length > 0
      ? Math.round((satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length) * 10) / 10
      : 0;

    return {
      total: allQuestionnaires.length,
      completed: responses.length,
      pending: Math.max(0, allQuestionnaires.length * 5 - responses.length), // Estimate
      avgSatisfaction,
    };
  }, [responses, allQuestionnaires.length]);

  const filteredQuestionnaires = allQuestionnaires.filter((q) => {
    const matchesSearch =
      search === "" ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = filterPhase === "all" || q.phase === filterPhase;
    return matchesSearch && matchesPhase;
  });

  const handleConfigureGoogleForms = (q: MockQuestionnaire) => {
    setSelectedQuestionnaire(q);
    setShowConfigModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-accent" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">
              Questionnaires Qualiopi
            </h1>
            <p className="text-sm text-gray-500">
              Gerez les questionnaires amont/aval par module
            </p>
          </div>
        </div>
        <button
          onClick={() => toast("Creation de questionnaire a venir", "info")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau questionnaire
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.total}</p>
              <p className="text-xs text-gray-500">Questionnaires</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              {responsesLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-success" />
              ) : (
                <p className="text-2xl font-bold text-dark">
                  {stats.completed}
                </p>
              )}
              <p className="text-xs text-gray-500">Reponses recues</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{stats.pending}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">
                {stats.avgSatisfaction > 0 ? `${stats.avgSatisfaction}/10` : "N/A"}
              </p>
              <p className="text-xs text-gray-500">Satisfaction moy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un questionnaire..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value as FilterPhase)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">Toutes les phases</option>
              <option value="amont">Amont (pre-formation)</option>
              <option value="aval">Aval (post-formation)</option>
              <option value="mi-parcours">Mi-parcours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Module questionnaires grouped */}
      <div className="space-y-4">
        <h2 className="font-heading font-semibold text-lg text-dark">
          Questionnaires par module
        </h2>

        {moduleQuestionnaires.map((mq) => (
          <div
            key={mq.moduleId}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-medium text-dark">{mq.moduleName}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Amont */}
              {mq.amont && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Amont
                    </span>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {mq.amont.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mq.amont.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mq.amont.googleFormsUrl ? (
                      <a
                        href={mq.amont.googleFormsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Google Forms
                      </a>
                    ) : (
                      <button
                        onClick={() => handleConfigureGoogleForms(mq.amont!)}
                        className="text-xs text-gray-500 hover:text-accent transition-colors"
                      >
                        + Lier Google Forms
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Aval */}
              {mq.aval && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Aval
                    </span>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {mq.aval.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mq.aval.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mq.aval.googleFormsUrl ? (
                      <a
                        href={mq.aval.googleFormsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Google Forms
                      </a>
                    ) : (
                      <button
                        onClick={() => handleConfigureGoogleForms(mq.aval!)}
                        className="text-xs text-gray-500 hover:text-accent transition-colors"
                      >
                        + Lier Google Forms
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All questionnaires list */}
      <div className="space-y-4">
        <h2 className="font-heading font-semibold text-lg text-dark">
          Tous les questionnaires ({filteredQuestionnaires.length})
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredQuestionnaires.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
                      q.phase === "amont"
                        ? "bg-blue-100 text-blue-700"
                        : q.phase === "aval"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    )}
                  >
                    {q.phase === "amont"
                      ? "Amont"
                      : q.phase === "aval"
                      ? "Aval"
                      : "Mi-parcours"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark truncate">
                      {q.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {q.questions.length} questions
                      {q.googleFormsUrl && " • Google Forms lie"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Forms config modal */}
      {showConfigModal && selectedQuestionnaire && (
        <GoogleFormsConfigModal
          questionnaire={selectedQuestionnaire}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedQuestionnaire(null);
          }}
          onSave={() => {
            toast("Lien Google Forms enregistre", "success");
            setShowConfigModal(false);
            setSelectedQuestionnaire(null);
          }}
        />
      )}
    </div>
  );
}

// Google Forms configuration modal
function GoogleFormsConfigModal({
  questionnaire,
  onClose,
  onSave,
}: {
  questionnaire: MockQuestionnaire;
  onClose: () => void;
  onSave: (url: string) => void;
}) {
  const [url, setUrl] = useState(questionnaire.googleFormsUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) return;
    setIsSaving(true);
    try {
      const supabase = createUntypedClient();
      await supabase
        .from("questionnaires")
        .update({ google_forms_url: url.trim() })
        .eq("id", questionnaire.id);
    } catch {
      // Continue even if Supabase fails (questionnaire may not exist in DB yet)
    }
    onSave(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-heading font-semibold text-lg text-dark">
            Lier un Google Forms
          </h2>
          <p className="text-sm text-gray-500 mt-1">{questionnaire.title}</p>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du Google Forms
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://forms.google.com/..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <p className="text-xs text-gray-500 mt-2">
              Les apprenants seront rediriges vers ce formulaire externe au lieu
              du questionnaire integre.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            <p className="font-medium mb-1">Conseil</p>
            <p className="text-xs">
              Assurez-vous que le formulaire Google est configure pour collecter
              les adresses email et permettre l&apos;edition des reponses.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!url.trim() || isSaving}
            className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
