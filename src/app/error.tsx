"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* NC logo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-success text-white font-heading font-bold text-2xl mx-auto mb-8">
          NC
        </div>

        {/* Error icon */}
        <div className="w-14 h-14 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7 text-danger" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-white mb-3">
          Une erreur est survenue
        </h1>

        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          Un probleme inattendu s&apos;est produit. Nous nous excusons pour la gene occasionnee.
        </p>

        {isDev && error.message && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs font-mono text-danger/80 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-gray-300 rounded-lg font-medium hover:bg-white/5 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
