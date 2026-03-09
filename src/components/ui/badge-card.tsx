"use client";

import {
  BookOpen,
  GraduationCap,
  Calendar,
  Heart,
  TrendingUp,
  Crown,
  MessageCircle,
  MessagesSquare,
  FileCheck,
  Flame,
  Zap,
  Award,
  Lock,
} from "lucide-react";
import type { Badge } from "@/lib/gamification";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  GraduationCap,
  Calendar,
  Heart,
  TrendingUp,
  Crown,
  MessageCircle,
  MessagesSquare,
  FileCheck,
  Flame,
  Zap,
  Award,
};

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  earnedDate?: string;
}

export function BadgeCard({ badge, earned, earnedDate }: BadgeCardProps) {
  const Icon = iconMap[badge.icon];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-200",
        earned
          ? "bg-gradient-to-b from-[#D4A843]/20 to-[#D4A843]/5 border border-[#D4A843]/40 shadow-[0_0_12px_rgba(212,168,67,0.15)] hover:scale-105"
          : "bg-white/5 border border-white/10 opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          earned ? "bg-[#D4A843]/20" : "bg-white/10"
        )}
      >
        {earned && Icon ? (
          <Icon className="h-6 w-6 text-[#D4A843]" />
        ) : (
          <Lock className="h-5 w-5 text-gray-500" />
        )}
      </div>

      <p
        className={cn(
          "text-sm font-semibold leading-tight",
          earned ? "text-white" : "text-gray-500"
        )}
      >
        {badge.name}
      </p>

      {earned && (
        <p className="text-xs text-gray-400">{badge.description}</p>
      )}

      {earned && earnedDate && (
        <p className="text-[10px] text-[#D4A843]/70">{earnedDate}</p>
      )}
    </div>
  );
}
