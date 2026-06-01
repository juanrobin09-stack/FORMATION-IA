// ===========================================================================
// FORMATOR AI - Couche IA (Anthropic prioritaire, OpenAI en repli, mock sinon)
// ===========================================================================
// Cette couche tourne UNIQUEMENT cote serveur (routes API).
// - Si ANTHROPIC_API_KEY est presente -> Claude (avec prompt caching)
// - Sinon si OPENAI_API_KEY est presente -> OpenAI
// - Sinon -> generateur de contenu simule (mode demo) pour que l'app
//   reste entierement fonctionnelle sans cle.
// ===========================================================================

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export type AIProvider = "anthropic" | "openai" | "mock";

export function activeProvider(): AIProvider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

/**
 * Genere une reponse JSON a partir d'un system prompt + user prompt.
 * Renvoie un objet deja parse.
 */
export async function generateJSON<T>(
  system: string,
  user: string,
  mockFactory: () => T,
): Promise<{ data: T; provider: AIProvider }> {
  const provider = activeProvider();

  try {
    if (provider === "anthropic") {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        // Prompt caching sur le system prompt (reutilise entre appels)
        system: [
          {
            type: "text",
            text: system,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: user }],
      });
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
      return { data: parseJSON<T>(text), provider };
    }

    if (provider === "openai") {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
  } catch (err) {
    // En cas d'erreur fournisseur, on retombe sur le mock pour ne pas casser l'UX.
    console.error("[FORMATOR AI] Echec fournisseur IA, repli sur le mode demo:", err);
    return { data: mockFactory(), provider: "mock" };
  }

  return { data: mockFactory(), provider: "mock" };
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
