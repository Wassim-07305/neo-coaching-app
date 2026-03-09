"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-48 rounded-xl bg-white/10 animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-4 rounded bg-white/10 animate-pulse w-full",
        className
      )}
    />
  );
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full bg-white/10 animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonDashboard({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/10 animate-pulse p-5 space-y-3"
          >
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-8 w-16 rounded bg-white/10" />
            <div className="h-3 w-28 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Content blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/10 animate-pulse p-5 space-y-4"
          >
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-5/6 rounded bg-white/10" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="h-3 w-24 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
