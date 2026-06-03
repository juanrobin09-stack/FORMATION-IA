// ===========================================================================
// FORMATOR AI - Couche IA (Anthropic prioritaire, OpenAI en repli)
// ===========================================================================
// Cette couche tourne UNIQUEMENT cote serveur (routes API).
// - Si ANTHROPIC_API_KEY est presente -> Claude (avec prompt caching)
// - Sinon si OPENAI_API_KEY est presente -> OpenAI
// - Sinon -> erreur explicite (aucun contenu simule).
// ===========================================================================

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Au-dela de cette duree, on abandonne proprement (avant que Vercel ne coupe
// la fonction a 60 s et ne renvoie un 504 illisible).
const REQUEST_TIMEOUT_MS = 55_000;

export type AIProvider = "anthropic" | "openai";

// Erreur levee quand aucune cle IA n'est configuree.
export class NoAIKeyError extends Error {
  constructor() {
    super("Aucune clé IA configurée");
    this.name = "NoAIKeyError";
  }
}

export function activeProvider(): AIProvider | null {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

// Extrait une clé propre même si l'utilisateur a collé du texte autour
// (commande curl, guillemets, espaces, retours à la ligne).
function cleanKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim().replace(/^["']|["']$/g, "");
  const m = trimmed.match(/sk-[A-Za-z0-9_-]{20,}/);
  return m ? m[0] : trimmed;
}

/**
 * Genere une reponse JSON a partir d'un system prompt + user prompt.
 * Renvoie un objet deja parse. Leve une erreur si aucune cle n'est
 * configuree (NoAIKeyError) ou si le fournisseur echoue.
 */
export async function generateJSON<T>(
  system: string,
  user: string,
): Promise<{ data: T; provider: AIProvider }> {
  const provider = activeProvider();
  if (!provider) throw new NoAIKeyError();

  if (provider === "anthropic") {
    const client = new Anthropic({
      apiKey: cleanKey(process.env.ANTHROPIC_API_KEY),
      maxRetries: 1,
      timeout: REQUEST_TIMEOUT_MS,
    });
    // « Tool use » : l'API garantit un JSON valide (input de l'outil),
    // ce qui evite toute erreur de parsing si le modele met des guillemets
    // a l'interieur de ses textes.
    const res = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 8000,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      tools: [
        {
          name: "fournir_resultat",
          description: "Retourne le résultat demandé sous forme structurée.",
          input_schema: { type: "object", properties: {}, additionalProperties: true },
        },
      ],
      tool_choice: { type: "tool", name: "fournir_resultat" },
      messages: [{ role: "user", content: user }],
    });
    const block = res.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    if (!block) throw new Error("Réponse IA vide (aucun résultat structuré).");
    return { data: block.input as T, provider };
  }

  // OpenAI
  const client = new OpenAI({
    apiKey: cleanKey(process.env.OPENAI_API_KEY),
    maxRetries: 1,
    timeout: REQUEST_TIMEOUT_MS,
  });
  const res = await client.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = res.choices[0]?.message?.content ?? "";
  return { data: parseJSON<T>(text), provider };
}

function parseJSON<T>(text: string): T {
  // Nettoie les fences markdown eventuelles
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  // Extrait le premier objet JSON
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const slice = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}
