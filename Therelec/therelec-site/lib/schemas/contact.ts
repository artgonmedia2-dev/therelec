import { z } from "zod"

export const contactSchema = z.object({
  serviceType: z.enum(["electricite", "climatisation", "urgence", "pro"]),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  telephone: z
    .string()
    .min(10, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s\-()]{10,}$/, "Format de téléphone invalide"),
  email: z.union([z.string().email("Adresse email invalide"), z.literal("")]).optional(),
  codePostal: z.union([z.string().regex(/^[0-9]{5}$/, "Code postal invalide (5 chiffres)"), z.literal("")]).optional(),
  prestation: z.string().optional(),
  description: z.string().optional(),
  rgpd: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
})

export type ContactFormData = z.infer<typeof contactSchema>

export const electriciteOptions = [
  { value: "installation-neuve", label: "Installation électrique neuve" },
  { value: "renovation", label: "Rénovation électrique" },
  { value: "conformite", label: "Mise en conformité NF C 15-100" },
  { value: "tableau", label: "Tableau électrique / Disjoncteur" },
  { value: "depannage", label: "Dépannage urgent" },
  { value: "domotique", label: "Domotique & éclairage" },
  { value: "autre", label: "Autre prestation" },
]

export const climatisationOptions = [
  { value: "split-mural", label: "Climatisation split mural" },
  { value: "gainable", label: "Climatisation gainable" },
  { value: "pac", label: "Pompe à chaleur air-air" },
  { value: "entretien", label: "Entretien & maintenance" },
  { value: "depannage-clim", label: "Dépannage climatisation" },
  { value: "autre", label: "Autre prestation" },
]
