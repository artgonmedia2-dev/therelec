"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, FileText, AlertTriangle, CheckCircle, Star, Award, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const stats = [
  { icon: Star, value: "4.9/5", label: "Google Reviews", color: "#FFB800" },
  { icon: Award, value: "+1000", label: "Clients satisfaits", color: "#00B4D8" },
  { icon: Shield, value: "Qualifelec", label: "Certifié 2025", color: "#10B981" },
  { icon: Zap, value: "< 30 min", label: "Urgence", color: "#F97316" },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A1628]"
      aria-label="Présentation Therelec"
    >
      {/* ── Background photo ─────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src="/hero-technicien.jpg"
          alt="Technicien Therelec en intervention électrique"
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        {/* Mobile : dark uniform overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#0A1628]/78 md:hidden" />
        {/* Desktop : gradient fades left (solid) → right (transparent) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0A1628] from-40% via-[#0A1628]/80 via-60% to-[#0A1628]/15" />
      </div>

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="container-site relative z-10 py-28 md:py-32">
        {/* On desktop, content occupies ~55% of width so image shows on right */}
        <div className="w-full md:max-w-[58%] lg:max-w-xl">

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shrink-0" />
              <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                Disponible maintenant — Intervention &lt; 30 min
              </span>
            </div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[2.4rem] sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.1]"
          >
            Électricien &{" "}
            <span className="text-[#FFB800]">Climatisation</span>
            <br />à Neuilly-sur-Seine
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-200 mb-5 leading-relaxed"
          >
            Artisan certifié <strong className="text-white">Qualifelec</strong> &{" "}
            <strong className="text-white">RGE QualiPac</strong> disponible 7j/7 pour
            particuliers et professionnels en Île-de-France.
          </motion.p>

          {/* Trust indicators — 2-column grid, no overflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-x-3 gap-y-2 mb-8"
          >
            {[
              "Devis gratuit sous 24h",
              "Garantie décennale",
              "Certifié Qualifelec 2025",
              "RGE QualiPac 2025",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-gray-200">
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs sm:text-sm leading-tight">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons — stacked on mobile, row on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Button asChild size="lg" variant="urgent" className="w-full sm:w-auto">
              <a href="tel:+33699699428" aria-label="Urgence électrique 24h/24">
                <AlertTriangle className="w-4 h-4" />
                Urgence 24h/24
              </a>
            </Button>

            <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
              <Link href="/contact" aria-label="Devis gratuit">
                <FileText className="w-4 h-4" />
                Devis gratuit
              </Link>
            </Button>

            <Button asChild size="lg" variant="white" className="hidden sm:flex">
              <a href="tel:+33699699428" aria-label="Nous appeler">
                <Phone className="w-4 h-4" />
                Nous appeler
              </a>
            </Button>
          </motion.div>

          {/* Stats — always 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.map(({ icon: Icon, value, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base leading-none">{value}</p>
                  <p className="text-gray-300 text-xs mt-0.5 leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20">
          <path d="M0,80 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
