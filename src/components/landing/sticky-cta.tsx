"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past the hero (roughly 80vh)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 hidden sm:flex items-center gap-3 bg-accent text-white rounded-2xl px-5 py-3 shadow-xl shadow-accent/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
      )}
    >
      <Calendar className="h-5 w-5 shrink-0" />
      <Link
        href="/reserver"
        className="text-sm font-semibold hover:underline whitespace-nowrap"
      >
        Reserver une consultation
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="ml-1 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
