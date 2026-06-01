// ===========================================================================
// FORMATOR AI - Bibliotheque de prompts pre-remplie
// ===========================================================================

import type { PromptItem, PromptCategorie } from "./types";

export const PROMPT_CATEGORIES: PromptCategorie[] = [
  "Commercial",
  "RH",
  "Marketing",
  "Immobilier",
  "BTP",
  "Restaurant",
  "Artisan",
  "PME",
];

export const SEED_PROMPTS: PromptItem[] = [
  {
    id: "seed-com-1",
    categorie: "Commercial",
    titre: "Email de prospection a froid",
    objectif: "Obtenir un premier rendez-vous avec un prospect.",
    prompt:
      "Agis comme un expert en prospection B2B. Redige un email de prospection a froid court (80 mots max) pour proposer [OFFRE] a [TYPE DE CLIENT]. Accroche personnalisee, une seule proposition de valeur claire, un call-to-action pour un rendez-vous de 15 minutes.",
    resultatAttendu: "Un email concis, personnalise et orient e prise de rendez-vous.",
  },
  {
    id: "seed-com-2",
    categorie: "Commercial",
    titre: "Traitement des objections",
    objectif: "Preparer des reponses aux objections clients.",
    prompt:
      "Tu es un coach commercial. Pour l'objection client suivante : \"[OBJECTION]\", propose 3 reponses differentes (empathie, preuve, reformulation) adaptees a la vente de [OFFRE].",
    resultatAttendu: "Trois reponses argumentees et pretes a l'emploi.",
  },
  {
    id: "seed-rh-1",
    categorie: "RH",
    titre: "Fiche de poste complete",
    objectif: "Rediger une offre d'emploi attractive.",
    prompt:
      "Agis comme un recruteur RH. Redige une fiche de poste complete pour un poste de [POSTE] dans le secteur [SECTEUR] : missions, profil recherche, competences, avantages. Ton moderne et inclusif.",
    resultatAttendu: "Une fiche de poste structuree et attractive.",
  },
  {
    id: "seed-rh-2",
    categorie: "RH",
    titre: "Questions d'entretien",
    objectif: "Preparer une grille d'entretien.",
    prompt:
      "Tu es expert RH. Genere 10 questions d'entretien pour evaluer un candidat au poste de [POSTE], avec pour chacune le critere evalue et un exemple de bonne reponse.",
    resultatAttendu: "Une grille d'entretien prete a l'emploi.",
  },
  {
    id: "seed-mkt-1",
    categorie: "Marketing",
    titre: "Calendrier de contenu reseaux sociaux",
    objectif: "Planifier 1 mois de publications.",
    prompt:
      "Agis comme un community manager. Cree un calendrier de 4 semaines de publications pour [ENTREPRISE] (secteur [SECTEUR]) sur [RESEAU]. Pour chaque post : date, theme, accroche, hashtags, type de visuel.",
    resultatAttendu: "Un planning editorial sur 4 semaines.",
  },
  {
    id: "seed-mkt-2",
    categorie: "Marketing",
    titre: "Sequence d'emailing",
    objectif: "Convertir des prospects en clients.",
    prompt:
      "Tu es expert en email marketing. Redige une sequence de 3 emails pour convertir des prospects interesses par [OFFRE]. Email 1 : valeur, Email 2 : preuve sociale, Email 3 : offre limitee.",
    resultatAttendu: "Trois emails prets a programmer.",
  },
  {
    id: "seed-immo-1",
    categorie: "Immobilier",
    titre: "Annonce de vente immobiliere",
    objectif: "Rediger une annonce qui vend.",
    prompt:
      "Agis comme un agent immobilier expert. Redige une annonce de vente percutante pour ce bien : [TYPE], [SURFACE] m2, [VILLE], [POINTS FORTS]. Accroche, description vendeuse, points forts en liste, appel a l'action.",
    resultatAttendu: "Une annonce immobiliere prete a publier.",
  },
  {
    id: "seed-immo-2",
    categorie: "Immobilier",
    titre: "Email de relance acquereur",
    objectif: "Relancer un acquereur apres visite.",
    prompt:
      "Tu es agent immobilier. Redige un email de relance chaleureux pour un acquereur ayant visite [BIEN] il y a 3 jours, sans etre insistant, en proposant de repondre a ses questions.",
    resultatAttendu: "Un email de relance professionnel et non intrusif.",
  },
  {
    id: "seed-btp-1",
    categorie: "BTP",
    titre: "Devis detaille",
    objectif: "Structurer un devis clair.",
    prompt:
      "Agis comme un conducteur de travaux. A partir de cette description de chantier : [DESCRIPTION], propose une trame de devis detaillee (postes, quantites, unites, fourchette de prix) pour [TYPE DE TRAVAUX].",
    resultatAttendu: "Une trame de devis structuree par postes.",
  },
  {
    id: "seed-btp-2",
    categorie: "BTP",
    titre: "Compte-rendu de chantier",
    objectif: "Rediger un CR de reunion de chantier.",
    prompt:
      "Tu es responsable de chantier. A partir de ces notes : [NOTES], redige un compte-rendu de chantier structure : avancement, points bloquants, decisions, actions et responsables, prochaine etape.",
    resultatAttendu: "Un compte-rendu de chantier professionnel.",
  },
  {
    id: "seed-resto-1",
    categorie: "Restaurant",
    titre: "Reponse a un avis Google",
    objectif: "Soigner son e-reputation.",
    prompt:
      "Agis comme le gerant d'un restaurant. Redige une reponse professionnelle et chaleureuse a cet avis Google : \"[AVIS]\". Remercie, reponds aux points souleves, invite a revenir.",
    resultatAttendu: "Une reponse d'avis soignee et professionnelle.",
  },
  {
    id: "seed-resto-2",
    categorie: "Restaurant",
    titre: "Post Instagram appetissant",
    objectif: "Promouvoir un plat sur Instagram.",
    prompt:
      "Tu es community manager d'un restaurant. Redige un post Instagram appetissant pour mettre en avant [PLAT]. Accroche gourmande, description sensorielle, hashtags locaux, emoji avec parcimonie.",
    resultatAttendu: "Un post Instagram pret a publier.",
  },
  {
    id: "seed-art-1",
    categorie: "Artisan",
    titre: "Description de prestation",
    objectif: "Presenter clairement un service.",
    prompt:
      "Agis comme un artisan [METIER]. Redige une description claire et rassurante de la prestation [PRESTATION] pour ma fiche Google et mon site : benefices, deroule, garantie.",
    resultatAttendu: "Une description de service professionnelle.",
  },
  {
    id: "seed-pme-1",
    categorie: "PME",
    titre: "Synthese de reunion",
    objectif: "Transformer des notes en compte-rendu.",
    prompt:
      "Tu es assistant de direction. A partir de ces notes de reunion : [NOTES], produis une synthese structuree : decisions, actions (avec responsable et echeance), points en suspens.",
    resultatAttendu: "Un compte-rendu clair et actionnable.",
  },
  {
    id: "seed-pme-2",
    categorie: "PME",
    titre: "Procedure interne",
    objectif: "Documenter un processus.",
    prompt:
      "Agis comme un consultant en organisation. Redige une procedure pas a pas pour [PROCESSUS] dans une PME : objectif, etapes numerotees, roles, points de controle.",
    resultatAttendu: "Une procedure interne prete a diffuser.",
  },
];
