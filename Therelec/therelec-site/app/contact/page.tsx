"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  Zap,
  Wind,
  Lock,
  CheckCircle,
} from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  contactSchema,
  type ContactFormData,
  electriciteOptions,
  climatisationOptions,
} from "@/lib/schemas/contact"

function ContactForm({ serviceType }: { serviceType: "electricite" | "climatisation" | "urgence" }) {
  const options =
    serviceType === "electricite"
      ? electriciteOptions
      : serviceType === "climatisation"
      ? climatisationOptions
      : [...electriciteOptions, ...climatisationOptions]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceType: serviceType === "urgence" ? "urgence" : serviceType, rgpd: false },
  })

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log("Contact form:", data)
    toast({
      title: serviceType === "urgence" ? "Demande urgente envoyée !" : "Demande envoyée !",
      description: "Nous vous répondons dans les 2 heures. Merci de votre confiance.",
      variant: "success",
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input
        type="hidden"
        {...register("serviceType")}
        value={serviceType === "urgence" ? "urgence" : serviceType}
      />

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
            {...register("codePostal")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Type de prestation</Label>
        <Select onValueChange={(val) => setValue("prestation", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez..." />
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
        <Label htmlFor={`desc-${serviceType}`}>Décrivez votre besoin</Label>
        <Textarea
          id={`desc-${serviceType}`}
          placeholder="Décrivez votre besoin ou le problème rencontré..."
          className="h-32"
          {...register("description")}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={`rgpd-${serviceType}`}
          className="mt-0.5 w-4 h-4 accent-[#04599c] cursor-pointer"
          {...register("rgpd")}
        />
        <Label htmlFor={`rgpd-${serviceType}`} className="text-xs text-gray-500 font-normal cursor-pointer">
          J&apos;accepte la{" "}
          <a href="/mentions-legales#confidentialite" className="text-[#04599c] hover:underline">
            politique de confidentialité
          </a>{" "}
          <span className="text-red-500">*</span>
        </Label>
      </div>
      {errors.rgpd && <p className="text-xs text-red-600">{errors.rgpd.message}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        variant={serviceType === "urgence" ? "urgent" : "default"}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </span>
        ) : serviceType === "urgence" ? (
          "Envoyer ma demande urgente"
        ) : (
          "Envoyer ma demande de devis"
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
        <Lock className="w-3 h-3" />
        Données protégées — Réponse garantie sous 2h
      </p>
    </form>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
            Contactez Therelec
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Devis gratuit, urgence 24h/24 ou simple question — nous sommes là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Coordonnées */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Nos coordonnées</h2>
              <div className="space-y-5 mb-8">
                <a
                  href="tel:+33699699428"
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-[#04599c]/40 hover:shadow-md transition-all group"
                >
                  <div className="w-11 h-11 bg-[#04599c] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Téléphone</p>
                    <p className="font-bold text-gray-900 mt-0.5">06 99 69 94 28</p>
                    <p className="text-xs text-gray-400 mt-0.5">Disponible 24h/24</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@therelec.fr"
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-[#04599c]/40 hover:shadow-md transition-all group"
                >
                  <div className="w-11 h-11 bg-[#00B4D8] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</p>
                    <p className="font-bold text-gray-900 mt-0.5">contact@therelec.fr</p>
                    <p className="text-xs text-gray-400 mt-0.5">Réponse sous 2h</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200">
                  <div className="w-11 h-11 bg-[#10B981] rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Adresse</p>
                    <p className="font-bold text-gray-900 mt-0.5">Neuilly-sur-Seine</p>
                    <p className="text-xs text-gray-400 mt-0.5">92200, Hauts-de-Seine</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#FFB800]/10 rounded-2xl border border-[#FFB800]/30">
                  <div className="w-11 h-11 bg-[#FFB800] rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#0A1628]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Disponibilité</p>
                    <p className="font-black text-[#0A1628] mt-0.5">24h/24 — 7j/7</p>
                    <p className="text-xs text-gray-600 mt-0.5">Urgences incluses</p>
                  </div>
                </div>
              </div>

              {/* Urgence card */}
              <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-2xl p-5 text-white">
                <AlertTriangle className="w-8 h-8 mb-3" />
                <h3 className="font-black text-lg mb-2">Urgence électrique ?</h3>
                <p className="text-orange-100 text-sm mb-4">
                  Intervention garantie en moins de 30 minutes sur Neuilly-sur-Seine.
                </p>
                <a
                  href="tel:+33699699428"
                  className="flex items-center justify-center gap-2 bg-white text-[#F97316] font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Appeler d&apos;urgence
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0A1628] to-[#04599c] p-6 md:p-8">
                  <h2 className="text-white font-black text-2xl mb-2">Demande de devis gratuit</h2>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {["Réponse sous 2h", "Sans engagement", "Gratuit"].map((item) => (
                      <div key={item} className="flex items-center gap-1.5 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <Tabs defaultValue="electricite">
                    <TabsList className="w-full mb-6 grid grid-cols-3">
                      <TabsTrigger value="electricite" className="flex-1">
                        <Zap className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Électricité</span>
                      </TabsTrigger>
                      <TabsTrigger value="climatisation" className="flex-1">
                        <Wind className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Climatisation</span>
                      </TabsTrigger>
                      <TabsTrigger value="urgence" className="flex-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Urgence</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="electricite">
                      <ContactForm serviceType="electricite" />
                    </TabsContent>
                    <TabsContent value="climatisation">
                      <ContactForm serviceType="climatisation" />
                    </TabsContent>
                    <TabsContent value="urgence">
                      <div className="mb-5 p-4 bg-[#F97316]/10 rounded-xl border border-[#F97316]/20">
                        <p className="text-[#F97316] font-bold text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Pour une urgence immédiate, appelez directement le 06 99 69 94 28
                        </p>
                      </div>
                      <ContactForm serviceType="urgence" />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
