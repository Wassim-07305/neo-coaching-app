"use client";

import { useState } from "react";
import { MessageSquare, Send, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "dirigeant" | "coach";
  senderName: string;
  text: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "m-1",
    sender: "coach",
    senderName: "Jean-Claude",
    text: "Bonjour Laurent ! J'espere que vous allez bien. Je voulais vous faire un point rapide sur l'avancement de votre equipe ce mois-ci.",
    timestamp: "2026-02-20 09:30",
  },
  {
    id: "m-2",
    sender: "dirigeant",
    senderName: "Laurent",
    text: "Bonjour Jean-Claude, merci ! Oui, je suis curieux de savoir comment ca avance. Est-ce que tout le monde est bien engage ?",
    timestamp: "2026-02-20 10:15",
  },
  {
    id: "m-3",
    sender: "coach",
    senderName: "Jean-Claude",
    text: "Globalement oui, les indicateurs sont en hausse. J'observe une bonne dynamique de groupe. Le prochain rapport mensuel vous donnera tous les details agreges.",
    timestamp: "2026-02-20 11:00",
  },
  {
    id: "m-4",
    sender: "dirigeant",
    senderName: "Laurent",
    text: "Parfait, c'est rassurant. Est-ce que les objectifs de cohesion d'equipe progressent comme prevu ?",
    timestamp: "2026-02-21 14:30",
  },
  {
    id: "m-5",
    sender: "coach",
    senderName: "Jean-Claude",
    text: "Oui, je constate une amelioration significative. Les modules sur l'intelligence emotionnelle ont vraiment aide. Je vous enverrai le rapport detaille en fin de mois.",
    timestamp: "2026-02-21 15:45",
  },
];

export default function DirigeantMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  function handleSend() {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      sender: "dirigeant",
      senderName: "Laurent",
      text: newMessage.trim(),
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dirigeant/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>
        <MessageSquare className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Messages</h1>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        {/* Thread header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">JC</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">Jean-Claude YEKPE</p>
            <p className="text-xs text-gray-500">Coach - Neo Coaching</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.sender === "dirigeant" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                  msg.sender === "coach"
                    ? "bg-primary text-white"
                    : "bg-accent/20 text-accent"
                )}
              >
                {msg.sender === "coach" ? "JC" : <User className="w-4 h-4" />}
              </div>
              <div
                className={cn(
                  "rounded-xl px-4 py-2.5",
                  msg.sender === "coach"
                    ? "bg-gray-100 text-dark"
                    : "bg-primary text-white"
                )}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    msg.sender === "coach" ? "text-gray-400" : "text-white/60"
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ecrire un message..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30 text-dark placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
