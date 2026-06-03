import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { aiError } from "@/lib/apiError";
import { SYSTEM_EXERCICES, promptExercices } from "@/lib/prompts";
import { EXERCICES_SCHEMA } from "@/lib/schemas";
import type { Exercice, Niveau } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  entreprise: string;
  secteur: string;
  niveau: Niveau;
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as Body;
    if (!input?.entreprise || !input?.secteur) {
      return NextResponse.json({ error: "Entreprise et secteur requis." }, { status: 400 });
    }
    const { data, provider } = await generateJSON<{ exercices: Exercice[] }>(
      SYSTEM_EXERCICES,
      promptExercices({
        entreprise: input.entreprise,
        secteur: input.secteur,
        niveau: input.niveau,
      }),
      EXERCICES_SCHEMA,
    );
    if (!data?.exercices?.length) {
      throw new Error("L'IA a renvoyé des exercices vides. Réessayez dans un instant.");
    }
    return NextResponse.json({ result: data.exercices, provider });
  } catch (err) {
    return aiError(err);
  }
}
