"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Wind, Zap, CheckCircle } from "lucide-react"

const climaPartners = [
  {
    src: "/partners/clima/cropped-logo_pour_papier-01-1.png",
    alt: "Daikin — Partenaire climatisation Therelec",
    name: "Daikin",
    desc: "Leader mondial des systèmes de climatisation",
    w: 140,
    h: 60,
  },
  {
    src: "/partners/clima/3.png",
    alt: "Toshiba — Partenaire climatisation Therelec",
    name: "Toshiba",
    desc: "Pompes à chaleur haute performance",
    w: 140,
    h: 60,
  },
  {
    src: "/partners/clima/4.png",
    alt: "Panasonic — Partenaire climatisation Therelec",
    name: "Panasonic",
    desc: "Solutions éco-énergétiques certifiées",
    w: 140,
    h: 60,
  },
]

const elecPartners = [
  {
    src: "/partners/elec/1-1.png",
    alt: "Hager — Partenaire électricité Therelec",
    name: "Hager",
    desc: "Tableaux électriques & disjoncteurs",
    w: 130,
    h: 55,
  },
  {
    src: "/partners/elec/2-1.png",
    alt: "Schneider Electric — Partenaire électricité Therelec",
    name: "Schneider Electric",
    desc: "Gestion de l'énergie & automatismes",
    w: 160,
    h: 55,
  },
  {
    src: "/partners/elec/3-1.png",
    alt: "Siemens — Partenaire électricité Therelec",
    name: "Siemens",
    desc: "Appareillage électrique & domotique",
    w: 140,
    h: 55,
  },
]

function PartnerGroup({
  icon: Icon,
  color,
  bg,
  border,
  label,
  badge,
  partners,
  delay,
}: {
  icon: typeof Wind
  color: string
  bg: string
  border: string
  label: string
  badge: string
  partners: typeof climaPartners
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className={`rounded-3xl border ${border} ${bg} p-7 md:p-8`}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="font-black text-gray-900 text-base leading-none">{label}</p>
          <p className="text-gray-400 text-xs mt-0.5">{badge}</p>
        </div>
      </div>

      {/* Partner logos */}
      <div className="grid grid-cols-3 gap-4">
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: delay + 0.1 + i * 0.08 }}
            whileHover={{ y: -3, scale: 1.03 }}
            className="group bg-white rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-default"
          >
            <div className="h-10 flex items-center justify-center w-full">
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                className="max-h-10 w-auto object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-800 leading-none">{p.name}</p>
              <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust pill */}
      <div className="mt-5 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 shrink-0" style={{ color }} />
        <p className="text-xs text-gray-500">
          Matériaux installés avec{" "}
          <strong className="text-gray-700">garantie fabricant</strong> et SAV assuré
        </p>
      </div>
    </motion.div>
  )
}

export default function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="partners-heading">
      <div className="container-site">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Nos partenaires
          </span>
          <h2
            id="partners-heading"
            className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
          >
            Des marques de référence mondiale
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Therelec installe uniquement des équipements de grandes marques, garantissant
            fiabilité, performance et éligibilité aux aides de l'État.
          </p>
        </motion.div>

        {/* Two groups side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PartnerGroup
            icon={Wind}
            color="#00B4D8"
            bg="bg-[#f0fbfe]"
            border="border-[#00B4D8]/15"
            label="Pompe à chaleur air/air & air/eau"
            badge="Climatisation · Partenaires officiels"
            partners={climaPartners}
            delay={0}
          />
          <PartnerGroup
            icon={Zap}
            color="#04599c"
            bg="bg-[#f0f6fc]"
            border="border-[#04599c]/15"
            label="Matériaux & appareillage électrique"
            badge="Électricité · Partenaires officiels"
            partners={elecPartners}
            delay={0.12}
          />
        </div>

        {/* Bottom reassurance strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left shadow-sm"
        >
          {[
            { emoji: "🏆", text: "Marques certifiées NF & CE" },
            { emoji: "🔧", text: "SAV & pièces disponibles" },
            { emoji: "📋", text: "Garantie fabricant complète" },
            { emoji: "✅", text: "Éligibles MaPrimeRénov'" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
