"use client"

import Link from "next/link"
import { Star, Users, Award, Shield, Quote, ThumbsUp } from "lucide-react"
import { motion } from "framer-motion"
import { testimonials } from "@/lib/data/testimonials"

const proofItems = [
  {
    icon: Star,
    value: "4.9/5",
    label: "Note Google",
    sub: "127 avis vérifiés",
    color: "#FFB800",
    bg: "#FFF8E1",
  },
  {
    icon: Users,
    value: "+1000",
    label: "Clients satisfaits",
    sub: "Particuliers & pros",
    color: "#04599c",
    bg: "#e6f0f8",
  },
  {
    icon: Award,
    value: "Qualifelec",
    label: "Certification",
    sub: "Électricité qualifiée",
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    icon: Shield,
    value: "RGE QualiPac",
    label: "Certification",
    sub: "Climatisation RGE",
    color: "#00B4D8",
    bg: "#E0F7FA",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note: ${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= rating ? "#FFB800" : "none"}
          stroke={star <= rating ? "#FFB800" : "#D1D5DB"}
        />
      ))}
    </div>
  )
}

export default function SocialProofSection() {
  const featured = testimonials.slice(0, 3)

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="social-proof-heading">
      <div className="container-site">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#FFB800]/15 text-[#B8860B] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Avis clients
          </span>
          <h2 id="social-proof-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Ce que disent nos clients
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Plus de 127 avis vérifiés sur Google — voici quelques témoignages récents.
          </p>
        </motion.div>

        {/* Proof Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {proofItems.map(({ icon: Icon, value, label, sub, color, bg }) => (
            <div
              key={value}
              className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <p className="font-black text-xl text-gray-900 leading-none" style={{ color }}>
                {value}
              </p>
              <p className="font-semibold text-gray-800 text-sm mt-1">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Google badge + testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Google badge column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-4">
              {/* Google logo-style */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center">
                  <span className="text-white font-black text-sm">G</span>
                </div>
                <span className="font-bold text-gray-700 text-sm">Google Reviews</span>
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 text-[#FFB800]" fill="#FFB800" />
                ))}
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">4.9</p>
              <p className="text-gray-400 text-sm">Basé sur 127 avis</p>
            </div>

            <div className="bg-gradient-to-br from-[#0A1628] to-[#04599c] rounded-2xl p-6 text-white text-center">
              <ThumbsUp className="w-8 h-8 text-[#FFB800] mx-auto mb-3" />
              <p className="font-bold text-lg mb-1">100% recommandé</p>
              <p className="text-gray-300 text-sm mb-5">
                Nos clients nous recommandent à leur entourage.
              </p>
              <Link
                href="/avis"
                className="inline-flex items-center justify-center w-full bg-white/15 hover:bg-white/25 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm border border-white/20"
              >
                Voir tous les avis →
              </Link>
            </div>
          </motion.div>

          {/* Testimonials */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {featured.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#04599c] to-[#00B4D8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {testimonial.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-400">{testimonial.city}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StarRating rating={testimonial.rating} />
                        <div className="w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center">
                          <span className="text-white font-black text-[10px]">G</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="w-4 h-4 text-[#04599c]/20 absolute -top-1 -left-1" />
                      <p className="text-gray-600 text-sm leading-relaxed pl-4">
                        {testimonial.text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-semibold text-[#04599c] bg-[#04599c]/8 px-2.5 py-1 rounded-full">
                        {testimonial.service}
                      </span>
                      <span className="text-xs text-gray-400">{testimonial.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
