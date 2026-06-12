# THERELEC — Site vitrine Génie Électrique & Climatique

Site vitrine complet pour Therelec, entreprise de génie électrique et climatique basée à Neuilly-sur-Seine (92), Île-de-France.

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4
- **UI Components** : shadcn/ui (Radix UI primitives)
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form + Zod validation
- **Images** : next/image (optimisation automatique)

## Prérequis

- Node.js >= 18.x
- npm >= 9.x

## Installation

```bash
# 1. Cloner le projet
git clone [repo-url]
cd therelec-site

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

```bash
npm run dev        # Démarrer en mode développement
npm run build      # Build de production
npm run start      # Démarrer en mode production
npm run lint       # Vérification ESLint
```

## Structure du projet

```
therelec-site/
├── app/
│   ├── layout.tsx                    # Root layout (metadata, JSON-LD, Header, Footer)
│   ├── page.tsx                      # Homepage (landing conversion)
│   ├── globals.css                   # Design system global (Tailwind v4)
│   ├── sitemap.ts                    # Sitemap XML auto-généré
│   ├── robots.ts                     # Robots.txt
│   ├── not-found.tsx                 # Page 404 custom
│   ├── services/
│   │   ├── electricite/page.tsx      # Page Électricité
│   │   └── climatisation/page.tsx   # Page Climatisation
│   ├── realisations/page.tsx         # Portfolio réalisations
│   ├── avis/page.tsx                 # Avis clients & témoignages
│   ├── zone-intervention/page.tsx   # Zone d'intervention + villes
│   ├── faq/page.tsx                 # FAQ complète avec JSON-LD
│   ├── blog/
│   │   ├── page.tsx                  # Liste articles blog
│   │   └── [slug]/page.tsx          # Article de blog dynamique
│   ├── contact/page.tsx              # Page contact + formulaires
│   └── mentions-legales/page.tsx    # Mentions légales + RGPD + CGV
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Navigation sticky avec mega-menu
│   │   ├── Footer.tsx               # Footer multi-colonnes
│   │   └── FloatingCTA.tsx          # Bouton téléphone flottant (mobile)
│   ├── home/
│   │   ├── HeroSection.tsx          # Section hero avec 3 CTAs
│   │   ├── SocialProofSection.tsx   # Témoignages + métriques
│   │   ├── ServicesSection.tsx      # 4 cartes services
│   │   ├── WhyUsSection.tsx         # 6 arguments qualité
│   │   ├── ProcessSection.tsx       # 4 étapes timeline
│   │   ├── CTABanner.tsx            # Bandeau urgence
│   │   ├── FAQSection.tsx           # Accordion FAQ homepage
│   │   └── ContactFormSection.tsx   # Formulaire devis tabbed
│   └── ui/
│       ├── button.tsx               # Composant Button (8 variants)
│       ├── card.tsx                 # Composant Card
│       ├── badge.tsx                # Composant Badge
│       ├── input.tsx                # Input avec gestion d'erreur
│       ├── textarea.tsx             # Textarea avec gestion d'erreur
│       ├── label.tsx                # Label accessible
│       ├── select.tsx               # Select dropdown (Radix)
│       ├── accordion.tsx            # Accordion (Radix)
│       ├── tabs.tsx                 # Tabs (Radix)
│       ├── toast.tsx                # Toast notifications
│       └── toaster.tsx              # Provider toaster
│
├── lib/
│   ├── data/
│   │   ├── services.ts              # Données services électricité + climatisation
│   │   ├── testimonials.ts          # 6 témoignages clients mockés
│   │   ├── faq.ts                   # 8 questions FAQ
│   │   ├── blog.ts                  # 3 articles blog mockés
│   │   ├── realisations.ts          # 8 réalisations portfolio
│   │   └── cities.ts               # 20 villes zone d'intervention
│   ├── schemas/
│   │   └── contact.ts              # Schémas Zod formulaires
│   └── utils.ts                    # Utilitaire cn()
│
└── hooks/
    └── use-toast.ts                # Hook toast notifications
```

## Pages disponibles

| URL | Description |
|-----|-------------|
| `/` | Homepage — Landing conversion complète |
| `/services/electricite` | Page Électricité (NF C 15-100, Qualifelec) |
| `/services/climatisation` | Page Climatisation (RGE QualiPac, MaPrimeRénov') |
| `/realisations` | Portfolio photos réalisations |
| `/avis` | Témoignages clients + avis Google |
| `/zone-intervention` | Carte + liste des villes desservies |
| `/faq` | Questions fréquentes (JSON-LD FAQPage) |
| `/blog` | Liste articles blog |
| `/blog/[slug]` | Article de blog |
| `/contact` | Formulaires devis Électricité/Climatisation/Urgence |
| `/mentions-legales` | Mentions légales + RGPD + CGV |

## Design System

### Couleurs (Tailwind CSS v4 `@theme`)

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--color-primary` | `#0056D2` | Bleu principal — liens, CTA |
| `--color-primary-dark` | `#0A1628` | Bleu foncé — headers, dark sections |
| `--color-accent` | `#FFB800` | Jaune — CTA urgence, accents |
| `--color-cyan` | `#00B4D8` | Cyan — climatisation |
| `--color-success` | `#10B981` | Vert — validations, certifications |
| `--color-warning` | `#F97316` | Orange — urgences |

### Composants Button

```tsx
<Button variant="default">   // Bleu primaire
<Button variant="accent">    // Jaune (#FFB800)
<Button variant="urgent">    // Orange pulsant (urgences)
<Button variant="secondary"> // Noir profond
<Button variant="white">     // Blanc sur dark background
<Button variant="outline">   // Contour bleu
<Button variant="ghost">     // Transparent
```

## SEO

- **Metadata API** Next.js avec title template par page
- **Schema.org JSON-LD** : LocalBusiness (homepage), Service (services), FAQPage (FAQ/blog)
- **Sitemap XML** auto-généré (`/sitemap.xml`)
- **Robots.txt** (`/robots.txt`)
- **Open Graph** et Twitter Cards sur chaque page
- **H1 unique** par page, alt text descriptifs sur toutes les images

## Formulaires

Les formulaires utilisent React Hook Form + Zod pour la validation. En développement, la soumission console.log les données et affiche un toast de confirmation. Pour la production, connecter à :
- [Resend](https://resend.com) pour l'envoi d'emails
- [SendGrid](https://sendgrid.com) alternative
- API Route Next.js (`/api/contact`)

## Déploiement sur Vercel

```bash
# 1. Build de test local
npm run build

# 2. Déployer sur Vercel
npx vercel deploy
```

Variables d'environnement à configurer sur Vercel :
```env
NEXT_PUBLIC_SITE_URL=https://therelec.fr
# (optionnel si email activé)
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=contact@therelec.fr
```

## Personnalisation

### Remplacer le numéro de téléphone

Rechercher `01 XX XX XX XX` et `+33XXXXXXXXX` dans tous les fichiers et remplacer par le vrai numéro.

### Remplacer le SIRET

Dans `app/mentions-legales/page.tsx`, remplacer `[SIRET à renseigner]`.

### Ajouter de vraies images

Dans `lib/data/realisations.ts` et `lib/data/blog.ts`, remplacer les URLs Unsplash par les vraies photos en les plaçant dans `public/images/`.

### Activer l'envoi d'emails

1. Créer un compte [Resend](https://resend.com)
2. Ajouter `RESEND_API_KEY` en variable d'environnement
3. Créer `app/api/contact/route.ts` avec l'envoi d'email
4. Mettre à jour `onSubmit` dans les formulaires pour appeler l'API

---

**Développé en juin 2026 — Therelec, Génie Électrique & Climatique, Neuilly-sur-Seine (92)**
