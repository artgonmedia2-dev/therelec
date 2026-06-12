export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  image: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "mise-en-conformite-nf-c-15-100",
    title: "Mise en conformité électrique NF C 15-100 : tout ce qu'il faut savoir en 2026",
    excerpt:
      "La norme NF C 15-100 est la référence pour les installations électriques en France. Découvrez ce qu'elle implique, pourquoi vous devez vous y conformer et comment Therelec peut vous aider.",
    category: "Électricité",
    date: "5 juin 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop",
    tags: ["conformité", "NF C 15-100", "électricité", "Consuel"],
    content: `
## Qu'est-ce que la norme NF C 15-100 ?

La norme NF C 15-100 est la référence française qui définit les règles de conception, de réalisation et de vérification des installations électriques basse tension dans les locaux d'habitation. Elle est obligatoire pour toute installation électrique réalisée ou rénovée en France.

## Pourquoi la mise en conformité est-elle importante ?

La mise en conformité de votre installation électrique présente plusieurs avantages :

- **Sécurité** : Une installation conforme réduit considérablement les risques d'incendie et d'électrocution
- **Vente immobilière** : Le diagnostic électrique est obligatoire pour la vente d'un bien de plus de 15 ans
- **Assurance** : En cas de sinistre, votre assurance peut refuser d'indemniser si l'installation n'est pas aux normes
- **Location** : Le propriétaire a l'obligation de louer un logement décent avec une installation électrique sûre

## Les principales exigences de la norme

### Le tableau électrique
- Présence de disjoncteurs différentiels 30mA par groupes de circuits
- Disjoncteur de tête 500mA ou différentiel général
- Protection individuelle de chaque circuit

### Les circuits
- Circuits spécialisés pour chaque gros électroménager
- Circuit dédié pour le lave-vaisselle, lave-linge, four, etc.
- Nombre minimum de prises par pièce

### Les pièces humides
- Zones de protection spécifiques dans les salles de bain
- Matériels adaptés selon les zones
- Pas de prise dans la zone de douche

## Comment se déroule la mise en conformité avec Therelec ?

1. **Diagnostic** : Nous réalisons un audit complet de votre installation
2. **Rapport** : Vous recevez un rapport détaillé des non-conformités
3. **Devis** : Devis transparent et détaillé des travaux nécessaires
4. **Travaux** : Réalisation dans les délais convenus, avec perturbations minimales
5. **Certification** : Obtention du certificat Consuel pour validation

## Quel est le coût ?

Le coût dépend de l'état de votre installation actuelle et de la surface de votre logement. En général, comptez :
- Diagnostic : Gratuit avec Therelec
- Mise en conformité partielle : À partir de 600 €
- Mise en conformité complète : À partir de 2 000 €

**Contactez-nous pour un devis gratuit et personnalisé.**
    `,
  },
  {
    id: "2",
    slug: "aides-financieres-climatisation-2026",
    title: "Aides financières pour la climatisation en 2026 : MaPrimeRénov' et CEE",
    excerpt:
      "Vous souhaitez installer une pompe à chaleur ou une climatisation ? Découvrez toutes les aides financières disponibles en 2026 pour réduire votre facture d'installation.",
    category: "Climatisation",
    date: "20 mai 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=400&fit=crop",
    tags: ["MaPrimeRénov", "CEE", "pompe à chaleur", "aides", "climatisation"],
    content: `
## Les aides financières disponibles en 2026

L'installation d'une pompe à chaleur air-air ou d'une climatisation performante peut bénéficier de nombreuses aides financières. En tant qu'installateur certifié RGE QualiPac, Therelec vous permet d'accéder à ces dispositifs.

## MaPrimeRénov'

MaPrimeRénov' est une aide de l'État pour financer vos travaux de rénovation énergétique.

### Montants pour une pompe à chaleur air-air
- **Ménages très modestes** : Jusqu'à 4 000 €
- **Ménages modestes** : Jusqu'à 3 000 €
- **Ménages intermédiaires** : Jusqu'à 2 000 €
- **Ménages aisés** : Non éligibles

### Conditions
- Logement de plus de 15 ans
- Résidence principale
- Installateur certifié RGE (c'est notre cas !)
- Demande avant le début des travaux

## Les Certificats d'Économie d'Énergie (CEE)

Les CEE sont des primes versées par les fournisseurs d'énergie. Elles s'appliquent aux pompes à chaleur air-air et peuvent représenter plusieurs centaines d'euros.

## L'éco-prêt à taux zéro (Éco-PTZ)

Vous pouvez emprunter jusqu'à 50 000 € sans intérêts pour financer vos travaux de rénovation énergétique, incluant l'installation d'une pompe à chaleur.

## Comment Therelec vous aide ?

En tant qu'installateur RGE QualiPac, nous :
- Calculons vos droits aux aides
- Constituons votre dossier MaPrimeRénov'
- Coordonnons avec les fournisseurs pour les CEE
- Vous informons sur l'Éco-PTZ

**Résultat : jusqu'à 60% de votre investissement financé par les aides !**

Contactez-nous pour une estimation personnalisée de vos droits aux aides.
    `,
  },
  {
    id: "3",
    slug: "electricite-maison-signes-installation-veillissante",
    title: "5 signes que votre installation électrique est dangereuse",
    excerpt:
      "Une installation électrique vieillissante peut être source de dangers graves. Voici les 5 signes qui indiquent qu'il est urgent de faire vérifier votre électricité.",
    category: "Électricité",
    date: "10 avril 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    tags: ["sécurité", "électricité", "installation", "danger"],
    content: `
## Votre installation électrique est-elle dangereuse ?

En France, l'électricité est responsable de 80 000 accidents domestiques par an et de 40 000 incendies. Une installation électrique vieillissante ou défectueuse est l'une des principales causes. Voici 5 signes qui doivent vous alerter.

## 1. Votre disjoncteur saute fréquemment

Si votre disjoncteur principal ou vos disjoncteurs de circuit sautent régulièrement, cela indique :
- Une surcharge du circuit
- Un court-circuit
- Un appareil défectueux
- Une installation sous-dimensionnée

**À faire** : Contactez un électricien qualifié pour diagnostic.

## 2. Vos prises ou interrupteurs sont chauds ou brûlent

Des prises ou interrupteurs qui chauffent anormalement signalent un problème de connexion ou une surcharge. C'est un risque d'incendie immédiat.

## 3. Vous avez encore des fusibles à cartouche

Les fusibles à cartouche sont une technologie des années 50-60. Ils offrent une protection insuffisante et doivent être remplacés par des disjoncteurs modernes avec protection différentielle.

## 4. Des fils électriques apparents ou endommagés

Tout câble dont la gaine est fissurée, dénudée ou brûlée doit être remplacé immédiatement. C'est un danger d'électrocution et d'incendie direct.

## 5. Vos lumières clignotent

Des scintillements de lumières indiquent souvent une connexion lâche ou instable dans le circuit. Cela peut provoquer des arcs électriques générateurs d'incendies.

## Que faire si vous reconnaissez ces signes ?

**N'attendez pas.** Appelez Therelec pour un diagnostic gratuit de votre installation. Nos techniciens Qualifelec identifient les dangers et vous proposent les travaux de mise en sécurité nécessaires.

En cas de danger immédiat : coupez le courant au tableau électrique et appelez-nous en urgence.
    `,
  },
]
