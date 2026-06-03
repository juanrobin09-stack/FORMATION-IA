// ===========================================================================
// FORMATOR AI - Schémas JSON pour le « tool use » Anthropic
// ===========================================================================
// Guident la structure SANS sur-contraindre (pas de additionalProperties:false
// qui peut bloquer les modèles rapides sur les structures imbriquées).
// Le « tool use » garantit déjà un JSON valide ; ces schémas garantissent la forme.
// ===========================================================================

const titreDescription = {
  type: "object",
  properties: { titre: { type: "string" }, description: { type: "string" } },
  required: ["titre", "description"],
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
};

export const FORMATION_SCHEMA = {
  type: "object",
  properties: {
    titre: { type: "string" },
    introduction: { type: "string" },
    modules: {
      type: "array",
      description: "Liste des modules de la formation (au moins 4).",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          objectif: { type: "string" },
          slides: {
            type: "array",
            description: "2 à 3 diapositives par module.",
            items: {
              type: "object",
              properties: {
                titre: { type: "string" },
                contenu: { type: "string" },
                exemple: { type: "string" },
                conseils: { type: "string" },
              },
              required: ["titre", "contenu", "exemple", "conseils"],
            },
          },
        },
        required: ["titre", "objectif", "slides"],
      },
    },
    conclusion: { type: "string" },
  },
  required: ["titre", "introduction", "modules", "conclusion"],
};

export const EXERCICES_SCHEMA = {
  type: "object",
  properties: {
    exercices: {
      type: "array",
      description: "10 exercices pratiques.",
      items: {
        type: "object",
        properties: {
          titre: { type: "string" },
          consigne: { type: "string" },
          corrige: { type: "string" },
        },
        required: ["titre", "consigne", "corrige"],
      },
    },
  },
  required: ["exercices"],
};
