// ===========================================================================
// FORMATOR AI - Schémas JSON stricts pour le « tool use » Anthropic
// ===========================================================================
// Garantissent que l'IA renvoie EXACTEMENT la structure attendue par l'app,
// ce qui évite tout crash d'affichage (champs manquants).
// ===========================================================================

const titreDescription = {
  type: "object",
  properties: { titre: { type: "string" }, description: { type: "string" } },
  required: ["titre", "description"],
  additionalProperties: false,
};

export const AUDIT_SCHEMA = {
  type: "object",
  properties: {
    resumeEntreprise: { type: "string" },
    opportunites: { type: "array", items: titreDescription },
    gainsTemps: { type: "string" },
    casUsage: { type: "array", items: titreDescription },
    priorites: { type: "array", items: { type: "string" } },
  },
  required: ["resumeEntreprise", "opportunites", "gainsTemps", "casUsage", "priorites"],
  additionalProperties: false,
};

export const FORMATION_SCHEMA = {
  type: "object",
  properties: {
    titre: { type: "string" },
    introduction: { type: "string" },
    modules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          objectif: { type: "string" },
          slides: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titre: { type: "string" },
                contenu: { type: "string" },
                exemple: { type: "string" },
                conseils: { type: "string" },
              },
              required: ["titre", "contenu", "exemple", "conseils"],
              additionalProperties: false,
            },
          },
        },
        required: ["titre", "objectif", "slides"],
        additionalProperties: false,
      },
    },
    conclusion: { type: "string" },
  },
  required: ["titre", "introduction", "modules", "conclusion"],
  additionalProperties: false,
};

export const EXERCICES_SCHEMA = {
  type: "object",
  properties: {
    exercices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          consigne: { type: "string" },
          corrige: { type: "string" },
        },
        required: ["titre", "consigne", "corrige"],
        additionalProperties: false,
      },
    },
  },
  required: ["exercices"],
  additionalProperties: false,
};
