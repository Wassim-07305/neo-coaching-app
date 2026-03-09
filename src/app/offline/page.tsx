"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
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
            margin: "0 auto 24px",
          }}
        >
          NC
        </div>

        <WifiOff
          style={{
            width: "48px",
            height: "48px",
            color: "#9ca3af",
            margin: "0 auto 24px",
          }}
        />

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "12px",
          }}
        >
          Vous êtes hors ligne
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          Vérifiez votre connexion internet et réessayez.
        </p>

        <button
          onClick={() => window.location.reload()}
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
          <RefreshCw style={{ width: "16px", height: "16px" }} />
          Réessayer
        </button>
      </div>
    </div>
  );
}
