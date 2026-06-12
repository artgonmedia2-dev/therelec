"use client"

import Link from "next/link"
import { Zap, Wind, AlertTriangle, Building2, ArrowRight, Check, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "electricite",
    icon: Zap,
    title: "Électricité Générale",
    description: "Installation, rénovation et mise en conformité NF C 15-100 pour particuliers et professionnels.",
    features: [
      "Installation électrique neuve",
      "Rénovation & mise aux normes",
      "Tableau électrique & disjoncteur",
      "Domotique & éclairage LED",
      "Attestation Consuel",
    ],
    price: "Dès 80 €",
    href: "/services/electricite",
    color: "#04599c",
    bg: "from-[#04599c] to-[#034882]",
    badge: null,
  },
  {
    id: "climatisation",
    icon: Wind,
    title: "Climatisation",
    description: "Pose et entretien de climatiseurs split, gainable et pompes à chaleur air-air RGE.",
    features: [
      "Split mural & gainable",
      "Pompe à chaleur air-air",
      "Entretien & maintenance",
      "Dossier MaPrimeRénov'",
      "Garantie 5 ans pièces",
    ],
    price: "Dès 1 200 €",
    href: "/services/climatisation",
    color: "#00B4D8",
    bg: "from-[#00B4D8] to-[#0090B0]",
    badge: null,
  },
  {
    id: "depannage",
    icon: AlertTriangle,
    title: "Dépannage 24h/24",
    description: "Urgence électrique ou climatisation ? Nos techniciens interviennent en moins de 30 minutes.",
    features: [
      "Disponible 24h/24, 7j/7",
      "Intervention < 30 min",
      "Panne & court-circuit",
      "Disjoncteur qui saute",
      "Nuits & week-ends inclus",
    ],
    price: "Dès 80 €",
    href: "/contact",
    color: "#F97316",
    bg: "from-[#F97316] to-[#DC6A0F]",
    badge: "URGENCE",
  },
  {
    id: "pro",
    icon: Building2,
    title: "Entreprises & Bureaux",
    description: "Solutions tertiaires sur mesure : électricité, climatisation, mise en conformité ERP.",
    features: [
      "Électricité tertiaire",
      "Climatisation open-space",
      "Contrats de maintenance",
      "Mise en conformité ERP",
      "Devis personnalisé",
    ],
    price: "Sur devis",
    href: "/contact",
    color: "#10B981",
    bg: "from-[#10B981] to-[#0D9A6D]",
    badge: null,
  },
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="services-heading">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Nos prestations
          </span>
          <h2 id="services-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Services Électricité & Climatisation
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            De l'installation au dépannage d'urgence — tous vos besoins couverts
            à Neuilly-sur-Seine et en Île-de-France.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col">
                  {/* Colored header */}
                  <div className={`bg-gradient-to-br ${service.bg} p-6 relative overflow-hidden`}>
                    {/* Badge */}
                    {service.badge && (
                      <span className="absolute top-3 right-3 bg-white text-[#F97316] text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                        {service.badge}
                      </span>
                    )}
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/75 text-xs">{service.price}</p>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-5 flex-1">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: service.color }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={service.href}
                      className="mt-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2 group/btn"
                      style={{ borderColor: service.color, color: service.color }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = service.color
                        el.style.color = "white"
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = "transparent"
                        el.style.color = service.color
                      }}
                      aria-label={`En savoir plus — ${service.title}`}
                    >
                      {service.id === "depannage" ? "Appeler maintenant" : "En savoir plus"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Urgence highlight banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 bg-[#FFF4ED] border border-[#F97316]/20 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="w-12 h-12 bg-[#F97316] rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-gray-900">Urgence électrique ou climatisation ?</p>
            <p className="text-gray-500 text-sm">
              Nos techniciens interviennent à Neuilly-sur-Seine en <strong className="text-[#F97316]">moins de 30 minutes</strong>, 24h/24 et 7j/7.
            </p>
          </div>
          <Button asChild variant="urgent" size="default" className="shrink-0 animate-none">
            <a href="tel:+33699699428">Appeler d'urgence</a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
