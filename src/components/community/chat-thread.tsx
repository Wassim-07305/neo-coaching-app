"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  type MockMessage,
  type MockGroup,
  getMessagesForGroup,
  getPinnedMessages,
} from "@/lib/mock-data-community";
import { MessageInput } from "./message-input";
import { useMessages, insertMessage } from "@/hooks/use-supabase-data";
import type { Message, Profile } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Users,
  Pin,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Megaphone,
  Info,
} from "lucide-react";

interface ChatThreadProps {
  group: MockGroup;
  onBack?: () => void;
  isAdmin?: boolean;
  currentUserId?: string;
}

function supabaseToMockMessage(
  msg: Message & { sender?: Profile },
  currentUserId: string
): MockMessage {
  const sender = msg.sender;
  const firstName = sender?.first_name || "Utilisateur";
  const lastName = sender?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return {
    id: msg.id,
    groupId: msg.group_id || "",
    senderId: msg.sender_id,
    senderName: msg.sender_id === currentUserId ? "Vous" : `${firstName} ${lastName}`.trim(),
    senderInitials: msg.sender_id === currentUserId ? "VS" : initials,
    content: msg.content,
    timestamp: msg.created_at,
    timeLabel: new Date(msg.created_at).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isPinned: msg.is_pinned,
  };
}

export function ChatThread({
  group,
  onBack,
  isAdmin = false,
  currentUserId = "coach-1",
}: ChatThreadProps) {
  // Fetch messages from Supabase
  const { data: supabaseMessages, refetch } = useMessages(group.id);

  // Build message list: prefer Supabase, fallback to mock
  const initialMessages = useMemo(() => getMessagesForGroup(group.id), [group.id]);

  const messages = useMemo<MockMessage[]>(() => {
    if (supabaseMessages && supabaseMessages.length > 0) {
      return supabaseMessages.map((m) => supabaseToMockMessage(m, currentUserId));
    }
    return initialMessages;
  }, [supabaseMessages, initialMessages, currentUserId]);

  const [localMessages, setLocalMessages] = useState<MockMessage[]>([]);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset local messages when group changes
  const [prevGroupId, setPrevGroupId] = useState(group.id);
  if (group.id !== prevGroupId) {
    setPrevGroupId(group.id);
    setLocalMessages([]);
  }

  const allMessages = useMemo(() => [...messages, ...localMessages], [messages, localMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const pinnedMessages = useMemo(() => {
    const supabasePinned = allMessages.filter((m) => m.isPinned);
    if (supabasePinned.length > 0) return supabasePinned;
    return getPinnedMessages(group.id);
  }, [allMessages, group.id]);

  async function handleSend(content: string) {
    // Optimistic local message
    const tempMsg: MockMessage = {
      id: `msg-temp-${Date.now()}`,
      groupId: group.id,
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

    // Persist to Supabase
    try {
      await insertMessage({
        sender_id: currentUserId,
        content,
        group_id: group.id,
      });
      // Refetch to get the real message with proper id
      refetch();
      // Remove the optimistic message once refetch completes
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } catch {
      // Keep optimistic message on error
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-base font-bold text-dark truncate">
            {group.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            {group.memberCount} membres
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && group.type === "general" && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors">
              <Megaphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Annonce</span>
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Pinned messages (collapsible) */}
      {pinnedMessages.length > 0 && (
        <div className="bg-accent/5 border-b border-accent/20 shrink-0">
          <button
            onClick={() => setPinnedOpen(!pinnedOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-accent"
          >
            <span className="flex items-center gap-1.5">
              <Pin className="w-3 h-3" />
              {pinnedMessages.length} message{pinnedMessages.length > 1 ? "s" : ""}{" "}
              epingle{pinnedMessages.length > 1 ? "s" : ""}
            </span>
            {pinnedOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {pinnedOpen && (
            <div className="px-4 pb-3 space-y-2">
              {pinnedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-2.5 bg-white rounded-lg border border-accent/10 text-xs text-gray-600"
                >
                  <span className="font-semibold text-dark">
                    {msg.senderName}
                  </span>
                  : {msg.content.slice(0, 120)}
                  {msg.content.length > 120 ? "..." : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {allMessages.map((msg) => {
          const isOwn =
            msg.senderId === currentUserId || msg.senderName === "Vous";
          const isAdminMsg = msg.senderId === "admin";

          return (
            <div
              key={msg.id}
              className={cn("flex gap-2.5", isOwn ? "justify-end" : "")}
            >
              {/* Avatar (left side for others) */}
              {!isOwn && (
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-bold shrink-0",
                    isAdminMsg
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {msg.senderInitials}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[75%] sm:max-w-[65%]",
                  isOwn ? "order-1" : ""
                )}
              >
                {/* Sender name (for others) */}
                {!isOwn && (
                  <p
                    className={cn(
                      "text-[10px] font-semibold mb-0.5 ml-1",
                      isAdminMsg ? "text-accent" : "text-gray-500"
                    )}
                  >
                    {msg.senderName}
                    {msg.isPinned && (
                      <Pin className="w-2.5 h-2.5 inline ml-1 text-accent" />
                    )}
                  </p>
                )}
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isOwn
                      ? "bg-accent text-white rounded-br-md"
                      : "bg-white text-dark border border-gray-100 rounded-bl-md"
                  )}
                >
                  {msg.content}

                  {/* Attachment */}
                  {msg.attachment && (
                    <div
                      className={cn(
                        "flex items-center gap-2 mt-2 px-3 py-2 rounded-lg",
                        isOwn ? "bg-white/20" : "bg-gray-50"
                      )}
                    >
                      <FileText
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isOwn ? "text-white/80" : "text-accent"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs font-medium truncate",
                            isOwn ? "text-white" : "text-dark"
                          )}
                        >
                          {msg.attachment.name}
                        </p>
                        <p
                          className={cn(
                            "text-[10px]",
                            isOwn ? "text-white/60" : "text-gray-400"
                          )}
                        >
                          {msg.attachment.size}
                        </p>
                      </div>
                      <Download
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isOwn ? "text-white/70" : "text-gray-400"
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Timestamp */}
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
      <MessageInput onSend={handleSend} />
    </div>
  );
}
