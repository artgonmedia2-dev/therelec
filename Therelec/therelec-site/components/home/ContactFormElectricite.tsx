"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, Send, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

/* ─── Primitives ─────────────────────────────────────────────── */

const PRIMARY = "#04599c"

function CheckPill({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className={["flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl border transition-all select-none", checked ? "border-[#04599c] bg-[#04599c]/8 text-[#04599c] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#04599c]/40 bg-white"].join(" ")}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
      <span className={["w-4 h-4 rounded border-2 flex items-center justify-center shrink-0", checked ? "border-[#04599c] bg-[#04599c]" : "border-gray-300 bg-white"].join(" ")}>
        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      {label}
    </label>
  )
}

function RadioPill({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label htmlFor={id} className={["flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl border transition-all select-none", checked ? "border-[#04599c] bg-[#04599c]/8 text-[#04599c] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#04599c]/40 bg-white"].join(" ")}>
      <input type="radio" id={id} checked={checked} onChange={onChange} className="hidden" />
      <span className={["w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", checked ? "border-[#04599c]" : "border-gray-300"].join(" ")}>
        {checked && <span className="w-2 h-2 rounded-full bg-[#04599c]" />}
      </span>
      {label}
    </label>
  )
}

function useCheckSet() {
  const [set, setSet] = useState<Set<string>>(new Set())
  const toggle = (v: string, on: boolean) => setSet((p) => { const n = new Set(p); on ? n.add(v) : n.delete(v); return n })
  return { has: (v: string) => set.has(v), toggle, values: () => Array.from(set) }
}

/* ─── Progress bar ───────────────────────────────────────────── */

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500">Étape {current + 1} sur {total}</span>
        <span className="text-xs font-bold text-[#04599c]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-[#04599c] rounded-full" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  )
}

/* ─── Slide animation ────────────────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

/* ─── Main component ─────────────────────────────────────────── */

export default function ContactFormElectricite() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  /* contact */
  const [nom, setNom] = useState("")
  const [tel, setTel] = useState("")
  const [email, setEmail] = useState("")
  const [cp, setCp] = useState("")

  /* sections */
  const nature = useCheckSet()
  const typeDemande = useCheckSet()
  const [typeDemandeAutre, setTypeDemandeAutre] = useState("")
  const [typeBatiment, setTypeBatiment] = useState("")
  const [batAutre, setBatAutre] = useState("")
  const puissance = useCheckSet()
  const [puissanceAutre, setPuissanceAutre] = useState("")
  const [surface, setSurface] = useState("")
  const [hauteur, setHauteur] = useState("")
  const travaux = useCheckSet()
  const depannage = useCheckSet()
  const [depanAutre, setDepanAutre] = useState("")
  const jours = useCheckSet()
  const creneaux = useCheckSet()
  const [creneauAutre, setCreneauAutre] = useState("")
  const [rgpd, setRgpd] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const steps = [
    {
      title: "Vos coordonnées",
      subtitle: "Pour que nous puissions vous recontacter",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="elec-nom">Nom complet <span className="text-red-500">*</span></Label>
            <Input id="elec-nom" placeholder="Jean Dupont" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="elec-tel">Téléphone <span className="text-red-500">*</span></Label>
            <Input id="elec-tel" type="tel" placeholder="06 XX XX XX XX" value={tel} onChange={(e) => setTel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="elec-email">Email</Label>
            <Input id="elec-email" type="email" placeholder="jean@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="elec-cp">Code postal</Label>
            <Input id="elec-cp" placeholder="92200" maxLength={5} value={cp} onChange={(e) => setCp(e.target.value)} />
          </div>
        </div>
      ),
    },
    {
      title: "Nature de l'intervention",
      subtitle: "Sélectionnez tout ce qui s'applique",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["Étude et devis", "Fourniture et pose", "Main d'œuvre seule", "Recherche de panne", "Contrat d'entretien"].map((v) => (
            <CheckPill key={v} id={`nat-${v}`} label={v} checked={nature.has(v)} onChange={(on) => nature.toggle(v, on)} />
          ))}
        </div>
      ),
    },
    {
      title: "Type de demande",
      subtitle: "Que souhaitez-vous réaliser ?",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Installation neuve", "Rénovation partielle / complète", "Dépannage / Réparation", "Mise en conformité / Sécurité", "Attestation Consuel", "Remplacement tableau électrique", "Extension / modification installation existante", "Étude technique / Diagnostic électrique"].map((v) => (
              <CheckPill key={v} id={`dem-${v}`} label={v} checked={typeDemande.has(v)} onChange={(on) => typeDemande.toggle(v, on)} />
            ))}
          </div>
          <Input placeholder="Autre : précisez..." value={typeDemandeAutre} onChange={(e) => setTypeDemandeAutre(e.target.value)} className="text-sm mt-2" />
        </div>
      ),
    },
    {
      title: "Type de bâtiment",
      subtitle: "Quel type de bien est concerné ?",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Appartement", "Maison individuelle", "Immeuble / Copropriété", "Local professionnel", "Commerce / Bureau", "Autre"].map((v) => (
              <RadioPill key={v} id={`bat-${v}`} label={v} checked={typeBatiment === v} onChange={() => setTypeBatiment(v)} />
            ))}
          </div>
          {typeBatiment === "Autre" && (
            <Input placeholder="Précisez..." value={batAutre} onChange={(e) => setBatAutre(e.target.value)} className="text-sm mt-2" />
          )}
        </div>
      ),
    },
    {
      title: "Puissance & Surface",
      subtitle: "Caractéristiques techniques de votre installation",
      content: (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Puissance électrique existante ou souhaitée</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["6 kVA", "9 kVA", "12 kVA", "36 kVA", "Triphasé", "Tarif Bleu", "Tarif Jaune", "Tarif Vert"].map((v) => (
                <CheckPill key={v} id={`puiss-${v}`} label={v} checked={puissance.has(v)} onChange={(on) => puissance.toggle(v, on)} />
              ))}
            </div>
            <Input placeholder="Autre : précisez..." value={puissanceAutre} onChange={(e) => setPuissanceAutre(e.target.value)} className="text-sm mt-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="elec-surface" className="text-sm">Surface (m²)</Label>
              <Input id="elec-surface" placeholder="ex : 80" value={surface} onChange={(e) => setSurface(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="elec-hauteur" className="text-sm">Hauteur sous plafond (m)</Label>
              <Input id="elec-hauteur" placeholder="ex : 2.5" value={hauteur} onChange={(e) => setHauteur(e.target.value)} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Travaux électriques",
      subtitle: "Cochez tout ce qui s'applique",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["Tableau électrique complet", "Disjoncteurs / Différentiels", "Circuits spécialisés (four, plaque, ballon…)", "Câblage neuf / Mise à niveau", "Mise à la terre", "Éclairage intérieur / extérieur", "Chauffage électrique", "VMC (simple / hygro / double flux)", "Réseaux TV / RJ45 / Téléphone", "Bornes de recharge", "Motorisation (volet, portail, garage)", "Alarme / Interphone / Vidéo", "Protection parafoudre", "Branchement provisoire"].map((v) => (
            <CheckPill key={v} id={`trav-${v}`} label={v} checked={travaux.has(v)} onChange={(on) => travaux.toggle(v, on)} />
          ))}
        </div>
      ),
    },
    {
      title: "Dépannage",
      subtitle: "Décrivez le problème rencontré",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Intervention urgente", "Coupure d'électricité partielle ou totale", "Court-circuit / Disjoncteur qui saute", "Surcharge électrique", "Prise ou interrupteur défectueux", "Appareil électrique non alimenté", "Éclairage non fonctionnel", "Odeur de brûlé / Échauffement anormal", "Détection d'anomalies électriques", "Dépannage VMC"].map((v) => (
              <CheckPill key={v} id={`dep-${v}`} label={v} checked={depannage.has(v)} onChange={(on) => depannage.toggle(v, on)} />
            ))}
          </div>
          <Input placeholder="Autre panne : précisez..." value={depanAutre} onChange={(e) => setDepanAutre(e.target.value)} className="text-sm mt-1" />
        </div>
      ),
    },
    {
      title: "Disponibilités & Confirmation",
      subtitle: "Quand pouvons-nous intervenir ?",
      content: (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Jours disponibles</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((v) => (
                <CheckPill key={v} id={`jour-e-${v}`} label={v} checked={jours.has(v)} onChange={(on) => jours.toggle(v, on)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Créneaux horaires</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["Matin (8h–12h)", "Après-midi (13h–17h)", "Soir (17h–20h)"].map((v) => (
                <CheckPill key={v} id={`cren-e-${v}`} label={v} checked={creneaux.has(v)} onChange={(on) => creneaux.toggle(v, on)} />
              ))}
            </div>
            <Input placeholder="Autre créneau : précisez..." value={creneauAutre} onChange={(e) => setCreneauAutre(e.target.value)} className="text-sm mt-2" />
          </div>
          <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
            <input type="checkbox" id="elec-rgpd" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#04599c] cursor-pointer" />
            <Label htmlFor="elec-rgpd" className="text-xs text-gray-500 font-normal cursor-pointer">
              J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
              <a href="/mentions-legales#confidentialite" className="text-[#04599c] hover:underline">politique de confidentialité</a>. <span className="text-red-500">*</span>
            </Label>
          </div>
        </div>
      ),
    },
  ]

  const TOTAL = steps.length
  const isLast = step === TOTAL - 1
  const isFirst = step === 0

  const canNext = step === 0 ? nom.trim() !== "" && tel.trim() !== "" : true

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const handleSubmit = async () => {
    if (!nom || !tel || !rgpd) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "electricite",
          nom, tel, email, cp,
          nature: nature.values(),
          typeDemande: [...typeDemande.values(), typeDemandeAutre].filter(Boolean),
          typeBatiment: typeBatiment === "Autre" ? batAutre : typeBatiment,
          puissance: [...puissance.values(), puissanceAutre].filter(Boolean),
          surface, hauteur,
          travaux: travaux.values(),
          depannage: [...depannage.values(), depanAutre].filter(Boolean),
          jours: jours.values(),
          creneaux: [...creneaux.values(), creneauAutre].filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error("server")
      toast({ title: "Demande envoyée !", description: "Nous vous répondons dans les 2 heures.", variant: "success" })
      setDone(true)
    } catch {
      toast({ title: "Erreur d'envoi", description: "Veuillez réessayer ou appeler le 06 99 69 94 28.", variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#04599c]/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#04599c]" />
        </div>
        <h3 className="font-black text-xl text-gray-900">Demande envoyée !</h3>
        <p className="text-gray-500 text-sm max-w-xs">Nous vous recontactons sous 2h ouvrées avec une proposition personnalisée.</p>
        <button onClick={() => { setDone(false); setStep(0) }} className="text-[#04599c] text-sm font-semibold hover:underline mt-2">
          Nouvelle demande →
        </button>
      </div>
    )
  }

  return (
    <div>
      <Progress current={step} total={TOTAL} />

      {/* Step header */}
      <div className="mb-5">
        <h4 className="font-black text-gray-900 text-lg">{steps[step].title}</h4>
        <p className="text-gray-400 text-sm">{steps[step].subtitle}</p>
      </div>

      {/* Animated step content */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={isFirst}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className={["w-2 h-2 rounded-full transition-all", i === step ? "bg-[#04599c] w-5" : i < step ? "bg-[#04599c]/40" : "bg-gray-200"].join(" ")}
            />
          ))}
        </div>

        {isLast ? (
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !nom || !tel || !rgpd}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi...</>
            ) : (
              <><Send className="w-3.5 h-3.5" />Envoyer</>
            )}
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => go(step + 1)}
            disabled={!canNext}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#04599c] hover:text-[#034882] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-gray-400 text-center mt-4">
        <Lock className="w-3 h-3" />
        Vos données sont protégées — Réponse garantie sous 2h
      </p>
    </div>
  )
}
