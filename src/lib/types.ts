// ===========================================================================
// FORMATOR AI - Modeles de donnees partages
// ===========================================================================

export type Niveau = "Debutant" | "Intermediaire" | "Avance";

export type ProspectStatut =
  | "Prospect"
  | "Contacte"
  | "RDV fixe"
  | "Proposition envoyee"
  | "Client signe"
  | "Formation realisee";

export const PROSPECT_STATUTS: ProspectStatut[] = [
  "Prospect",
  "Contacte",
  "RDV fixe",
  "Proposition envoyee",
  "Client signe",
  "Formation realisee",
];

export interface Prospect {
  id: string;
  entreprise: string;
  secteur: string;
  nbSalaries: number | null;
  contact: string;
  telephone: string;
  email: string;
  besoin: string;
  dateRdv: string; // ISO date
  statut: ProspectStatut;
  montant: number | null; // CA potentiel / signe
  createdAt: string;
}

// --- Audit IA ---
export interface AuditInput {
  entreprise: string;
  secteur: string;
  activite: string;
  tachesRepetitives: string;
  outils: string;
  difficultes: string;
  niveauEquipes: Niveau;
  objectifs: string;
}

export interface AuditResult {
  resumeEntreprise: string;
  opportunites: { titre: string; description: string }[];
  gainsTemps: string;
  casUsage: { titre: string; description: string }[];
  priorites: string[];
}

// --- Formation ---
export interface FormationInput {
  entreprise: string;
  secteur: string;
  nbSalaries: number | null;
  objectifs: string;
  duree: string;
  niveau: Niveau;
}

export interface Slide {
  titre: string;
  contenu: string;
  exemple: string;
  conseils: string;
}

export interface ModuleFormation {
  titre: string;
  objectif: string;
  slides: Slide[];
}

export interface FormationResult {
  titre: string;
  introduction: string;
  modules: ModuleFormation[];
  conclusion: string;
}

// --- Exercices ---
export interface Exercice {
  titre: string;
  consigne: string;
  corrige: string;
}

// --- Bibliotheque de prompts ---
export type PromptCategorie =
  | "Commercial"
  | "RH"
  | "Marketing"
  | "Immobilier"
  | "BTP"
  | "Restaurant"
  | "Artisan"
  | "PME";

export interface PromptItem {
  id: string;
  categorie: PromptCategorie;
  titre: string;
  objectif: string;
  prompt: string;
  resultatAttendu: string;
}

// --- Devis ---
export interface DevisLigne {
  designation: string;
  quantite: number;
  unite: string; // jour, heure, forfait, participant...
  prixUnitaireHT: number;
}

export interface Devis {
  id: string;
  numero: string; // ex: DEV-2026-0001
  entreprise: string; // raison sociale du client
  clientAdresse: string;
  clientContact: string;
  date: string; // date d'emission
  validiteJours: number; // duree de validite de l'offre
  dateExecution: string; // date prevue de la prestation
  lieuExecution: string;
  duree: string;
  nbParticipants: number;
  lignes: DevisLigne[];
  tvaRate: number; // taux de TVA en %
  franchiseTVA: boolean; // true => TVA non applicable art. 293 B CGI
  acompte: number; // pourcentage d'acompte a la commande
  conditions: string;
  createdAt: string;
}

// Totaux calcules d'un devis
export interface DevisTotaux {
  totalHT: number;
  montantTVA: number;
  totalTTC: number;
  montantAcompte: number;
}

export function calcDevis(d: Devis): DevisTotaux {
  const totalHT = d.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaireHT, 0);
  const montantTVA = d.franchiseTVA ? 0 : totalHT * (d.tvaRate / 100);
  const totalTTC = totalHT + montantTVA;
  const montantAcompte = totalTTC * ((d.acompte || 0) / 100);
  return { totalHT, montantTVA, totalTTC, montantAcompte };
}

// --- Base de connaissances ---
export type KnowledgeKind = "formation" | "audit" | "exercices" | "devis";

export interface KnowledgeEntry {
  id: string;
  kind: KnowledgeKind;
  entreprise: string;
  secteur: string;
  titre: string;
  createdAt: string;
  // Charge utile typee selon kind
  formation?: FormationResult;
  audit?: AuditResult;
  exercices?: Exercice[];
  devis?: Devis;
}

// --- Branding / identite du prestataire (export PDF & mentions legales) ---
export interface Branding {
  cabinet: string; // raison sociale / nom commercial
  couleur: string; // hex
  logoDataUrl: string | null;
  // Coordonnees et mentions legales du prestataire
  formeJuridique: string; // ex: Auto-entrepreneur, SARL, SAS...
  adresse: string;
  codePostalVille: string;
  telephone: string;
  email: string;
  siret: string;
  rcsRm: string; // RCS ou RM + ville
  tvaIntra: string; // n° de TVA intracommunautaire
  iban: string; // optionnel, pour le reglement
  // Parametres de facturation par defaut
  franchiseTVA: boolean; // franchise en base de TVA (auto-entrepreneur)
  tvaRate: number; // taux de TVA par defaut (%)
  validiteJours: number; // duree de validite des devis (jours)
  conditionsReglement: string;
}
