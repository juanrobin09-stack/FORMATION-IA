import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { aiError } from "@/lib/apiError";
import {
  SYSTEM_AUDIT,
  SYSTEM_EXERCICES,
  SYSTEM_FORMATION,
  promptAudit,
  promptExercices,
  promptFormation,
} from "@/lib/prompts";
import type { AuditResult, Exercice, FormationResult, Niveau } from "@/lib/types";

export const runtime = "nodejs";
// 60 s = limite du plan Vercel Hobby. Les 3 generations tournent en parallele.
export const maxDuration = 60;

interface Body {
  entreprise: string;
  secteur: string;
  objectifs: string;
  niveau?: Niveau;
  duree?: string;
  nbSalaries?: number | null;
}

// FONCTION MAGIQUE : genere audit + formation + exercices en un appel.
export async function POST(req: Request) {
  const input = (await req.json()) as Body;
  if (!input?.entreprise || !input?.secteur) {
    return NextResponse.json({ error: "Entreprise et secteur requis." }, { status: 400 });
  }
  const niveau: Niveau = input.niveau ?? "Debutant";
  const duree = input.duree ?? "1 journée (7h)";

  try {
    const [audit, formation, exercices] = await Promise.all([
      generateJSON<AuditResult>(
        SYSTEM_AUDIT,
        promptAudit({
          entreprise: input.entreprise,
          secteur: input.secteur,
          activite: input.objectifs,
          tachesRepetitives: "a identifier",
          outils: "a identifier",
          difficultes: "a identifier",
          niveauEquipes: niveau,
          objectifs: input.objectifs,
        }),
      ),
      generateJSON<FormationResult>(
        SYSTEM_FORMATION,
        promptFormation({
          entreprise: input.entreprise,
          secteur: input.secteur,
          nbSalaries: input.nbSalaries ?? null,
          objectifs: input.objectifs,
          duree,
          niveau,
        }),
      ),
      generateJSON<{ exercices: Exercice[] }>(
        SYSTEM_EXERCICES,
        promptExercices({
          entreprise: input.entreprise,
          secteur: input.secteur,
          niveau,
        }),
      ),
    ]);

    return NextResponse.json({
      audit: audit.data,
      formation: formation.data,
      exercices: exercices.data.exercices ?? [],
      provider: audit.provider,
    });
  } catch (err) {
    return aiError(err);
  }
}
