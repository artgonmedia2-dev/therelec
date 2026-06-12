"use client"

import { Clock, Award, ThumbsUp, Euro, MapPin, Wrench, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  { value: "+1000", label: "Clients satisfaits", color: "#FFB800" },
  { value: "4.9/5", label: "Note Google", color: "#FFB800" },
  { value: "< 30 min", label: "Délai urgence", color: "#F97316" },
  { value: "10 ans", label: "Garantie travaux", color: "#10B981" },
]

const arguments_ = [
  {
    icon: Clock,
    title: "Disponible 24h/24, 7j/7",
    description:
      "Nos techniciens sont disponibles à toute heure pour vos urgences électriques et de climatisation. Intervention garantie en moins de 30 minutes sur Neuilly-sur-Seine.",
    color: "#F97316",
    bg: "#F9731618",
    stat: "< 30 min",
    statLabel: "d'intervention",
  },
  {
    icon: Award,
    title: "Certifié Qualifelec & RGE",
    description:
      "Artisan certifié Qualifelec pour l'électricité et RGE QualiPac pour la climatisation. Certifications garantissant des travaux conformes aux normes en vigueur.",
    color: "#10B981",
    bg: "#10B98118",
    stat: "2",
    statLabel: "certifications",
  },
  {
    icon: ThumbsUp,
    title: "4.9/5 — +1000 clients",
    description:
      "Plus de 1000 clients nous font confiance. Nos avis Google attestent de la qualité de nos interventions et de notre professionnalisme.",
    color: "#FFB800",
    bg: "#FFB80018",
    stat: "127",
    statLabel: "avis vérifiés",
  },
  {
    icon: Euro,
    title: "Devis gratuit & transparent",
    description:
      "Devis gratuit sous 24h, sans surprise. Nos tarifs sont clairs et communiqués avant toute intervention. Vous ne payez que ce qui est convenu.",
    color: "#04599c",
    bg: "#04599c18",
    stat: "0 €",
    statLabel: "pour le devis",
  },
  {
    icon: MapPin,
    title: "Artisan local Île-de-France",
    description:
      "Basés à Neuilly-sur-Seine, nous intervenons dans tout le département 92 et en Île-de-France. Un artisan de proximité, pas une grande enseigne.",
    color: "#00B4D8",
    bg: "#00B4D818",
    stat: "50+",
    statLabel: "communes",
  },
  {
    icon: Wrench,
    title: "Garantie décennale",
    description:
      "Tous nos travaux sont couverts par notre garantie décennale et assurance responsabilité civile. Votre installation est protégée pour 10 ans.",
    color: "#8B5CF6",
    bg: "#8B5CF618",
    stat: "10 ans",
    statLabel: "de garantie",
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-[#0A1628]" aria-labelledby="why-us-heading">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#FFB800]/20 text-[#FFB800] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Pourquoi choisir Therelec
          </span>
          <h2 id="why-us-heading" className="text-3xl md:text-4xl font-black text-white mb-4">
            La référence en Génie Électrique{" "}
            <span className="text-[#FFB800]">à Neuilly-sur-Seine</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Nous nous engageons à vous offrir des prestations de qualité, dans le respect des délais
            et avec une totale transparence.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {stats.map(({ value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
            >
              <p className="text-3xl font-black mb-1" style={{ color }}>{value}</p>
              <p className="text-gray-400 text-sm">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Argument cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arguments_.map((arg, i) => {
            const Icon = arg.icon
            return (
              <motion.div
                key={arg.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 flex flex-col"
              >
                {/* Icon + stat row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: arg.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: arg.color }} />
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg leading-none" style={{ color: arg.color }}>
                      {arg.stat}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{arg.statLabel}</p>
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg mb-3">{arg.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{arg.description}</p>

                {/* Bottom colored accent */}
                <div
                  className="mt-5 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: arg.color }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFB800]/20 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-[#FFB800]" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Prêt à démarrer votre projet ?</p>
              <p className="text-gray-400 text-sm">Devis gratuit sous 24h — sans engagement.</p>
            </div>
          </div>
          <a
            href="/contact"
            className="shrink-0 bg-[#FFB800] hover:bg-[#E5A600] text-[#0A1628] font-bold px-8 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Demander un devis gratuit
          </a>
        </motion.div>
      </div>
    </section>
  )
}
