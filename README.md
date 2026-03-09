# Neo-Coaching App

Plateforme de coaching professionnel par **Jean-Claude YEKPE** (NEO-FORMATIONS).

Application web complete pour la gestion de parcours de coaching individuel et entreprise, avec suivi des KPIs, modules de formation, rendez-vous, communaute et reporting.

## Stack technique

- **Framework** : Next.js 16 (App Router, Turbopack)
- **Langage** : TypeScript
- **Base de donnees & Auth** : Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Styles** : Tailwind CSS v4 (theme custom)
- **UI** : Lucide React (icones), React Hook Form + Zod (formulaires)
- **PDF** : @react-pdf/renderer (certificats, rapports)
- **PWA** : Service Worker, manifest, notifications push

## Architecture

```
src/
  app/
    (public)/          # Pages publiques (landing, connexion, blog, intervenants, reservation)
    (app)/
      admin/           # Dashboard admin (coachees, entreprises, modules, RDV, rapports, parametres)
      dirigeant/       # Espace dirigeant (dashboard, equipe, rapports, messages)
      salarie/         # Espace salarie (dashboard, modules, agenda, communaute, profil)
      coaching/        # Espace coache individuel (dashboard, modules, communaute, profil)
      notifications/   # Centre de notifications
      onboarding/      # Assistant d'onboarding
  components/
    admin/             # Composants admin (tables, formulaires, graphiques)
    booking/           # Funnel de reservation (5 etapes)
    coaching/          # Composants coache (timeline, certificats)
    community/         # Chat, DM, reactions, mentions
    dirigeant/         # KPIs agreges, comparaisons, rapports
    landing/           # Sections page d'accueil
    modules/           # Contenu module, exercices, quiz
    navigation/        # Sidebar admin, bottom nav mobile
    providers/         # AuthProvider (Supabase)
    salarie/           # Indicateurs, taches, groupe
    ui/                # Composants reutilisables (toast, KPI gauge, badges, chat IA)
  lib/
    supabase/          # Client, queries, hooks, adapters, middleware, types
    mock-data.ts       # Donnees de demonstration
```

## Roles et acces

| Role | Prefix route | Description |
|------|-------------|-------------|
| **admin** | `/admin/*` | Jean-Claude YEKPE - gestion complete |
| **dirigeant** | `/dirigeant/*` | Dirigeants d'entreprise - suivi equipe |
| **salarie** | `/salarie/*` | Collaborateurs en coaching entreprise |
| **coachee** | `/coaching/*` | Coaches individuels |
| **intervenant** | `/intervenants` | Experts externes |

Le middleware protege les routes par role : un salarie ne peut pas acceder a `/admin/*`, etc.

## Fonctionnalites principales

### Admin
- Dashboard avec statistiques temps reel (Supabase)
- Gestion des coachees (liste, fiche detaillee, KPIs, modules, annotations)
- Gestion des entreprises (liste, detail, import CSV)
- Modules de formation (CRUD, contenu riche, exercices)
- Calendrier RDV et pipeline booking
- Rapports personnalises et export PDF
- Gestion des co-coachs et permissions
- Journal d'audit
- Notifications push

### Dirigeant
- KPIs agreges de l'equipe
- Comparaison annuelle
- Rapports de progression
- Messagerie

### Salarie / Coache
- Dashboard personnalise (KPIs, modules, taches, prochain RDV)
- Parcours de modules avec exercices interactifs et quiz
- Reflexions guidees
- Badges et gamification
- Communaute (chat de groupe, DM, reactions)
- Certificats PDF telechargeables
- Changement de mot de passe

### Public
- Landing page (services, parcours, tarifs, temoignages, FAQ, blog)
- Funnel de reservation en 5 etapes
- Fiches intervenants
- Blog avec articles

## Installation

```bash
# Cloner le repo
git clone https://github.com/Wassim-07305/neo-coaching-app.git
cd neo-coaching-app

# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key  # optionnel, pour les operations admin
```

> L'application fonctionne en **mode demo** sans configuration Supabase (donnees mock).

## Developpement

```bash
# Lancer le serveur de dev
npm run dev

# Build de production
npm run build

# Linter
npm run lint
```

## Base de donnees

Les migrations Supabase sont dans `supabase/migrations/` :
- `001_initial_schema.sql` : Schema complet (profiles, companies, modules, KPIs, appointments, messages, notifications, tasks, etc.)
- `002_seed_admin.sql` : Donnees initiales (compte admin)

## Deploiement

Compatible Vercel, Netlify ou tout hebergement supportant Next.js.

```bash
npm run build
```

41 pages, 0 erreurs TypeScript.

## Licence

Projet prive - NEO-FORMATIONS / Jean-Claude YEKPE.
