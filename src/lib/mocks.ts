// ===========================================================================
// FORMATOR AI - Generateurs de contenu simule (mode demo sans cle IA)
// ===========================================================================
// Produisent un contenu coherent et personnalise au metier, afin que
// l'application soit pleinement utilisable et demontrable sans cle API.
// ===========================================================================

import type {
  AuditResult,
  Exercice,
  FormationResult,
  ModuleFormation,
} from "./types";
import { useCasesPourSecteur } from "./prompts";

export function mockAudit(input: {
  entreprise: string;
  secteur: string;
}): AuditResult {
  const cas = useCasesPourSecteur(input.secteur);
  return {
    resumeEntreprise: `${input.entreprise} evolue dans le secteur ${input.secteur}. L'entreprise gere de nombreuses taches repetitives qui mobilisent du temps a forte valeur ajoutee. L'integration de l'IA generative represente un levier immediat de productivite.`,
    opportunites: cas.map((c, i) => ({
      titre: `Opportunite ${i + 1} : ${capitalize(c)}`,
      description: `Mettre en place des assistants IA pour ${c}. Gain de temps estime et montee en qualite des livrables.`,
    })),
    gainsTemps:
      "Estimation : 5 a 10 heures economisees par semaine et par collaborateur sur les taches automatisables, soit l'equivalent d'une journee de travail.",
    casUsage: cas.map((c) => ({
      titre: capitalize(c),
      description: `Cas d'usage prioritaire pour le secteur ${input.secteur} : ${c}.`,
    })),
    priorites: [
      `Former les equipes aux fondamentaux de ChatGPT (${input.secteur})`,
      `Automatiser : ${cas[0]}`,
      `Deployer une bibliotheque de prompts metier`,
    ],
  };
}

export function mockFormation(input: {
  entreprise: string;
  secteur: string;
  niveau: string;
  duree: string;
}): FormationResult {
  const cas = useCasesPourSecteur(input.secteur);
  const slide = (titre: string, contenu: string, exemple: string, conseils: string) => ({
    titre,
    contenu,
    exemple,
    conseils,
  });

  const modules: ModuleFormation[] = [
    {
      titre: "Introduction",
      objectif: `Comprendre les enjeux de l'IA pour ${input.secteur}`,
      slides: [
        slide(
          "Bienvenue",
          `Objectifs de la journee et presentation du programme adapte a ${input.entreprise}.`,
          `Tour de table : quelles taches vous prennent le plus de temps dans le ${input.secteur} ?`,
          "Creez un climat de confiance, l'IA n'est pas la pour remplacer mais pour assister.",
        ),
      ],
    },
    {
      titre: "Comprendre l'IA",
      objectif: "Demystifier l'intelligence artificielle generative",
      slides: [
        slide(
          "Qu'est-ce que l'IA generative ?",
          "Principes, capacites et limites des grands modeles de langage.",
          `Exemple : generer un email professionnel adapte au ${input.secteur} en 10 secondes.`,
          "Insistez sur la verification systematique des resultats.",
        ),
      ],
    },
    {
      titre: "Decouvrir ChatGPT",
      objectif: "Prendre en main l'outil et l'art du prompt",
      slides: [
        slide(
          "Premiers pas avec ChatGPT",
          "Interface, conversations, et structure d'un bon prompt (contexte, role, objectif, format).",
          `Exemple : "Agis comme un expert ${input.secteur} et redige..."`,
          "Un bon prompt = role + contexte + tache + format attendu.",
        ),
      ],
    },
    {
      titre: "Cas d'usage metier",
      objectif: `Appliquer l'IA aux situations reelles du ${input.secteur}`,
      slides: cas.map((c) =>
        slide(
          capitalize(c),
          `Comment utiliser l'IA pour ${c}.`,
          `Demonstration en direct : ${c} pour ${input.entreprise}.`,
          "Adaptez toujours le ton a votre clientele.",
        ),
      ),
    },
    {
      titre: "Automatisations",
      objectif: "Gagner du temps sur les taches recurrentes",
      slides: [
        slide(
          "Automatiser sans coder",
          "Connecter l'IA a vos outils (emails, documents, reseaux sociaux).",
          `Exemple : automatiser ${cas[0]} pour ${input.entreprise}.`,
          "Commencez petit, mesurez le gain, puis etendez.",
        ),
      ],
    },
    {
      titre: "Bonnes pratiques",
      objectif: "Utiliser l'IA de maniere responsable et efficace",
      slides: [
        slide(
          "Securite, confidentialite et ethique",
          "Donnees sensibles, verification, mentions legales et RGPD.",
          "Exemple : anonymiser les donnees clients avant tout traitement.",
          "Ne jamais coller de donnees confidentielles non anonymisees.",
        ),
      ],
    },
    {
      titre: "Atelier pratique",
      objectif: "Mettre en pratique sur des cas reels",
      slides: [
        slide(
          "Atelier guide",
          `Les participants traitent un cas concret de leur quotidien (${input.secteur}).`,
          `Exercice : ${cas[1] ?? cas[0]} de A a Z.`,
          "Circulez, debloquez, valorisez les reussites.",
        ),
      ],
    },
    {
      titre: "Conclusion",
      objectif: "Ancrer les acquis et planifier la suite",
      slides: [
        slide(
          "Synthese & plan d'action",
          "Recapitulatif des acquis et feuille de route a 30 jours.",
          `Chaque participant repart avec 3 prompts prets a l'emploi pour le ${input.secteur}.`,
          "Proposez un suivi a 1 mois pour ancrer les usages.",
        ),
      ],
    },
  ];

  return {
    titre: `Formation IA personnalisee - ${input.entreprise} (${input.secteur})`,
    introduction: `Cette formation de ${input.duree}, niveau ${input.niveau}, est entierement adaptee au secteur ${input.secteur}. Elle vise a rendre les equipes de ${input.entreprise} autonomes et productives avec l'IA generative.`,
    modules,
    conclusion: `A l'issue de cette formation, les equipes de ${input.entreprise} maitrisent les usages cles de l'IA pour le ${input.secteur} et disposent d'une boite a outils concrete (prompts, automatisations, bonnes pratiques).`,
  };
}

export function mockExercices(input: {
  secteur: string;
}): Exercice[] {
  const cas = useCasesPourSecteur(input.secteur);
  const base: { titre: string; consigne: string; corrige: string }[] = [];
  const themes = [
    ...cas,
    "redaction d'emails professionnels",
    "synthese de reunion",
    "creation de contenu reseaux sociaux",
    "reponse a une reclamation client",
    "redaction d'une fiche de poste",
    "creation d'un plan de communication",
    "analyse de la concurrence",
  ];
  for (let i = 0; i < 10; i++) {
    const t = themes[i % themes.length];
    base.push({
      titre: `Exercice ${i + 1} : ${capitalize(t)}`,
      consigne: `En utilisant ChatGPT, realisez ${t} dans le contexte du secteur ${input.secteur}. Soignez le contexte fourni a l'IA et iterez sur le resultat.`,
      corrige: `Corrige modele : un bon prompt commence par definir le role ("Agis comme un expert ${input.secteur}"), le contexte, la tache (${t}) et le format attendu. Le resultat doit ensuite etre relu et ajuste au ton de l'entreprise.`,
    });
  }
  return base;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
