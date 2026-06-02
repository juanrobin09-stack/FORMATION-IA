// ===========================================================================
// FORMATOR AI - Panorama des outils d'IA (multi-fournisseurs)
// ===========================================================================
// Les formations couvrent TOUS les principaux outils d'IA, pas seulement
// ChatGPT. Ces donnees alimentent les prompts (generation reelle), le
// contenu de demonstration et la page panorama /outils.
// ===========================================================================

export interface AiTool {
  nom: string;
  editeur: string;
  usage: string;
  gratuit: boolean;
}

export interface AiToolCategory {
  categorie: string;
  description: string;
  outils: AiTool[];
}

export const AI_TOOLS: AiToolCategory[] = [
  {
    categorie: "Assistants conversationnels",
    description: "Rediger, resumer, analyser, repondre, brainstormer.",
    outils: [
      { nom: "ChatGPT", editeur: "OpenAI", usage: "Assistant polyvalent, redaction et analyse", gratuit: true },
      { nom: "Claude", editeur: "Anthropic", usage: "Documents longs, redaction nuancee, analyse", gratuit: true },
      { nom: "Gemini", editeur: "Google", usage: "Integre a Google, recherche et productivite", gratuit: true },
      { nom: "Copilot", editeur: "Microsoft", usage: "Integre a Windows et Office 365", gratuit: true },
      { nom: "Le Chat", editeur: "Mistral AI", usage: "Assistant europeen, rapide et souverain", gratuit: true },
    ],
  },
  {
    categorie: "Recherche & veille",
    description: "Trouver des informations a jour et sourcees.",
    outils: [
      { nom: "Perplexity", editeur: "Perplexity AI", usage: "Recherche web avec sources citees", gratuit: true },
      { nom: "Gemini (recherche)", editeur: "Google", usage: "Reponses ancrees dans le web", gratuit: true },
    ],
  },
  {
    categorie: "Generation d'images",
    description: "Visuels, illustrations, retouche, publicites.",
    outils: [
      { nom: "Midjourney", editeur: "Midjourney", usage: "Images artistiques haute qualite", gratuit: false },
      { nom: "DALL·E", editeur: "OpenAI", usage: "Images a partir de texte (dans ChatGPT)", gratuit: false },
      { nom: "Adobe Firefly", editeur: "Adobe", usage: "Visuels commerciaux, retouche generative", gratuit: true },
      { nom: "Stable Diffusion", editeur: "Stability AI", usage: "Generation d'images open source", gratuit: true },
    ],
  },
  {
    categorie: "Productivite & bureautique",
    description: "Documents, presentations, tableurs, notes.",
    outils: [
      { nom: "Microsoft 365 Copilot", editeur: "Microsoft", usage: "Word, Excel, PowerPoint, Outlook", gratuit: false },
      { nom: "Gemini for Workspace", editeur: "Google", usage: "Docs, Sheets, Gmail, Slides", gratuit: false },
      { nom: "Notion AI", editeur: "Notion", usage: "Notes, bases de connaissances, redaction", gratuit: false },
      { nom: "Gamma", editeur: "Gamma", usage: "Presentations et slides generees par IA", gratuit: true },
    ],
  },
  {
    categorie: "Audio & video",
    description: "Voix, video, sous-titres, musique.",
    outils: [
      { nom: "ElevenLabs", editeur: "ElevenLabs", usage: "Synthese vocale realiste", gratuit: true },
      { nom: "HeyGen", editeur: "HeyGen", usage: "Videos avec avatars parlants", gratuit: false },
      { nom: "Synthesia", editeur: "Synthesia", usage: "Videos de formation avec presentateur IA", gratuit: false },
      { nom: "Suno", editeur: "Suno", usage: "Generation de musique et jingles", gratuit: true },
    ],
  },
  {
    categorie: "Automatisation & reunions",
    description: "Connecter les outils et automatiser les taches.",
    outils: [
      { nom: "Make", editeur: "Make", usage: "Automatisations visuelles avec IA", gratuit: true },
      { nom: "Zapier", editeur: "Zapier", usage: "Connecter des milliers d'applications", gratuit: true },
      { nom: "Fireflies", editeur: "Fireflies", usage: "Transcription et compte-rendu de reunions", gratuit: true },
    ],
  },
];

// Resume compact pour enrichir les prompts envoyes a l'IA.
export function panoramaResume(): string {
  return AI_TOOLS.map(
    (c) => `${c.categorie} : ${c.outils.map((o) => o.nom).join(", ")}`,
  ).join(" ; ");
}

// Liste a plat des noms d'outils.
export function tousLesOutils(): string[] {
  return AI_TOOLS.flatMap((c) => c.outils.map((o) => o.nom));
}
