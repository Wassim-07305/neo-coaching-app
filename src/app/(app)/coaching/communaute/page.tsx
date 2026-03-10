"use client";

import { useState, useMemo } from "react";
import { mockGroups } from "@/lib/mock-data-community";
import { GroupList } from "@/components/community/group-list";
import { ChatThread } from "@/components/community/chat-thread";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useGroups, useMessages, useGroupMembers } from "@/hooks/use-supabase-data";

export default function CoachingCommunautePage() {
  const { profile, user, loading: authLoading } = useAuth();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Fetch groups for current user
  const { data: supabaseGroups, loading: groupsLoading } = useGroups(user?.id);
  const { data: groupMembers } = useGroupMembers(activeGroupId || undefined);
  const { data: messages } = useMessages(activeGroupId || undefined);

  // Transform Supabase data to match MockGroup props, or fallback to mock
  const userGroups = useMemo(() => {
    if (supabaseGroups && supabaseGroups.length > 0) {
      return supabaseGroups.map((g) => ({
        id: g.id,
        name: g.name,
        type: (g.type === "entreprise" ? "gpe" : g.type === "coaching_individuel" ? "coaching" : "general") as "general" | "gpe" | "coaching" | "dm",
        memberCount: 0,
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
        members: [] as string[],
      }));
    }
    // Fallback to mock data for demo
    return mockGroups;
  }, [supabaseGroups]);

  // Build active group - use mock data for chat functionality
  const activeGroup = useMemo(() => {
    // First try to find in mock groups for full chat functionality
    const mockGroup = mockGroups.find((mg) => mg.id === activeGroupId);
    if (mockGroup) return mockGroup;

    // If not in mocks, build from Supabase data
    const group = userGroups.find((g) => g.id === activeGroupId);
    if (!group) return null;

    // Return with member IDs as strings (matching MockGroup type)
    return {
      ...group,
      members: groupMembers?.map((gm) => gm.user_id) || [],
    };
  }, [activeGroupId, userGroups, groupMembers]);

  const isLoading = authLoading || groupsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const currentUserId = user?.id || profile?.id || "coach-8";

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
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}
