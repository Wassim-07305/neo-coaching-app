"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success font-heading text-sm font-bold text-white">
              NC
            </div>
            <span className="font-heading text-lg font-bold text-white">
              Neo-Coaching
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/connexion"
              className="rounded-lg border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Connexion
            </Link>
            <Link
              href="/reserver"
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              Reserver un appel
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden pb-4 border-t border-white/10 mt-1">
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/connexion"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-medium text-white text-center transition-colors hover:bg-white/10"
              >
                Connexion
              </Link>
              <Link
                href="/reserver"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white text-center transition-colors hover:bg-accent/90"
              >
                Reserver un appel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
