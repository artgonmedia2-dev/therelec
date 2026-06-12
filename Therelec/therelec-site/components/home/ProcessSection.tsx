"use client"

import { Phone, FileText, Wrench, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Appel & Diagnostic",
    description:
      "Contactez-nous par téléphone ou formulaire. En quelques minutes nous évaluons votre besoin et planifions l'intervention.",
    color: "#04599c",
    lightBg: "#e6f0f8",
  },
  {
    number: "02",
    icon: FileText,
    title: "Devis gratuit",
    description:
      "Devis clair, détaillé et sans surprise sous 24h. Vous validez avant que nous commencions — aucuns frais cachés.",
    color: "#00B4D8",
    lightBg: "#E0F7FA",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Intervention rapide",
    description:
      "Nos techniciens qualifiés interviennent dans les délais convenus. Urgence ? Nous sommes là en moins de 30 minutes.",
    color: "#FFB800",
    lightBg: "#FFF8E1",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Garantie & Suivi",
    description:
      "Travaux couverts par notre garantie décennale. Nous restons disponibles pour tout suivi ou question après intervention.",
    color: "#10B981",
    lightBg: "#D1FAE5",
  },
]

export default function ProcessSection() {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="process-heading">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Notre méthode
          </span>
          <h2 id="process-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Comment ça se passe ?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Un processus simple et transparent — de l'appel initial à la garantie finale.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center px-4 relative"
              >
                {/* Step icon bubble */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-5 relative z-10"
                  style={{ backgroundColor: step.lightBg, border: `2px solid ${step.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: step.color }} />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Arrow connector (except last) */}
                {i < steps.length - 1 && (
                  <ArrowRight
                    className="absolute right-0 top-8 w-5 h-5 text-gray-300 translate-x-1/2 z-20"
                  />
                )}

                <h3 className="font-bold text-gray-900 text-center mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm text-center leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile: vertical steps */}
        <div className="md:hidden space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                {/* Icon + vertical connector */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: step.lightBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 min-h-[20px]" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.number}
                    </span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom reassurance strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Devis sous 24h", color: "#04599c" },
            { label: "Sans engagement", color: "#00B4D8" },
            { label: "Prix transparent", color: "#FFB800" },
            { label: "Garanti 10 ans", color: "#10B981" },
          ].map(({ label, color }, i) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 bg-white rounded-xl py-3 px-4 shadow-sm border border-gray-100 text-sm font-semibold text-gray-700"
            >
              <CheckCircle className="w-4 h-4 shrink-0" style={{ color }} />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
