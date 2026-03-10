"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useMessages, insertMessage, useProfiles } from "@/hooks/use-supabase-data";
import type { Message, Profile } from "@/lib/supabase/types";

interface DisplayMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  timeLabel: string;
  isOwn: boolean;
}

// Mock messages as fallback
const mockMessages: DisplayMessage[] = [
  {
    id: "m-1",
    senderId: "coach-1",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Bonjour ! J'espere que vous allez bien. Je voulais vous faire un point rapide sur l'avancement de votre equipe ce mois-ci.",
    timestamp: "2026-02-20T09:30:00",
    timeLabel: "09:30",
    isOwn: false,
  },
  {
    id: "m-2",
    senderId: "dirigeant-1",
    senderName: "Vous",
    senderInitials: "VS",
    content:
      "Bonjour Jean-Claude, merci ! Oui, je suis curieux de savoir comment ca avance. Est-ce que tout le monde est bien engage ?",
    timestamp: "2026-02-20T10:15:00",
    timeLabel: "10:15",
    isOwn: true,
  },
  {
    id: "m-3",
    senderId: "coach-1",
    senderName: "Jean-Claude",
    senderInitials: "JC",
    content:
      "Globalement oui, les indicateurs sont en hausse. J'observe une bonne dynamique de groupe.",
    timestamp: "2026-02-20T11:00:00",
    timeLabel: "11:00",
    isOwn: false,
  },
];

function supabaseToDisplay(
  msg: Message & { sender?: Profile },
  currentUserId: string
): DisplayMessage {
  const sender = msg.sender;
  const firstName = sender?.first_name || "Utilisateur";
  const lastName = sender?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const isOwn = msg.sender_id === currentUserId;

  return {
    id: msg.id,
    senderId: msg.sender_id,
    senderName: isOwn ? "Vous" : `${firstName} ${lastName}`.trim(),
    senderInitials: isOwn ? "VS" : initials,
    content: msg.content,
    timestamp: msg.created_at,
    timeLabel: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwn,
  };
}

export default function DirigeantMessagesPage() {
  const { user, profile } = useAuth();
  const currentUserId = user?.id || "";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch admin profiles to find the coach/admin to message
  const { data: adminProfiles } = useProfiles({ role: "admin" });

  // The coach is the first admin found
  const coach = useMemo(() => {
    if (adminProfiles && adminProfiles.length > 0) {
      return adminProfiles[0];
    }
    return null;
  }, [adminProfiles]);

  const coachId = coach?.id;
  const coachName = coach
    ? `${coach.first_name} ${coach.last_name}`.trim()
    : "Jean-Claude YEKPE";
  const coachInitials = coach
    ? `${coach.first_name?.charAt(0) || "J"}${coach.last_name?.charAt(0) || "C"}`.toUpperCase()
    : "JC";

  // Fetch DM messages with the coach (scoped to current user)
  const { data: supabaseMessages, loading, refetch } = useMessages(
    undefined,
    coachId,
    currentUserId || undefined
  );

  const messages = useMemo<DisplayMessage[]>(() => {
    if (supabaseMessages && supabaseMessages.length > 0) {
      return supabaseMessages.map((m) => supabaseToDisplay(m, currentUserId));
    }
    return mockMessages;
  }, [supabaseMessages, currentUserId]);

  const [localMessages, setLocalMessages] = useState<DisplayMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const allMessages = useMemo(
    () => [...messages, ...localMessages],
    [messages, localMessages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  async function handleSend() {
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage("");

    // Optimistic message
    const tempMsg: DisplayMessage = {
      id: `dm-temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: "Vous",
      senderInitials: `${profile?.first_name?.charAt(0) || "V"}${profile?.last_name?.charAt(0) || "S"}`.toUpperCase(),
      content,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };
    setLocalMessages((prev) => [...prev, tempMsg]);

    if (coachId) {
      try {
        await insertMessage({
          sender_id: currentUserId,
          content,
          recipient_id: coachId,
        });
        refetch();
        setLocalMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      } catch {
        // Keep optimistic message on error
      }
    }
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
            <span className="text-white text-sm font-bold">{coachInitials}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">{coachName}</p>
            <p className="text-xs text-gray-500">Coach - Neo Coaching</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : allMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">
                Aucun message pour le moment. Envoyez un message a votre coach !
              </p>
            </div>
          ) : (
            allMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.isOwn ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                    msg.isOwn
                      ? "bg-accent/20 text-accent"
                      : "bg-primary text-white"
                  )}
                >
                  {msg.senderInitials}
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-2.5",
                    msg.isOwn
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-dark"
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      msg.isOwn ? "text-white/60" : "text-gray-400"
                    )}
                  >
                    {msg.timeLabel}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
