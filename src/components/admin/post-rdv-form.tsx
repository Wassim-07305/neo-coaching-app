"use client";

import { useState } from "react";
import { X, Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PostRdvTask {
  title: string;
  dueDate: string;
}

export interface PostRdvData {
  summary: string;
  engagement: number;
  keyPoints: string[];
  tasks: PostRdvTask[];
  kpiSuggestion: { investissement?: number; efficacite?: number; participation?: number };
  privateNotes: string;
}

interface PostRdvFormProps {
  clientName: string;
  onSave: (data: PostRdvData) => void;
  onClose: () => void;
}

export function PostRdvForm({ clientName, onSave, onClose }: PostRdvFormProps) {
  const [summary, setSummary] = useState("");
  const [engagement, setEngagement] = useState(0);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [pointInput, setPointInput] = useState("");
  const [tasks, setTasks] = useState<PostRdvTask[]>([]);
  const [privateNotes, setPrivateNotes] = useState("");

  const addPoint = () => {
    if (pointInput.trim()) {
      setKeyPoints([...keyPoints, pointInput.trim()]);
      setPointInput("");
    }
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", dueDate: "" }]);
  };

  const updateTask = (i: number, field: keyof PostRdvTask, value: string) => {
    const updated = [...tasks];
    updated[i] = { ...updated[i], [field]: value };
    setTasks(updated);
  };

  const removeTask = (i: number) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    if (!summary.trim()) return;
    onSave({
      summary,
      engagement,
      keyPoints,
      tasks: tasks.filter((t) => t.title.trim()),
      kpiSuggestion: {},
      privateNotes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-dark">
              Notes post-rendez-vous
            </h2>
            <p className="text-sm text-gray-500">{clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Summary */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Resume de la seance *
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Decrivez les points abordes durant la seance..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#D4A843] focus:outline-none resize-none"
            />
          </div>

          {/* Engagement rating */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Engagement du coachee
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setEngagement(val)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      val <= engagement
                        ? "fill-[#D4A843] text-[#D4A843]"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key points */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Points cles abordes
            </label>
            <div className="flex gap-2">
              <input
                value={pointInput}
                onChange={(e) => setPointInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPoint())}
                placeholder="Ajouter un point cle..."
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
              />
              <button
                onClick={addPoint}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Ajouter
              </button>
            </div>
            {keyPoints.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {keyPoints.map((point, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-[#D4A843]/10 px-3 py-1 text-xs font-medium text-[#D4A843]"
                  >
                    {point}
                    <button
                      onClick={() => setKeyPoints(keyPoints.filter((_, idx) => idx !== i))}
                      className="ml-0.5 hover:text-[#c49a3a]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Taches a assigner
              </label>
              <button
                onClick={addTask}
                className="flex items-center gap-1 text-xs text-[#D4A843] hover:text-[#c49a3a] font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={task.title}
                    onChange={(e) => updateTask(i, "title", e.target.value)}
                    placeholder="Titre de la tache"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
                  />
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => updateTask(i, "dueDate", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
                  />
                  <button
                    onClick={() => removeTask(i)}
                    className="p-2 text-gray-400 hover:text-[#E74C3C]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Private notes */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Notes privees
            </label>
            <textarea
              rows={3}
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Visible uniquement par vous..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm italic focus:border-[#D4A843] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!summary.trim()}
            className="flex-1 rounded-lg bg-[#D4A843] py-2.5 text-sm font-semibold text-white hover:bg-[#c49a3a] disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
