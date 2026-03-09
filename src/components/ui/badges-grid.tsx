"use client";

import { Trophy } from "lucide-react";
import { allBadges } from "@/lib/gamification";
import { BadgeCard } from "@/components/ui/badge-card";

export interface BadgesGridProps {
  earnedBadgeIds?: string[];
  earnedDates?: Record<string, string>;
}

const defaultEarned = ["premier_module", "premier_rdv", "premier_message"];

export function BadgesGrid({ earnedBadgeIds = defaultEarned, earnedDates = {} }: BadgesGridProps) {
  const earnedCount = earnedBadgeIds.length;
  const totalCount = allBadges.length;
  const pct = Math.round((earnedCount / totalCount) * 100);

  const sorted = [...allBadges].sort((a, b) => {
    const aEarned = earnedBadgeIds.includes(a.id) ? 0 : 1;
    const bEarned = earnedBadgeIds.includes(b.id) ? 0 : 1;
    return aEarned - bEarned;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#D4A843]" />
          <h3 className="font-heading text-lg font-bold text-dark">
            Vos Badges
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          {earnedCount}/{totalCount} obtenus
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-[#D4A843] to-[#c49a3a] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earnedBadgeIds.includes(badge.id)}
            earnedDate={earnedDates[badge.id]}
          />
        ))}
      </div>
    </div>
  );
}
