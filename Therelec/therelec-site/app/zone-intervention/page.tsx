import type { Metadata } from "next"
import Link from "next/link"
import {
  MapPin, CheckCircle, Clock, Phone, Zap, Wind, AlertTriangle,
  ArrowRight, Star, Navigation, Timer,
} from "lucide-react"
import { cities } from "@/lib/data/cities"
import { Button } from "@/components/ui/button"
import CTABanner from "@/components/home/CTABanner"

/* ─── SEO Metadata ──────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Électricien & Climatisation Île-de-France — Zone d'Intervention | Therelec",
  description:
    "Therelec intervient à Neuilly-sur-Seine (92) et dans toute l'Île-de-France : Courbevoie, Levallois-Perret, Puteaux, Nanterre, Boulogne-Billancourt, Paris 16e, 17e, 8e. Électricité & climatisation, urgences 24h/24, devis gratuit.",
  keywords: [
    "électricien Neuilly-sur-Seine",
    "climatisation 92",
    "électricien île-de-france",
    "dépannage électrique Hauts-de-Seine",
    "zone intervention électricien",
    "climatisation Courbevoie",
    "électricien Levallois",
  ],
  openGraph: {
    title: "Zone d'Intervention Therelec — Électricité & Climatisation Île-de-France",
    description:
      "Électricien & poseur de climatisation à Neuilly-sur-Seine (92200). Interventions dans 50+ communes d'Île-de-France. Urgences 24h/24.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://therelec.fr/zone-intervention" },
}

/* ─── Structured Data ───────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://therelec.fr",
      name: "Therelec",
      description:
        "Électricien et installateur climatisation certifié Qualifelec & RGE à Neuilly-sur-Seine. Interventions en Île-de-France.",
      url: "https://therelec.fr",
      telephone: "+33699699428",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Neuilly-sur-Seine",
        postalCode: "92200",
        addressLocality: "Neuilly-sur-Seine",
        addressCountry: "FR",
      },
      geo: { "@type": "GeoCoordinates", latitude: 48.8848, longitude: 2.2685 },
      areaServed: cities.map((c) => ({
        "@type": "City",
        name: c.name,
        postalCode: c.postalCode,
      })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services électricité et climatisation",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installation électrique" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Climatisation" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dépannage électrique 24h/24" } },
        ],
      },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Dans quelles villes Therelec intervient-il ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Therelec intervient principalement à Neuilly-sur-Seine et dans tout le département des Hauts-de-Seine (92) : Courbevoie, Levallois-Perret, Puteaux, Nanterre, Boulogne-Billancourt, Issy-les-Moulineaux, Suresnes, Rueil-Malmaison, Asnières-sur-Seine, Clichy, Colombes. Nous intervenons aussi à Paris (8e, 16e, 17e) et dans toute l'Île-de-France.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le délai d'intervention pour une urgence électrique à Neuilly-sur-Seine ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pour les urgences à Neuilly-sur-Seine et dans le 92, nos techniciens interviennent en moins de 30 minutes, 24h/24 et 7j/7, y compris les nuits, week-ends et jours fériés.",
          },
        },
        {
          "@type": "Question",
          name: "Therelec intervient-il dans toute l'Île-de-France ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, nous intervenons dans les 8 départements d'Île-de-France. Notre zone principale est le 92 (Hauts-de-Seine), mais nous nous déplaçons aussi à Paris (75), en Seine-Saint-Denis (93), Val-de-Marne (94), Essonne (91), Yvelines (78), Val-d'Oise (95) et Seine-et-Marne (77).",
          },
        },
      ],
    },
  ],
}

/* ─── Static data ───────────────────────────────────────────── */

const departements = [
  { code: "92", name: "Hauts-de-Seine", color: "#04599c", priority: true, delay: "< 30 min" },
  { code: "75", name: "Paris",            color: "#8B5CF6", priority: false, delay: "< 45 min" },
  { code: "93", name: "Seine-St-Denis",   color: "#10B981", priority: false, delay: "< 60 min" },
  { code: "94", name: "Val-de-Marne",     color: "#F97316", priority: false, delay: "< 60 min" },
  { code: "91", name: "Essonne",          color: "#06B6D4", priority: false, delay: "Sur RDV"  },
  { code: "78", name: "Yvelines",         color: "#EC4899", priority: false, delay: "Sur RDV"  },
  { code: "95", name: "Val-d'Oise",       color: "#84CC16", priority: false, delay: "Sur RDV"  },
  { code: "77", name: "Seine-et-Marne",   color: "#FFB800", priority: false, delay: "Sur RDV"  },
]

const cityHighlights: Record<string, { title: string; description: string; services: string[] }> = {
  "Neuilly-sur-Seine": {
    title: "Électricien Neuilly-sur-Seine (92200)",
    description:
      "Notre siège social. Interventions en moins de 30 minutes pour tous vos travaux d'électricité et climatisation, en urgence comme sur rendez-vous.",
    services: ["Rénovation électrique", "Installation climatisation", "Dépannage 24h/24", "Mise en conformité"],
  },
  "Courbevoie": {
    title: "Électricien Courbevoie (92400)",
    description:
      "Artisan qualifié pour vos travaux électriques et climatisation à Courbevoie. Devis gratuit sous 24h, intervention rapide dans le quartier Défense.",
    services: ["Tableau électrique", "Climatisation tertiaire", "Éclairage LED", "Urgences"],
  },
  "Levallois-Perret": {
    title: "Électricien Levallois-Perret (92300)",
    description:
      "Interventions électricité et climatisation à Levallois-Perret. Particuliers, copropriétés et entreprises. Certifié Qualifelec.",
    services: ["Installation électrique", "Split mural", "Domotique", "Conformité NF C 15-100"],
  },
  "Puteaux": {
    title: "Électricien Puteaux (92800)",
    description:
      "Therelec intervient à Puteaux pour tous vos besoins en électricité et climatisation. Zone La Défense couverte, disponible 24h/24.",
    services: ["Électricité tertiaire", "Gainable", "Dépannage", "ERP conformité"],
  },
  "Boulogne-Billancourt": {
    title: "Électricien Boulogne-Billancourt (92100)",
    description:
      "Électricien et climaticien à Boulogne-Billancourt. Rénovation, installation neuve, urgences. Devis gratuit, intervention le jour même.",
    services: ["Rénovation complète", "PAC air-air", "Éclairage", "Urgences 24h/24"],
  },
  "Nanterre": {
    title: "Électricien Nanterre (92000)",
    description:
      "Interventions rapides à Nanterre pour particuliers et professionnels. RGE QualiPac pour bénéficier des aides MaPrimeRénov'.",
    services: ["Installation électrique", "Climatisation RGE", "Tableau électrique", "Dépannage"],
  },
}

const faq = [
  {
    q: "Dans quelles villes intervenez-vous ?",
    a: "Nous intervenons principalement à Neuilly-sur-Seine et dans tout le 92 (Courbevoie, Levallois, Puteaux, Nanterre, Boulogne-Billancourt…). Nous couvrons aussi Paris 8e, 16e, 17e et l'ensemble de l'Île-de-France sur rendez-vous.",
  },
  {
    q: "Quel est le délai d'intervention pour une urgence ?",
    a: "À Neuilly-sur-Seine et dans le 92, nos techniciens interviennent en moins de 30 minutes, 24h/24 et 7j/7. Pour le reste de l'Île-de-France, comptez moins d'une heure selon la localisation.",
  },
  {
    q: "Intervenez-vous à Paris ?",
    a: "Oui, nous intervenons régulièrement dans les arrondissements proches du 92 : Paris 16e (75016), Paris 17e (75017) et Paris 8e (75008). Contactez-nous pour vérifier la disponibilité.",
  },
  {
    q: "Ma commune n'est pas dans la liste, pouvez-vous quand même intervenir ?",
    a: "Oui. Notre liste n'est pas exhaustive. Appelez-nous au 06 99 69 94 28 ou utilisez notre formulaire de contact — nous étudions chaque demande et intervenons dans toute l'Île-de-France.",
  },
]

/* ─── Page Component ────────────────────────────────────────── */

export default function ZoneInterventionPage() {
  const mainCity = cities.find((c) => c.isMain)!
  const otherCities = cities.filter((c) => !c.isMain)
  const highlightCities = cities.filter((c) => cityHighlights[c.name])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-[#0A1628] to-[#04599c] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container-site relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Navigation className="w-4 h-4" />
              Zone d'intervention
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              Électricien & Climatisation{" "}
              <span className="text-[#FFB800]">Île-de-France</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Basés à <strong className="text-white">Neuilly-sur-Seine (92200)</strong>, nous
              intervenons dans tout le département des Hauts-de-Seine et en Île-de-France.
              Urgences électriques &amp; climatisation <strong className="text-white">24h/24</strong>.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: MapPin,  value: "50+",      label: "Communes couvertes" },
                { icon: Timer,   value: "< 30 min", label: "Délai urgence 92"   },
                { icon: Clock,   value: "24h/24",   label: "Disponibilité"      },
                { icon: Star,    value: "4.9/5",    label: "Avis Google"        },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center">
                  <Icon className="w-5 h-5 text-[#FFB800] mx-auto mb-2" />
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Coverage zones ── */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              Périmètre d'intervention
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              3 zones de couverture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: MapPin,
                title: "Neuilly-sur-Seine & Hauts-de-Seine (92)",
                description:
                  "Zone principale d'intervention. Toutes nos équipes sont basées dans le 92 — délai garanti en moins de 30 minutes pour les urgences.",
                color: "#04599c",
                badge: "Zone prioritaire",
                delay: "< 30 min",
                cities: ["Neuilly-sur-Seine", "Courbevoie", "Levallois", "Puteaux", "Nanterre"],
              },
              {
                icon: Clock,
                title: "Paris & petite couronne",
                description:
                  "Nous intervenons régulièrement dans les arrondissements parisiens limitrophes (8e, 16e, 17e) et la petite couronne.",
                color: "#8B5CF6",
                badge: "< 45 min",
                delay: "< 45 min",
                cities: ["Paris 8e", "Paris 16e", "Paris 17e", "Clichy", "Gennevilliers"],
              },
              {
                icon: Phone,
                title: "Toute l'Île-de-France",
                description:
                  "Sur rendez-vous, nous intervenons dans tous les départements d'Île-de-France. Urgences prises en charge partout, nuits et week-ends.",
                color: "#F97316",
                badge: "24h/24",
                delay: "Sur RDV",
                cities: ["Essonne", "Yvelines", "Val-de-Marne", "Val-d'Oise", "Seine-et-Marne"],
              },
            ].map(({ icon: Icon, title, description, color, badge, delay, cities: zoneCities }) => (
              <div
                key={title}
                className="relative rounded-2xl border-2 p-6 hover:shadow-lg transition-all group"
                style={{ borderColor: `${color}25` }}
              >
                <div className="absolute top-4 right-4">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    {badge}
                  </span>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${color}12` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 pr-16">{title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {zoneCities.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${color}12`, color }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold pt-3 border-t border-gray-100" style={{ color }}>
                  <Timer className="w-4 h-4" />
                  Délai d'intervention : {delay}
                </div>
              </div>
            ))}
          </div>

          {/* Departments grid */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Les 8 départements d&apos;Île-de-France
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm">
                Couverture complète — délai d&apos;intervention selon la distance depuis Neuilly-sur-Seine.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {departements.map(({ code, name, color, priority, delay }) => (
                <div
                  key={code}
                  className="relative rounded-2xl p-5 text-center border-2 transition-all hover:shadow-md bg-white"
                  style={{ borderColor: `${color}30` }}
                >
                  {priority && (
                    <span
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-black px-2.5 py-0.5 rounded-full text-white whitespace-nowrap shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      Base principale
                    </span>
                  )}
                  <p className="text-3xl font-black mb-1" style={{ color }}>{code}</p>
                  <p className="text-gray-700 font-semibold text-sm leading-tight mb-2">{name}</p>
                  <div
                    className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    style={{ backgroundColor: `${color}12`, color }}
                  >
                    <Timer className="w-3 h-3" />
                    {delay}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services by zone */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <h2 className="text-2xl font-black text-gray-900 text-center mb-8">
              Services disponibles dans toute l&apos;Île-de-France
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap, title: "Électricité", color: "#04599c",
                  items: ["Installation & rénovation", "Tableau électrique", "Mise en conformité NF C 15-100", "Domotique & éclairage LED", "Attestation Consuel"],
                },
                {
                  icon: Wind, title: "Climatisation", color: "#00B4D8",
                  items: ["Split mural & gainable", "Pompe à chaleur air-air", "Entretien & maintenance", "Dossier MaPrimeRénov'", "RGE QualiPac certifié"],
                },
                {
                  icon: AlertTriangle, title: "Urgences 24h/24", color: "#F97316",
                  items: ["Panne électrique", "Court-circuit & disjoncteur", "Coupure générale", "Urgence climatisation", "Nuits, week-ends & jours fériés"],
                },
              ].map(({ icon: Icon, title, color, items }) => (
                <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cities grid ── */}
      <section className="py-16 bg-gray-50">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Communes desservies
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Voici les principales communes où nous intervenons régulièrement.
            </p>
          </div>

          {/* Main city highlight */}
          <div className="bg-gradient-to-r from-[#04599c] to-[#034882] rounded-2xl p-6 mb-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-black text-xl">{mainCity.name}</p>
                <span className="bg-[#FFB800] text-[#0A1628] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Base principale
                </span>
              </div>
              <p className="text-gray-200 text-sm">
                {mainCity.postalCode} — Siège social Therelec · Intervention urgence &lt; 30 min · Tous services disponibles
              </p>
            </div>
            <a
              href="tel:+33699699428"
              className="shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              Appeler maintenant
            </a>
          </div>

          {/* Other cities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-8">
            {otherCities.map((city) => (
              <div
                key={city.name}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#04599c]/40 hover:bg-[#04599c]/5 hover:shadow-sm transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-xs truncate">{city.name}</p>
                  <p className="text-gray-400 text-[11px]">{city.postalCode}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-[#04599c]/5 border border-[#04599c]/15 rounded-xl text-center">
            <p className="text-gray-700 text-sm">
              <strong>Votre commune n&apos;est pas dans la liste ?</strong>{" "}
              Contactez-nous — nous intervenons dans toute l&apos;Île-de-France.{" "}
              <a href="tel:+33699699428" className="text-[#04599c] font-semibold hover:underline">
                06 99 69 94 28
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── SEO city cards ── */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Électricien &amp; Climatisation par ville
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Therelec est votre artisan de confiance pour l&apos;électricité et la climatisation
              dans chacune de ces villes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightCities.map((city) => {
              const info = cityHighlights[city.name]!
              return (
                <article
                  key={city.name}
                  className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#04599c] shrink-0 mt-0.5" />
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">{info.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                    {info.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {info.services.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-[#04599c]/8 text-[#04599c] px-2.5 py-1 rounded-full font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="flex items-center gap-1.5 text-[#04599c] font-semibold text-sm hover:gap-2.5 transition-all"
                  >
                    Devis gratuit à {city.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-gray-50">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Questions fréquentes — Zone d&apos;intervention
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#04599c] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    ?
                  </span>
                  {q}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed pl-8">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-white">
        <div className="container-site max-w-3xl text-center">
          <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-3xl p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              Vous êtes dans notre zone d&apos;intervention ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Contactez-nous pour un devis gratuit sous 24h. Urgence ? Appelez directement
              au <strong className="text-white">06 99 69 94 28</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-[#FFB800] hover:bg-[#E5A600] text-[#0A1628] font-bold border-0">
                <Link href="/contact">Demander un devis gratuit</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <a href="tel:+33699699428" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  06 99 69 94 28
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-gray-300 text-sm">
              {["Devis gratuit sous 24h", "Certifié Qualifelec & RGE", "Garantie décennale"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
