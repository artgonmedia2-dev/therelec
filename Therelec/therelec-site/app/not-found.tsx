import Link from "next/link"
import { Zap, Home, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#04599c] flex items-center justify-center p-6">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#FFB800] rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Zap className="w-10 h-10 text-[#0A1628]" fill="#0A1628" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-white/20 mb-4">404</h1>
        <h2 className="text-3xl font-black text-white mb-4">Page introuvable</h2>
        <p className="text-gray-300 text-lg mb-10">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de panique —
          revenez à l&apos;accueil ou contactez-nous !
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="accent">
            <Link href="/">
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button asChild size="lg" variant="white">
            <Link href="/contact">
              <FileText className="w-5 h-5" />
              Nous contacter
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <a
            href="tel:+33699699428"
            className="flex items-center justify-center gap-2 text-[#FFB800] font-semibold hover:text-[#E5A600] transition-colors"
          >
            <Phone className="w-4 h-4" />
            Ou appelez-nous : 06 99 69 94 28
          </a>
        </div>
      </div>
    </div>
  )
}
