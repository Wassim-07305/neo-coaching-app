import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Conditions Generales d'Utilisation | Neo-Coaching",
};

export default function CGUPage() {
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
          Conditions Generales d&apos;Utilisation
        </h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              1. Objet
            </h2>
            <p>
              Les presentes Conditions Generales d&apos;Utilisation (CGU)
              regissent l&apos;acces et l&apos;utilisation de la plateforme
              Neo-Coaching, editee par NEO-FORMATIONS. En accedant a la
              plateforme, vous acceptez sans reserve les presentes CGU.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              2. Description des services
            </h2>
            <p>
              Neo-Coaching est une plateforme de coaching professionnel
              proposant :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Des modules de formation en ligne (videos, textes, quiz,
                reflexions guidees)
              </li>
              <li>
                Un suivi personnalise avec indicateurs de performance (KPIs)
              </li>
              <li>
                La planification et le suivi de rendez-vous de coaching
              </li>
              <li>
                Un espace communautaire de discussion et d&apos;entraide
              </li>
              <li>
                Des rapports de progression automatiques
              </li>
              <li>
                L&apos;acces a un annuaire d&apos;intervenants specialises
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              3. Inscription et compte utilisateur
            </h2>
            <p>
              L&apos;acces aux services necessite la creation d&apos;un compte.
              L&apos;utilisateur s&apos;engage a :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Fournir des informations exactes et a jour</li>
              <li>Maintenir la confidentialite de ses identifiants</li>
              <li>
                Informer immediatement NEO-FORMATIONS de toute utilisation non
                autorisee de son compte
              </li>
              <li>
                Ne pas creer de compte sous une fausse identite
              </li>
            </ul>
            <p className="mt-2">
              Les comptes B2B (salaries) sont crees par l&apos;administrateur
              ou via un lien d&apos;invitation. Les comptes B2C (coachees
              individuelles) sont crees lors de la reservation d&apos;une
              consultation.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              4. Utilisation de la plateforme
            </h2>
            <p>L&apos;utilisateur s&apos;engage a :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Utiliser la plateforme conformement a sa finalite de coaching
                professionnel
              </li>
              <li>
                Respecter les autres utilisateurs dans les espaces
                communautaires
              </li>
              <li>
                Ne pas diffuser de contenu inapproprie, diffamatoire ou
                contraire aux bonnes moeurs
              </li>
              <li>
                Ne pas tenter d&apos;acceder a des donnees qui ne lui sont pas
                destinees
              </li>
              <li>
                Ne pas perturber le fonctionnement de la plateforme
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              5. Modules de formation
            </h2>
            <p>
              Les modules de formation sont assignes par l&apos;administrateur
              (Jean-Claude YEKPE) ou dans le cadre d&apos;un parcours
              entreprise. L&apos;utilisateur beneficie d&apos;un droit
              d&apos;acces personnel et non cessible aux contenus qui lui sont
              attribues. Toute reproduction ou diffusion des contenus de
              formation est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              6. Rendez-vous et annulation
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Les rendez-vous de coaching sont planifies via la plateforme
              </li>
              <li>
                Toute annulation doit etre effectuee au minimum 24 heures avant
                le rendez-vous
              </li>
              <li>
                En cas d&apos;annulation tardive ou de non-presentation, la
                seance peut etre consideree comme effectuee
              </li>
              <li>
                NEO-FORMATIONS se reserve le droit de reporter un rendez-vous
                en cas de force majeure
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              7. Communaute et moderation
            </h2>
            <p>
              Les espaces communautaires sont moderes par
              l&apos;administrateur. NEO-FORMATIONS se reserve le droit de
              supprimer tout message contraire aux presentes CGU et de
              suspendre l&apos;acces d&apos;un utilisateur en cas de
              manquement repete. L&apos;utilisateur sera informe de la raison
              de toute action de moderation.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              8. Propriete intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus de la plateforme (modules, videos,
              textes, logos, design) sont proteges par le droit de la propriete
              intellectuelle. Les certificats de completion delivres sont la
              propriete de l&apos;utilisateur qui les a obtenus.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              9. Tarifs et paiement
            </h2>
            <p>
              Les tarifs des prestations sont indiques sur la page Tarifs du
              site. Le paiement s&apos;effectue en ligne par carte bancaire via
              notre prestataire de paiement securise (Stripe). Les factures
              sont disponibles dans l&apos;espace client. Pour les entreprises,
              le reglement peut s&apos;effectuer par virement bancaire selon
              les modalites convenues dans le contrat.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              10. Limitation de responsabilite
            </h2>
            <p>
              NEO-FORMATIONS met tout en oeuvre pour assurer la disponibilite
              de la plateforme mais ne garantit pas un acces ininterrompu. En
              cas d&apos;interruption pour maintenance, les utilisateurs seront
              prevenus dans la mesure du possible. NEO-FORMATIONS ne saurait
              etre tenue responsable des resultats individuels du coaching, qui
              dependent de l&apos;implication personnelle de chaque utilisateur.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              11. Modification des CGU
            </h2>
            <p>
              NEO-FORMATIONS se reserve le droit de modifier les presentes CGU
              a tout moment. Les utilisateurs seront informes par notification
              dans la plateforme. La poursuite de l&apos;utilisation apres
              modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              12. Droit applicable et litiges
            </h2>
            <p>
              Les presentes CGU sont regies par le droit francais. En cas de
              litige, les parties s&apos;efforceront de trouver une solution
              amiable. A defaut, les tribunaux de Paris seront seuls
              competents.
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
