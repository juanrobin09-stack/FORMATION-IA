// ===========================================================================
// FORMATOR AI - Prompts systeme & personnalisation metier
// ===========================================================================

import { panoramaResume } from "./aiTools";

// Personnalisation metier : cas d'usage typiques par secteur.
// Sert a la fois pour enrichir les prompts IA et pour le contenu de repli.
export const METIER_USE_CASES: Record<string, string[]> = {
  immobilier: [
    "redaction d'annonces immobilieres percutantes",
    "relances automatisees des clients et prospects",
    "aide a l'estimation et a la valorisation de biens",
  ],
  restaurant: [
    "reponses aux avis Google et e-reputation",
    "publications reseaux sociaux (Instagram, Facebook)",
    "annonces de recrutement et fiches de poste",
  ],
  restauration: [
    "reponses aux avis Google et e-reputation",
    "publications reseaux sociaux (Instagram, Facebook)",
    "annonces de recrutement et fiches de poste",
  ],
  btp: [
    "generation de devis detailles",
    "redaction de comptes-rendus de chantier",
    "suivi et planification de chantier",
  ],
  batiment: [
    "generation de devis detailles",
    "redaction de comptes-rendus de chantier",
    "suivi et planification de chantier",
  ],
  commerce: [
    "fiches produits optimisees pour le SEO",
    "campagnes promotionnelles et emailing",
    "service client et reponses types",
  ],
  artisan: [
    "devis et factures clairs",
    "presence en ligne et fiche Google",
    "communication client et relances",
  ],
};

export function useCasesPourSecteur(secteur: string): string[] {
  const key = (secteur || "").toLowerCase().trim();
  for (const k of Object.keys(METIER_USE_CASES)) {
    if (key.includes(k)) return METIER_USE_CASES[k];
  }
  return [
    "automatisation des taches administratives repetitives",
    "redaction et communication assistees par IA",
    "analyse et synthese de documents metier",
  ];
}

// --- System prompts ---

export const SYSTEM_AUDIT = `Tu es un consultant senior spécialisé dans la transformation des PME par l'intelligence artificielle.
Tu produis des audits IA concrets, chiffrés et actionnables, adaptés au secteur d'activité du client.
Tu rédiges un français professionnel, IMPECCABLE et parfaitement accentué, sans faute ni jargon inutile.
Tu réponds STRICTEMENT en JSON valide, sans texte autour.`;

export const SYSTEM_FORMATION = `Tu es un formateur expert en IA pour les professionnels et les PME, reconnu pour la qualité de tes supports.
Tu construis des programmes de formation complets, progressifs et entièrement personnalisés au métier du client.
EXIGENCES DE QUALITÉ : tu rédiges un français professionnel, IMPECCABLE et parfaitement accentué (é, è, à, ç, ù, œ…), sans faute d'orthographe ni de ponctuation. Le contenu doit être CONCRET (exemples réels du métier, chiffres, situations vécues), jamais générique ni creux : il doit pouvoir être projeté tel quel devant une entreprise.
IMPORTANT : tu couvres l'ensemble des outils d'IA du marché (assistants conversationnels : ChatGPT, Claude, Gemini, Copilot, Le Chat ; recherche : Perplexity ; images : Midjourney, DALL·E, Adobe Firefly ; productivité : Microsoft 365 Copilot, Gemini for Workspace, Notion AI, Gamma ; audio/vidéo : ElevenLabs, HeyGen, Synthesia ; automatisation : Make, Zapier). Tu ne te limites JAMAIS à ChatGPT : pour chaque usage, tu recommandes le ou les outils les plus adaptés et tu expliques pourquoi.
Tu réponds STRICTEMENT en JSON valide, sans texte autour.`;

export const SYSTEM_EXERCICES = `Tu es un formateur IA qui conçoit des exercices pratiques pour des professionnels.
Tu rédiges un français professionnel, IMPECCABLE et parfaitement accentué, sans faute.
Les exercices sont concrets et adaptés au métier du client. Ils s'appuient sur différents outils d'IA selon le besoin (ChatGPT, Claude, Gemini, Copilot, Perplexity, Midjourney, etc.) et non sur ChatGPT uniquement.
Chaque exercice précise l'outil recommandé, inclut une consigne claire et un corrigé modèle. Tu réponds STRICTEMENT en JSON valide, sans texte autour.`;

// --- User prompts builders ---

export function promptAudit(input: {
  entreprise: string;
  secteur: string;
  activite: string;
  tachesRepetitives: string;
  outils: string;
  difficultes: string;
  niveauEquipes: string;
  objectifs: string;
}): string {
  const cas = useCasesPourSecteur(input.secteur).join(", ");
  return `Realise un audit IA pour cette entreprise.

Entreprise: ${input.entreprise}
Secteur: ${input.secteur}
Activite: ${input.activite}
Taches repetitives: ${input.tachesRepetitives}
Outils utilises: ${input.outils}
Difficultes rencontrees: ${input.difficultes}
Niveau IA des equipes: ${input.niveauEquipes}
Objectifs recherches: ${input.objectifs}

Cas d'usage typiques du secteur a considerer: ${cas}.

Reponds en JSON avec exactement cette structure:
{
  "resumeEntreprise": "string (2-3 phrases)",
  "opportunites": [{ "titre": "string", "description": "string" }],
  "gainsTemps": "string (estimation chiffree des gains de temps)",
  "casUsage": [{ "titre": "string", "description": "string" }],
  "priorites": ["string", "string", "string"]
}
Donne 3 a 5 opportunites et 3 a 5 cas d'usage.`;
}

export function promptFormation(input: {
  entreprise: string;
  secteur: string;
  nbSalaries: number | null;
  objectifs: string;
  duree: string;
  niveau: string;
}): string {
  const cas = useCasesPourSecteur(input.secteur).join(", ");
  return `Cree une formation IA complete et personnalisee.

Entreprise: ${input.entreprise}
Secteur: ${input.secteur}
Nombre de salaries: ${input.nbSalaries ?? "non precise"}
Objectifs: ${input.objectifs}
Duree: ${input.duree}
Niveau des participants: ${input.niveau}

Personnalise TOUT le contenu pour le secteur "${input.secteur}".
Cas d'usage metier a integrer: ${cas}.
Panorama d'outils a couvrir (ne te limite pas a ChatGPT): ${panoramaResume()}.

La formation doit suivre cette progression: Introduction, Comprendre l'IA, Panorama des outils d'IA (ChatGPT, Claude, Gemini, Copilot, Perplexity, Midjourney...), L'art du prompt, Cas d'usage metier (avec l'outil le plus adapte pour chacun), Automatisations, Bonnes pratiques, Atelier pratique, Conclusion.

Réponds en JSON avec exactement cette structure:
{
  "titre": "string",
  "introduction": "string (3-4 phrases personnalisées au client)",
  "modules": [
    {
      "titre": "string",
      "objectif": "string",
      "slides": [
        { "titre": "string", "contenu": "string (3 à 5 phrases courtes et concrètes ; chacune deviendra une puce à l'écran)", "exemple": "string (exemple TRÈS concret du métier, idéalement un prompt prêt à l'emploi entre guillemets)", "conseils": "string (conseil d'animation pour le formateur)" }
      ]
    }
  ],
  "conclusion": "string"
}
Génère 6 à 8 modules, chacun avec 2 à 3 slides riches. Le français doit être impeccable et accentué.`;
}

export function promptExercices(input: {
  entreprise: string;
  secteur: string;
  niveau: string;
}): string {
  const cas = useCasesPourSecteur(input.secteur).join(", ");
  return `Genere 10 exercices pratiques d'IA adaptes au metier.

Entreprise: ${input.entreprise}
Secteur: ${input.secteur}
Niveau: ${input.niveau}
Cas d'usage metier: ${cas}.
Varie les outils d'IA utilises selon l'exercice (${panoramaResume()}). Indique l'outil recommande dans chaque consigne.

Reponds en JSON avec exactement cette structure:
{
  "exercices": [
    { "titre": "string", "consigne": "string", "corrige": "string (corrige modele)" }
  ]
}
Genere exactement 10 exercices concrets et propres au secteur.`;
}
