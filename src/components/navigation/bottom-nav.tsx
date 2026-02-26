"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  User,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Accueil", path: "/dashboard" },
  { icon: BookOpen, label: "Modules", path: "/modules" },
  { icon: MessageSquare, label: "Communaute", path: "/communaute" },
  { icon: User, label: "Profil", path: "/profil" },
];

interface BottomNavProps {
  basePath: string;
}

export function BottomNav({ basePath }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors",
                isActive ? "text-accent" : "text-gray-400"
              )}
            >
              <item.icon
                className={cn("w-5 h-5", isActive && "stroke-[2.5]")}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
