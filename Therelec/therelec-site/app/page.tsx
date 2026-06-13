import type { Metadata } from "next"
import HeroSection from "@/components/home/HeroSection"
import SocialProofSection from "@/components/home/SocialProofSection"
import ServicesSection from "@/components/home/ServicesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import ProcessSection from "@/components/home/ProcessSection"
import CTABanner from "@/components/home/CTABanner"
import FAQSection from "@/components/home/FAQSection"
import ContactFormSection from "@/components/home/ContactFormSection"
import CertificationsSection from "@/components/home/CertificationsSection"
import PartnersSection from "@/components/home/PartnersSection"

export const metadata: Metadata = {
  title: "Therelec — Électricien & Climatisation à Neuilly-sur-Seine | Devis Gratuit",
  description:
    "Electricien certifié Qualifelec et installateur RGE QualiPac à Neuilly-sur-Seine. Installation, rénovation électrique, climatisation, dépannage 24h/24. Devis gratuit.",
  alternates: { canonical: "https://therelec.fr" },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <CertificationsSection />
      <PartnersSection />
      <CTABanner />
      <FAQSection />
      <ContactFormSection />
    </>
  )
}
