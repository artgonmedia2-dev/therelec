import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})
import Footer from "@/components/layout/Footer"
import FloatingCTA from "@/components/layout/FloatingCTA"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL("https://therelec.fr"),
  title: {
    default: "Therelec — Électricien & Climatisation à Neuilly-sur-Seine",
    template: "%s | Therelec — Génie Électrique & Climatique",
  },
  description:
    "Therelec, artisan électricien certifié Qualifelec & RGE QualiPac à Neuilly-sur-Seine. Installation, rénovation, dépannage 24h/24 en Île-de-France. Devis gratuit.",
  keywords: [
    "électricien Neuilly-sur-Seine",
    "climatisation Neuilly-sur-Seine",
    "dépannage électrique urgent 92",
    "installation climatisation Île-de-France",
    "Qualifelec",
    "RGE QualiPac",
    "mise en conformité NF C 15-100",
  ],
  authors: [{ name: "Therelec" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://therelec.fr",
    siteName: "Therelec",
    title: "Therelec — Électricien & Climatisation à Neuilly-sur-Seine",
    description:
      "Artisan certifié Qualifelec & RGE QualiPac. Électricité, climatisation, dépannage 24h/24 en Île-de-France.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Therelec — Électricien & Climatisation Neuilly-sur-Seine",
    description: "Artisan certifié Qualifelec & RGE. Dépannage 24h/24.",
  },
  alternates: { canonical: "https://therelec.fr" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://therelec.fr",
  name: "Therelec",
  description:
    "Artisan électricien certifié Qualifelec et RGE QualiPac à Neuilly-sur-Seine. Installation électrique, climatisation, dépannage urgence 24h/24 en Île-de-France.",
  url: "https://therelec.fr",
  telephone: "+33699699428",
  email: "contact@therelec.fr",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Neuilly-sur-Seine",
    postalCode: "92200",
    addressRegion: "Hauts-de-Seine",
    addressCountry: "FR",
  },
  geo: { "@type": "GeoCoordinates", latitude: "48.8848", longitude: "2.2685" },
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "€€",
  areaServed: [
    { "@type": "City", name: "Neuilly-sur-Seine" },
    { "@type": "City", name: "Courbevoie" },
    { "@type": "State", name: "Île-de-France" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FloatingCTA />
        <Toaster />
      </body>
    </html>
  )
}
