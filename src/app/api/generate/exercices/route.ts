import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { aiError } from "@/lib/apiError";
import { SYSTEM_EXERCICES, promptExercices } from "@/lib/prompts";
import type { Exercice, Niveau } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  entreprise: string;
  secteur: string;
  niveau: Niveau;
}

export async function POST(req: Request) {
  const input = (await req.json()) as Body;
  if (!input?.entreprise || !input?.secteur) {
    return NextResponse.json({ error: "Entreprise et secteur requis." }, { status: 400 });
  }
  try {
    const { data, provider } = await generateJSON<{ exercices: Exercice[] }>(
      SYSTEM_EXERCICES,
      promptExercices({
        entreprise: input.entreprise,
        secteur: input.secteur,
        niveau: input.niveau,
      }),
    );
    return NextResponse.json({ result: data.exercices ?? [], provider });
  } catch (err) {
    return aiError(err);
  }
}
