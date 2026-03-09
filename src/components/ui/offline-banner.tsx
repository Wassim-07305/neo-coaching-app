"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

export function OfflineBanner() {
  const isOffline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-warning text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      Vous etes hors ligne. Certaines fonctionnalites peuvent etre limitees.
    </div>
  );
}
