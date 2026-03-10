"use client";

import { useState } from "react";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Smile,
  TrendingUp,
  Lightbulb,
  ListChecks,
  Lock,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface SessionNote {
  id: string;
  appointmentId: string;
  clientName: string;
  sessionDate: string;
  content: string;
  privateNotes?: string;
  keyTakeaways?: string[];
  nextSteps?: string[];
  moodRating?: number;
  progressRating?: number;
}

interface SessionNotesPanelProps {
  appointmentId: string;
  clientId: string;
  clientName: string;
  coachId: string;
  sessionDate: string;
  existingNote?: SessionNote;
  onSave?: (note: SessionNote) => void;
  className?: string;
}

export function SessionNotesPanel({
  appointmentId,
  clientId,
  clientName,
  coachId,
  sessionDate,
  existingNote,
  onSave,
  className,
}: SessionNotesPanelProps) {
  const [content, setContent] = useState(existingNote?.content || "");
  const [privateNotes, setPrivateNotes] = useState(existingNote?.privateNotes || "");
  const [showPrivate, setShowPrivate] = useState(false);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    existingNote?.keyTakeaways || [""]
  );
  const [nextSteps, setNextSteps] = useState<string[]>(
    existingNote?.nextSteps || [""]
  );
  const [moodRating, setMoodRating] = useState(existingNote?.moodRating || 5);
  const [progressRating, setProgressRating] = useState(
    existingNote?.progressRating || 5
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleAddItem = (type: "takeaways" | "steps") => {
    if (type === "takeaways") {
      setKeyTakeaways([...keyTakeaways, ""]);
    } else {
      setNextSteps([...nextSteps, ""]);
    }
  };

  const handleRemoveItem = (type: "takeaways" | "steps", index: number) => {
    if (type === "takeaways") {
      setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
    } else {
      setNextSteps(nextSteps.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (
    type: "takeaways" | "steps",
    index: number,
    value: string
  ) => {
    if (type === "takeaways") {
      const updated = [...keyTakeaways];
      updated[index] = value;
      setKeyTakeaways(updated);
    } else {
      const updated = [...nextSteps];
      updated[index] = value;
      setNextSteps(updated);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast("Veuillez saisir le contenu de la note", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/sessions/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          coachId,
          clientId,
          content,
          privateNotes: privateNotes || undefined,
          keyTakeaways: keyTakeaways.filter((t) => t.trim()),
          nextSteps: nextSteps.filter((s) => s.trim()),
          moodRating,
          progressRating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast("Notes de session enregistrees", "success");
        onSave?.({
          id: data.data?.id || `note-${Date.now()}`,
          appointmentId,
          clientName,
          sessionDate,
          content,
          privateNotes,
          keyTakeaways: keyTakeaways.filter((t) => t.trim()),
          nextSteps: nextSteps.filter((s) => s.trim()),
          moodRating,
          progressRating,
        });
      } else {
        toast(data.error || "Erreur lors de l'enregistrement", "error");
      }
    } catch {
      toast("Erreur lors de l'enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 3) return "😟";
    if (rating <= 5) return "😐";
    if (rating <= 7) return "🙂";
    return "😊";
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-dark text-base">
                Notes de session
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{clientName}</span>
                <span>•</span>
                <Calendar className="w-3 h-3" />
                <span>
                  {format(new Date(sessionDate), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Main content */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Resume de la session
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Decrivez le deroulement de la session, les sujets abordes, les progres observes..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
          />
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-2 gap-4">
          {/* Mood rating */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
              <Smile className="w-4 h-4 text-accent" />
              Humeur du coache
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full bg-gray-200 appearance-none cursor-pointer accent-accent"
              />
              <span className="text-2xl">{getMoodEmoji(moodRating)}</span>
              <span className="text-sm font-bold text-dark w-8">
                {moodRating}/10
              </span>
            </div>
          </div>

          {/* Progress rating */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Progression
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={progressRating}
                onChange={(e) => setProgressRating(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full bg-gray-200 appearance-none cursor-pointer accent-success"
              />
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                  progressRating >= 7
                    ? "bg-success"
                    : progressRating >= 5
                      ? "bg-warning"
                      : "bg-danger"
                )}
              >
                {progressRating}
              </div>
            </div>
          </div>
        </div>

        {/* Key takeaways */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Points cles retenus
          </label>
          <div className="space-y-2">
            {keyTakeaways.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateItem("takeaways", index, e.target.value)
                  }
                  placeholder="Point cle..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <button
                  onClick={() => handleRemoveItem("takeaways", index)}
                  className="p-2 text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddItem("takeaways")}
              className="flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter un point cle
            </button>
          </div>
        </div>

        {/* Next steps */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <ListChecks className="w-4 h-4 text-success" />
            Prochaines etapes
          </label>
          <div className="space-y-2">
            {nextSteps.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleUpdateItem("steps", index, e.target.value)
                  }
                  placeholder="Action a realiser..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
                <button
                  onClick={() => handleRemoveItem("steps", index)}
                  className="p-2 text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddItem("steps")}
              className="flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une etape
            </button>
          </div>
        </div>

        {/* Private notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-dark">
              <Lock className="w-4 h-4 text-gray-400" />
              Notes privees (coach uniquement)
            </label>
            <button
              onClick={() => setShowPrivate(!showPrivate)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-dark"
            >
              {showPrivate ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Masquer
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Afficher
                </>
              )}
            </button>
          </div>
          {showPrivate && (
            <textarea
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Notes confidentielles visibles uniquement par vous..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none bg-gray-50"
            />
          )}
        </div>
      </div>
    </div>
  );
}
