"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqHome } from "@/lib/data/faq"

export default function FAQSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="faq-heading">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Questions fréquentes
            </span>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
              Vous avez des questions ?
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Retrouvez les réponses aux questions les plus fréquentes. Pour toute autre question,
              n&apos;hésitez pas à nous contacter.
            </p>

            <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-2xl p-6 text-white">
              <p className="font-bold text-lg mb-2">Pas de réponse à votre question ?</p>
              <p className="text-gray-300 text-sm mb-5">
                Notre équipe est disponible 24h/24 pour répondre à vos questions.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+33699699428"
                  className="flex items-center justify-center gap-2 bg-[#FFB800] text-[#0A1628] font-bold py-3 rounded-xl hover:bg-[#E5A600] transition-colors"
                >
                  Appeler maintenant
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  Envoyer un message
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right: FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqHome.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-gray-50 rounded-xl border border-gray-200 px-5 hover:border-[#04599c]/30 transition-colors"
                >
                  <AccordionTrigger className="text-gray-900 hover:text-[#04599c]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-[#04599c] font-semibold hover:text-[#034882] transition-colors"
                aria-label="Voir toutes les questions fréquentes"
              >
                Voir toutes les FAQ
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
