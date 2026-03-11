import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Mentions legales | Neo-Coaching",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a l&apos;accueil
        </Link>

        <h1 className="font-heading text-3xl font-bold text-dark mb-8">
          Mentions legales
        </h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              1. Editeur du site
            </h2>
            <p>
              Le site Neo-Coaching est edite par :<br />
              <strong>NEO-FORMATIONS</strong><br />
              Dirigeant : Jean-Claude YEKPE<br />
              Adresse : Paris, France<br />
              Email : contact@neo-formations.fr<br />
              Telephone : +33 6 00 00 00 00<br />
              SIRET : [A completer]<br />
              Numero de declaration d&apos;activite : [A completer]
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              2. Hebergement
            </h2>
            <p>
              Le site est heberge par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
              Site web : vercel.com
            </p>
            <p className="mt-2">
              Base de donnees hebergee par :<br />
              <strong>Supabase Inc.</strong><br />
              970 Toa Payoh North #07-04, Singapore 318992<br />
              Site web : supabase.com
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              3. Propriete intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus presents sur le site Neo-Coaching
              (textes, images, logos, videos, modules de formation, graphismes)
              sont la propriete exclusive de NEO-FORMATIONS ou de ses
              partenaires. Toute reproduction, representation, modification,
              publication ou adaptation de tout ou partie des elements du site,
              quel que soit le moyen ou le procede utilise, est interdite sans
              autorisation ecrite prealable de NEO-FORMATIONS.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              4. Responsabilite
            </h2>
            <p>
              NEO-FORMATIONS s&apos;efforce de fournir sur le site des
              informations aussi precises que possible. Toutefois, elle ne
              pourra etre tenue responsable des omissions, des inexactitudes et
              des carences dans la mise a jour, qu&apos;elles soient de son
              fait ou du fait des tiers partenaires qui lui fournissent ces
              informations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              5. Liens hypertextes
            </h2>
            <p>
              Le site Neo-Coaching peut contenir des liens hypertextes vers
              d&apos;autres sites. NEO-FORMATIONS n&apos;exerce aucun controle
              sur ces sites et decline toute responsabilite quant a leur
              contenu.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              6. Droit applicable
            </h2>
            <p>
              Les presentes mentions legales sont soumises au droit francais.
              En cas de litige, les tribunaux francais seront seuls competents.
            </p>
          </section>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Derniere mise a jour : Mars 2026
        </p>
      </div>
    </div>
  );
}
