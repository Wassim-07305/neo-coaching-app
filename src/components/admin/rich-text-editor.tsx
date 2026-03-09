"use client";

import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const toolbarButtons = [
  { command: "bold", icon: Bold, label: "Gras" },
  { command: "italic", icon: Italic, label: "Italique" },
  { command: "underline", icon: Underline, label: "Souligner" },
  { command: "separator" as const, icon: null, label: "" },
  { command: "formatBlock_h2", icon: Heading2, label: "Titre 2" },
  { command: "formatBlock_h3", icon: Heading3, label: "Titre 3" },
  { command: "separator" as const, icon: null, label: "" },
  { command: "insertUnorderedList", icon: List, label: "Liste" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Liste numerotee" },
  { command: "separator" as const, icon: null, label: "" },
  { command: "createLink", icon: Link, label: "Lien" },
  { command: "formatBlock_blockquote", icon: Quote, label: "Citation" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Commencez a ecrire le contenu du module...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string) => {
    if (command === "createLink") {
      const url = prompt("URL du lien :");
      if (url) document.execCommand("createLink", false, url);
    } else if (command.startsWith("formatBlock_")) {
      const tag = command.replace("formatBlock_", "");
      document.execCommand("formatBlock", false, `<${tag}>`);
    } else {
      document.execCommand(command, false);
    }
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#D4A843]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        {toolbarButtons.map((btn, i) => {
          if (btn.command === "separator") {
            return (
              <div
                key={`sep-${i}`}
                className="mx-1 h-5 w-px bg-gray-300"
              />
            );
          }
          const Icon = btn.icon!;
          return (
            <button
              key={btn.command}
              type="button"
              onClick={() => execCommand(btn.command)}
              title={btn.label}
              className={cn(
                "rounded p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[200px] px-4 py-3 text-sm text-gray-900 focus:outline-none",
          "prose prose-sm max-w-none",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:italic",
          "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_blockquote]:border-l-3 [&_blockquote]:border-[#D4A843] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600",
          "[&_a]:text-blue-600 [&_a]:underline"
        )}
      />
    </div>
  );
}
