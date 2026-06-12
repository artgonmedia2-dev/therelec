export interface Testimonial {
  id: string
  name: string
  city: string
  rating: number
  text: string
  service: string
  date: string
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marie D.",
    city: "Neuilly-sur-Seine",
    rating: 5,
    text: "Intervention très rapide suite à une panne électrique totale chez moi. Le technicien est arrivé en moins de 30 minutes, très professionnel et efficace. Problème résolu en 1 heure. Je recommande vivement !",
    service: "Dépannage électrique",
    date: "Mars 2026",
    initials: "MD",
  },
  {
    id: "2",
    name: "Pierre L.",
    city: "Levallois-Perret",
    rating: 5,
    text: "Installation de climatisation split pour mon appartement. Devis reçu le lendemain, installation faite dans la semaine. Travail soigné, propre et respect du délai annoncé. Équipe au top !",
    service: "Climatisation split",
    date: "Avril 2026",
    initials: "PL",
  },
  {
    id: "3",
    name: "Sophie M.",
    city: "Courbevoie",
    rating: 5,
    text: "Mise en conformité électrique pour la vente de mon appartement. Therelec a géré tout le dossier Consuel. Très bon rapport qualité/prix, personnel à l'écoute. Merci !",
    service: "Mise en conformité",
    date: "Février 2026",
    initials: "SM",
  },
  {
    id: "4",
    name: "Jean-François B.",
    city: "Neuilly-sur-Seine",
    rating: 5,
    text: "Installation d'une pompe à chaleur air-air dans ma maison. Excellente qualité de l'installation, ils m'ont aidé à monter le dossier MaPrimeRénov'. Économies significatives sur ma facture !",
    service: "Pompe à chaleur",
    date: "Janvier 2026",
    initials: "JB",
  },
  {
    id: "5",
    name: "Isabelle T.",
    city: "Puteaux",
    rating: 5,
    text: "Rénovation électrique complète de notre appartement en rénovation. Travaux réalisés en 3 jours comme promis, dans les règles de l'art. Certifiés Qualifelec, ça se ressent dans la qualité.",
    service: "Rénovation électrique",
    date: "Mai 2026",
    initials: "IT",
  },
  {
    id: "6",
    name: "Marc R.",
    city: "Nanterre",
    rating: 5,
    text: "Service d'urgence impeccable. Disjoncteur qui sautait en permanence un samedi soir. Technicien dispo en 20 min, problème identifié et résolu rapidement. Tarif raisonnable même le weekend.",
    service: "Urgence électrique",
    date: "Juin 2026",
    initials: "MR",
  },
]
