"use client";

import { Users, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface MyGroupProps {
  groupName: string;
  unreadMessages: number;
}

export function MyGroup({ groupName, unreadMessages }: MyGroupProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-dark text-base mb-4">Mon Groupe</h2>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark">{groupName}</p>
          {unreadMessages > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <MessageCircle className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">
                {unreadMessages} message{unreadMessages > 1 ? "s" : ""} non lu{unreadMessages > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        href="/salarie/communaute"
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        Acceder au groupe
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
