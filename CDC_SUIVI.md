# Suivi d'avancement - Cahier des Charges Neo-Coaching

> Derniere mise a jour : 2026-03-11
> Score global : **~75%** du CDC implemente

---

## Legende

| Icone | Signification |
|-------|---------------|
| Done | Termine et fonctionnel |
| Partiel | UI construite, backend/logique incomplete |
| Absent | Non commence |

---

## 1. Landing Page (F1-F11k) — 90%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F1 | Hero Section | Done | Hero avec CTA, responsive |
| F2 | Services Section | Done | 2 cards coaching collectif/individuel |
| F3 | Temoignages | Done | Carousel/grille, manque auto-rotate 6s |
| F4 | Experts/Intervenants | Done | Grille responsive + lien profil |
| F5 | Tarifs | Done | Tableau comparatif pricing |
| F6 | FAQ | Done | Accordeon 10 questions |
| F7 | Newsletter | Done | Formulaire email, stockage Supabase absent, Resend non connecte |
| F8 | Blog/Ressources | Done | Donnees mock dans blog-data.ts, pas de CMS |
| F9 | Statistiques/Chiffres | Done | Compteurs animes |
| F10 | CTA Reservation Flottant | Done | Sticky CTA |
| F11 | Footer | Done | Navigation secondaire |
| F11a | Hero Optimisation | Done | Headline + 2 CTA |
| F11b | Services Clarte | Done | Cards detaillees |
| F11c | Temoignages Preuve Sociale | Done | Stars + citations |
| F11d | Intervenants Repertoire | Done | Cards 300x300 + hover |
| F11e | Tarifs Transparence | Done | 3 colonnes |
| F11f | FAQ Objections | Done | Accordeon anime |
| F11g | Newsletter Capture | Done | Email + consent RGPD |
| F11h | Blog Thought Leadership | Done | Grille articles |
| F11i | Statistiques Social Proof | Done | Bandeaux animes |
| F11j | CTA Sticky | Done | Bottom-right sticky |
| F11k | Footer Detaille | Done | Pages legales MANQUANTES (CGU, Mentions, Confidentialite) |

**Reste a faire :**
- [ ] Pages legales : CGU, Mentions legales, Politique de confidentialite
- [ ] Connecter newsletter a Resend/Mailchimp
- [ ] Auto-rotate temoignages (6s)

---

## 2. Portail Administrateur (F12-F36e) — 75%

### 2.1 Dashboard Admin

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F12 | KPIs Globaux | Done | Cards stats + graphiques Recharts |
| F13 | Alertes/Notifications | Partiel | Bandeau basique, alertes KPI < 4 pas automatiques |
| F14 | Graphique Analyse | Partiel | Line charts OK, scatter plot Inv vs Eff manquant |

### 2.2 Gestion Coachees

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F15 | Liste Coachees | Done | Tableau filtres + recherche + export CSV |
| F16 | Fiche Detaillee | Done | Onglets Profil/KPIs/Modules/RDV/Messages, onglet Documents manquant |
| F17 | KPIs par Coachee | Done | Gauges + historique line chart |
| F18 | Progression Modules | Done | Timeline horizontale avec statuts |
| F19 | Historique/Annotations | Done | coachee-annotations.tsx + activity log |

### 2.3 Gestion Modules

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F20 | Liste Modules | Done | Catalogue avec filtres |
| F21 | Creation/Edition | Done | Rich text editor + module-form |
| F22 | Assignation Modules | Partiel | Selection multi OK, rappels auto (1sem, 3j) manquants |
| F23 | Suivi Progression | Partiel | Vue agregee OK, taux abandon + temps moyen non calcules |

### 2.4 Gestion Entreprises

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F24 | Liste Entreprises | Done | Tableau + filtres + export CSV |
| F25 | Fiche Entreprise | Done | Onglets Equipe/KPIs/Modules/Contrat/RDV |
| F26 | Gestion Salaries | Partiel | Formulaire OK, emails invitation auto manquants |

### 2.5 Gestion RDV

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F27 | Calendrier RDV | Done | Vue mois/semaine/jour, drag-drop manquant |
| F28 | Gestion Creneaux | Partiel | Formulaire OK, validation chevauchement + rappels auto 24h/2h manquants |
| F29 | Suivi Post-RDV | Done | post-rdv-form.tsx + session-notes-panel.tsx |

### 2.6 Rapports PDF

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F30 | Rapports Auto | Partiel | Templates PDF existent, declencheur cron manquant |
| F31 | Rapports Entreprise | Done | monthly-report-pdf.tsx |

### 2.7 Moderation Communaute

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F32 | Moderation Messages | Partiel | Vue admin OK, log suppressions + notification auteur manquants |

### 2.8 Gestion Intervenants

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F33 | Annuaire Intervenants | Done | Liste + actions |
| F34 | Edition Profil | Done | Infos + disponibilites + liens sociaux |

### 2.9 Parametres

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F35 | Configuration Globale | Partiel | Page existe, branding dynamique non configurable |
| F36 | Gestion Utilisateurs | Partiel | Formulaire OK, permissions granulaires (read/write/delete) manquantes |

### 2.10 Details Avances

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F36a | Import CSV Salaries | Done | csv-import.tsx avec preview + validation |
| F36b | Export Donnees | Done | export-data.ts (CSV, JSON) |
| F36c | Integrations Externes | Partiel | Zoom + Stripe OK, Resend non connecte, Slack absent |
| F36d | Logs Audit | Done | audit-log.ts + audit-log-view.tsx |
| F36e | Gestion Co-Coachs | Done | co-coach-management.tsx |

**Reste a faire :**
- [ ] Alertes KPI automatiques (KPI < 4, declin > 2pts)
- [ ] Scatter plot Investissement vs Efficacite (F14)
- [ ] Rappels auto assignation modules (1 sem, 3j avant deadline)
- [ ] Emails invitation salaries automatiques
- [ ] Validation chevauchement creneaux RDV
- [ ] Rappels auto RDV 24h/2h avant
- [ ] Cron generation rapports mensuels
- [ ] Permissions granulaires utilisateurs
- [ ] Connecter Resend pour emails transactionnels
- [ ] Drag-drop calendrier RDV

---

## 3. Portail Dirigeant (F37-F39a) — 80%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F37 | Vue Globale KPIs Equipe | Done | 3 gauges + evolution |
| F37a | Tableau Salaries | Done | employee-progress-list.tsx |
| F37b | Graphique Evolution | Done | evolution-chart.tsx (Recharts) |
| F38 | Rapport Mensuel Auto | Partiel | PDF OK, envoi auto 1er du mois manquant |
| F38a | Telechargement Manuel | Done | Selecteur periode + generation |
| F38b | Comparaison YoY | Done | year-comparison.tsx |
| F39 | Chat Direct | Done | dm-thread.tsx |
| F39a | Historique/Recherche | Partiel | Recherche texte libre + export conversation manquants |

**Reste a faire :**
- [ ] Envoi auto rapport mensuel (cron 1er du mois)
- [ ] Recherche texte libre dans messages
- [ ] Export conversation PDF/TXT

---

## 4. Portail Salarie B2B (F40-F44) — 85%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F40 | Dashboard Salarie | Done | KPIs + modules + taches |
| F41 | Acces Modules | Done | Liste filtrable + lecteur |
| F42 | Questionnaires Evaluation | Done | questionnaire-form.tsx |
| F43 | Communaute Equipe | Done | Chat groupe + reactions + mentions |
| F44 | Profil Salarie | Partiel | Infos + badges OK, telechargement certificats non connecte |

**Reste a faire :**
- [ ] Connecter telechargement certificats PDF au profil

---

## 5. Portail Coachee B2C (F45-F49d) — 70%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F45 | Dashboard Coaching | Done | KPIs + modules + RDV, ressources recommandees manquantes |
| F46 | Modules Individuels | Done | Lecteur complet + progression |
| F47 | Rendez-Vous | Partiel | Calendrier OK, lien Zoom in-app + recap post-RDV cote coachee manquants |
| F48 | Communaute Coachees | Done | Groupes par type, evenements live manquants |
| F49 | Profil Coachee | Done | Infos + badges + certificats |
| F49a | Onboarding | Partiel | Wizard OK, email bienvenue + tour guide interactif manquants |
| F49b | Gamification | Partiel | gamification.ts + badges OK, leaderboard + defis mensuels manquants |
| F49c | Contenu Personnalise | Absent | Algorithme recommandation base sur KPI faible absent |
| F49d | Support 24/7 | Partiel | ai-chat-widget.tsx existe, pas connecte a IA reelle, ticketing absent |

**Reste a faire :**
- [ ] Ressources recommandees du mois sur dashboard
- [ ] Lien Zoom directement dans l'app
- [ ] Recap post-RDV cote coachee
- [ ] Email de bienvenue onboarding
- [ ] Tour guide interactif (premiere visite)
- [ ] Leaderboard gamification
- [ ] Defis mensuels
- [ ] Algorithme recommandation contenu (KPI faible -> module)
- [ ] Connecter AI chat widget a une API IA
- [ ] Systeme de ticketing support

---

## 6. Systeme de KPIs (F50-F54e) — 60%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F50 | Trois Metriques | Done | Investissement, Efficacite, Participation (0-10) |
| F51 | Gauge Visuel | Done | kpi-gauge.tsx circulaire 3 couleurs |
| F52 | Badges Couleur | Done | kpi-badge.tsx inline |
| F53 | Historique KPIs | Done | kpi-history-chart.tsx (Recharts 12 mois) |
| F54 | Calcul Auto KPIs | Partiel | kpi-calculator.ts existe, pas de trigger auto (cron/webhook) |
| F54a | Formule Investissement | Partiel | Code existe, pas execute auto cote serveur |
| F54b | Formule Efficacite | Partiel | Code existe, pas execute auto cote serveur |
| F54c | Formule Participation | Partiel | Code existe, pas execute auto cote serveur |
| F54d | Ajustement Manuel | Partiel | Modal KPI scoring OK, log avant/apres + justification incomplet |
| F54e | Alertes KPI Faibles | Absent | Triggers auto (KPI < 4, declin > 2pts) totalement absents |

**Reste a faire :**
- [ ] Edge Function ou cron pour calcul KPI automatique
- [ ] Triggers alertes KPI < 4 (danger)
- [ ] Triggers alertes declin > 2 points vs semaine precedente
- [ ] Log complet ajustement manuel (avant/apres + justification)
- [ ] Notification coachee si baisse significative

---

## 7. Systeme de Rendez-Vous (F55-F61c) — 80%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F55 | Etape 1 : Infos Personnelles | Done | booking-wizard step-personal |
| F56 | Etape 2 : Situation | Done | step-situation |
| F57 | Etape 3 : Motivation | Done | step-motivation |
| F58 | Etape 4 : Qualification | Done | step-qualification |
| F59 | Etape 5 : Choix Creneau | Done | step-creneau + confirmation |
| F60 | Repertoire Experts | Done | /intervenants grille responsive |
| F61 | Fiche Expert | Done | /intervenants/[id] detail complet |
| F61a | Validations par Etape | Partiel | Zod validation OK, check email doublon DB manquant |
| F61b | Anti-Spam | Partiel | anti-spam.tsx OK, reCAPTCHA v3 non integre |
| F61c | Post-Booking Workflow | Partiel | Email confirmation auto + follow-up 24h manquants |

**Reste a faire :**
- [ ] Check email doublon en base avant soumission
- [ ] Integrer reCAPTCHA v3
- [ ] Email confirmation automatique apres booking
- [ ] Email follow-up si pas de confirmation 24h

---

## 8. Modules de Formation (F62-F67e) — 80%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F62 | Structure Hierarchique | Done | Modules > Lecons ordonnees |
| F63 | Contenu Video | Partiel | Lecteur basique, vitesse 0.75x-2x + sous-titres VTT manquants |
| F64 | Contenu Texte Riche | Done | rich-text-editor.tsx |
| F65 | Quiz Interactif | Done | quiz-interactive.tsx multi-choix |
| F66 | Suivi Progression | Done | Barre % + timeline |
| F67 | Certificat PDF | Done | certificate-pdf.tsx |
| F67a | Video Avance | Absent | CDN, multi-bitrate, transcription absents |
| F67b | Editeur Avance | Partiel | Basique, blockquotes/tables/code blocks manquants |
| F67c | Quiz Avance | Partiel | Vrai/faux, fill-in-blank, points custom manquants |
| F67d | Ressources Externes | Partiel | /salarie/documents existe, bibliotheque partagee manquante |
| F67e | Reflexions Guidees | Done | guided-reflection.tsx |

**Reste a faire :**
- [ ] Controles video : vitesse variable (0.75x-2x)
- [ ] Support sous-titres VTT
- [ ] Types quiz supplementaires (vrai/faux, fill-in-blank)
- [ ] Points custom par question de quiz
- [ ] Bibliotheque ressources partagee equipe

---

## 9. Communaute (F68-F72) — 75%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F68 | Groupes par Role | Done | Groupes company/individuel/general |
| F69 | Messages et Threads | Partiel | Chat OK, threads imbriques + edition 1h manquants |
| F70 | Reactions Emoji | Done | emoji-reactions.tsx |
| F71 | Partage Ressources | Partiel | Upload fichiers dans chat manquant |
| F72 | Moderation Admin | Partiel | Vue admin OK, bloquer user + notification raison manquants |

**Reste a faire :**
- [ ] Threads/reponses imbriquees dans messages
- [ ] Edition message dans l'heure apres envoi
- [ ] Upload fichiers dans chat (PDF, images, 10MB max)
- [ ] Action bloquer utilisateur
- [ ] Notification utilisateur avec raison moderation

---

## 10. Rapports PDF (F73-F75d) — 70%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F73 | Generation Automatique | Partiel | Templates OK, cron trigger manquant |
| F74 | Contenu Rapport | Done | KPIs + modules + RDV + recommandations |
| F75 | Rapport Equipe | Done | Agregation par entreprise |
| F75a | Rapport Detaille Coachee | Done | individual-report-pdf.tsx |
| F75b | Rapport Comparatif Equipe | Partiel | PDF OK, courbe Gauss distribution KPI manquante |
| F75c | Rapports Personnalises | Done | custom-report.tsx avec filtres |
| F75d | Export et Partage | Partiel | PDF/CSV OK, lien public temporaire 24h + cloud save manquants |

**Reste a faire :**
- [ ] Cron trigger generation rapports fin de mois/trimestre
- [ ] Graphique distribution KPI (courbe Gauss)
- [ ] Lien public temporaire (24h expiry) pour partage rapports
- [ ] Integration cloud save (Google Drive/Dropbox)

---

## 11. Notifications (F76-F79) — 65%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F76 | Six Types Notifications | Partiel | Types definis, triggers auto pas branches |
| F77 | Cloche In-App | Done | notification-bell.tsx + page /notifications |
| F78 | Push PWA | Partiel | push-notifications.ts existe, envoi serveur reel manquant (VAPID) |
| F79 | Emails Notification | Partiel | email-templates.ts OK, envoi auto Resend non connecte |

**Reste a faire :**
- [ ] Brancher triggers auto : nouveau module assigne, KPI change, RDV 24h
- [ ] Configurer VAPID keys + web-push package pour push serveur
- [ ] Connecter Resend pour envoi emails automatiques
- [ ] Preferences notification par utilisateur (frequence, unsubscribe)

---

## 12. PWA & Offline (F80-F82) — 80%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F80 | Progressive Web App | Done | Manifest + icones + install prompt |
| F81 | Service Worker | Done | sw.js cache strategies |
| F82 | Banneau Offline | Done | offline-banner.tsx + /offline page |
| - | Background Sync | Absent | Queue actions offline non implemente |

**Reste a faire :**
- [ ] Background sync : queue actions offline pour sync au retour en ligne

---

## 13. Design System (F83-F86h) — 90%

| ID | Feature | Statut | Notes |
|----|---------|--------|-------|
| F83 | Palette Couleurs | Done | Navy #0A1628, Gold #D4A843, etc. |
| F84 | Typographie | Done | Montserrat + Inter |
| F85 | Composants Reutilisables | Done | Buttons, Cards, Inputs, Modales, Gauges, Badges |
| F86 | Responsive Design | Done | Mobile-first, breakpoints 640/1024/1440 |
| F86a | Boutons et CTA | Done | Primaire/Secondaire/Ghost |
| F86b | Cartes et Containers | Done | Cards + hover effects |
| F86c | Inputs et Formulaires | Done | Border-bottom + focus gold |
| F86d | Navigation et Menu | Done | Sidebar admin + bottom nav mobile |
| F86e | Modales et Overlays | Done | Backdrop + animation scale |
| F86f | Toasts | Done | toast.tsx 4 variantes |
| F86g | Accessibilite WCAG 2.1 | Partiel | ARIA labels + focus visible incomplets sur certains composants |
| F86h | Performance | Partiel | Images webp + lazy loading pas systematiques |

**Reste a faire :**
- [ ] Audit ARIA labels sur tous les composants interactifs
- [ ] Focus visible sur tous les elements navigables clavier
- [ ] Convertir images en webp
- [ ] Lazy loading systematique sur toutes les images

---

## Resume des priorites

### Priorite 1 — Backend critique (bloque le fonctionnement)
- [ ] Calcul KPI automatique (F54) — Edge Function/cron executant kpi-calculator.ts
- [ ] Alertes KPI faibles (F54e) — Triggers KPI < 4, declin > 2pts
- [ ] Emails transactionnels (F79, F61c, F26) — Connecter Resend
- [ ] Notifications auto (F76) — Brancher triggers evenements
- [ ] Seed data Supabase — Executer 003_seed_data.sql

### Priorite 2 — Fonctionnalites manquantes importantes
- [ ] Rappels RDV auto 24h/2h (F28)
- [ ] Rapports auto mensuels (F30, F38, F73) — Cron 1er du mois
- [ ] Push notifications serveur (F78) — VAPID + web-push
- [ ] Recommandation contenu (F49c) — Algo KPI faible -> module
- [ ] Pages legales (F11k) — CGU, Mentions legales, Confidentialite

### Priorite 3 — Ameliorations UX
- [ ] Threads imbriques chat (F69)
- [ ] Upload fichiers dans chat (F71)
- [ ] Drag-drop calendrier RDV (F27)
- [ ] Video vitesse variable + sous-titres (F63)
- [ ] Tour guide onboarding (F49a)
- [ ] Leaderboard + defis mensuels (F49b)

### Priorite 4 — Nice-to-have / Optionnel
- [ ] Integration Slack alertes admin (F36c)
- [ ] CDN video + multi-bitrate (F67a)
- [ ] Background sync offline (F81)
- [ ] Lien temporaire partage rapports (F75d)
- [ ] reCAPTCHA v3 (F61b)

---

## Historique des mises a jour

| Date | Modifications |
|------|---------------|
| 2026-03-11 | Creation du fichier de suivi, analyse initiale complete (75% CDC) |
