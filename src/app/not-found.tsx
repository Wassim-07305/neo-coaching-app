import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* NC logo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-success text-white font-heading font-bold text-2xl mx-auto mb-8">
          NC
        </div>

        {/* 404 indicator */}
        <p className="text-accent font-heading font-bold text-6xl mb-4">404</p>

        <h1 className="font-heading text-2xl font-bold text-white mb-3">
          Page introuvable
        </h1>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a ete deplacee.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
