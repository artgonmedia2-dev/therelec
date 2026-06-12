"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, Send, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

/* ─── Primitives ─────────────────────────────────────────────── */

const PRIMARY = "#00B4D8"

function CheckPill({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className={["flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl border transition-all select-none", checked ? "border-[#00B4D8] bg-[#00B4D8]/8 text-[#00B4D8] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#00B4D8]/40 bg-white"].join(" ")}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
      <span className={["w-4 h-4 rounded border-2 flex items-center justify-center shrink-0", checked ? "border-[#00B4D8] bg-[#00B4D8]" : "border-gray-300 bg-white"].join(" ")}>
        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      {label}
    </label>
  )
}

function RadioPill({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label htmlFor={id} className={["flex items-center gap-2 text-sm cursor-pointer px-3 py-2.5 rounded-xl border transition-all select-none", checked ? "border-[#00B4D8] bg-[#00B4D8]/8 text-[#00B4D8] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#00B4D8]/40 bg-white"].join(" ")}>
      <input type="radio" id={id} checked={checked} onChange={onChange} className="hidden" />
      <span className={["w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", checked ? "border-[#00B4D8]" : "border-gray-300"].join(" ")}>
        {checked && <span className="w-2 h-2 rounded-full bg-[#00B4D8]" />}
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

/* ─── Progress ───────────────────────────────────────────────── */

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500">Étape {current + 1} sur {total}</span>
        <span className="text-xs font-bold text-[#00B4D8]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-[#00B4D8] rounded-full" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  )
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

/* ─── Main Component ─────────────────────────────────────────── */

export default function ContactFormClimatisation() {
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
  const typeEquip = useCheckSet()
  const config = useCheckSet()
  const [configAutre, setConfigAutre] = useState("")
  const marque = useCheckSet()
  const [marqueAutre, setMarqueAutre] = useState("")
  const symptomes = useCheckSet()
  const [sympAutre, setSympAutre] = useState("")
  const [typeBatiment, setTypeBatiment] = useState("")
  const [batAutre, setBatAutre] = useState("")
  const [surface, setSurface] = useState("")
  const [hauteur, setHauteur] = useState("")
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
            <Label htmlFor="clim-nom">Nom complet <span className="text-red-500">*</span></Label>
            <Input id="clim-nom" placeholder="Jean Dupont" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clim-tel">Téléphone <span className="text-red-500">*</span></Label>
            <Input id="clim-tel" type="tel" placeholder="06 XX XX XX XX" value={tel} onChange={(e) => setTel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clim-email">Email</Label>
            <Input id="clim-email" type="email" placeholder="jean@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clim-cp">Code postal</Label>
            <Input id="clim-cp" placeholder="92200" maxLength={5} value={cp} onChange={(e) => setCp(e.target.value)} />
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
            <CheckPill key={v} id={`cn-${v}`} label={v} checked={nature.has(v)} onChange={(on) => nature.toggle(v, on)} />
          ))}
        </div>
      ),
    },
    {
      title: "Type de demande",
      subtitle: "Que souhaitez-vous réaliser ?",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["Installation neuve", "Remplacement équipement existant", "Réparation / Dépannage", "Entretien / Maintenance", "Mise en service"].map((v) => (
            <CheckPill key={v} id={`cd-${v}`} label={v} checked={typeDemande.has(v)} onChange={(on) => typeDemande.toggle(v, on)} />
          ))}
        </div>
      ),
    },
    {
      title: "Type d'équipement",
      subtitle: "Quel système est concerné ?",
      content: (
        <div className="grid grid-cols-1 gap-2">
          {["Pompe à chaleur air/air", "Pompe à chaleur air/eau", "Climatisation réversible (chauffage + froid)"].map((v) => (
            <CheckPill key={v} id={`ce-${v}`} label={v} checked={typeEquip.has(v)} onChange={(on) => typeEquip.toggle(v, on)} />
          ))}
        </div>
      ),
    },
    {
      title: "Configuration du système",
      subtitle: "Quel type d'installation ?",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Mono split", "Multi split", "Gainable", "Cassette", "Console", "Plafonnier", "Murale"].map((v) => (
              <CheckPill key={v} id={`cc-${v}`} label={v} checked={config.has(v)} onChange={(on) => config.toggle(v, on)} />
            ))}
          </div>
          <Input placeholder="Autre : précisez..." value={configAutre} onChange={(e) => setConfigAutre(e.target.value)} className="text-sm mt-1" />
        </div>
      ),
    },
    {
      title: "Marque de l'équipement",
      subtitle: "Précisez la marque si connue",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Daikin", "Mitsubishi Electric", "Panasonic", "Toshiba", "Hitachi", "Atlantic", "LG", "Samsung"].map((v) => (
              <CheckPill key={v} id={`cm-${v}`} label={v} checked={marque.has(v)} onChange={(on) => marque.toggle(v, on)} />
            ))}
          </div>
          <Input placeholder="Autre marque : précisez..." value={marqueAutre} onChange={(e) => setMarqueAutre(e.target.value)} className="text-sm mt-1" />
        </div>
      ),
    },
    {
      title: "Symptômes / Problèmes",
      subtitle: "Pour les demandes de dépannage",
      content: (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["Ne refroidit pas", "Ne chauffe pas", "Erreur affichée", "Bruit anormal", "Arrêts intempestifs", "Fuite d'eau", "Problème condensats / pompe de relevage", "Télécommande défectueuse", "Givre / fuite fluide frigorigène", "Filtre encrassé / mauvais entretien", "Groupe extérieur inactif", "Problème électrique / disjoncteur"].map((v) => (
              <CheckPill key={v} id={`cs-${v}`} label={v} checked={symptomes.has(v)} onChange={(on) => symptomes.toggle(v, on)} />
            ))}
          </div>
          <Input placeholder="Autre symptôme : précisez..." value={sympAutre} onChange={(e) => setSympAutre(e.target.value)} className="text-sm mt-1" />
        </div>
      ),
    },
    {
      title: "Bâtiment & Surface",
      subtitle: "Caractéristiques du lieu d'intervention",
      content: (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type de bâtiment</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Appartement", "Maison individuelle", "Immeuble / Copropriété", "Bureau", "Commerce", "Local professionnel", "Autre"].map((v) => (
                <RadioPill key={v} id={`cb-${v}`} label={v} checked={typeBatiment === v} onChange={() => setTypeBatiment(v)} />
              ))}
            </div>
            {typeBatiment === "Autre" && <Input placeholder="Précisez..." value={batAutre} onChange={(e) => setBatAutre(e.target.value)} className="text-sm mt-2" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="clim-surface" className="text-sm">Surface (m²)</Label>
              <Input id="clim-surface" placeholder="ex : 35" value={surface} onChange={(e) => setSurface(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clim-hauteur" className="text-sm">Hauteur sous plafond (m)</Label>
              <Input id="clim-hauteur" placeholder="ex : 2.5" value={hauteur} onChange={(e) => setHauteur(e.target.value)} />
            </div>
          </div>
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
                <CheckPill key={v} id={`cj-${v}`} label={v} checked={jours.has(v)} onChange={(on) => jours.toggle(v, on)} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Créneaux horaires</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["Matin (8h–12h)", "Après-midi (13h–17h)", "Soir (17h–20h)"].map((v) => (
                <CheckPill key={v} id={`ck-${v}`} label={v} checked={creneaux.has(v)} onChange={(on) => creneaux.toggle(v, on)} />
              ))}
            </div>
            <Input placeholder="Autre créneau : précisez..." value={creneauAutre} onChange={(e) => setCreneauAutre(e.target.value)} className="text-sm mt-2" />
          </div>
          <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
            <input type="checkbox" id="clim-rgpd" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00B4D8] cursor-pointer" />
            <Label htmlFor="clim-rgpd" className="text-xs text-gray-500 font-normal cursor-pointer">
              J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
              <a href="/mentions-legales#confidentialite" className="text-[#00B4D8] hover:underline">politique de confidentialité</a>. <span className="text-red-500">*</span>
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
          formType: "climatisation",
          nom, tel, email, cp,
          nature: nature.values(),
          typeDemande: typeDemande.values(),
          typeEquip: typeEquip.values(),
          config: [...config.values(), configAutre].filter(Boolean),
          marque: [...marque.values(), marqueAutre].filter(Boolean),
          symptomes: [...symptomes.values(), sympAutre].filter(Boolean),
          typeBatiment: typeBatiment === "Autre" ? batAutre : typeBatiment,
          surface, hauteur,
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
        <div className="w-16 h-16 rounded-full bg-[#00B4D8]/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#00B4D8]" />
        </div>
        <h3 className="font-black text-xl text-gray-900">Demande envoyée !</h3>
        <p className="text-gray-500 text-sm max-w-xs">Nous vous recontactons sous 2h ouvrées avec une proposition personnalisée.</p>
        <button onClick={() => { setDone(false); setStep(0) }} className="text-[#00B4D8] text-sm font-semibold hover:underline mt-2">
          Nouvelle demande →
        </button>
      </div>
    )
  }

  return (
    <div>
      <Progress current={step} total={TOTAL} />

      <div className="mb-5">
        <h4 className="font-black text-gray-900 text-lg">{steps[step].title}</h4>
        <p className="text-gray-400 text-sm">{steps[step].subtitle}</p>
      </div>

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
              className={["w-2 h-2 rounded-full transition-all", i === step ? "bg-[#00B4D8] w-5" : i < step ? "bg-[#00B4D8]/40" : "bg-gray-200"].join(" ")}
            />
          ))}
        </div>

        {isLast ? (
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !nom || !tel || !rgpd}
            className="flex items-center gap-2 bg-[#00B4D8] hover:bg-[#0090B0] border-0"
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
            className="flex items-center gap-1.5 text-sm font-semibold text-[#00B4D8] hover:text-[#0090B0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
