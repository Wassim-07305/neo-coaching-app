"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StickyNote, Plus, Tag } from "lucide-react";
import type { MockAnnotation } from "@/lib/mock-data";

interface CoacheeAnnotationsProps {
  annotations: MockAnnotation[];
}

const tagConfig: Record<
  string,
  { label: string; className: string }
> = {
  priorite: { label: "Priorite", className: "bg-danger/10 text-danger border-danger/30" },
  suivi_special: { label: "Suivi special", className: "bg-warning/10 text-warning border-warning/30" },
  en_pause: { label: "En pause", className: "bg-gray-100 text-gray-500 border-gray-200" },
  general: { label: "General", className: "bg-blue-50 text-blue-700 border-blue-200" },
};

export function CoacheeAnnotations({ annotations }: CoacheeAnnotationsProps) {
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState<string>("general");

  const sorted = [...annotations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-sm text-dark flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-accent" />
          Notes privees
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>

      {/* New note form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-lg border border-accent/20 bg-accent/5 space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ecrire une note privee..."
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-accent"
              >
                <option value="general">General</option>
                <option value="priorite">Priorite</option>
                <option value="suivi_special">Suivi special</option>
                <option value="en_pause">En pause</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewNote("");
                }}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // TODO: save to Supabase
                  setShowForm(false);
                  setNewNote("");
                }}
                disabled={!newNote.trim()}
                className="px-3 py-1.5 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Aucune note pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((annotation) => {
            const tag = tagConfig[annotation.tag || "general"];
            return (
              <div
                key={annotation.id}
                className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium border",
                      tag.className
                    )}
                  >
                    {tag.label}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(annotation.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {annotation.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
