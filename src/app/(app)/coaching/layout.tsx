"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BottomNav } from "@/components/navigation/bottom-nav";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        <div className="p-4">{children}</div>
      </main>
      <BottomNav basePath="/coaching" />
    </div>
  );
}
