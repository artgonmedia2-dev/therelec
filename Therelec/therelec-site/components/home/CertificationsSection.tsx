"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Euro, Leaf, ShieldCheck } from "lucide-react"

const logos = [
  { src: "/certifications/6-1.png", alt: "Qualifelec — Certification électricité", w: 180, h: 80 },
  { src: "/certifications/4-1.png", alt: "RGE QualiPac — Pompes à chaleur & climatisation", w: 180, h: 80 },
  { src: "/certifications/1-1.png", alt: "RGE Chauffage+ — Chaudières & systèmes de chauffage", w: 180, h: 80 },
  { src: "/certifications/2-1.png", alt: "RGE QualiSol — Énergie solaire", w: 180, h: 80 },
  { src: "/certifications/3-1.png", alt: "RGE Quali'Bois — Chauffage bois & biomasse", w: 180, h: 80 },
  { src: "/certifications/5-1.png", alt: "RGE Ventilation+ — VMC & ventilation", w: 180, h: 80 },
]

const benefits = [
  {
    icon: Euro,
    color: "#10B981",
    title: "Aides financières",
    text: "MaPrimeRénov', CEE, Éco-PTZ et TVA à 5,5% accessibles uniquement avec un artisan RGE.",
  },
  {
    icon: ShieldCheck,
    color: "#04599c",
    title: "Qualité garantie",
    text: "Nos certifications attestent d'une formation continue et d'un contrôle qualité par des organismes indépendants.",
  },
  {
    icon: Leaf,
    color: "#22C55E",
    title: "Engagement écologique",
    text: "Le label RGE est décerné aux artisans engagés dans la transition énergétique et les économies d'énergie.",
  },
]

export default function CertificationsSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="certs-heading">
      <div className="container-site">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4" />
            Certifications & Qualifications
          </span>
          <h2 id="certs-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Un artisan certifié,<br className="hidden sm:block" /> c'est votre garantie
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Therelec détient <strong className="text-gray-800">6 certifications professionnelles</strong> qui
            vous ouvrent l'accès aux aides de l'État et vous garantissent une installation aux normes.
          </p>
        </motion.div>

        {/* RGE highlight banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-[#0A1628] to-[#04599c] rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <Leaf className="w-8 h-8 text-[#4ADE80]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[#4ADE80] text-sm font-bold uppercase tracking-widest mb-1">
              Reconnu Garant de l'Environnement
            </p>
            <h3 className="text-white text-xl md:text-2xl font-black mb-2">
              Artisan RGE — Accès à toutes les aides de l'État
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
              En choisissant Therelec, vous pouvez bénéficier de{" "}
              <strong className="text-white">MaPrimeRénov'</strong>,{" "}
              <strong className="text-white">CEE</strong>,{" "}
              <strong className="text-white">Éco-prêt à taux zéro</strong> et de la{" "}
              <strong className="text-white">TVA à 5,5%</strong> sur vos travaux de rénovation énergétique.
            </p>
          </div>
          <Link
            href="/certifications"
            className="shrink-0 flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#0A1628] font-bold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            En savoir plus
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Logos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-default"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="w-full h-14 object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* 3 benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {benefits.map(({ icon: Icon, color, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 p-5 bg-gray-50 rounded-2xl"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">{title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/certifications"
              className="inline-flex items-center gap-2 bg-[#04599c] hover:bg-[#034d87] text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              Voir toutes nos certifications
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#04599c] text-[#04599c] hover:bg-[#04599c]/5 font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Simuler mes aides
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-4">
            Consultation gratuite · Estimation des aides personnalisée
          </p>
        </motion.div>

      </div>
    </section>
  )
}
