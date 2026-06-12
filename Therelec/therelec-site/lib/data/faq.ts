export interface FAQItem {
  id: string
  question: string
  answer: string
  category: "general" | "electricite" | "climatisation" | "urgence"
}

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "Intervenez-vous en urgence 24h/24 et 7j/7 ?",
    answer:
      "Oui, notre service de dépannage est disponible 24 heures sur 24, 7 jours sur 7, y compris les jours fériés. En cas d'urgence électrique ou de panne de climatisation, nos techniciens interviennent en moyenne en moins de 30 minutes sur Neuilly-sur-Seine et dans les communes limitrophes.",
    category: "urgence",
  },
  {
    id: "2",
    question: "Êtes-vous certifiés Qualifelec et RGE ?",
    answer:
      "Absolument. Therelec est certifié Qualifelec (2025) pour l'électricité, ce qui garantit notre qualification professionnelle et notre respect des normes en vigueur. Nous sommes également certifiés RGE QualiPac (2025) pour les installations de climatisation et pompes à chaleur, ce qui vous permet de bénéficier des aides financières comme MaPrimeRénov'.",
    category: "general",
  },
  {
    id: "3",
    question: "Le devis est-il gratuit et sans engagement ?",
    answer:
      "Oui, tous nos devis sont gratuits et sans engagement. Nous nous déplaçons chez vous pour évaluer précisément votre besoin et vous proposer une solution adaptée à votre budget. Le devis est détaillé et transparent, sans surprise. Vous recevez généralement votre devis sous 24 à 48 heures.",
    category: "general",
  },
  {
    id: "4",
    question: "Quelle est la différence entre split mural et climatisation gainable ?",
    answer:
      "Le split mural est une unité visible sur le mur, idéale pour climatiser une ou deux pièces. Il est moins onéreux à l'installation. La climatisation gainable est cachée dans les faux-plafonds ou les combles et distribue l'air via des gaines dans plusieurs pièces simultanément. Elle est totalement invisible et silencieuse, mais nécessite un investissement plus important. Nous vous conseillons la solution la plus adaptée à votre logement lors du devis.",
    category: "climatisation",
  },
  {
    id: "5",
    question: "Puis-je bénéficier d'aides pour l'installation d'une pompe à chaleur ?",
    answer:
      "Oui, en tant qu'installateur certifié RGE QualiPac, nous vous permettons d'accéder à MaPrimeRénov' (jusqu'à 4 000 € selon vos revenus), les Certificats d'Économie d'Énergie (CEE) et l'éco-prêt à taux zéro. Nous vous accompagnons dans le montage de votre dossier d'aides financières pour maximiser vos économies.",
    category: "climatisation",
  },
  {
    id: "6",
    question: "Combien de temps dure la mise en conformité électrique (NF C 15-100) ?",
    answer:
      "La durée dépend de l'état de votre installation et de la surface du logement. En général, comptez 1 à 3 jours pour un appartement standard. Nous réalisons d'abord un diagnostic complet, puis vous présentons un devis détaillé des travaux à réaliser. Une fois les travaux terminés, nous vous fournissons le certificat de conformité Consuel, indispensable pour la vente ou la location de votre bien.",
    category: "electricite",
  },
  {
    id: "7",
    question: "Quelle zone géographique couvrez-vous ?",
    answer:
      "Therelec intervient principalement à Neuilly-sur-Seine et dans tout le département des Hauts-de-Seine (92) : Courbevoie, Levallois-Perret, Puteaux, Nanterre, Boulogne-Billancourt, Issy-les-Moulineaux, Suresnes, et plus encore. Nous couvrons également Paris (75) et les départements limitrophes en Île-de-France.",
    category: "general",
  },
  {
    id: "8",
    question: "Proposez-vous des contrats de maintenance pour les entreprises ?",
    answer:
      "Oui, nous proposons des contrats de maintenance annuels pour les entreprises, commerces et bureaux. Ces contrats comprennent des visites préventives programmées, la vérification des installations électriques et climatiques, et un service d'urgence prioritaire avec tarifs préférentiels. Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.",
    category: "general",
  },
]

export const faqHome: FAQItem[] = faqItems.slice(0, 6)
