"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { type MockMessage } from "@/lib/mock-data-community";
import { MessageInput } from "./message-input";
import { useMessages, insertMessage } from "@/hooks/use-supabase-data";
import type { Message, Profile } from "@/lib/supabase/types";
import { ArrowLeft, Phone, Video } from "lucide-react";

interface DmThreadProps {
  recipientId?: string;
  recipientName: string;
  recipientInitials: string;
  messages: MockMessage[];
  onBack?: () => void;
  currentUserId?: string;
}

function supabaseToMockDm(
  msg: Message & { sender?: Profile },
  currentUserId: string
): MockMessage {
  const sender = msg.sender;
  const firstName = sender?.first_name || "Utilisateur";
  const lastName = sender?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return {
    id: msg.id,
    groupId: "dm",
    senderId: msg.sender_id,
    senderName: msg.sender_id === currentUserId ? "Vous" : `${firstName} ${lastName}`.trim(),
    senderInitials: msg.sender_id === currentUserId ? "VS" : initials,
    content: msg.content,
    timestamp: msg.created_at,
    timeLabel: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isPinned: false,
  };
}

export function DmThread({
  recipientId,
  recipientName,
  recipientInitials,
  messages: initialMessages,
  onBack,
  currentUserId = "coach-1",
}: DmThreadProps) {
  // Fetch DM messages from Supabase if recipientId is provided
  const { data: supabaseMessages, refetch } = useMessages(undefined, recipientId);

  const messages = useMemo<MockMessage[]>(() => {
    if (supabaseMessages && supabaseMessages.length > 0) {
      return supabaseMessages.map((m) => supabaseToMockDm(m, currentUserId));
    }
    return initialMessages;
  }, [supabaseMessages, initialMessages, currentUserId]);

  const [localMessages, setLocalMessages] = useState<MockMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allMessages = useMemo(() => [...messages, ...localMessages], [messages, localMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  async function handleSend(content: string) {
    const tempMsg: MockMessage = {
      id: `dm-temp-${Date.now()}`,
      groupId: "dm",
      senderId: currentUserId,
      senderName: "Vous",
      senderInitials: "VS",
      content,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isPinned: false,
    };
    setLocalMessages((prev) => [...prev, tempMsg]);

    if (recipientId) {
      try {
        await insertMessage({
          sender_id: currentUserId,
          content,
          recipient_id: recipientId,
        });
        refetch();
        setLocalMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      } catch {
        // Keep optimistic message on error
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
          {recipientInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-base font-bold text-dark truncate">
            {recipientName}
          </h2>
          <p className="text-[10px] text-success">En ligne</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {allMessages.map((msg) => {
          const isOwn =
            msg.senderId === currentUserId || msg.senderName === "Vous";

          return (
            <div
              key={msg.id}
              className={cn("flex gap-2.5", isOwn ? "justify-end" : "")}
            >
              {!isOwn && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent text-[10px] font-bold shrink-0">
                  {msg.senderInitials}
                </div>
              )}

              <div className={cn("max-w-[75%] sm:max-w-[65%]")}>
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isOwn
                      ? "bg-accent text-white rounded-br-md"
                      : "bg-white text-dark border border-gray-100 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
                <p
                  className={cn(
                    "text-[10px] mt-0.5 mx-1",
                    isOwn ? "text-right text-gray-400" : "text-gray-400"
                  )}
                >
                  {msg.timeLabel}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} placeholder="Ecrire un message..." />
    </div>
  );
}
