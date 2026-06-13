"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Wind,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { motion } from "framer-motion"

const trustItems = [
  "Devis gratuit sous 24h",
  "Certifié Qualifelec 2025",
  "6 labels RGE officiels",
  "Intervention < 30 min",
]

const floatingCards = {
  topLeft: {
    icon: Zap,
    color: "#04599c",
    bg: "#e6f0f8",
    title: "Qualifelec 2025",
    sub: "Certification électricité",
  },
  right: {
    stars: 5,
    score: "4.9",
    reviews: "127 avis Google",
  },
  bottomLeft: {
    color: "#10B981",
    title: "RGE Reconnu",
    sub: "5 labels officiels",
  },
  bottomRight: {
    color: "#F97316",
    title: "Urgence 24h/24",
    sub: "< 30 min",
  },
}

export default function HeroSection() {
  const TopLeftIcon = floatingCards.topLeft.icon

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0d2040 50%, #04599c 100%)" }}
      aria-label="Présentation Therelec"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #04599c 0%, transparent 70%)" }}
      />

      <div className="container-site relative z-10 py-32 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center">

          {/* ── Left: Content (7 cols) ── */}
          <div className="lg:col-span-7">

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2.5 bg-[#10B981]/15 border border-[#10B981]/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shrink-0" />
                <span className="text-[#4ADE80] text-sm font-semibold">
                  Disponible maintenant — Intervention &lt; 30 min
                </span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] xl:text-6xl font-black text-white leading-[1.08] mb-5"
            >
              Électricien &amp;{" "}
              <span className="text-[#FFB800]">Climatisation</span>
              <br />à Neuilly-sur-Seine
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed mb-7 max-w-xl"
            >
              Artisan certifié{" "}
              <strong className="text-white">Qualifelec</strong> &amp;{" "}
              <strong className="text-white">RGE QualiPac</strong> — installation électrique,
              climatisation et dépannage 7j/7 pour particuliers et professionnels en Île-de-France.
            </motion.p>

            {/* Trust checkmarks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-8"
            >
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-200">
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-sm leading-tight">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#0A1628] font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#FFB800]/25"
              >
                <FileText className="w-4 h-4" />
                Devis gratuit
              </Link>
              <a
                href="tel:+33699699428"
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#e06010] text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-[#F97316]/25"
              >
                <AlertTriangle className="w-4 h-4" />
                Urgence 24h/24
              </a>
              <a
                href="tel:+33699699428"
                className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                06 99 69 94 28
              </a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-6 pt-6 border-t border-white/10"
            >
              {[
                { value: "4.9/5", label: "Google Reviews", dot: "#FFB800" },
                { value: "+1 000", label: "Clients satisfaits", dot: "#00B4D8" },
                { value: "6", label: "Certifications", dot: "#10B981" },
                { value: "5 ans+", label: "d'expérience", dot: "#F97316" },
              ].map(({ value, label, dot }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                  <span className="text-white font-black text-sm">{value}</span>
                  <span className="text-gray-400 text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Visual (5 cols — desktop only) ── */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main photo card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/hero-technicien.jpg"
                  alt="Technicien Therelec en intervention"
                  width={520}
                  height={580}
                  className="w-full h-[520px] object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />

                {/* Overlay bottom pill */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
                    <span className="text-white font-bold text-sm">Artisan certifié RGE</span>
                  </div>
                  <Link
                    href="/certifications"
                    className="flex items-center gap-1 text-[#FFB800] text-xs font-semibold hover:underline"
                  >
                    Voir <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Floating card — Qualifelec (top-left) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -top-5 -left-8 bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-3 min-w-[190px]"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: floatingCards.topLeft.bg }}
                >
                  <TopLeftIcon className="w-5 h-5" style={{ color: floatingCards.topLeft.color }} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm leading-none">{floatingCards.topLeft.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{floatingCards.topLeft.sub}</p>
                </div>
              </motion.div>

              {/* Floating card — Google Rating (right) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="absolute top-1/3 -right-8 bg-white rounded-2xl shadow-xl p-3.5"
              >
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-[#FFB800]" fill="#FFB800" />
                  ))}
                </div>
                <p className="font-black text-gray-900 text-xl leading-none">
                  {floatingCards.right.score}
                  <span className="text-sm font-semibold text-gray-400"> / 5</span>
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{floatingCards.right.reviews}</p>
              </motion.div>

              {/* Floating card — RGE (bottom-left) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="absolute -bottom-5 -left-8 rounded-2xl shadow-xl px-4 py-3 text-white"
                style={{ backgroundColor: floatingCards.bottomLeft.color }}
              >
                <p className="font-black text-sm leading-none">{floatingCards.bottomLeft.title}</p>
                <p className="text-green-100 text-xs mt-0.5">{floatingCards.bottomLeft.sub}</p>
              </motion.div>

              {/* Floating card — Emergency (bottom-right) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="absolute bottom-16 -right-8 rounded-2xl shadow-xl px-4 py-3 text-white flex items-center gap-2"
                style={{ backgroundColor: floatingCards.bottomRight.color }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <div>
                  <p className="font-black text-sm leading-none">{floatingCards.bottomRight.title}</p>
                  <p className="text-orange-100 text-xs mt-0.5">{floatingCards.bottomRight.sub}</p>
                </div>
              </motion.div>

              {/* Decorative rings */}
              <div className="absolute -z-10 -bottom-12 -right-12 w-48 h-48 rounded-full border border-white/10" />
              <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 rounded-full border border-white/5" />
            </motion.div>
          </div>
        </div>

        {/* ── Mobile: mini stats (visible on mobile only) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 grid grid-cols-2 gap-3 lg:hidden"
        >
          {[
            { value: "4.9/5", label: "Google", color: "#FFB800" },
            { value: "+1 000", label: "Clients", color: "#00B4D8" },
            { value: "6", label: "Certifications", color: "#10B981" },
            { value: "< 30 min", label: "Urgence", color: "#F97316" },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white/8 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div>
                <p className="text-white font-black text-base leading-none">{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20">
          <path d="M0,80 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
