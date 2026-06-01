// ===========================================================================
// FORMATOR AI - Fabrique de devis (pre-remplissage depuis le branding)
// ===========================================================================

"use client";

import type { Branding, Devis, DevisLigne } from "./types";
import { uid, nextDevisNumero } from "./store";

export function defaultLigne(over?: Partial<DevisLigne>): DevisLigne {
  return {
    designation: "Formation à l'intelligence artificielle (présentiel ou distanciel)",
    quantite: 1,
    unite: "forfait",
    prixUnitaireHT: 1200,
    ...over,
  };
}

export function createDevis(b: Branding, over?: Partial<Devis>): Devis {
  return {
    id: uid(),
    numero: nextDevisNumero(),
    entreprise: "",
    clientAdresse: "",
    clientContact: "",
    date: new Date().toISOString().slice(0, 10),
    validiteJours: b.validiteJours ?? 90,
    dateExecution: "",
    lieuExecution: "",
    duree: "1 journée (7h)",
    nbParticipants: 1,
    lignes: [defaultLigne()],
    tvaRate: b.tvaRate ?? 20,
    franchiseTVA: b.franchiseTVA ?? true,
    acompte: 30,
    conditions: b.conditionsReglement ?? "",
    createdAt: new Date().toISOString(),
    ...over,
  };
}
