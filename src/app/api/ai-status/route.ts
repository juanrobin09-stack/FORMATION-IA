import { NextResponse } from "next/server";
import { activeProvider, generateJSON } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // toujours lire l'etat courant des variables d'env
export const maxDuration = 30;

// GET /api/ai-status            -> { provider, model } (cle presente ?)
// GET /api/ai-status?test=1     -> effectue un vrai appel minimal pour valider la cle
export async function GET(req: Request) {
  const provider = activeProvider();
  const model =
    provider === "anthropic"
      ? process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6"
      : provider === "openai"
        ? process.env.OPENAI_MODEL || "gpt-4o-mini"
        : null;

  const test = new URL(req.url).searchParams.get("test") === "1";
  if (!test) {
    return NextResponse.json({ provider, model });
  }

  if (!provider) {
    return NextResponse.json({ provider, model, test: "no_key" });
  }
  try {
    await generateJSON<{ ok: boolean }>(
      "Tu réponds uniquement en JSON valide.",
      'Réponds exactement {"ok":true}.',
    );
    return NextResponse.json({ provider, model, test: "ok" });
  } catch (e) {
    return NextResponse.json({
      provider,
      model,
      test: "error",
      message: e instanceof Error ? e.message : "Erreur inconnue",
    });
  }
}
