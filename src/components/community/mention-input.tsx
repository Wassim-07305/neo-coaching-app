"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MentionUser {
  id: string;
  name: string;
  avatar?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  users: MentionUser[];
  placeholder?: string;
  onSubmit?: () => void;
}

export function MentionInput({
  value,
  onChange,
  users,
  placeholder = "Ecrire un message...",
  onSubmit,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [caretPos, setCaret] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // Detect @ trigger
    const before = value.slice(0, caretPos);
    const atMatch = before.match(/@(\w*)$/);
    if (atMatch) {
      setQuery(atMatch[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value, caretPos]);

  const insertMention = (user: MentionUser) => {
    const before = value.slice(0, caretPos);
    const after = value.slice(caretPos);
    const atIdx = before.lastIndexOf("@");
    const newValue = before.slice(0, atIdx) + `@${user.name} ` + after;
    onChange(newValue);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (showSuggestions && filtered.length > 0) {
        e.preventDefault();
        insertMention(filtered[0]);
      } else if (onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setCaret(e.target.selectionStart);
        }}
        onClick={(e) => setCaret((e.target as HTMLTextAreaElement).selectionStart)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#D4A843] focus:outline-none resize-none"
      />

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute bottom-full left-0 z-20 mb-1 w-64 max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.slice(0, 5).map((user) => (
            <button
              key={user.id}
              onClick={() => insertMention(user)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-[#D4A843]/10 text-xs font-bold text-[#D4A843]"
              )}>
                {user.name.charAt(0)}
              </div>
              <span>{user.name}</span>
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 text-[10px] text-gray-400">
        Tapez @ pour mentionner quelqu&apos;un
      </p>
    </div>
  );
}
