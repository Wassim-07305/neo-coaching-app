"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  MessageSquare,
  UserCheck,
  FileText,
  Calendar,
  ClipboardList,
  Route,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NotificationBell } from "@/components/ui/notification-bell";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Coachees", href: "/admin/coachees" },
  { icon: Building2, label: "Entreprises", href: "/admin/entreprises" },
  { icon: BookOpen, label: "Modules", href: "/admin/modules" },
  { icon: MessageSquare, label: "Communaute", href: "/admin/communaute" },
  { icon: UserCheck, label: "Intervenants", href: "/admin/intervenants" },
  { icon: Route, label: "Parcours", href: "/admin/parcours" },
  { icon: ClipboardList, label: "Questionnaires", href: "/admin/questionnaires" },
  { icon: FileText, label: "Rapports", href: "/admin/rapports" },
  { icon: Calendar, label: "RDV / Booking", href: "/admin/rdv" },
  { icon: Video, label: "Calendly", href: "/admin/calendly" },
  { icon: Settings, label: "Parametres", href: "/admin/parametres" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    profile
      ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
      : "?";

  const sidebarContent = (
    <div className="flex flex-col h-full relative">
      {/* Premium gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      {/* Logo + Notification */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white font-heading font-bold text-sm shadow-lg shadow-accent/20">
              NC
            </div>
          </div>
          <div>
            <span className="font-heading font-bold text-white text-lg block leading-tight">
              Neo-Coaching
            </span>
            <span className="text-[10px] text-accent/80 uppercase tracking-widest font-medium">
              Administration
            </span>
          </div>
        </div>
        <NotificationBell className="[&_button]:text-gray-300 [&_button:hover]:text-white [&_button:hover]:bg-white/10" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/15 text-accent shadow-sm shadow-accent/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "drop-shadow-sm")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-white/5 px-4 py-4 bg-gradient-to-t from-black/10 to-transparent">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5">
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 text-accent text-sm font-bold ring-2 ring-accent/20">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Chargement..."}
            </p>
            <p className="text-xs text-accent/80 capitalize font-medium">
              {profile?.role || ""}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-danger/10 hover:text-danger transition-all"
        >
          <LogOut className="w-4 h-4" />
          Se deconnecter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-primary px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success text-white font-heading font-bold text-xs">
            NC
          </div>
          <span className="font-heading font-semibold text-accent text-sm">
            Neo-Coaching
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-1"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-64 bg-primary transform transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-primary z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
