"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/push-notifications";

const DISMISS_KEY = "push-permission-dismissed-at";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type CardState = "prompt" | "success" | "error" | "hidden";

export function PushPermissionCard() {
  const [state, setState] = useState<CardState>("hidden");

  useEffect(() => {
    if (!isPushSupported()) return;

    const permission = getNotificationPermission();
    if (permission !== "default") return;

    // Check if the user dismissed the card within the last 30 days
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) return;
    }

    setState("prompt");
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setState(granted ? "success" : "error");
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setState("hidden");
  };

  if (state === "hidden") return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      {state === "prompt" && (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#D4A843]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">
              Activez les notifications
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Recevez des alertes pour vos rendez-vous, modules et messages.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleEnable}
                className="px-4 py-2 rounded-lg bg-[#D4A843] text-black text-sm font-medium hover:bg-[#D4A843]/90 transition-colors"
              >
                Activer
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Notifications activées
            </h3>
            <p className="text-white/60 text-sm mt-0.5">
              Vous recevrez des alertes pour vos rendez-vous et messages.
            </p>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Notifications refusées
            </h3>
            <p className="text-white/60 text-sm mt-0.5">
              Vous pouvez les activer plus tard dans les paramètres de votre
              navigateur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
