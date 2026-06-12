import type { Metadata } from "next"
import Link from "next/link"
import { Zap, CheckCircle, ArrowRight, Phone, FileText, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { electriciteServices } from "@/lib/data/services"
import CTABanner from "@/components/home/CTABanner"
import ContactFormSection from "@/components/home/ContactFormSection"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Électricien à Neuilly-sur-Seine — Installation, Rénovation, Dépannage",
  description:
    "Therelec, électricien certifié Qualifelec à Neuilly-sur-Seine. Installation électrique neuve, rénovation, mise en conformité NF C 15-100, tableau électrique. Devis gratuit.",
  alternates: { canonical: "https://therelec.fr/services/electricite" },
  openGraph: {
    title: "Électricien Neuilly-sur-Seine — Therelec",
    description: "Artisan électricien certifié. Installation, rénovation, dépannage urgent 24h/24.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Électricité Générale — Therelec",
  provider: { "@type": "LocalBusiness", name: "Therelec", url: "https://therelec.fr" },
  areaServed: { "@type": "City", name: "Neuilly-sur-Seine" },
  serviceType: "Électricité générale",
  description: "Installation, rénovation, mise en conformité et dépannage électrique à Neuilly-sur-Seine.",
}

const faqElectricite = [
  {
    q: "Qu'est-ce que la certification Qualifelec garantit ?",
    a: "La certification Qualifelec garantit les compétences techniques de l'entreprise, le respect des normes électriques en vigueur (notamment NF C 15-100) et la qualité des installations réalisées. C'est une garantie supplémentaire pour vous en tant que client.",
  },
  {
    q: "Combien coûte la mise en conformité électrique ?",
    a: "Le coût dépend de l'état de votre installation et de la superficie de votre logement. En général, comptez entre 600€ et 3000€ pour un appartement standard. Nous réalisons un diagnostic gratuit et vous proposons un devis détaillé avant toute intervention.",
  },
  {
    q: "Faut-il un certificat Consuel pour vendre son bien ?",
    a: "Non, le diagnostic électrique est obligatoire pour les biens de plus de 15 ans, mais le certificat Consuel n'est obligatoire que pour les nouvelles installations ou rénovations complètes. Cependant, une mise aux normes peut rassurer les acheteurs et faciliter la vente.",
  },
  {
    q: "Intervenez-vous les week-ends pour les urgences ?",
    a: "Oui, notre service d'urgence est disponible 7 jours sur 7, 24 heures sur 24, y compris les week-ends et jours fériés. En cas d'urgence électrique, appelez-nous au 06 99 69 94 28.",
  },
]

export default function ElectricitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                Accueil
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-300 text-sm">Services</span>
              <span className="text-gray-600">/</span>
              <span className="text-white text-sm font-medium">Électricité</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#FFB800] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0A1628]" fill="#0A1628" />
              </div>
              <span className="bg-[#FFB800]/20 text-[#FFB800] text-sm font-bold px-3 py-1.5 rounded-full">
                Certifié Qualifelec 2025
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
              Électricien à Neuilly-sur-Seine
              <br />
              <span className="text-[#FFB800]">Installation, Rénovation, Dépannage</span>
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl">
              Artisan électricien certifié Qualifelec intervenant à Neuilly-sur-Seine et en
              Île-de-France. Installation neuve, rénovation électrique, mise en conformité NF C
              15-100, dépannage d&apos;urgence 24h/24.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="accent">
                <Link href="/contact">
                  <FileText className="w-5 h-5" />
                  Devis électricité gratuit
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

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Nos prestations électriques
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              De l&apos;installation neuve à la mise en conformité, notre équipe Qualifelec prend en
              charge tous vos besoins électriques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {electriciteServices.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#04599c]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#04599c] transition-colors">
                  <Zap className="w-6 h-6 text-[#04599c] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#04599c] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2 mb-5">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#04599c] shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {service.price && (
                  <p className="text-sm font-bold text-[#04599c] border-t border-gray-100 pt-4">
                    {service.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Qualifelec */}
      <section className="py-20 bg-gray-50">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Certification
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
                Pourquoi choisir un électricien Qualifelec ?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                La certification Qualifelec est un gage de qualité et de compétence reconnu dans le
                secteur de l&apos;électricité. Elle garantit que l&apos;entreprise respecte les normes
                en vigueur et dispose des compétences nécessaires.
              </p>
              <ul className="space-y-4">
                {[
                  "Travaux conformes à la norme NF C 15-100",
                  "Techniciens qualifiés et régulièrement formés",
                  "Assurance responsabilité civile professionnelle",
                  "Garantie décennale sur tous les travaux",
                  "Accès aux meilleures offres fournisseurs",
                  "Certification vérifiable sur le site Qualifelec.fr",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-3xl p-8 text-white">
              <Award className="w-12 h-12 text-[#FFB800] mb-6" />
              <h3 className="text-2xl font-black mb-4">Certification Qualifelec 2025</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Therelec est certifié Qualifelec, la référence qualité pour les entreprises
                d&apos;électricité en France. Cette certification est renouvelée annuellement après
                audit.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Années d'expérience", value: "5+" },
                  { label: "Clients électricité", value: "800+" },
                  { label: "Note Google", value: "4.9/5" },
                  { label: "Certifié depuis", value: "2020" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4">
                    <p className="text-[#FFB800] font-black text-xl">{value}</p>
                    <p className="text-gray-300 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="accent" size="lg" className="w-full">
                <Link href="/contact">Demander un devis électricité</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs indicatifs */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Tarifs indicatifs électricité</h2>
            <p className="text-gray-500">
              Estimations non contractuelles — devis gratuit et personnalisé sur demande
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Diagnostic électrique", price: "Gratuit" },
              { label: "Dépannage électrique", price: "À partir de 80€" },
              { label: "Remplacement disjoncteur", price: "À partir de 80€" },
              { label: "Tableau électrique (remplacement)", price: "À partir de 400€" },
              { label: "Mise en conformité NF C 15-100", price: "À partir de 600€" },
              { label: "Rénovation électrique complète (studio)", price: "À partir de 800€" },
              { label: "Installation électrique neuve (apt 3p)", price: "À partir de 1 500€" },
              { label: "Domotique & éclairage LED", price: "Sur devis" },
              { label: "Contrat maintenance entreprise", price: "Sur devis" },
            ].map(({ label, price }) => (
              <div
                key={label}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#04599c]/30 hover:bg-[#04599c]/5 transition-all"
              >
                <span className="text-gray-700 text-sm">{label}</span>
                <span className="font-bold text-[#04599c] text-sm shrink-0 ml-4">{price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            * TVA 10% applicable pour les logements de plus de 2 ans
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            FAQ — Électricité
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqElectricite.map((item, i) => (
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
