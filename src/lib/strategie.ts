// ===========================================================================
// FORMATOR AI - Strategie commerciale (plan de developpement client & offres)
// ===========================================================================
// Donnees structurees issues du plan de developpement commercial.
// Servent a la page /strategie et a la pre-configuration des devis.
// ===========================================================================

export interface OffreEssai {
  id: string;
  titre: string;
  type: "payante" | "gratuite";
  duree: string;
  prix: string;
  description: string;
  points: string[];
}

export interface OffreContrat {
  id: string;
  titre: string;
  engagement: string;
  description: string;
  points: string[];
  recommande?: boolean;
}

export const PHASE_DECOUVERTE: OffreEssai[] = [
  {
    id: "essai-payant",
    titre: "Echantillon payant",
    type: "payante",
    duree: "7 a 14 jours",
    prix: "300 a 600 EUR",
    description:
      "Periode d'echantillonnage permettant d'acceder a une prestation concrete tout en representant un investissement maitrise pour le prospect.",
    points: [
      "Tarif attractif selon la duree choisie et le perimetre des services",
      "Acces a une prestation concrete et representative",
      "Engagement financier limite et maitrise",
    ],
  },
  {
    id: "essai-gratuit",
    titre: "Essai gratuit",
    type: "gratuite",
    duree: "7 a 14 jours",
    prix: "Offert",
    description:
      "Periode d'essai sans engagement financier, pertinente pour acquerir de l'experience terrain et construire la confiance avec le client.",
    points: [
      "Aucun engagement financier pour le prospect",
      "Logique d'acquisition d'experience terrain",
      "Investissement relationnel pour une collaboration durable",
    ],
  },
];

export const OFFRES_CONTRAT: OffreContrat[] = [
  {
    id: "avec-engagement",
    titre: "Contrat avec engagement",
    engagement: "6 a 12 mois",
    description:
      "Pour les clients souhaitant s'inscrire dans une relation commerciale stable et durable, avec une visibilite a long terme pour les deux parties.",
    points: [
      "Duree d'engagement de 6 a 12 mois",
      "Conditions tarifaires preferentielles negociables",
      "Visibilite et stabilite a long terme",
    ],
    recommande: true,
  },
  {
    id: "sans-engagement",
    titre: "Contrat sans engagement",
    engagement: "30 jours renouvelables",
    description:
      "Pour les clients recherchant de la flexibilite : resiliation possible a tout moment, sans penalite ni preavis contraignant.",
    points: [
      "Base de 30 jours renouvelables",
      "Resiliation a tout moment, sans penalite",
      "Reduit les freins a la decision et facilite l'entree en relation",
    ],
  },
];

export const REPUTATION_ACTIONS: { titre: string; description: string }[] = [
  {
    titre: "Site internet dedie",
    description:
      "Creer un site vitrine professionnel presentant les services et les resultats obtenus.",
  },
  {
    titre: "Espace avis & temoignages",
    description:
      "Collecter et afficher les temoignages et evaluations des clients satisfaits.",
  },
  {
    titre: "Forum / communaute",
    description:
      "Creer une communaute active autour des services pour favoriser le bouche-a-oreille.",
  },
  {
    titre: "Credibilite & visibilite",
    description:
      "Renforcer la credibilite aupres de futurs prospects et la recommandation naturelle.",
  },
];

export const EXCLUSIVITE = {
  titre: "Offre d'exclusivite - premiers clients",
  description:
    "Les premiers clients fideles se voient proposer un acces prioritaire, voire unique, aux nouvelles offres et fonctionnalites avant toute ouverture au marche general.",
  points: [
    "Acces prioritaire (voire unique) aux nouvelles offres",
    "Assortie d'un engagement ferme du client",
    "Si l'engagement standard est inferieur a 12 mois, l'exclusivite peut etre portee a 14 ou 16 mois",
    "Recompense la confiance des clients pionniers et cree un fort sentiment de valorisation",
  ],
};

// Etapes du parcours commercial (entonnoir), du premier contact a la fidelisation.
export const PARCOURS_COMMERCIAL: { etape: string; description: string }[] = [
  {
    etape: "1. Decouverte",
    description: "Echantillon payant (300-600 EUR) ou essai gratuit de 7 a 14 jours.",
  },
  {
    etape: "2. Reputation",
    description: "Capitaliser sur les retours clients via site web et avis en ligne.",
  },
  {
    etape: "3. Contractualisation",
    description: "Formule avec engagement (6-12 mois) ou sans engagement (30 jours).",
  },
  {
    etape: "4. Fidelisation",
    description: "Offre d'exclusivite pour les premiers clients (14-16 mois).",
  },
];
