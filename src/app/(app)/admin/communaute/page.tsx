"use client";

import { useState, useMemo } from "react";
import { mockGroups, type MockGroup } from "@/lib/mock-data-community";
import { GroupList } from "@/components/community/group-list";
import { ChatThread } from "@/components/community/chat-thread";
import { CreateGroupModal } from "@/components/admin/create-group-modal";
import { MessageSquare, Loader2 } from "lucide-react";
import { useGroups, useGroupMembers } from "@/hooks/use-supabase-data";

export default function AdminCommunautePage() {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch real data from Supabase (no userId = admin fetches all groups)
  const { data: supabaseGroups, loading: groupsLoading } = useGroups();
  const { data: groupMembers } = useGroupMembers(activeGroupId || undefined);

  // Transform Supabase groups to match MockGroup format
  const groups = useMemo<MockGroup[]>(() => {
    if (supabaseGroups && supabaseGroups.length > 0) {
      return supabaseGroups.map((g) => ({
        id: g.id,
        name: g.name,
        type: (g.type === "entreprise" ? "gpe" : g.type === "coaching_individuel" ? "coaching" : "general") as "general" | "gpe" | "coaching" | "dm",
        memberCount: 0, // Would need to count from group_members
        members: [] as string[],
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
      }));
    }
    return mockGroups;
  }, [supabaseGroups]);

  // Build active group with members
  const activeGroup = useMemo(() => {
    // First try to find in mock groups for full chat functionality
    const mockGroup = mockGroups.find((mg) => mg.id === activeGroupId);
    if (mockGroup) return mockGroup;

    // If not in mocks, build from Supabase data
    const group = groups.find((g) => g.id === activeGroupId);
    if (!group) return null;

    return {
      ...group,
      members: groupMembers?.map((gm) => gm.user_id) || [],
    };
  }, [activeGroupId, groups, groupMembers]);

  const handleGroupCreated = (newGroup: { name: string; type: string }) => {
    // When creating a group via Supabase, the groups list will be refreshed
    // For now, set the active group to trigger a re-fetch
    setShowCreateModal(false);
    // Toast notification will be shown by the modal
  };

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

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
              onBack={() => setActiveGroupId(null)}
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
