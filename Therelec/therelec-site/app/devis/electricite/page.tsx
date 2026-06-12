"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import {
  Zap,
  Phone,
  CheckCircle,
  Lock,
  ChevronRight,
  AlertTriangle,
  Building2,
  Wrench,
  ClipboardList,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  devisElectriciteSchema,
  type DevisElectriciteData,
  natureOptions,
  typeDemandeOptions,
  batimentOptions,
  puissanceOptions,
  travauxOptions,
  depannageOptions,
} from "@/lib/schemas/devis-electricite"
import { cn } from "@/lib/utils"

// ─── Composants réutilisables ─────────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  title,
  required,
}: {
  icon: React.ElementType
  title: string
  required?: boolean
}) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-[#04599c]/20">
      <div className="w-9 h-9 bg-[#04599c]/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#04599c]" />
      </div>
      <h2 className="font-bold text-gray-900 text-lg">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h2>
    </div>
  )
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  withOtherField,
  otherValue,
  onOtherChange,
}: {
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
  withOtherField?: boolean
  otherValue?: string
  onOtherChange?: (v: string) => void
}) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value
          const isOther = opt.value === "autre"
          return (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-[#04599c] bg-[#04599c]/5"
                  : "border-gray-200 hover:border-[#04599c]/40 hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  isSelected ? "border-[#04599c]" : "border-gray-300"
                )}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#04599c]" />
                )}
              </div>
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className={cn("text-sm font-medium", isSelected ? "text-[#04599c]" : "text-gray-700")}>
                {opt.label}
              </span>
              {isOther && isSelected && withOtherField && (
                <input
                  type="text"
                  placeholder="Préciser…"
                  value={otherValue ?? ""}
                  onChange={(e) => onOtherChange?.(e.target.value)}
                  className="ml-1 flex-1 text-sm border-0 border-b border-[#04599c] focus:outline-none bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </label>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: string[]
  values: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) => {
    onChange(
      values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = values.includes(opt)
        return (
          <label
            key={opt}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
              checked
                ? "border-[#04599c] bg-[#04599c]/5"
                : "border-gray-200 hover:border-[#04599c]/40 hover:bg-gray-50"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                checked ? "border-[#04599c] bg-[#04599c]" : "border-gray-300"
              )}
            >
              {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
            </div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
            <span className={cn("text-sm font-medium", checked ? "text-[#04599c]" : "text-gray-700")}>
              {opt}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function DevisElectricitePage() {
  const [natureVal, setNatureVal] = useState("")
  const [typeDemandeVal, setTypeDemandeVal] = useState("")
  const [batimentVal, setBatimentVal] = useState("")
  const [batimentAutre, setBatimentAutre] = useState("")
  const [puissanceVal, setPuissanceVal] = useState("")
  const [puissanceAutre, setPuissanceAutre] = useState("")
  const [travauxVals, setTravauxVals] = useState<string[]>([])
  const [depannageVals, setDepannageVals] = useState<string[]>([])
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DevisElectriciteData>({
    resolver: zodResolver(devisElectriciteSchema),
    defaultValues: { pays: "France", rgpd: false },
  })

  const onSubmit = async (data: DevisElectriciteData) => {
    setSubmitError("")

    // Validation champs contrôlés
    if (!natureVal) { setSubmitError("Veuillez sélectionner la nature de l'intervention."); return }
    if (!typeDemandeVal) { setSubmitError("Veuillez sélectionner le type de demande."); return }
    if (!batimentVal) { setSubmitError("Veuillez sélectionner le type de bâtiment."); return }
    if (!puissanceVal) { setSubmitError("Veuillez sélectionner la puissance."); return }

    const payload = {
      ...data,
      natureIntervention: natureVal,
      typeDemande: typeDemandeVal,
      typeBatiment: batimentVal,
      typeBatimentAutre: batimentAutre,
      puissance: puissanceVal,
      puissanceAutre: puissanceAutre,
      travaux: travauxVals,
      depannage: depannageVals,
    }

    await new Promise((r) => setTimeout(r, 1400))
    console.log("Devis électricité soumis :", payload)

    toast({
      title: "Demande envoyée avec succès !",
      description: "Notre équipe vous contacte dans les 2 heures. Merci.",
      variant: "success",
    })

    // Reset
    reset()
    setNatureVal("")
    setTypeDemandeVal("")
    setBatimentVal("")
    setBatimentAutre("")
    setPuissanceVal("")
    setPuissanceAutre("")
    setTravauxVals([])
    setDepannageVals([])
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#0A1628] to-[#04599c]">
        <div className="container-site">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium">Devis Électricité</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-[#FFB800] rounded-2xl flex items-center justify-center shrink-0">
              <Zap className="w-7 h-7 text-[#0A1628]" fill="#0A1628" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Formulaire de demande d&apos;intervention
              </h1>
              <p className="text-[#FFB800] font-semibold mt-1">
                Électricité — Installation, Rénovation, Dépannage, Mise en conformité
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {["Devis gratuit sous 2h", "Artisan certifié Qualifelec", "Disponible 24h/24"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-12 bg-gray-50">
        <div className="container-site max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

            {/* ── 1. Nature de l'intervention ─────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={ClipboardList} title="Nature de l'intervention souhaitée" required />
              <RadioGroup
                name="natureIntervention"
                options={natureOptions}
                value={natureVal}
                onChange={setNatureVal}
              />
            </div>

            {/* ── 2. Type de demande ──────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={Wrench} title="Type de demande" required />
              <RadioGroup
                name="typeDemande"
                options={typeDemandeOptions}
                value={typeDemandeVal}
                onChange={setTypeDemandeVal}
              />
            </div>

            {/* ── 3. Type de bâtiment ─────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={Building2} title="Type de bâtiment" required />
              <RadioGroup
                name="typeBatiment"
                options={batimentOptions}
                value={batimentVal}
                onChange={setBatimentVal}
                withOtherField
                otherValue={batimentAutre}
                onOtherChange={setBatimentAutre}
              />
            </div>

            {/* ── 4. Puissance électrique ─────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={Zap} title="Puissance électrique existante ou souhaitée" required />
              <RadioGroup
                name="puissance"
                options={puissanceOptions}
                value={puissanceVal}
                onChange={setPuissanceVal}
                withOtherField
                otherValue={puissanceAutre}
                onOtherChange={setPuissanceAutre}
              />
            </div>

            {/* ── 5. Surface ──────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={Building2} title="Surface concernée" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input
                    id="surface"
                    type="number"
                    min="1"
                    placeholder="ex : 85"
                    {...register("surface")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hauteur">Hauteur sous plafond (m)</Label>
                  <Input
                    id="hauteur"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="ex : 2.5"
                    {...register("hauteur")}
                  />
                </div>
              </div>
            </div>

            {/* ── 6. Travaux électriques concernés ────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={Wrench} title="Travaux électriques concernés" required />
              <p className="text-sm text-gray-500 mb-4">Cochez tout ce qui s&apos;applique</p>
              <CheckboxGroup
                options={travauxOptions}
                values={travauxVals}
                onChange={setTravauxVals}
              />
            </div>

            {/* ── 7. Dépannage ─────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={AlertTriangle} title="Dépannage" required />
              <div className="mb-4 p-3 bg-[#F97316]/10 rounded-xl border border-[#F97316]/20">
                <p className="text-sm text-[#F97316] font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Pour une urgence immédiate, appelez directement le{" "}
                  <a href="tel:+33699699428" className="underline font-bold">06 99 69 94 28</a>
                </p>
              </div>
              <CheckboxGroup
                options={depannageOptions}
                values={depannageVals}
                onChange={setDepannageVals}
              />
            </div>

            {/* ── 8. Date / Heure souhaitée ───────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={ClipboardList} title="Date / Heure souhaitée" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dateIntervention">Date</Label>
                  <Input
                    id="dateIntervention"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("dateIntervention")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="heureIntervention">Heure</Label>
                  <Input
                    id="heureIntervention"
                    type="time"
                    {...register("heureIntervention")}
                  />
                </div>
              </div>
            </div>

            {/* ── 9. Coordonnées ──────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <SectionTitle icon={User} title="Vos coordonnées" required />

              <div className="space-y-4">
                {/* Nom + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nom">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nom"
                      placeholder="Jean Dupont"
                      error={errors.nom?.message}
                      {...register("nom")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="telephone">
                      Téléphone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="06 50 12 34 56"
                      error={errors.telephone?.message}
                      {...register("telephone")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.fr"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-1.5">
                  <Label htmlFor="adresseLigne1">Adresse ligne 1</Label>
                  <Input
                    id="adresseLigne1"
                    placeholder="15 rue de la Paix"
                    {...register("adresseLigne1")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      placeholder="Neuilly-sur-Seine"
                      {...register("ville")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      placeholder="Île-de-France"
                      {...register("region")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input
                      id="codePostal"
                      placeholder="92200"
                      maxLength={5}
                      {...register("codePostal")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    defaultValue="France"
                    {...register("pays")}
                  />
                </div>
              </div>
            </div>

            {/* ── RGPD + Erreur globale + Submit ──────────────────── */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              {/* Erreur globale */}
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  {submitError}
                </div>
              )}

              {/* RGPD */}
              <div className="flex items-start gap-3 mb-6">
                <input
                  type="checkbox"
                  id="rgpd"
                  className="mt-0.5 w-4 h-4 accent-[#04599c] cursor-pointer"
                  {...register("rgpd")}
                />
                <Label htmlFor="rgpd" className="text-sm text-gray-500 font-normal cursor-pointer leading-relaxed">
                  J&apos;accepte que mes données soient utilisées pour traiter ma demande de devis,
                  conformément à la{" "}
                  <Link href="/mentions-legales#confidentialite" className="text-[#04599c] hover:underline">
                    politique de confidentialité
                  </Link>
                  . <span className="text-red-500">*</span>
                </Label>
              </div>
              {errors.rgpd && (
                <p className="mb-4 text-xs text-red-600">{errors.rgpd.message}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
                aria-label="Envoyer ma demande d'intervention électricité"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Envoyer ma demande d&apos;intervention
                  </span>
                )}
              </Button>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Données protégées (RGPD)
                </span>
                <span className="hidden sm:block">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Réponse garantie sous 2h ouvrées
                </span>
                <span className="hidden sm:block">·</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Urgence : 06 99 69 94 28
                </span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
