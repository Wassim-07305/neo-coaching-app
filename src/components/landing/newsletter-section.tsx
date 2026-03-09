"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    if (!consent) {
      setError("Veuillez accepter de recevoir nos communications.");
      return;
    }

    // TODO: save to Supabase / Resend
    setSubmitted(true);
  }

  return (
    <section className="bg-primary py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-6">
          <Mail className="h-7 w-7 text-accent" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
          Restez inspire
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          Recevez nos conseils coaching, astuces management et
          ressources exclusives directement dans votre boite mail.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 bg-success/10 border border-success/30 rounded-xl px-6 py-4">
            <Check className="h-5 w-5 text-success" />
            <p className="text-success font-medium text-sm">
              Bienvenue ! Verifiez votre email pour confirmer votre inscription.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors shrink-0"
              >
                S&apos;inscrire
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <label className="flex items-start gap-2.5 text-left cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-accent focus:ring-accent/30 cursor-pointer"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                J&apos;accepte de recevoir les communications de Neo-Formations.
                Vous pouvez vous desinscrire a tout moment.
              </span>
            </label>

            {error && (
              <p className="text-danger text-xs text-left">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
