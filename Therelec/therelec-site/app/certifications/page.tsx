import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  ArrowRight,
  Phone,
  Euro,
  ShieldCheck,
  Leaf,
  Zap,
  Wind,
  Flame,
  Sun,
  TreePine,
  Fan,
  BadgeCheck,
  FileText,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Certifications & Qualifications | Therelec — Artisan RGE Qualifelec",
  description:
    "Therelec est certifié Qualifelec, RGE QualiPac, RGE Chauffage+, RGE QualiSol, RGE Quali'Bois et RGE Ventilation+. Accédez à MaPrimeRénov', CEE et Éco-PTZ.",
  keywords: [
    "Qualifelec",
    "RGE QualiPac",
    "RGE Chauffage+",
    "RGE QualiSol",
    "RGE Quali'Bois",
    "RGE Ventilation+",
    "MaPrimeRénov",
    "CEE",
    "Éco-PTZ",
    "artisan certifié RGE",
    "Neuilly-sur-Seine",
  ],
  alternates: { canonical: "https://therelec.fr/certifications" },
  openGraph: {
    title: "Certifications & Qualifications | Therelec",
    description:
      "6 certifications professionnelles pour des travaux conformes et l'accès aux aides de l'État.",
    url: "https://therelec.fr/certifications",
    siteName: "Therelec",
    type: "website",
  },
}

const certifications = [
  {
    id: "qualifelec",
    logo: "/certifications/6-1.png",
    name: "Qualifelec",
    label: "Électricité",
    tagColor: "#04599c",
    tagBg: "#e6f0f8",
    icon: Zap,
    iconColor: "#04599c",
    description:
      "La certification Qualifelec est la référence nationale pour les travaux électriques. Elle atteste des compétences techniques de l'entreprise, du respect strict de la norme NF C 15-100 et des règles de l'art, pour des installations sûres et durables.",
    covers: [
      "Installation électrique neuve",
      "Rénovation et mise en conformité",
      "Tableau électrique (comptage, AGCP)",
      "Domotique, éclairage LED",
      "Borne IRVE (recharge véhicule électrique)",
      "Courants faibles & réseaux",
    ],
    subsidy: null,
    subsidyNote: null,
    highlight: "Norme NF C 15-100 garantie",
  },
  {
    id: "qualipac",
    logo: "/certifications/4-1.png",
    name: "RGE QualiPac",
    label: "Climatisation & PAC",
    tagColor: "#7B1FA2",
    tagBg: "#f3e8ff",
    icon: Wind,
    iconColor: "#7B1FA2",
    description:
      "QualiPac certifie la maîtrise des pompes à chaleur et des climatisations réversibles. Cette certification garantit une installation optimale, performante et conforme aux exigences de MaPrimeRénov' et des Certificats d'Économies d'Énergie.",
    covers: [
      "Climatisation réversible (split, gainable, multi-split)",
      "Pompe à chaleur air/air",
      "Pompe à chaleur air/eau",
      "Chauffe-eau thermodynamique",
      "Systèmes VRF tertiaires",
      "Maintenance & entretien PAC",
    ],
    subsidy: "Jusqu'à 4 000€",
    subsidyNote: "MaPrimeRénov' + CEE cumulables",
    highlight: "Éligible MaPrimeRénov'",
  },
  {
    id: "chauffageplus",
    logo: "/certifications/1-1.png",
    name: "RGE Chauffage+",
    label: "Chauffage",
    tagColor: "#8B2500",
    tagBg: "#fef3ef",
    icon: Flame,
    iconColor: "#D84315",
    description:
      "Chauffage+ couvre l'installation, le remplacement et l'entretien de chaudières à condensation (gaz, fioul) et autres systèmes de chauffage performants. La certification garantit un rendement optimisé et des économies d'énergie mesurables.",
    covers: [
      "Chaudière à condensation gaz",
      "Chaudière fioul haute performance",
      "Remplacement de chaudière ancienne",
      "Programmateur & régulation de chauffage",
      "Plancher chauffant hydraulique",
      "Radiateurs à inertie & sèche-serviettes",
    ],
    subsidy: "CEE éligibles",
    subsidyNote: "Économies sur la facture d'énergie",
    highlight: "Chaudière à condensation",
  },
  {
    id: "qualisol",
    logo: "/certifications/2-1.png",
    name: "RGE QualiSol",
    label: "Énergie solaire",
    tagColor: "#F57F17",
    tagBg: "#fff8e1",
    icon: Sun,
    iconColor: "#F9A825",
    description:
      "QualiSol certifie la conception et la pose de capteurs solaires thermiques pour la production d'eau chaude sanitaire et le chauffage. L'énergie solaire thermique est l'une des solutions les plus rentables à long terme.",
    covers: [
      "Chauffe-eau solaire individuel (CESI)",
      "Système solaire combiné (SSC)",
      "Capteurs solaires thermiques plans ou tubulaires",
      "Ballon de stockage solaire",
      "Intégration en toiture (IAT)",
      "Supervision et monitoring",
    ],
    subsidy: "Jusqu'à 4 000€",
    subsidyNote: "MaPrimeRénov' + CEE + Éco-PTZ",
    highlight: "Énergie solaire gratuite",
  },
  {
    id: "qualibois",
    logo: "/certifications/3-1.png",
    name: "RGE Quali'Bois",
    label: "Bois & Biomasse",
    tagColor: "#2E7D32",
    tagBg: "#e8f5e9",
    icon: TreePine,
    iconColor: "#388E3C",
    description:
      "Quali'Bois atteste de la maîtrise des équipements de chauffage au bois et à la biomasse. Le bois énergie est le combustible renouvelable le plus accessible, avec parmi les meilleures aides de l'État disponibles.",
    covers: [
      "Poêle à bois labellisé Flamme Verte",
      "Poêle à granulés (pellets)",
      "Insert cheminée haut rendement",
      "Chaudière bois / biomasse",
      "Chauffe-eau bois",
      "Silo et circuit d'alimentation automatique",
    ],
    subsidy: "Jusqu'à 8 000€",
    subsidyNote: "MaPrimeRénov' parmi les plus hautes + CEE",
    highlight: "Prime la plus élevée de l'État",
  },
  {
    id: "ventilationplus",
    logo: "/certifications/5-1.png",
    name: "RGE Ventilation+",
    label: "Ventilation",
    tagColor: "#0277BD",
    tagBg: "#e1f5fe",
    icon: Fan,
    iconColor: "#0288D1",
    description:
      "Ventilation+ garantit la qualité d'installation des VMC à double flux et systèmes de ventilation performants. Une bonne ventilation est essentielle à la qualité de l'air intérieur et à la performance thermique d'un bâtiment rénové.",
    covers: [
      "VMC double flux avec récupération de chaleur",
      "VMC simple flux hygroréglable A et B",
      "Ventilation tertiaire et collective",
      "Groupe de ventilation à commande électronique",
      "Réseau de gaines et bouches d'extraction",
      "Équilibrage et mise en service",
    ],
    subsidy: "CEE éligibles",
    subsidyNote: "TVA à 5,5% applicable",
    highlight: "Qualité de l'air garantie",
  },
]

const aides = [
  {
    name: "MaPrimeRénov'",
    color: "#04599c",
    bg: "#e6f0f8",
    icon: "🏠",
    amount: "Jusqu'à 20 000€",
    description:
      "Aide de l'État versée directement après les travaux, calculée selon vos revenus et le type d'installation. Accessible à tous les propriétaires.",
    condition: "Artisan RGE obligatoire",
  },
  {
    name: "CEE",
    color: "#10B981",
    bg: "#ecfdf5",
    icon: "⚡",
    amount: "Variable",
    description:
      "Certificats d'Économies d'Énergie financés par les fournisseurs d'énergie. Cumulable avec MaPrimeRénov' pour maximiser vos aides.",
    condition: "Artisan RGE obligatoire",
  },
  {
    name: "Éco-PTZ",
    color: "#8B5CF6",
    bg: "#f5f3ff",
    icon: "💰",
    amount: "Jusqu'à 50 000€",
    description:
      "Prêt sans intérêts pour financer vos travaux de rénovation énergétique. Remboursable sur 20 ans, sans conditions de ressources.",
    condition: "Artisan RGE obligatoire",
  },
  {
    name: "TVA à 5,5%",
    color: "#F97316",
    bg: "#fff7ed",
    icon: "📊",
    amount: "Économie immédiate",
    description:
      "Taux de TVA réduit à 5,5% (au lieu de 10%) sur les travaux de rénovation énergétique. S'applique sur la main d'œuvre et les matériaux.",
    condition: "Résidence principale",
  },
]

const steps = [
  {
    num: "01",
    title: "Demandez votre devis",
    text: "Contactez-nous pour une visite gratuite. Nous évaluons vos besoins et identifions les aides auxquelles vous avez droit.",
  },
  {
    num: "02",
    title: "Simulation des aides",
    text: "Nous calculons le montant exact de MaPrimeRénov', CEE et autres aides applicables à votre situation.",
  },
  {
    num: "03",
    title: "Dossier de financement",
    text: "Nous vous accompagnons dans la constitution du dossier de demande d'aides. Zéro paperasse pour vous.",
  },
  {
    num: "04",
    title: "Travaux & versement",
    text: "Nos équipes réalisent les travaux certifiés. L'aide est versée directement après réception du chantier.",
  },
]

export default function CertificationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "Therelec",
        url: "https://therelec.fr",
        telephone: "+33699699428",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Neuilly-sur-Seine",
          postalCode: "92200",
          addressCountry: "FR",
        },
        hasCredential: [
          { "@type": "EducationalOccupationalCredential", credentialCategory: "Qualifelec" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "RGE QualiPac" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "RGE Chauffage+" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "RGE QualiSol" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "RGE Quali'Bois" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "RGE Ventilation+" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qu'est-ce que la certification RGE ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "RGE (Reconnu Garant de l'Environnement) est un label officiel du gouvernement français. Il certifie que l'artisan est qualifié pour réaliser des travaux de rénovation énergétique permettant d'accéder aux aides de l'État (MaPrimeRénov', CEE, Éco-PTZ).",
            },
          },
          {
            "@type": "Question",
            name: "Quelles aides puis-je obtenir avec un artisan RGE ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Avec un artisan RGE comme Therelec, vous pouvez bénéficier de MaPrimeRénov' (jusqu'à 20 000€), des CEE (Certificats d'Économies d'Énergie), de l'Éco-prêt à taux zéro (jusqu'à 50 000€) et de la TVA à 5,5%.",
            },
          },
          {
            "@type": "Question",
            name: "La certification Qualifelec garantit-elle la qualité des travaux électriques ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui. Qualifelec est la certification nationale de référence pour les travaux électriques. Elle garantit le respect de la norme NF C 15-100, la formation continue des techniciens et un contrôle qualité par des organismes indépendants.",
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">

        {/* ── Hero ── */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#0A1628] via-[#0d1f3d] to-[#04599c] overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="container-site relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                Certifications officielles
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Nos certifications,<br />
                <span className="text-[#FFB800]">votre confiance</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
                Therelec est titulaire de <strong className="text-white">6 certifications professionnelles</strong>,
                dont Qualifelec et 5 labels RGE. Ces accréditations vous ouvrent l'accès aux aides de l'État
                et garantissent des travaux conformes aux normes les plus exigeantes.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { value: "6", label: "Certifications" },
                  { value: "5", label: "Labels RGE" },
                  { value: "5+", label: "Ans d'expérience" },
                  { value: "100%", label: "Conformité normes" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4">
                    <p className="text-3xl font-black text-[#FFB800]">{value}</p>
                    <p className="text-white/70 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#0A1628] font-bold px-7 py-4 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Devis gratuit
                </Link>
                <a
                  href="tel:+33699699428"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  06 99 69 94 28
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Logos strip ── */}
        <section className="py-10 bg-gray-50 border-b border-gray-200">
          <div className="container-site">
            <p className="text-center text-gray-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Nos accréditations officielles
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {certifications.map((cert) => (
                <a
                  key={cert.id}
                  href={`#${cert.id}`}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <Image
                    src={cert.logo}
                    alt={cert.name}
                    width={160}
                    height={70}
                    className="w-full h-12 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Certifications détaillées ── */}
        <section className="py-20 bg-white">
          <div className="container-site">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Nos 6 certifications en détail
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Chaque certification couvre un domaine précis et garantit la compétence de nos techniciens
                pour les travaux concernés.
              </p>
            </div>

            <div className="space-y-8">
              {certifications.map((cert, i) => {
                const Icon = cert.icon
                return (
                  <article
                    key={cert.id}
                    id={cert.id}
                    className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow scroll-mt-24"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5">

                      {/* Left — logo + badge */}
                      <div className="lg:col-span-1 bg-gray-50 flex flex-col items-center justify-center p-8 gap-4 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <Image
                          src={cert.logo}
                          alt={cert.name}
                          width={180}
                          height={80}
                          className="w-40 h-20 object-contain"
                        />
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ color: cert.tagColor, backgroundColor: cert.tagBg }}
                        >
                          {cert.label}
                        </span>
                        {cert.subsidy && (
                          <div className="text-center bg-[#ecfdf5] border border-[#10B981]/20 rounded-xl px-4 py-2">
                            <p className="text-[#10B981] font-black text-lg leading-none">{cert.subsidy}</p>
                            <p className="text-[#10B981]/70 text-xs mt-1">{cert.subsidyNote}</p>
                          </div>
                        )}
                      </div>

                      {/* Right — details */}
                      <div className="lg:col-span-4 p-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cert.iconColor}18` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: cert.iconColor }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-xl font-black text-gray-900">{cert.name}</h3>
                              <span className="inline-flex items-center gap-1 text-xs bg-[#04599c]/10 text-[#04599c] font-semibold px-2 py-0.5 rounded-full">
                                <BadgeCheck className="w-3 h-3" />
                                {cert.highlight}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm">Certification officielle · Organisme qualifié</p>
                          </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-5">{cert.description}</p>

                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Travaux couverts
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cert.covers.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle
                                  className="w-4 h-4 shrink-0"
                                  style={{ color: cert.iconColor }}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Aides financières ── */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-site">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <Euro className="w-4 h-4" />
                Aides financières
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Financez vos travaux grâce à nos certifications
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                En tant qu'artisan RGE, Therelec vous permet d'accéder à l'ensemble des dispositifs
                d'aide à la rénovation énergétique. Ces aides peuvent couvrir jusqu'à <strong>70% du coût total</strong> de vos travaux.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {aides.map((aide) => (
                <div
                  key={aide.name}
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{aide.icon}</div>
                  <p
                    className="text-2xl font-black mb-1"
                    style={{ color: aide.color }}
                  >
                    {aide.amount}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{aide.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{aide.description}</p>
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ color: aide.color, backgroundColor: aide.bg }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {aide.condition}
                  </div>
                </div>
              ))}
            </div>

            {/* Cumul box */}
            <div className="bg-gradient-to-r from-[#0A1628] to-[#04599c] rounded-3xl p-8 text-center text-white">
              <p className="text-[#4ADE80] text-sm font-bold uppercase tracking-widest mb-2">Bon à savoir</p>
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Ces aides sont <span className="text-[#FFB800]">cumulables</span> entre elles
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                MaPrimeRénov' + CEE + Éco-PTZ peuvent être combinés pour un même projet.
                Nos experts vous aident à maximiser vos aides et à monter votre dossier de A à Z.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#0A1628] font-bold px-8 py-4 rounded-xl transition-colors"
              >
                Simuler mes aides gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="py-20 bg-white">
          <div className="container-site">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Comment bénéficier des aides ?
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Nous gérons l'intégralité du processus pour vous. Du devis à la réception des aides,
                Therelec vous accompagne à chaque étape.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#04599c]/30 to-transparent z-0 -translate-x-1/2" />
                  )}
                  <div className="relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm z-10">
                    <div className="w-14 h-14 bg-[#04599c] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-gray-50">
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Qu'est-ce que la certification RGE ?",
                  a: "RGE signifie « Reconnu Garant de l'Environnement ». C'est un label officiel du gouvernement français attribué aux artisans qualifiés pour réaliser des travaux de rénovation énergétique. Il est obligatoire pour que vous puissiez bénéficier de MaPrimeRénov', des CEE et de l'Éco-PTZ.",
                },
                {
                  q: "Quelles aides puis-je obtenir avec un artisan RGE ?",
                  a: "Avec Therelec, artisan RGE, vous pouvez cumuler : MaPrimeRénov' (jusqu'à 20 000€ selon revenus et travaux), CEE (primes des fournisseurs d'énergie), Éco-prêt à taux zéro (jusqu'à 50 000€ sans intérêts) et TVA réduite à 5,5%.",
                },
                {
                  q: "Dois-je avancer les frais avant de recevoir les aides ?",
                  a: "Pour MaPrimeRénov', l'aide est versée après la réalisation des travaux et la transmission de la facture. Dans certains cas, une avance partielle est possible via votre banque. Nous vous guidons sur les options disponibles selon votre situation.",
                },
                {
                  q: "La certification Qualifelec est-elle la même que RGE ?",
                  a: "Non, ce sont deux accréditations distinctes. Qualifelec certifie les compétences en travaux électriques (norme NF C 15-100). RGE est le label de rénovation énergétique ouvrant aux aides de l'État. Therelec détient les deux, ainsi que 5 labels RGE spécialisés.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden group"
                >
                  <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-semibold text-gray-900 hover:text-[#04599c] transition-colors">
                    {q}
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-16 bg-[#0A1628]">
          <div className="container-site text-center">
            <p className="text-[#FFB800] text-sm font-bold uppercase tracking-widest mb-4">
              Artisan certifié disponible 24h/24
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Prêt à lancer vos travaux ?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Contactez-nous pour un devis gratuit. Nous analysons vos droits aux aides
              et vous proposons la meilleure solution technique et financière.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#0A1628] font-bold px-8 py-4 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                Devis & simulation d'aides
              </Link>
              <a
                href="tel:+33699699428"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                06 99 69 94 28
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
