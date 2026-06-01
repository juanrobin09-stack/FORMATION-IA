// ===========================================================================
// FORMATOR AI - Construction d'un "deck" de diapositives a partir d'une formation
// ===========================================================================
// Modele commun au mode presentation (HTML plein ecran) et a l'export PDF 16:9.
// ===========================================================================

import type { FormationResult } from "./types";

export type DeckSlide =
  | { kind: "cover"; title: string; subtitle: string; client: string; secteur?: string }
  | { kind: "agenda"; items: string[] }
  | { kind: "section"; index: number; total: number; title: string; objectif: string }
  | {
      kind: "content";
      moduleIndex: number;
      moduleTitre: string;
      title: string;
      points: string[];
      exemple?: string;
      conseils?: string;
    }
  | { kind: "closing"; title: string; text: string; cabinet: string };

// Decoupe un paragraphe en puces lisibles (sur les phrases).
function toPoints(text: string): string[] {
  if (!text) return [];
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text.trim()];
}

export function buildDeck(
  formation: FormationResult,
  meta: { client: string; secteur?: string; cabinet: string },
): DeckSlide[] {
  const slides: DeckSlide[] = [];

  slides.push({
    kind: "cover",
    title: formation.titre,
    subtitle: meta.secteur ? `Formation personnalisée — secteur ${meta.secteur}` : "Formation à l'intelligence artificielle",
    client: meta.client,
    secteur: meta.secteur,
  });

  slides.push({
    kind: "agenda",
    items: formation.modules.map((m, i) => `${i + 1}. ${m.titre}`),
  });

  formation.modules.forEach((m, i) => {
    slides.push({
      kind: "section",
      index: i + 1,
      total: formation.modules.length,
      title: m.titre,
      objectif: m.objectif,
    });
    m.slides.forEach((s) => {
      slides.push({
        kind: "content",
        moduleIndex: i + 1,
        moduleTitre: m.titre,
        title: s.titre,
        points: toPoints(s.contenu),
        exemple: s.exemple || undefined,
        conseils: s.conseils || undefined,
      });
    });
  });

  slides.push({
    kind: "closing",
    title: "Merci !",
    text: formation.conclusion,
    cabinet: meta.cabinet,
  });

  return slides;
}
