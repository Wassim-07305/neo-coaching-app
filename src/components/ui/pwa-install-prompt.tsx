"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DURATION) {
        return;
      }
      localStorage.removeItem(DISMISS_KEY);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay for slide-up animation
      requestAnimationFrame(() => setVisible(true));
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
    setTimeout(() => setDeferredPrompt(null), 300);
  };

  if (!deferredPrompt) return null;

  return (
    <div
      className={cn(
        "fixed bottom-16 left-0 right-0 z-50 px-4 pb-4 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto max-w-lg rounded-xl bg-[#0A1628] border border-white/10 p-4 shadow-2xl flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2D8C4E]">
            <Download className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-white/90 leading-tight">
            Installer Neo-Coaching sur votre appareil pour un accès rapide
          </p>
        </div>

        <button
          onClick={handleInstall}
          className="shrink-0 rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c49a3a] active:bg-[#b38d33]"
        >
          Installer
        </button>

        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1.5 text-white/50 transition-colors hover:text-white/80"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
