"use client";

import { useState } from "react";
import { mockGroups } from "@/lib/mock-data-community";
import { GroupList } from "@/components/community/group-list";
import { ChatThread } from "@/components/community/chat-thread";
import { MessageSquare } from "lucide-react";

export default function AdminCommunautePage() {
  const [activeGroupId, setActiveGroupId] = useState<string>("grp-general");
  const activeGroup = mockGroups.find((g) => g.id === activeGroupId) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Communaute
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-160px)] flex">
        {/* Left panel - Group list */}
        <div className="w-80 border-r border-gray-200 shrink-0 hidden md:block">
          <GroupList
            groups={mockGroups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            isAdmin
          />
        </div>

        {/* Right panel - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeGroup ? (
            <ChatThread
              group={activeGroup}
              isAdmin
              currentUserId="admin"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Selectionnez un groupe pour commencer
            </div>
          )}
        </div>
      </div>

      {/* Mobile: show group list if no active group */}
      <div className="md:hidden">
        {!activeGroup ? (
          <GroupList
            groups={mockGroups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            isAdmin
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-160px)]">
            <ChatThread
              group={activeGroup}
              isAdmin
              currentUserId="admin"
              onBack={() => setActiveGroupId("")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
