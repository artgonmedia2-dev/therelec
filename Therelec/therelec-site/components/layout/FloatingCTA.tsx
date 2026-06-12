"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, FileText, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Mobile: Bottom Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-white border-t border-gray-200 shadow-2xl p-3 safe-area-inset-bottom">
          <div className="flex gap-2">
            <a
              href="tel:+33699699428"
              className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm"
              aria-label="Appeler Therelec en urgence"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Urgence 24h/24</span>
            </a>
            <Link
              href="/contact"
              className="flex-1 flex items-center justify-center gap-2 bg-[#04599c] text-white py-3 rounded-xl font-bold text-sm"
              aria-label="Demander un devis gratuit"
            >
              <FileText className="w-4 h-4" />
              <span>Devis gratuit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: Floating Phone Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <div className="flex flex-col items-end gap-3">
          {expanded && (
            <div className="flex flex-col gap-2 mb-1">
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-[#04599c] text-white px-4 py-3 rounded-xl shadow-lg hover:bg-[#034882] transition-all text-sm font-semibold whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                Devis gratuit
              </Link>
              <a
                href="tel:+33699699428"
                className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-3 rounded-xl shadow-lg hover:bg-[#EA6C0A] transition-all text-sm font-semibold whitespace-nowrap"
              >
                <AlertTriangle className="w-4 h-4" />
                Urgence 24h/24
              </a>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
              "bg-[#04599c] text-white hover:bg-[#034882] hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04599c] focus-visible:ring-offset-2"
            )}
            aria-label={expanded ? "Fermer les options de contact" : "Ouvrir les options de contact"}
          >
            {expanded ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </>
  )
}
