"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SwUpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setWaitingWorker(null), 300);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let autoDismissTimer: ReturnType<typeof setTimeout>;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check if there's already a waiting worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          requestAnimationFrame(() => setVisible(true));
        }

        // Listen for new updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
              requestAnimationFrame(() => setVisible(true));

              // Auto-dismiss after 30 seconds
              autoDismissTimer = setTimeout(dismiss, 30000);
            }
          });
        });
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });

    // Reload when the new SW takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    return () => {
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    };
  }, [dismiss]);

  const handleUpdate = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  if (!waitingWorker) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] px-4 pt-4 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-lg rounded-xl bg-[#0A1628] border border-white/10 p-4 shadow-2xl flex items-center gap-3">
        <RefreshCw className="h-5 w-5 shrink-0 text-[#D4A843]" />

        <p className="flex-1 text-sm text-white/90">
          Une mise à jour est disponible
        </p>

        <button
          onClick={handleUpdate}
          className="shrink-0 rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c49a3a] active:bg-[#b38d33]"
        >
          Mettre à jour
        </button>

        <button
          onClick={dismiss}
          className="shrink-0 rounded-md p-1.5 text-white/50 transition-colors hover:text-white/80"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
