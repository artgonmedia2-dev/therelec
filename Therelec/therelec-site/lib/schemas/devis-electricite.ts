import { z } from "zod"

export const devisElectriciteSchema = z.object({
  natureIntervention: z.string().min(1, "Veuillez sélectionner la nature de l'intervention"),
  typeDemande: z.string().min(1, "Veuillez sélectionner le type de demande"),
  typeBatiment: z.string().min(1, "Veuillez sélectionner le type de bâtiment"),
  typeBatimentAutre: z.string().optional(),
  puissance: z.string().min(1, "Veuillez sélectionner la puissance"),
  puissanceAutre: z.string().optional(),
  surface: z.string().optional(),
  hauteur: z.string().optional(),
  travaux: z.array(z.string()).optional(),
  depannage: z.array(z.string()).optional(),
  dateIntervention: z.string().optional(),
  heureIntervention: z.string().optional(),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  adresseLigne1: z.string().optional(),
  ville: z.string().optional(),
  region: z.string().optional(),
  codePostal: z.string().optional(),
  pays: z.string().optional(),
  rgpd: z.boolean().refine((v) => v === true, {
    message: "Vous devez accepter la politique de confidentialité",
  }),
})

export type DevisElectriciteData = z.infer<typeof devisElectriciteSchema>

export const natureOptions = [
  { value: "etude-devis", label: "Étude et devis" },
  { value: "fourniture-pose", label: "Fourniture et pose" },
  { value: "main-oeuvre", label: "Main d'œuvre seule" },
  { value: "recherche-panne", label: "Recherche de panne" },
  { value: "contrat-entretien", label: "Contrat d'entretien" },
]

export const typeDemandeOptions = [
  { value: "installation-neuve", label: "Installation neuve" },
  { value: "renovation", label: "Rénovation partielle / complète" },
  { value: "depannage", label: "Dépannage / Réparation" },
  { value: "conformite", label: "Mise en conformité / Sécurité" },
  { value: "consuel", label: "Attestation Consuel" },
  { value: "tableau", label: "Remplacement tableau électrique" },
  { value: "extension", label: "Extension / modification installation existante" },
  { value: "etude", label: "Étude technique / Diagnostic électrique" },
]

export const batimentOptions = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison individuelle" },
  { value: "immeuble", label: "Immeuble / Copropriété" },
  { value: "local-pro", label: "Local professionnel" },
  { value: "commerce", label: "Commerce / Bureau" },
  { value: "autre", label: "Autre :" },
]

export const puissanceOptions = [
  { value: "6kva", label: "6 kVA" },
  { value: "9kva", label: "9 kVA" },
  { value: "12kva", label: "12 kVA" },
  { value: "36kva", label: "36 kVA" },
  { value: "triphase", label: "Triphasé" },
  { value: "tarif-bleu", label: "Tarif Bleu" },
  { value: "tarif-jaune", label: "Tarif Jaune" },
  { value: "tarif-vert", label: "Tarif Vert" },
  { value: "autre", label: "Autre :" },
]

export const travauxOptions = [
  "Tableau électrique complet",
  "Disjoncteurs / Différentiels",
  "Circuits spécialisés (four, plaque, ballon…)",
  "Câblage neuf / Mise à niveau",
  "Mise à la terre",
  "Éclairage intérieur / extérieur",
  "Chauffage électrique",
  "VMC (simple / hygro / double flux)",
  "Réseaux TV / RJ45 / Téléphone",
  "Bornes de recharge",
  "Motorisation (volet, portail, garage)",
  "Alarme / Interphone / Vidéo",
  "Protection parafoudre",
  "Branchement provisoire",
]

export const depannageOptions = [
  "Intervention urgente",
  "Coupure d'électricité partielle ou totale",
  "Court-circuit / Disjoncteur qui saute",
  "Surcharge électrique",
  "Prise ou interrupteur défectueux",
  "Appareil électrique non alimenté",
  "Éclairage non fonctionnel",
  "Odeur de brûlé / Échauffement anormal",
  "Détection d'anomalies électriques",
  "Dépannage VMC",
  "Autre panne à préciser",
]
