"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#0A1628",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            fontFamily: "'Inter', Arial, sans-serif",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "#2D8C4E",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
              }}
            >
              NC
            </div>

            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              Une erreur critique est survenue
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Un probleme inattendu s&apos;est produit. Veuillez recharger la
              page.
            </p>

            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: "#D4A843",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
