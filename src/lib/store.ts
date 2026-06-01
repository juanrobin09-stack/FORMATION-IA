// ===========================================================================
// FORMATOR AI - Couche de persistance (V1: localStorage navigateur)
// ===========================================================================
// Interface volontairement simple et synchrone cote client.
// La migration vers Supabase se fait en remplacant l'implementation
// sans changer les appelants (cf. src/lib/supabase.ts pour le schema).
// ===========================================================================

"use client";

import type { Branding, Devis, KnowledgeEntry, Prospect, PromptItem } from "./types";

const KEYS = {
  prospects: "formator.prospects",
  knowledge: "formator.knowledge",
  devis: "formator.devis",
  prompts: "formator.prompts.custom",
  branding: "formator.branding",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// --- Prospects (CRM) ---
export const prospectStore = {
  all: (): Prospect[] => read<Prospect[]>(KEYS.prospects, []),
  save: (p: Prospect): Prospect[] => {
    const all = prospectStore.all();
    const idx = all.findIndex((x) => x.id === p.id);
    if (idx >= 0) all[idx] = p;
    else all.unshift(p);
    write(KEYS.prospects, all);
    return all;
  },
  remove: (id: string): Prospect[] => {
    const all = prospectStore.all().filter((x) => x.id !== id);
    write(KEYS.prospects, all);
    return all;
  },
};

// --- Base de connaissances ---
export const knowledgeStore = {
  all: (): KnowledgeEntry[] => read<KnowledgeEntry[]>(KEYS.knowledge, []),
  add: (e: KnowledgeEntry): KnowledgeEntry[] => {
    const all = knowledgeStore.all();
    all.unshift(e);
    write(KEYS.knowledge, all);
    return all;
  },
  remove: (id: string): KnowledgeEntry[] => {
    const all = knowledgeStore.all().filter((x) => x.id !== id);
    write(KEYS.knowledge, all);
    return all;
  },
};

// --- Devis ---
export const devisStore = {
  all: (): Devis[] => read<Devis[]>(KEYS.devis, []),
  save: (d: Devis): Devis[] => {
    const all = devisStore.all();
    const idx = all.findIndex((x) => x.id === d.id);
    if (idx >= 0) all[idx] = d;
    else all.unshift(d);
    write(KEYS.devis, all);
    return all;
  },
  remove: (id: string): Devis[] => {
    const all = devisStore.all().filter((x) => x.id !== id);
    write(KEYS.devis, all);
    return all;
  },
};

// --- Prompts personnalises (ajoutes par l'utilisateur) ---
export const customPromptStore = {
  all: (): PromptItem[] => read<PromptItem[]>(KEYS.prompts, []),
  add: (p: PromptItem): PromptItem[] => {
    const all = customPromptStore.all();
    all.unshift(p);
    write(KEYS.prompts, all);
    return all;
  },
  remove: (id: string): PromptItem[] => {
    const all = customPromptStore.all().filter((x) => x.id !== id);
    write(KEYS.prompts, all);
    return all;
  },
};

// --- Branding (identite du prestataire + mentions legales) ---
export const DEFAULT_BRANDING: Branding = {
  cabinet: "Formator AI",
  couleur: "#2563eb",
  logoDataUrl: null,
  formeJuridique: "Auto-entrepreneur",
  adresse: "",
  codePostalVille: "",
  telephone: "",
  email: "",
  siret: "",
  rcsRm: "",
  tvaIntra: "",
  iban: "",
  franchiseTVA: true,
  tvaRate: 20,
  validiteJours: 90,
  conditionsReglement:
    "Acompte de 30 % à la commande, solde à réception de facture sous 30 jours. Règlement par virement bancaire.",
};

export const brandingStore = {
  get: (): Branding => ({ ...DEFAULT_BRANDING, ...read<Partial<Branding>>(KEYS.branding, {}) }),
  set: (b: Branding): Branding => {
    write(KEYS.branding, b);
    return b;
  },
};

// Numero de devis sequentiel : DEV-AAAA-NNNN
export function nextDevisNumero(): string {
  const year = new Date().getFullYear();
  const all = devisStore.all();
  const prefix = `DEV-${year}-`;
  const max = all
    .map((d) => d.numero)
    .filter((n) => n?.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10))
    .filter((n) => !isNaN(n))
    .reduce((m, n) => Math.max(m, n), 0);
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}
