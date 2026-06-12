import type { Metadata } from "next"
import Link from "next/link"
import { Star, Quote, CheckCircle, ThumbsUp, ExternalLink } from "lucide-react"
import { testimonials } from "@/lib/data/testimonials"
import { Button } from "@/components/ui/button"
import CTABanner from "@/components/home/CTABanner"

export const metadata: Metadata = {
  title: "Avis Clients — Témoignages Vérifiés Therelec",
  description:
    "Découvrez les avis de nos clients sur nos prestations d'électricité et climatisation à Neuilly-sur-Seine. Note 4.9/5 sur Google.",
  alternates: { canonical: "https://therelec.fr/avis" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: testimonials.map((t) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
    },
    author: { "@type": "Person", name: t.name },
    reviewBody: t.text,
  })),
}

const ratingBreakdown = [
  { stars: 5, pct: 85 },
  { stars: 4, pct: 10 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
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

export default function AvisPage() {
  const avgRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site text-center">
          <span className="inline-block bg-white/15 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Avis clients vérifiés
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {avgRating}/5 — Nos clients nous font confiance
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10">
            Plus de 127 avis vérifiés sur Google. Découvrez pourquoi +1000 clients nous recommandent
            pour leurs travaux d&apos;électricité et de climatisation.
          </p>

          {/* Rating summary card */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/10 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/20 max-w-xl mx-auto">
            {/* Score */}
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-[#FFB800]">{avgRating}</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 text-[#FFB800]" fill="#FFB800" />
                ))}
              </div>
              <p className="text-gray-300 text-sm mt-1">127 avis Google</p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-20 bg-white/20" />

            {/* Rating bars */}
            <div className="flex-1 w-full sm:w-auto space-y-1.5">
              {ratingBreakdown.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-gray-300 text-xs w-4 text-right">{stars}</span>
                  <Star className="w-3 h-3 text-[#FFB800] shrink-0" fill="#FFB800" />
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFB800] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-8">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container-site">

          {/* Google badge + stats row */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">G</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Google Reviews</p>
                <p className="text-gray-400 text-xs">Plateforme vérifiée</p>
              </div>
            </div>
            {[
              { icon: ThumbsUp, label: "100% recommandé", color: "#10B981" },
              { icon: CheckCircle, label: "Avis vérifiés", color: "#04599c" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
                <Icon className="w-5 h-5" style={{ color }} />
                <span className="font-semibold text-gray-700 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#04599c] to-[#00B4D8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.name}</p>
                      <p className="text-xs text-gray-400 truncate">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StarRating rating={testimonial.rating} />
                    <div className="w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center">
                      <span className="text-white font-black text-[10px]">G</span>
                    </div>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="w-5 h-5 text-[#04599c]/20 absolute -top-1 -left-1" />
                  <p className="text-gray-600 text-sm leading-relaxed pl-5">
                    {testimonial.text}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#04599c] bg-[#04599c]/10 px-2.5 py-1 rounded-full">
                    {testimonial.service}
                  </span>
                  <span className="text-xs text-gray-400">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA — leave review */}
          <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 bg-[#FFB800]/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Star className="w-7 h-7 text-[#FFB800]" fill="#FFB800" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Vous êtes client Therelec ?
            </h2>
            <p className="text-gray-500 mb-6">
              Partagez votre expérience sur Google et aidez d&apos;autres clients à faire le bon choix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <a
                  href="https://g.page/r/therelec/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Laisser un avis Google
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
