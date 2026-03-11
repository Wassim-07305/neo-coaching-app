import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Politique de confidentialite | Neo-Coaching",
};

export default function ConfidentialitePage() {
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
          Politique de confidentialite
        </h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des donnees personnelles est :<br />
              <strong>NEO-FORMATIONS</strong>, representee par Jean-Claude
              YEKPE<br />
              Email : contact@neo-formations.fr
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              2. Donnees collectees
            </h2>
            <p>Nous collectons les donnees suivantes :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Donnees d&apos;identification :</strong> nom, prenom,
                adresse email, numero de telephone
              </li>
              <li>
                <strong>Donnees professionnelles :</strong> entreprise, poste,
                departement
              </li>
              <li>
                <strong>Donnees de suivi coaching :</strong> scores KPI,
                progression modules, resultats questionnaires, notes de session
              </li>
              <li>
                <strong>Donnees de connexion :</strong> adresse IP, navigateur,
                horodatage des connexions
              </li>
              <li>
                <strong>Donnees de communication :</strong> messages dans la
                communaute, echanges avec le coach
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              3. Finalites du traitement
            </h2>
            <p>Vos donnees sont collectees pour :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gerer votre compte et votre acces a la plateforme</li>
              <li>Assurer le suivi de votre parcours de coaching</li>
              <li>Calculer et suivre vos indicateurs de performance (KPIs)</li>
              <li>Generer des rapports de progression personnalises</li>
              <li>
                Permettre la communication entre coachees, dirigeants et coachs
              </li>
              <li>Envoyer des notifications et rappels de rendez-vous</li>
              <li>
                Ameliorer nos services et personnaliser votre experience
              </li>
              <li>Respecter nos obligations legales et contractuelles</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              4. Base legale
            </h2>
            <p>Le traitement de vos donnees est fonde sur :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>L&apos;execution du contrat</strong> de coaching entre
                vous et NEO-FORMATIONS
              </li>
              <li>
                <strong>Votre consentement</strong> pour les communications
                marketing et la newsletter
              </li>
              <li>
                <strong>L&apos;interet legitime</strong> de NEO-FORMATIONS pour
                l&apos;amelioration de ses services
              </li>
              <li>
                <strong>Les obligations legales</strong> en matiere de formation
                professionnelle (Qualiopi)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              5. Duree de conservation
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Donnees de compte : pendant la duree de la relation
                contractuelle + 3 ans apres la fin du contrat
              </li>
              <li>Donnees de coaching et KPIs : 5 ans apres la fin du parcours</li>
              <li>
                Donnees de facturation : 10 ans (obligations comptables)
              </li>
              <li>
                Cookies et donnees de connexion : 13 mois maximum
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              6. Partage des donnees
            </h2>
            <p>
              Vos donnees peuvent etre partagees avec :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Votre dirigeant d&apos;entreprise</strong> (B2B
                uniquement) : KPIs agreges de l&apos;equipe, progression
                modules
              </li>
              <li>
                <strong>Les intervenants/co-coachs</strong> : uniquement les
                donnees necessaires a la prestation
              </li>
              <li>
                <strong>Sous-traitants techniques :</strong> Vercel
                (hebergement), Supabase (base de donnees), Resend (emails),
                Stripe (paiements)
              </li>
            </ul>
            <p className="mt-2">
              Vos donnees ne sont jamais vendues a des tiers. Les notes
              personnelles prises dans les reflexions guidees restent
              strictement privees et ne sont pas visibles par l&apos;administrateur.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              7. Vos droits (RGPD)
            </h2>
            <p>
              Conformement au Reglement General sur la Protection des Donnees
              (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Droit d&apos;acces :</strong> obtenir une copie de vos
                donnees personnelles
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger des donnees
                inexactes
              </li>
              <li>
                <strong>Droit a l&apos;effacement :</strong> demander la
                suppression de vos donnees
              </li>
              <li>
                <strong>Droit a la portabilite :</strong> recevoir vos donnees
                dans un format structure
              </li>
              <li>
                <strong>Droit d&apos;opposition :</strong> vous opposer au
                traitement de vos donnees
              </li>
              <li>
                <strong>Droit a la limitation :</strong> restreindre le
                traitement de vos donnees
              </li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous a :{" "}
              <a
                href="mailto:contact@neo-formations.fr"
                className="text-accent hover:underline"
              >
                contact@neo-formations.fr
              </a>
            </p>
            <p className="mt-2">
              Vous pouvez egalement introduire une reclamation aupres de la
              CNIL (Commission Nationale de l&apos;Informatique et des
              Libertes) : www.cnil.fr
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              8. Cookies
            </h2>
            <p>
              Le site utilise des cookies strictement necessaires au
              fonctionnement de la plateforme (authentification, session
              utilisateur). Aucun cookie de tracking publicitaire n&apos;est
              utilise.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-dark mb-3">
              9. Securite
            </h2>
            <p>
              NEO-FORMATIONS met en oeuvre des mesures techniques et
              organisationnelles appropriees pour proteger vos donnees :
              chiffrement des communications (HTTPS/TLS), controle d&apos;acces
              par role (RLS), authentification securisee, journalisation des
              acces (audit log).
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
