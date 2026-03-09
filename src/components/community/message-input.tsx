"use client";

import { useState, useRef } from "react";
import { Paperclip, SendHorizontal, X, FileText } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string, file?: File) => void;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  placeholder = "Ecrire un message...",
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (!text.trim() && !file) return;
    onSend(text.trim(), file || undefined);
    setText("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    // Auto-expand textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {/* File preview */}
      {file && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-gray-50 rounded-lg">
          <FileText className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs text-dark truncate flex-1">
            {file.name}
          </span>
          <button
            onClick={() => {
              setFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Attach button */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
          className="hidden"
        />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-2xl text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none max-h-[120px]"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && !file}
          className="flex items-center justify-center w-10 h-10 bg-accent text-white rounded-full hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
