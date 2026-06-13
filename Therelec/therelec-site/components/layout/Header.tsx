"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Phone,
  Menu,
  X,
  Zap,
  Wind,
  AlertTriangle,
  Building2,
  ChevronDown,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Accueil" },
  {
    href: "/services",
    label: "Services",
    dropdown: [
      { href: "/services/electricite", label: "Électricité", icon: Zap, desc: "Installation, rénovation, conformité" },
      { href: "/services/climatisation", label: "Climatisation", icon: Wind, desc: "Split, gainable, pompe à chaleur" },
      { href: "/contact", label: "Dépannage 24h/24", icon: AlertTriangle, desc: "Intervention urgente < 30 min" },
      { href: "/contact", label: "Entreprises", icon: Building2, desc: "Solutions tertiaires & maintenance" },
    ],
  },
  { href: "/realisations", label: "Réalisations" },
  { href: "/certifications", label: "Certifications" },
  { href: "/avis", label: "Avis clients" },
  { href: "/zone-intervention", label: "Zone d'intervention" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#04599c] text-white px-4 py-2 rounded-lg z-[200] font-medium"
      >
        Aller au contenu principal
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-transparent"
        )}
        role="banner"
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04599c] rounded"
              aria-label="Therelec — Accueil"
            >
              {/* Sur fond sombre (hero non scrollé) : logo avec fond blanc arrondi */}
              {/* Sur fond blanc (scrollé) : logo direct */}
              <div
                className={cn(
                  "transition-all duration-300",
                  isScrolled
                    ? "bg-transparent p-0 rounded-none"
                    : "bg-white rounded-xl p-1"
                )}
              >
                <Image
                  src="/logo.png"
                  alt="Therelec — Génie Électrique et Climatique"
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isScrolled
                          ? "text-gray-700 hover:text-[#04599c] hover:bg-[#04599c]/5"
                          : "text-gray-200 hover:text-white hover:bg-white/10"
                      )}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")}
                      />
                    </button>

                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                        {link.dropdown.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#04599c]/10 flex items-center justify-center shrink-0 group-hover:bg-[#04599c]/20">
                                <Icon className="w-4 h-4 text-[#04599c]" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm group-hover:text-[#04599c]">
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? isScrolled
                          ? "text-[#04599c] bg-[#04599c]/10"
                          : "text-white bg-white/20"
                        : isScrolled
                        ? "text-gray-700 hover:text-[#04599c] hover:bg-[#04599c]/5"
                        : "text-gray-200 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA Zone */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+33699699428"
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-colors",
                  isScrolled ? "text-gray-700 hover:text-[#04599c]" : "text-white hover:text-[#FFB800]"
                )}
                aria-label="Appeler Therelec"
              >
                <Phone className="w-4 h-4" />
                <span>06 99 69 94 28</span>
              </a>
              <Button asChild size="sm" variant="accent">
                <Link href="/contact">
                  <FileText className="w-4 h-4" />
                  Devis gratuit
                </Link>
              </Button>
            </div>

            {/* Mobile: Phone + Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:+33699699428"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isScrolled ? "bg-[#04599c] text-white" : "bg-white/20 text-white"
                )}
                aria-label="Appeler Therelec"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                )}
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobile"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Therelec — Génie Électrique et Climatique"
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain"
                />
              </div>

              <a
                href="tel:+33699699428"
                className="flex items-center gap-3 p-3 bg-[#04599c] text-white rounded-xl font-semibold mb-3"
              >
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-xs opacity-80">Appelez-nous</p>
                  <p>06 99 69 94 28</p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 p-3 bg-[#FFB800] text-[#0A1628] rounded-xl font-bold"
              >
                <FileText className="w-4 h-4" />
                Devis gratuit
              </Link>
            </div>

            <div className="p-4">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key="services" className="mb-1">
                    <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Services
                    </p>
                    {link.dropdown.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[#04599c]" />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                ) : link.href !== "/" ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors",
                      pathname === link.href
                        ? "bg-[#04599c]/10 text-[#04599c]"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
              <Link
                href="/"
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors",
                  pathname === "/"
                    ? "bg-[#04599c]/10 text-[#04599c]"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                Accueil
              </Link>
            </div>

            <div className="p-4 border-t border-gray-100 mt-auto">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Contact
              </Link>
              <Link
                href="/mentions-legales"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50"
              >
                Mentions légales
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
