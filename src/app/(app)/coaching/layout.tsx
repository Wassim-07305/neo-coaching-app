"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { NotificationBell } from "@/components/ui/notification-bell";
import { Loader2 } from "lucide-react";

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && profile?.role !== "coachee") {
      router.push("/connexion");
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (profile?.role !== "coachee") return null;

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with notification bell */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success text-white font-heading font-bold text-xs">
              NC
            </div>
            <span className="font-heading font-semibold text-primary text-sm">
              Neo-Coaching
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent text-xs font-semibold">
              {initials}
            </div>
          </div>
        </div>
      </header>
      <main className="pt-14 pb-20">
        <div className="p-4">{children}</div>
      </main>
      <BottomNav basePath="/coaching" />
    </div>
  );
}
