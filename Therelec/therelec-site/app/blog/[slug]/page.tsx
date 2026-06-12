import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, ArrowLeft, Calendar } from "lucide-react"
import { blogPosts } from "@/lib/data/blog"
import CTABanner from "@/components/home/CTABanner"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: "Article non trouvé" }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://therelec.fr/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-0">
        <div className="container-site max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#0056D2] font-medium mb-8 hover:text-[#0044AA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#0056D2]/10 text-[#0056D2] text-sm font-semibold px-3 py-1.5 rounded-full">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              {post.readTime} de lecture
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-8">{post.excerpt}</p>
        </div>

        {/* Hero image */}
        <div className="container-site max-w-5xl mb-12">
          <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 960px"
            />
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="pb-20">
        <div className="container-site max-w-3xl">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            style={{
              lineHeight: 1.8,
            }}
          >
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-black text-gray-900 mt-10 mb-4"
                  >
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-xl font-bold text-gray-900 mt-6 mb-3"
                  >
                    {line.replace("### ", "")}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <p key={i} className="flex items-start gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-[#0056D2] rounded-full mt-3 shrink-0" />
                    <span>{line.replace("- ", "")}</span>
                  </p>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-bold text-gray-900 mb-2">
                    {line.replace(/\*\*/g, "")}
                  </p>
                )
              }
              if (line.trim() === "") return <br key={i} />
              return (
                <p key={i} className="mb-4 text-gray-600">
                  {line
                    .split(/(\*\*[^*]+\*\*)/g)
                    .map((part, j) =>
                      part.startsWith("**") ? (
                        <strong key={j} className="text-gray-900 font-bold">
                          {part.replace(/\*\*/g, "")}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                </p>
              )
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-site max-w-5xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-48">
                    <Image
                      src={rPost.image}
                      alt={rPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#0056D2] bg-[#0056D2]/10 px-2 py-1 rounded-full">
                      {rPost.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-3 mb-1 group-hover:text-[#0056D2] transition-colors line-clamp-2">
                      {rPost.title}
                    </h3>
                    <p className="text-xs text-gray-400">{rPost.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
