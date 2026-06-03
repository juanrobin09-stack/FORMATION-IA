import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { aiError } from "@/lib/apiError";
import { SYSTEM_FORMATION, promptFormation } from "@/lib/prompts";
import { FORMATION_SCHEMA } from "@/lib/schemas";
import type { FormationInput, FormationResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as FormationInput;
    if (!input?.entreprise || !input?.secteur) {
      return NextResponse.json({ error: "Entreprise et secteur requis." }, { status: 400 });
    }
    const { data, provider } = await generateJSON<FormationResult>(
      SYSTEM_FORMATION,
      promptFormation({
        entreprise: input.entreprise,
        secteur: input.secteur,
        nbSalaries: input.nbSalaries,
        objectifs: input.objectifs,
        duree: input.duree,
        niveau: input.niveau,
      }),
      FORMATION_SCHEMA,
    );
    return NextResponse.json({ result: data, provider });
  } catch (err) {
    return aiError(err);
  }
}
