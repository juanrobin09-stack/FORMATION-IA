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
    const res = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      // Prompt caching sur le system prompt (reutilise entre appels)
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: user }],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return { data: parseJSON<T>(text), provider };
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
