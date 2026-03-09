import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-primary py-20 sm:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
          Pret a transformer
          <br />
          <span className="text-accent">votre potentiel ?</span>
        </h2>

        <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
          30 minutes gratuites, sans engagement. Decouvrez comment le coaching peut
          accelerer votre reussite.
        </p>

        <Link
          href="/reserver"
          className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-accent/90 hover:scale-[1.02] shadow-lg shadow-accent/20"
        >
          Reserver un appel strategique
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
