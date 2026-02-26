import Link from "next/link";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Intervenants", href: "/intervenants" },
  { label: "Reserver", href: "/reserver" },
];

export function Footer() {
  return (
    <footer className="bg-primary border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success font-heading text-sm font-bold text-white">
                NC
              </div>
              <span className="font-heading text-lg font-bold text-white">
                Neo-Coaching
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Coaching professionnel et formation certifiee par Jean-Claude YEKPE.
              Transformez votre potentiel.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:contact@neo-formations.fr"
                  className="hover:text-accent transition-colors"
                >
                  contact@neo-formations.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33600000000"
                  className="hover:text-accent transition-colors"
                >
                  +33 6 00 00 00 00
                </a>
              </li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; 2026 NEO-FORMATIONS. Tous droits reserves.</p>
          <Link href="#" className="hover:text-accent transition-colors">
            Mentions legales
          </Link>
        </div>
      </div>
    </footer>
  );
}
