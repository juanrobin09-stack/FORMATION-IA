import { NextResponse } from "next/server";
import { NoAIKeyError } from "./ai";

// Extrait un message d'erreur lisible (statut + message) des erreurs SDK.
function detailOf(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown> & { error?: { error?: { message?: string }; message?: string } };
    const status = (e.status ?? e.statusCode) as number | undefined;
    const msg =
      e.error?.error?.message ||
      e.error?.message ||
      (typeof e.message === "string" ? e.message : undefined);
    return [status ? `HTTP ${status}` : null, msg].filter(Boolean).join(" — ") || "erreur inconnue";
  }
  return String(err);
}

// Reponse d'erreur normalisee pour les routes de generation IA.
export function aiError(err: unknown) {
  if (err instanceof NoAIKeyError) {
    return NextResponse.json(
      {
        error:
          "Aucune clé IA n'est configurée. Ajoutez ANTHROPIC_API_KEY (ou OPENAI_API_KEY) dans vos variables d'environnement, puis redémarrez l'application.",
        code: "NO_AI_KEY",
      },
      { status: 503 },
    );
  }
  const detail = detailOf(err);
  console.error("[FORMATOR AI] Échec de génération:", detail);
  return NextResponse.json(
    { error: `La génération a échoué : ${detail}`, detail },
    { status: 502 },
  );
}
