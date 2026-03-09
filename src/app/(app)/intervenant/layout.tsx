"use client";

import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Clock,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/ui/notification-bell";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/intervenant/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/intervenant/reservations", label: "Mes reservations", icon: Calendar },
  { href: "/intervenant/disponibilites", label: "Disponibilites", icon: Clock },
];

export default function IntervenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const pathname = usePathname();
  const supabase = createClient();

  // Check role - intervenant only
  if (profile && profile.role !== "intervenant" && profile.role !== "admin") {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/connexion";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/intervenant/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-success flex items-center justify-center text-white font-heading font-bold text-sm">
                NC
              </div>
              <span className="font-heading font-semibold text-accent hidden sm:inline">
                Neo-Coaching
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-gray-300 hidden sm:inline">
                  {profile?.first_name} {profile?.last_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Deconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-white/10 px-4 py-2 flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
