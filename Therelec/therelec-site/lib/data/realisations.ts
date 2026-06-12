export interface Realisation {
  id: string
  title: string
  description: string
  category: "electricite" | "climatisation" | "renovation"
  city: string
  image: string
  tags: string[]
}

export const realisations: Realisation[] = [
  {
    id: "1",
    title: "Rénovation électrique complète",
    description: "Rénovation électrique d'un appartement 120m² — nouveau tableau, câblage complet, mise aux normes NF C 15-100.",
    category: "renovation",
    city: "Neuilly-sur-Seine",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    tags: ["Rénovation", "NF C 15-100", "Tableau électrique"],
  },
  {
    id: "2",
    title: "Installation split mural Mitsubishi",
    description: "Pose d'un split mural 12 000 BTU dans un salon 35m². Travail soigné, câblage masqué.",
    category: "climatisation",
    city: "Levallois-Perret",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",
    tags: ["Split mural", "Mitsubishi", "Climatisation"],
  },
  {
    id: "3",
    title: "Tableau électrique et domotique",
    description: "Remplacement du tableau électrique et installation d'un système de domotique Legrand connecté.",
    category: "electricite",
    city: "Courbevoie",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    tags: ["Tableau électrique", "Domotique", "Legrand"],
  },
  {
    id: "4",
    title: "Pompe à chaleur air-air",
    description: "Installation d'une PAC air-air Daikin pour une maison 180m². Dossier MaPrimeRénov' constitué.",
    category: "climatisation",
    city: "Neuilly-sur-Seine",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
    tags: ["PAC", "Daikin", "MaPrimeRénov'"],
  },
  {
    id: "5",
    title: "Mise en conformité bureaux",
    description: "Mise en conformité électrique de 500m² de bureaux pour un groupe pharmaceutique à Puteaux.",
    category: "electricite",
    city: "Puteaux",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    tags: ["Tertiaire", "Conformité", "Bureaux"],
  },
  {
    id: "6",
    title: "Climatisation gainable résidentiel",
    description: "Climatisation gainable pour une villa 4 pièces — 3 unités intérieures, unité extérieure Mitsubishi.",
    category: "climatisation",
    city: "Garches",
    image: "https://images.unsplash.com/photo-1601972599748-9d85da4d36b2?w=600&h=400&fit=crop",
    tags: ["Gainable", "Mitsubishi", "Villa"],
  },
  {
    id: "7",
    title: "Éclairage LED professionnel",
    description: "Remplacement complet de l'éclairage d'un restaurant 200 couverts en LED basse consommation.",
    category: "electricite",
    city: "Boulogne-Billancourt",
    image: "https://images.unsplash.com/photo-1567015885029-d5b9c6fb3bc5?w=600&h=400&fit=crop",
    tags: ["LED", "Commerce", "Économie énergie"],
  },
  {
    id: "8",
    title: "Installation électrique neuve",
    description: "Électricité complète pour un appartement neuf 80m² en VEFA — du câblage à la mise en service.",
    category: "renovation",
    city: "Nanterre",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    tags: ["Neuf", "VEFA", "Installation"],
  },
]
