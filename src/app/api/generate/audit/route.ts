import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import { aiError } from "@/lib/apiError";
import { SYSTEM_AUDIT, promptAudit } from "@/lib/prompts";
import { AUDIT_SCHEMA } from "@/lib/schemas";
import type { AuditInput, AuditResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as AuditInput;
    if (!input?.entreprise || !input?.secteur) {
      return NextResponse.json({ error: "Entreprise et secteur requis." }, { status: 400 });
    }
    const { data, provider } = await generateJSON<AuditResult>(
      SYSTEM_AUDIT,
      promptAudit({
        entreprise: input.entreprise,
        secteur: input.secteur,
        activite: input.activite,
        tachesRepetitives: input.tachesRepetitives,
        outils: input.outils,
        difficultes: input.difficultes,
        niveauEquipes: input.niveauEquipes,
        objectifs: input.objectifs,
      }),
      AUDIT_SCHEMA,
    );
    return NextResponse.json({ result: data, provider });
  } catch (err) {
    return aiError(err);
  }
}
