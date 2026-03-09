"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner">
            <Icon className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-xl text-dark">
            {title}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        {actionLabel && (actionHref || onAction) && (
          actionHref ? (
            <Link
              href={actionHref}
              className="px-6 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg shadow-accent/20"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg shadow-accent/20"
            >
              {actionLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
}
