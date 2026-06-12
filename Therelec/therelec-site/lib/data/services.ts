export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  href: string
  icon: string
  badge?: string
  color: string
}

export const services: Service[] = [
  {
    id: "electricite",
    title: "Électricité Générale",
    description: "Installation, rénovation et mise en conformité NF C 15-100 pour particuliers et professionnels.",
    features: [
      "Installation électrique neuve",
      "Rénovation complète",
      "Mise en conformité NF C 15-100",
      "Tableau électrique & disjoncteur",
      "Domotique & éclairage LED",
    ],
    href: "/services/electricite",
    icon: "Zap",
    color: "#04599c",
  },
  {
    id: "climatisation",
    title: "Climatisation",
    description: "Installation et entretien de systèmes climatisation split, gainable et pompe à chaleur air-air.",
    features: [
      "Climatisation split mural",
      "Climatisation gainable",
      "Pompe à chaleur air-air",
      "Entretien & maintenance",
      "Éligible MaPrimeRénov'",
    ],
    href: "/services/climatisation",
    icon: "Wind",
    color: "#00B4D8",
  },
  {
    id: "depannage",
    title: "Dépannage 24h/24",
    description: "Intervention d'urgence rapide 7j/7, 24h/24. Nos techniciens interviennent en moins de 30 min.",
    features: [
      "Disponible 24h/24, 7j/7",
      "Intervention < 30 min",
      "Panne électrique urgente",
      "Disjoncteur qui saute",
      "Urgence climatisation",
    ],
    href: "/contact",
    icon: "AlertTriangle",
    badge: "URGENCE",
    color: "#F97316",
  },
  {
    id: "pro",
    title: "Entreprises & Bureaux",
    description: "Solutions électriques et climatiques sur mesure pour le tertiaire. Contrats de maintenance.",
    features: [
      "Électricité tertiaire",
      "Climatisation bureaux",
      "Contrats de maintenance",
      "Mise en conformité ERP",
      "Devis personnalisé",
    ],
    href: "/contact",
    icon: "Building2",
    color: "#10B981",
  },
]

export interface SubService {
  id: string
  title: string
  description: string
  details: string[]
  price?: string
}

export const electriciteServices: SubService[] = [
  {
    id: "installation-neuve",
    title: "Installation électrique neuve",
    description: "Conception et réalisation de l'installation électrique complète pour maisons neuves et appartements.",
    details: [
      "Étude et conception du réseau électrique",
      "Pose des gaines et câblage",
      "Installation du tableau électrique",
      "Mise en place des prises et interrupteurs",
      "Test et vérification de la conformité",
    ],
    price: "À partir de 1 500 €",
  },
  {
    id: "renovation",
    title: "Rénovation électrique",
    description: "Modernisation et mise aux normes de votre installation électrique existante.",
    details: [
      "Diagnostic de l'installation existante",
      "Remplacement du tableau vétuste",
      "Câblage selon normes actuelles",
      "Ajout de prises et points lumineux",
      "Certification de conformité",
    ],
    price: "À partir de 800 €",
  },
  {
    id: "conformite",
    title: "Mise en conformité NF C 15-100",
    description: "Mise aux normes obligatoire pour vente, location ou assurance. Certificat Consuel fourni.",
    details: [
      "Diagnostic complet de l'installation",
      "Rapport des non-conformités",
      "Travaux de mise aux normes",
      "Obtention du certificat Consuel",
      "Garantie 10 ans sur les travaux",
    ],
    price: "À partir de 600 €",
  },
  {
    id: "tableau",
    title: "Tableau électrique",
    description: "Remplacement, mise à niveau et sécurisation de votre tableau électrique.",
    details: [
      "Remplacement tableau vétuste",
      "Installation disjoncteurs différentiels",
      "Ajout de circuits",
      "Protection contre les surtensions",
      "Étiquetage et documentation",
    ],
    price: "À partir de 400 €",
  },
  {
    id: "depannage-elec",
    title: "Dépannage électrique urgent",
    description: "Intervention rapide 24h/24 pour toute panne électrique. Technicien qualifié disponible immédiatement.",
    details: [
      "Prise en charge < 30 min",
      "Diagnostic rapide sur place",
      "Réparation immédiate si possible",
      "Devis transparent avant intervention",
      "Disponible nuits et week-ends",
    ],
    price: "À partir de 80 €",
  },
]

export const climatisationServices: SubService[] = [
  {
    id: "split-mural",
    title: "Climatisation split mural",
    description: "Installation de climatiseurs muraux efficaces pour appartements et maisons.",
    details: [
      "Conseil et dimensionnement",
      "Pose de l'unité intérieure et extérieure",
      "Raccordement frigorifique",
      "Raccordement électrique",
      "Mise en service et formation",
    ],
    price: "À partir de 1 200 €",
  },
  {
    id: "gainable",
    title: "Climatisation gainable",
    description: "Solution invisible et silencieuse pour climatiser plusieurs pièces avec une seule unité.",
    details: [
      "Étude de dimensionnement",
      "Pose dans les combles ou faux-plafond",
      "Réseau de gaines certifié",
      "Grilles de soufflage design",
      "Régulation par pièce",
    ],
    price: "À partir de 3 500 €",
  },
  {
    id: "pac",
    title: "Pompe à chaleur air-air",
    description: "Solution éco-responsable éligible MaPrimeRénov'. Chauffe en hiver, rafraîchit en été.",
    details: [
      "Audit thermique de votre logement",
      "Dimensionnement optimal",
      "Installation certifiée RGE",
      "Dossier aides financières",
      "SAV et entretien inclus 1 an",
    ],
    price: "À partir de 4 000 €",
  },
  {
    id: "entretien",
    title: "Entretien & Maintenance",
    description: "Contrats de maintenance annuels pour garantir la performance et la longévité de vos équipements.",
    details: [
      "Nettoyage des filtres et échangeurs",
      "Vérification du niveau de gaz",
      "Contrôle des pressions et températures",
      "Rapport d'intervention détaillé",
      "Tarif préférentiel en urgence",
    ],
    price: "À partir de 150 €/an",
  },
]
