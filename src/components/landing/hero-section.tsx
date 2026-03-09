import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-medium/30 rounded-full blur-3xl" />
      </div>

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
          <span className="text-accent text-sm font-medium">
            NEO-FORMATIONS par Jean-Claude YEKPE
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Dirigeant de PME
          <br />
          <span className="text-accent">ou Femme salariee</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed mb-10">
          Transformez votre potentiel avec un accompagnement sur mesure.
          Coaching individuel, management d&apos;equipes, et formation certifiee.
        </p>

        {/* CTA */}
        <Link
          href="/reserver"
          className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-accent/90 hover:scale-[1.02] shadow-lg shadow-accent/20"
        >
          Reserver un appel strategique
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-5 text-sm text-gray-400">
          30 minutes gratuites &middot; Sans engagement
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
