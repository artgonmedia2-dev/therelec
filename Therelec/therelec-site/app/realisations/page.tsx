"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { realisations } from "@/lib/data/realisations"
import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle, Star, ArrowRight, Phone, Zap, Wind, Wrench } from "lucide-react"
import CTABanner from "@/components/home/CTABanner"

const categories = [
  { key: "tous", label: "Tous les projets", icon: null },
  { key: "electricite", label: "Électricité", icon: Zap },
  { key: "climatisation", label: "Climatisation", icon: Wind },
  { key: "renovation", label: "Rénovation", icon: Wrench },
]

const categoryColor: Record<string, string> = {
  electricite: "#04599c",
  climatisation: "#00B4D8",
  renovation: "#10B981",
}

const categoryBg: Record<string, string> = {
  electricite: "#e6f0f8",
  climatisation: "#e0f7fa",
  renovation: "#d1fae5",
}

const categoryLabel: Record<string, string> = {
  electricite: "Électricité",
  climatisation: "Climatisation",
  renovation: "Rénovation",
}

function ProjectCard({
  real,
  featured = false,
  index,
}: {
  real: (typeof realisations)[0]
  featured?: boolean
  index: number
}) {
  const color = categoryColor[real.category]
  const bg = categoryBg[real.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={[
        "group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100",
        "hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col",
        featured ? "md:col-span-2 md:flex-row" : "",
      ].join(" ")}
    >
      {/* Image */}
      <div
        className={[
          "relative overflow-hidden shrink-0",
          featured ? "md:w-[55%] h-60 md:h-auto" : "h-52",
        ].join(" ")}
      >
        <Image
          src={real.image}
          alt={`${real.title} — Therelec ${real.city}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, 33vw"}
          priority={featured}
        />

        {/* Permanent subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            {categoryLabel[real.category]}
          </span>
        </div>

        {/* Featured star */}
        {featured && (
          <div className="absolute top-3 right-3 bg-[#FFB800] text-[#0A1628] text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" fill="currentColor" />
            À la une
          </div>
        )}

        {/* City label at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {real.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Color accent top bar */}
        <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: color }} />

        <h3
          className={[
            "font-bold text-gray-900 mb-2 group-hover:transition-colors leading-snug",
            featured ? "text-xl" : "text-base",
          ].join(" ")}
          style={{ color: "inherit" }}
        >
          <span className="group-hover:text-[var(--c)]" style={{ "--c": color } as React.CSSProperties}>
            {real.title}
          </span>
        </h3>

        <p
          className={[
            "text-gray-500 leading-relaxed mb-4 flex-1",
            featured ? "text-sm line-clamp-3" : "text-sm line-clamp-2",
          ].join(" ")}
        >
          {real.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {real.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: bg, color }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            Travaux terminés
          </div>
          {featured && (
            <Link
              href="/contact"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color }}
            >
              Projet similaire ?
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function RealisationsPage() {
  const [active, setActive] = useState("tous")

  const filtered = useMemo(
    () => (active === "tous" ? realisations : realisations.filter((r) => r.category === active)),
    [active]
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { tous: realisations.length }
    for (const r of realisations) {
      c[r.category] = (c[r.category] ?? 0) + 1
    }
    return c
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-[#0A1628] to-[#04599c] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container-site text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Portfolio — Nos réalisations
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              Nos chantiers en <span className="text-[#FFB800]">Île-de-France</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10">
              Découvrez nos interventions récentes en électricité et climatisation.
              Chaque projet est réalisé avec soin et dans les règles de l&apos;art.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: "+1000", label: "Projets réalisés" },
              { value: "5 ans+", label: "D'expérience" },
              { value: "4.9/5", label: "Satisfaction client" },
              { value: "24h/24", label: "Disponibilité" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-[#FFB800]">{value}</p>
                <p className="text-gray-300 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-site">

          {/* Certifications trust strip */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { label: "Certifié Qualifelec", color: "#04599c" },
              { label: "RGE QualiPac", color: "#00B4D8" },
              { label: "Garantie décennale", color: "#10B981" },
              { label: "Devis gratuit sous 24h", color: "#F97316" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-700"
              >
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color }} />
                {label}
              </span>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
            {categories.map((cat) => {
              const isActive = active === cat.key
              const Icon = cat.icon
              return (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={[
                    "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-[#04599c] text-white shadow-md shadow-[#04599c]/30"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#04599c] hover:text-[#04599c]",
                  ].join(" ")}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {cat.label}
                  <span
                    className={[
                      "text-xs rounded-full px-2 py-0.5 font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500",
                    ].join(" ")}
                  >
                    {counts[cat.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <p className="text-center text-gray-400 text-sm mb-8">
            <span className="font-semibold text-gray-700">{filtered.length}</span> projet{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </p>

          {/* Cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((real, i) => (
                <ProjectCard
                  key={real.id}
                  real={real}
                  featured={i === 0 && active === "tous"}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-medium">Aucune réalisation dans cette catégorie.</p>
              <button
                onClick={() => setActive("tous")}
                className="mt-4 text-[#04599c] font-semibold text-sm hover:underline"
              >
                Voir tous les projets →
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
                  Votre projet
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  Vous avez un projet similaire ?
                </h2>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Contactez-nous pour un devis gratuit et sans engagement.
                  Nous intervenons dans toute l&apos;Île-de-France sous 24h.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <Link href="/contact">Demander un devis gratuit</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="tel:+33699699428" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      06 99 69 94 28
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-400">
                  {["Devis sous 24h", "Sans engagement", "Certifié Qualifelec"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — dark panel */}
              <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] p-8 md:p-10 flex flex-col justify-center text-white">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 text-[#FFB800]" fill="#FFB800" />
                  ))}
                </div>
                <p className="text-lg font-bold leading-snug mb-4">
                  &ldquo;Travail impeccable, délais respectés et techniciens très professionnels. Je recommande vivement Therelec.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    ML
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Marie L.</p>
                    <p className="text-gray-300 text-xs">Neuilly-sur-Seine — Rénovation électrique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <CTABanner />
    </>
  )
}
