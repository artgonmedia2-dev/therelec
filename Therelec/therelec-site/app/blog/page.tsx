import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, BookOpen } from "lucide-react"
import { blogPosts } from "@/lib/data/blog"
import { Badge } from "@/components/ui/badge"
import CTABanner from "@/components/home/CTABanner"

export const metadata: Metadata = {
  title: "Blog — Conseils Électricité & Climatisation",
  description:
    "Articles et conseils sur l'électricité, la climatisation, les aides financières et la réglementation. Expertise Therelec à Neuilly-sur-Seine.",
  alternates: { canonical: "https://therelec.fr/blog" },
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
            Blog Therelec
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Conseils en électricité, climatisation, aides financières et réglementation.
            Expertise d&apos;artisan pour mieux comprendre vos travaux.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-site">
          {/* Featured article */}
          <div className="mb-12">
            <Link href={`/blog/${featured.slug}`} className="group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto min-h-[280px]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#04599c] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      À la une
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#04599c]/10 text-[#04599c] text-xs font-semibold px-3 py-1 rounded-full">
                      {featured.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {featured.readTime} de lecture
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-[#04599c] transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-[#04599c] font-semibold">
                    Lire l&apos;article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Other articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-52">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-[#04599c]/10 text-[#04599c] text-xs font-semibold px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <h2 className="font-black text-gray-900 text-lg mb-3 group-hover:text-[#04599c] transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-[#04599c] font-semibold text-sm">
                      Lire l&apos;article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
