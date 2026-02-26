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
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-dark mb-1">
            {title}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {description}
          </p>
        </div>
        {actionLabel && (actionHref || onAction) && (
          actionHref ? (
            <Link
              href={actionHref}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              {actionLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
}
