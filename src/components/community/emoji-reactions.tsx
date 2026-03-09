"use client";

import { useState } from "react";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_EMOJIS = ["👍", "❤️", "😊", "🎉", "💪", "🔥", "👏", "💡"];

interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface EmojiReactionsProps {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
}

export function EmojiReactions({ reactions, onToggle }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {reactions
        .filter((r) => r.count > 0)
        .map((r) => (
          <button
            key={r.emoji}
            onClick={() => onToggle(r.emoji)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors",
              r.reacted
                ? "bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843]"
                : "bg-gray-100 border border-transparent text-gray-600 hover:bg-gray-200"
            )}
          >
            <span>{r.emoji}</span>
            <span className="font-medium">{r.count}</span>
          </button>
        ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <SmilePlus className="h-4 w-4" />
        </button>

        {showPicker && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPicker(false)}
            />
            <div className="absolute bottom-full left-0 z-20 mb-1 flex gap-1 rounded-xl bg-white border border-gray-200 p-2 shadow-lg">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onToggle(emoji);
                    setShowPicker(false);
                  }}
                  className="rounded-lg p-1.5 text-lg hover:bg-gray-100 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
