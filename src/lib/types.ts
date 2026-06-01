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
export interface Devis {
  id: string;
  entreprise: string;
  prix: number;
  duree: string;
  nbParticipants: number;
  conditions: string;
  date: string;
  createdAt: string;
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

// --- Branding / export PDF ---
export interface Branding {
  cabinet: string;
  couleur: string; // hex
  logoDataUrl: string | null;
}
