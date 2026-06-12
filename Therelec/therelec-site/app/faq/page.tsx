import type { Metadata } from "next"
import Link from "next/link"
import { HelpCircle, Phone, FileText } from "lucide-react"
import { faqItems } from "@/lib/data/faq"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import CTABanner from "@/components/home/CTABanner"

export const metadata: Metadata = {
  title: "FAQ — Questions Fréquentes Électricité & Climatisation",
  description:
    "Réponses à toutes vos questions sur nos services d'électricité et climatisation à Neuilly-sur-Seine. Certifications, tarifs, urgences, aides financières.",
  alternates: { canonical: "https://therelec.fr/faq" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

const categories = [
  { key: "general", label: "Général", color: "#04599c" },
  { key: "electricite", label: "Électricité", color: "#FFB800" },
  { key: "climatisation", label: "Climatisation", color: "#00B4D8" },
  { key: "urgence", label: "Urgences", color: "#F97316" },
]

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
            Questions fréquentes
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Retrouvez les réponses à toutes vos questions sur nos services d&apos;électricité
            et de climatisation. Vous ne trouvez pas votre réponse ? Contactez-nous !
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Sidebar nav */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-bold text-gray-900 mb-4 text-lg">Catégories</h2>
                <nav className="space-y-2 mb-8">
                  {categories.map((cat) => (
                    <a
                      key={cat.key}
                      href={`#${cat.key}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600 hover:text-gray-900 font-medium"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </a>
                  ))}
                </nav>

                {/* Contact card */}
                <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-2xl p-6 text-white">
                  <HelpCircle className="w-8 h-8 text-[#FFB800] mb-4" />
                  <h3 className="font-bold text-lg mb-2">Pas de réponse ?</h3>
                  <p className="text-gray-300 text-sm mb-5">
                    Notre équipe est disponible 24h/24 pour répondre à toutes vos questions.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+33699699428"
                      className="flex items-center gap-2 justify-center bg-[#FFB800] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#E5A600] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler maintenant
                    </a>
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 justify-center bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                    >
                      <FileText className="w-4 h-4" />
                      Envoyer un message
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ by category */}
            <div className="lg:col-span-2 space-y-10">
              {categories.map((cat) => {
                const items = faqItems.filter((f) => f.category === cat.key)
                if (!items.length) return null
                return (
                  <div key={cat.key} id={cat.key}>
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h2 className="text-2xl font-black text-gray-900">{cat.label}</h2>
                    </div>
                    <Accordion type="single" collapsible className="space-y-3">
                      {items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="bg-white rounded-xl border border-gray-200 px-5 hover:border-[#04599c]/30 transition-colors"
                        >
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
