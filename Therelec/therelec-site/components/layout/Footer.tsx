import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock, Award, Star, Shield } from "lucide-react"

const footerServices = [
  { label: "Électricité générale", href: "/services/electricite" },
  { label: "Climatisation", href: "/services/climatisation" },
  { label: "Installation neuve", href: "/services/electricite" },
  { label: "Rénovation électrique", href: "/services/electricite" },
  { label: "Dépannage 24h/24", href: "/contact" },
  { label: "Entreprises & Bureaux", href: "/contact" },
]

const footerLinks = [
  { label: "Accueil", href: "/" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Avis clients", href: "/avis" },
  { label: "Zone d'intervention", href: "/zone-intervention" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/mentions-legales#confidentialite" },
  { label: "CGV", href: "/mentions-legales#cgv" },
]

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <div className="bg-white rounded-xl p-2 inline-block group-hover:opacity-90 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Therelec — Génie Électrique et Climatique"
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Artisan certifié Qualifelec & RGE QualiPac, au service des particuliers et
              professionnels à Neuilly-sur-Seine et en Île-de-France depuis plus de 5 ans.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2">
                <Award className="w-4 h-4 text-[#FFB800]" />
                <span className="text-xs font-semibold">Qualifelec 2025</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs font-semibold">RGE QualiPac</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2">
                <Star className="w-4 h-4 text-[#FFB800]" fill="#FFB800" />
                <span className="text-xs font-semibold">4.9/5 Google</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Nos services
            </h3>
            <ul className="space-y-2.5">
              {footerServices.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Contact & Urgences
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+33699699428"
                  className="flex items-start gap-3 group"
                  aria-label="Téléphone Therelec"
                >
                  <div className="w-9 h-9 bg-[#04599c]/30 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#04599c] transition-colors mt-0.5">
                    <Phone className="w-4 h-4 text-[#00B4D8] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Téléphone</p>
                    <p className="font-semibold text-white group-hover:text-[#FFB800] transition-colors">
                      06 99 69 94 28
                    </p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="mailto:contact@therelec.fr"
                  className="flex items-start gap-3 group"
                  aria-label="Email Therelec"
                >
                  <div className="w-9 h-9 bg-[#04599c]/30 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#04599c] transition-colors mt-0.5">
                    <Mail className="w-4 h-4 text-[#00B4D8] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-white group-hover:text-[#FFB800] transition-colors text-sm">
                      contact@therelec.fr
                    </p>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#04599c]/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#00B4D8]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Adresse</p>
                  <p className="font-semibold text-white text-sm">Neuilly-sur-Seine</p>
                  <p className="text-xs text-gray-400">92200, Hauts-de-Seine</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#FFB800]/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Disponibilité</p>
                  <p className="font-bold text-[#FFB800] text-sm">24h/24 — 7j/7</p>
                  <p className="text-xs text-gray-400">Urgences incluses</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Therelec — Génie Électrique & Climatique. Tous droits réservés.
            </p>
            <p className="text-gray-600 text-xs">
              Site réalisé par{" "}
              <span className="text-gray-400 font-semibold tracking-wide">ArtgonMEDIA</span>
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
