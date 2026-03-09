"use client";

import { useState } from "react";
import { mockGroups } from "@/lib/mock-data-community";
import { GroupList } from "@/components/community/group-list";
import { ChatThread } from "@/components/community/chat-thread";
import { MessageSquare } from "lucide-react";

export default function SalarieCommunautePage() {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Salarie sees only their groups (for mock, show all)
  const userGroups = mockGroups;
  const activeGroup = userGroups.find((g) => g.id === activeGroupId) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-xl font-bold text-dark">
          Communaute
        </h1>
      </div>

      {/* Mobile-first: group list OR chat */}
      {!activeGroup ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <GroupList
            groups={userGroups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-180px)]">
          <ChatThread
            group={activeGroup}
            onBack={() => setActiveGroupId(null)}
            currentUserId="coach-1"
          />
        </div>
      )}
    </div>
  );
}
