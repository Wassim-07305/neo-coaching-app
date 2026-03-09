"use client";

import { cn } from "@/lib/utils";
import { type MockGroup } from "@/lib/mock-data-community";
import { Hash, Users, MessageCircle, Plus, Sparkles } from "lucide-react";

interface GroupListProps {
  groups: MockGroup[];
  activeGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  isAdmin?: boolean;
}

const groupIcons: Record<string, typeof Hash> = {
  general: Sparkles,
  gpe: Users,
  coaching: MessageCircle,
  dm: MessageCircle,
};

export function GroupList({
  groups,
  activeGroupId,
  onSelectGroup,
  isAdmin = false,
}: GroupListProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h2 className="font-heading text-lg font-bold text-dark">
          Mes Groupes
        </h2>
        {isAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Creer
          </button>
        )}
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => {
          const isActive = activeGroupId === group.id;
          const Icon = groupIcons[group.type] || Hash;
          const isGeneral = group.type === "general";

          return (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-l-3",
                isActive
                  ? "bg-accent/5 border-l-accent"
                  : "border-l-transparent hover:bg-gray-50"
              )}
            >
              {/* Group icon */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                  isGeneral
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Group info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={cn(
                      "text-sm font-semibold truncate",
                      isGeneral ? "text-accent" : "text-dark"
                    )}
                  >
                    {group.name}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {group.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate pr-2">
                    {group.lastMessage}
                  </p>
                  {group.unreadCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold shrink-0">
                      {group.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
