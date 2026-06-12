import type { Metadata } from "next"
import Link from "next/link"
import { Wind, CheckCircle, Phone, FileText, Shield, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { climatisationServices } from "@/lib/data/services"
import CTABanner from "@/components/home/CTABanner"
import ContactFormSection from "@/components/home/ContactFormSection"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Climatisation à Neuilly-sur-Seine — Installation & Dépannage RGE QualiPac",
  description:
    "Installation climatisation split, gainable, pompe à chaleur air-air à Neuilly-sur-Seine. Certifié RGE QualiPac — éligible MaPrimeRénov'. Devis gratuit.",
  alternates: { canonical: "https://therelec.fr/services/climatisation" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Climatisation — Therelec",
  provider: { "@type": "LocalBusiness", name: "Therelec", url: "https://therelec.fr" },
  areaServed: { "@type": "City", name: "Neuilly-sur-Seine" },
  serviceType: "Installation climatisation",
  description: "Installation et entretien climatisation split, gainable, pompe à chaleur à Neuilly-sur-Seine.",
}

const aides = [
  {
    name: "MaPrimeRénov'",
    amount: "Jusqu'à 4 000€",
    description: "Aide de l'État pour l'installation d'une pompe à chaleur air-air",
    color: "#10B981",
  },
  {
    name: "CEE",
    amount: "Plusieurs centaines €",
    description: "Certificats d'Économie d'Énergie versés par les fournisseurs d'énergie",
    color: "#04599c",
  },
  {
    name: "Éco-PTZ",
    amount: "Jusqu'à 50 000€",
    description: "Prêt à taux zéro pour financer vos travaux de rénovation énergétique",
    color: "#00B4D8",
  },
]

const faqClim = [
  {
    q: "Quelle puissance de climatisation pour mon appartement ?",
    a: "En règle générale, comptez environ 100W de puissance par m². Pour un appartement de 50m², une climatisation de 5 000W (5 kW) sera suffisante. Nous réalisons une étude thermique gratuite pour dimensionner précisément votre installation.",
  },
  {
    q: "Combien coûte l'installation d'un split mural ?",
    a: "Le prix d'installation d'un split mural varie entre 1 200€ et 2 500€ tout compris (matériel + main d'œuvre), selon la puissance et la marque choisie. Pour une pompe à chaleur, comptez entre 4 000€ et 8 000€ selon la superficie à traiter.",
  },
  {
    q: "Puis-je bénéficier de MaPrimeRénov' pour une climatisation ?",
    a: "Oui, pour une pompe à chaleur air-air certifiée. En tant qu'installateur RGE QualiPac, nous vous permettons d'accéder à MaPrimeRénov' (jusqu'à 4 000€ selon vos revenus) et aux Certificats d'Économie d'Énergie (CEE). Nous vous accompagnons dans le montage de votre dossier.",
  },
  {
    q: "Quelle est la durée de vie d'une climatisation ?",
    a: "Une climatisation bien entretenue dure en moyenne 15 à 20 ans. L'entretien annuel est essentiel : nettoyage des filtres, vérification du niveau de fluide frigorigène, contrôle des pressions. Nous proposons des contrats de maintenance annuels.",
  },
]

export default function ClimatisationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#00B4D8]">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">Accueil</Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-300 text-sm">Services</span>
              <span className="text-gray-600">/</span>
              <span className="text-white text-sm font-medium">Climatisation</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <span className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                Certifié RGE QualiPac 2025
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
              Climatisation à Neuilly-sur-Seine
              <br />
              <span className="text-[#FFB800]">Installation & Dépannage RGE</span>
            </h1>

            <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Installateur certifié RGE QualiPac pour tous vos projets de climatisation : split mural,
              gainable, pompe à chaleur air-air. Éligible MaPrimeRénov&apos; et CEE.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="accent">
                <Link href="/contact">
                  <FileText className="w-5 h-5" />
                  Devis climatisation gratuit
                </Link>
              </Button>
              <Button asChild size="lg" variant="white">
                <a href="tel:+33699699428">
                  <Phone className="w-5 h-5" />
                  Appeler maintenant
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Nos solutions de climatisation
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Du split mural discret à la climatisation gainable invisible, nous trouvons la solution
              adaptée à votre logement et votre budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {climatisationServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#00B4D8]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#00B4D8] transition-colors">
                  <Wind className="w-6 h-6 text-[#00B4D8] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00B4D8] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2 mb-5">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#00B4D8] shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {service.price && (
                  <p className="text-sm font-bold text-[#00B4D8] border-t border-gray-100 pt-4">
                    {service.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aides financières */}
      <section className="py-20 bg-gray-50">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Aides financières 2026
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Jusqu&apos;à 60% financé par les aides d&apos;État
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              En tant qu&apos;installateur certifié RGE QualiPac, nous vous permettons d&apos;accéder
              à toutes les aides disponibles pour votre projet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {aides.map((aide) => (
              <div
                key={aide.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${aide.color}15` }}
                >
                  <Euro className="w-7 h-7" style={{ color: aide.color }} />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{aide.name}</h3>
                <p className="font-bold text-2xl mb-3" style={{ color: aide.color }}>
                  {aide.amount}
                </p>
                <p className="text-gray-500 text-sm">{aide.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-[#0A1628] to-[#04599c] rounded-2xl p-6 md:p-8 text-white max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-black mb-2">Nous montons votre dossier d&apos;aides</h3>
                <p className="text-gray-300">
                  Nous gérons pour vous la constitution du dossier MaPrimeRénov&apos;, les démarches
                  CEE et l&apos;éco-prêt à taux zéro. Vous n&apos;avez rien à faire.
                </p>
              </div>
              <Button asChild variant="accent" size="lg" className="shrink-0">
                <Link href="/contact">Simuler mes aides</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* RGE QualiPac */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#00B4D8]/10 text-[#00B4D8] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                RGE QualiPac
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
                Pourquoi choisir un installateur RGE QualiPac ?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Le label RGE (Reconnu Garant de l&apos;Environnement) QualiPac est indispensable pour
                accéder aux aides financières de l&apos;État. Seul un installateur RGE peut vous
                permettre de bénéficier de MaPrimeRénov&apos;.
              </p>
              <ul className="space-y-4">
                {[
                  "Accès à MaPrimeRénov' et CEE",
                  "Installation aux normes environnementales",
                  "Techniciens formés aux fluides frigorigènes",
                  "Attestation d'installation fournie",
                  "Garantie sur pièces et main d'œuvre",
                  "Suivi et entretien annuel proposé",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#00B4D8] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Installations réalisées", value: "250+", icon: Wind },
                { label: "Certifié RGE depuis", value: "2021", icon: Shield },
                { label: "Note satisfaction", value: "4.9/5", icon: CheckCircle },
                { label: "Aides obtenues", value: "100%", icon: Euro },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-2xl p-5 text-white"
                >
                  <Icon className="w-6 h-6 text-[#00B4D8] mb-3" />
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-gray-300 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            FAQ — Climatisation
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqClim.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white rounded-xl border border-gray-200 px-5"
              >
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTABanner />
      <ContactFormSection />
    </>
  )
}
