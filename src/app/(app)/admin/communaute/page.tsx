"use client";

import { useState } from "react";
import { mockGroups, type MockGroup } from "@/lib/mock-data-community";
import { GroupList } from "@/components/community/group-list";
import { ChatThread } from "@/components/community/chat-thread";
import { CreateGroupModal } from "@/components/admin/create-group-modal";
import { MessageSquare } from "lucide-react";

export default function AdminCommunautePage() {
  const [groups, setGroups] = useState<MockGroup[]>(mockGroups);
  const [activeGroupId, setActiveGroupId] = useState<string>("grp-general");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeGroup = groups.find((g) => g.id === activeGroupId) || null;

  const handleGroupCreated = (newGroup: { name: string; type: string }) => {
    // Map our type to MockGroup type
    const typeMap: Record<string, MockGroup["type"]> = {
      entreprise: "gpe",
      coaching_individuel: "coaching",
      general: "general",
    };

    const group: MockGroup = {
      id: `grp-${Date.now()}`,
      name: newGroup.name,
      type: typeMap[newGroup.type] || "gpe",
      memberCount: 1,
      members: ["admin"],
      lastMessage: "Groupe cree",
      lastMessageTime: "A l'instant",
      unreadCount: 0,
    };
    setGroups((prev) => [...prev, group]);
    setActiveGroupId(group.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">
          Communaute
        </h1>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-160px)]">
        {/* Left panel - Group list */}
        <div className="w-80 border-r border-gray-200 shrink-0">
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            onCreateGroup={() => setShowCreateModal(true)}
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

      {/* Mobile layout: show group list OR chat */}
      <div className="md:hidden">
        {!activeGroup ? (
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            onCreateGroup={() => setShowCreateModal(true)}
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

      {/* Create group modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}
