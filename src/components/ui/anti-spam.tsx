"use client";

import { useState, useEffect, useCallback } from "react";

interface HoneypotFieldProps {
  onBotDetected?: () => void;
}

/**
 * Invisible honeypot field — bots fill it, humans don't.
 * Also checks submission timing (too fast = bot).
 */
export function HoneypotField({ onBotDetected }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        opacity: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <label htmlFor="website_url">Website</label>
      <input
        type="text"
        id="website_url"
        name="website_url"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => onBotDetected?.()}
      />
    </div>
  );
}

interface AntiSpamResult {
  isBot: boolean;
  score: number; // 0 = human, 1 = definitely bot
  reasons: string[];
}

/**
 * Client-side anti-spam hook. Combines:
 * - Time-based detection (form filled too fast)
 * - Honeypot detection
 * - Simple interaction tracking
 */
export function useAntiSpam(minFillTimeMs = 3000) {
  const [loadTime] = useState(Date.now());
  const [honeypotTriggered, setHoneypotTriggered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMoved(true);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    const handleKeyDown = () => {
      setHasInteracted(true);
      window.removeEventListener("keydown", handleKeyDown);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onHoneypotTriggered = useCallback(() => {
    setHoneypotTriggered(true);
  }, []);

  const validate = useCallback((): AntiSpamResult => {
    const reasons: string[] = [];
    let score = 0;

    const fillTime = Date.now() - loadTime;
    if (fillTime < minFillTimeMs) {
      reasons.push("form_too_fast");
      score += 0.4;
    }

    if (honeypotTriggered) {
      reasons.push("honeypot_filled");
      score += 0.5;
    }

    if (!mouseMoved && !hasInteracted) {
      reasons.push("no_interaction");
      score += 0.2;
    }

    return {
      isBot: score >= 0.5,
      score: Math.min(score, 1),
      reasons,
    };
  }, [loadTime, minFillTimeMs, honeypotTriggered, mouseMoved, hasInteracted]);

  return {
    HoneypotField: () => <HoneypotField onBotDetected={onHoneypotTriggered} />,
    validate,
    honeypotTriggered,
  };
}
