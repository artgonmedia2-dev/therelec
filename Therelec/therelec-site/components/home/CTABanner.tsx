"use client"

import Link from "next/link"
import { Phone, FileText, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CTABanner() {
  return (
    <section
      className="py-16 bg-gradient-to-r from-[#04599c] via-[#034882] to-[#0A1628] relative overflow-hidden"
      aria-label="Appel à l'action"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container-site relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
              <span className="text-green-400 font-semibold text-sm">Disponible maintenant</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3">
              Besoin d&apos;un électricien ?
              <br />
              <span className="text-[#FFB800]">Disponible 24h/24, 7j/7</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Urgence ou planification — nous intervenons à Neuilly-sur-Seine en{" "}
              <strong className="text-white">moins de 30 minutes</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button asChild size="xl" variant="urgent" className="animate-none shadow-xl">
              <a href="tel:+33699699428" aria-label="Appeler pour une urgence 24h/24">
                <AlertTriangle className="w-5 h-5" />
                Urgence 24h/24
              </a>
            </Button>

            <Button asChild size="xl" variant="accent" className="shadow-xl">
              <Link href="/contact" aria-label="Demander un devis gratuit">
                <FileText className="w-5 h-5" />
                Devis gratuit
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "< 30 min", label: "Délai d'intervention" },
            { value: "+1000", label: "Clients satisfaits" },
            { value: "4.9/5", label: "Note Google" },
            { value: "5 ans+", label: "D'expérience" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl md:text-3xl font-black text-[#FFB800]">{value}</p>
              <p className="text-gray-300 text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
