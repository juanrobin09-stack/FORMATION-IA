import { NextResponse } from "next/server";
import { NoAIKeyError } from "./ai";

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
  console.error("[FORMATOR AI] Échec de génération:", err);
  return NextResponse.json(
    { error: "La génération a échoué. Vérifiez votre clé IA et réessayez dans un instant." },
    { status: 502 },
  );
}
