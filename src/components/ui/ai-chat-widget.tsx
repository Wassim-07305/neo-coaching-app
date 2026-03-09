"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Comment accéder à mes modules ?",
  "Comment fonctionne le suivi KPI ?",
  "Comment prendre un rendez-vous ?",
  "Où trouver mes livrables ?",
];

const faqResponses: Record<string, string> = {
  module:
    "Vos modules sont accessibles depuis votre tableau de bord, dans la section 'Mon Parcours'. Cliquez sur un module pour voir son contenu, ses exercices et passer le quiz de validation.",
  kpi:
    "Les KPIs sont calculés automatiquement à partir de vos données de progression. Vous pouvez les consulter dans l'onglet 'KPIs' de votre tableau de bord. Votre coach peut également ajuster certains scores manuellement.",
  rdv:
    "Pour prendre un rendez-vous, rendez-vous dans la section 'Rendez-vous' de votre espace. Vous y trouverez le calendrier des disponibilités et pourrez réserver un créneau directement.",
  livrable:
    "Vos livrables se trouvent dans la section dédiée de chaque module. Vous pouvez y déposer vos fichiers (PDF, documents) et votre coach les validera.",
  parcours:
    "Votre parcours est composé de plusieurs modules thématiques. Chaque module contient du contenu théorique, des exercices pratiques et un quiz de validation. Progressez à votre rythme !",
  badge:
    "Les badges récompensent votre progression ! Vous en débloquez en complétant des modules, en participant aux sessions, en maintenant une série de connexions, etc.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();

  for (const [key, response] of Object.entries(faqResponses)) {
    if (lower.includes(key)) return response;
  }

  if (lower.includes("rendez-vous") || lower.includes("rdv"))
    return faqResponses.rdv;
  if (lower.includes("badge") || lower.includes("gamif"))
    return faqResponses.badge;

  return "Je comprends votre question. Pour une réponse personnalisée, je vous suggère de contacter directement votre coach via la messagerie. En attendant, n'hésitez pas à explorer les sections de votre tableau de bord ou à consulter les modules disponibles.";
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour ! Je suis l'assistant Neo-Coaching. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A843] text-white shadow-lg hover:bg-[#c49a3a] transition-transform hover:scale-105"
          aria-label="Ouvrir le chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-[#0A1628] px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#D4A843]" />
              <span className="text-sm font-semibold text-white">
                Assistant Neo-Coaching
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4A843]/10">
                    <Bot className="h-4 w-4 text-[#D4A843]" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#0A1628] text-white rounded-br-md"
                      : "bg-gray-100 text-gray-700 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0A1628]/10">
                    <User className="h-4 w-4 text-[#0A1628]" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4A843]/10">
                  <Bot className="h-4 w-4 text-[#D4A843]" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 rounded-bl-md">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">Rédaction...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (only show if few messages) */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-[11px] text-gray-500 hover:border-[#D4A843] hover:text-[#D4A843] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#D4A843] focus:outline-none"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4A843] text-white hover:bg-[#c49a3a] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
