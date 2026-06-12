"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Zap, Wind, CheckCircle, Lock, Phone, Clock, MessageSquare, Shield } from "lucide-react"
import ContactFormClimatisation from "@/components/home/ContactFormClimatisation"
import ContactFormElectricite from "@/components/home/ContactFormElectricite"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  contactSchema,
  type ContactFormData,
  electriciteOptions,
  climatisationOptions,
} from "@/lib/schemas/contact"

function ContactForm({ serviceType }: { serviceType: "electricite" | "climatisation" }) {
  const options = serviceType === "electricite" ? electriciteOptions : climatisationOptions

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceType, rgpd: false },
  })

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log("Form submitted:", data)
    toast({
      title: "Demande envoyée !",
      description: "Nous vous répondons dans les 2 heures. Merci de votre confiance.",
      variant: "success",
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="hidden" {...register("serviceType")} value={serviceType} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`nom-${serviceType}`}>
            Nom complet <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`nom-${serviceType}`}
            placeholder="Jean Dupont"
            error={errors.nom?.message}
            {...register("nom")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`tel-${serviceType}`}>
            Téléphone <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`tel-${serviceType}`}
            type="tel"
            placeholder="06 XX XX XX XX"
            error={errors.telephone?.message}
            {...register("telephone")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`email-${serviceType}`}>Email</Label>
          <Input
            id={`email-${serviceType}`}
            type="email"
            placeholder="jean@exemple.fr"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`cp-${serviceType}`}>Code postal</Label>
          <Input
            id={`cp-${serviceType}`}
            placeholder="92200"
            maxLength={5}
            error={errors.codePostal?.message}
            {...register("codePostal")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Type de prestation</Label>
        <Select onValueChange={(val) => setValue("prestation", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une prestation..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`desc-${serviceType}`}>Description de votre besoin</Label>
        <Textarea
          id={`desc-${serviceType}`}
          placeholder="Décrivez brièvement votre besoin ou le problème rencontré..."
          className="h-28"
          {...register("description")}
        />
      </div>

      {/* RGPD */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={`rgpd-${serviceType}`}
          className="mt-0.5 w-4 h-4 accent-[#04599c] cursor-pointer"
          {...register("rgpd")}
        />
        <Label htmlFor={`rgpd-${serviceType}`} className="text-xs text-gray-500 font-normal cursor-pointer">
          J&apos;accepte que mes données soient utilisées pour traiter ma demande de devis,
          conformément à la{" "}
          <a href="/mentions-legales#confidentialite" className="text-[#04599c] hover:underline">
            politique de confidentialité
          </a>
          . <span className="text-red-500">*</span>
        </Label>
      </div>
      {errors.rgpd && <p className="text-xs text-red-600">{errors.rgpd.message}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
        aria-label="Envoyer ma demande de devis"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </span>
        ) : (
          "Envoyer ma demande de devis"
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3" />
        Vos données sont protégées — Réponse garantie sous 2h
      </p>
    </form>
  )
}

export default function ContactFormSection() {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="contact-form-heading">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#04599c]/10 text-[#04599c] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Contact
          </span>
          <h2 id="contact-form-heading" className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Demandez votre devis gratuit
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Remplissez le formulaire — nous vous répondons sous 2h ouvrées avec un devis personnalisé.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">

          {/* Form card — 3/5 width */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0A1628] to-[#04599c] p-6 md:p-8">
                <h3 className="text-white font-black text-xl md:text-2xl mb-1">
                  Demande de devis gratuit
                </h3>
                <div className="flex flex-wrap gap-3 mt-4">
                  {["Réponse sous 2h", "Devis sans engagement", "Gratuit"].map((label) => (
                    <div key={label} className="flex items-center gap-1.5 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs + form */}
              <div className="p-6 md:p-8">
                <Tabs defaultValue="electricite">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="electricite" className="flex-1">
                      <Zap className="w-4 h-4" />
                      Électricité
                    </TabsTrigger>
                    <TabsTrigger value="climatisation" className="flex-1">
                      <Wind className="w-4 h-4" />
                      Climatisation
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="electricite">
                    {/* Qualifelec certification badge */}
                    <div className="flex items-center gap-3 bg-[#e6f0f8] border border-[#04599c]/20 rounded-xl px-4 py-3 mb-5">
                      <Image
                        src="/logo-qualifelec.jpg"
                        alt="Certification Qualifelec"
                        width={80}
                        height={40}
                        className="object-contain shrink-0"
                      />
                      <div>
                        <p className="text-[#04599c] font-bold text-sm">Artisan certifié Qualifelec</p>
                        <p className="text-gray-500 text-xs">Travaux électriques conformes NF C 15-100</p>
                      </div>
                    </div>
                    <ContactFormElectricite />
                  </TabsContent>

                  <TabsContent value="climatisation">
                    {/* RGE certification badge */}
                    <div className="flex items-center gap-3 bg-[#e0f7fa] border border-[#00B4D8]/20 rounded-xl px-4 py-3 mb-5">
                      <Image
                        src="/logo-rge.jpg"
                        alt="Certification RGE QualiPac"
                        width={80}
                        height={40}
                        className="object-contain shrink-0"
                      />
                      <div>
                        <p className="text-[#00B4D8] font-bold text-sm">Artisan certifié RGE QualiPac</p>
                        <p className="text-gray-500 text-xs">Éligible MaPrimeRénov' & CEE</p>
                      </div>
                    </div>
                    <ContactFormClimatisation />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>

          {/* Sidebar — 2/5 width */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Urgence CTA */}
            <div className="bg-gradient-to-br from-[#F97316] to-[#DC6A0F] rounded-2xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-xl mb-1">Urgence ?</h3>
              <p className="text-orange-100 text-sm mb-4">
                Pas le temps d&apos;attendre ? Appelez directement — intervention en moins de 30 minutes.
              </p>
              <a
                href="tel:+33699699428"
                className="flex items-center justify-center gap-2 w-full bg-white text-[#F97316] font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                06 99 69 94 28
              </a>
              <p className="text-orange-200 text-xs text-center mt-3">Disponible 24h/24 — 7j/7</p>
            </div>

            {/* Why us trust list */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
              <h3 className="font-bold text-gray-900 mb-5">Pourquoi nous choisir ?</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "Réponse sous 2h",
                    sub: "Jours ouvrés",
                    color: "#04599c",
                  },
                  {
                    icon: CheckCircle,
                    title: "Devis 100% gratuit",
                    sub: "Sans engagement",
                    color: "#10B981",
                  },
                  {
                    icon: Shield,
                    title: "Garantie décennale",
                    sub: "Assurance RC Pro",
                    color: "#8B5CF6",
                  },
                  {
                    icon: MessageSquare,
                    title: "4.9/5 sur Google",
                    sub: "127 avis vérifiés",
                    color: "#FFB800",
                  },
                ].map(({ icon: Icon, title, sub, color }) => (
                  <div key={title} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm leading-none mb-0.5">{title}</p>
                      <p className="text-gray-400 text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address / info */}
            <div className="bg-[#0A1628] rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-xs mb-1">Notre siège social</p>
              <p className="text-white font-bold text-sm">Neuilly-sur-Seine, 92200</p>
              <p className="text-gray-400 text-xs mt-2">Île-de-France</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
