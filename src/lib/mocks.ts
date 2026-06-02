// ===========================================================================
// FORMATOR AI - Générateurs de contenu de démonstration (mode sans clé IA)
// ===========================================================================
// Produisent un contenu professionnel, accentué, concret et personnalisé au
// métier, afin que l'application soit présentable même sans clé API.
// (Avec une clé Claude/OpenAI, le contenu est entièrement rédigé par l'IA.)
// ===========================================================================

import type {
  AuditResult,
  Exercice,
  FormationResult,
  ModuleFormation,
  Slide,
} from "./types";
import { useCasesPourSecteur } from "./prompts";

const slide = (titre: string, contenu: string, exemple: string, conseils: string): Slide => ({
  titre,
  contenu,
  exemple,
  conseils,
});

// Recommande un outil d'IA différent selon l'usage (on ne se limite pas à ChatGPT).
const OUTILS_RECO = ["ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "Midjourney"];
function recommandeOutil(i: number): string {
  return OUTILS_RECO[i % OUTILS_RECO.length];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function mockAudit(input: { entreprise: string; secteur: string }): AuditResult {
  const cas = useCasesPourSecteur(input.secteur);
  return {
    resumeEntreprise: `${input.entreprise} évolue dans le secteur ${input.secteur}. L'entreprise consacre aujourd'hui un temps important à des tâches répétitives (communication, administratif, relation client) qui mobilisent des compétences à forte valeur ajoutée. L'intégration raisonnée de l'IA générative représente un levier immédiat de productivité et de qualité, sans investissement matériel.`,
    opportunites: cas.map((c, i) => ({
      titre: capitalize(c),
      description: `Déployer un assistant IA (${recommandeOutil(i)}) pour ${c}. À la clé : un gain de temps mesurable, une qualité homogène des livrables et une montée en compétence rapide des équipes.`,
    })),
    gainsTemps:
      "Estimation : 5 à 10 heures économisées par semaine et par collaborateur sur les tâches automatisables, soit l'équivalent d'une journée de travail récupérée chaque semaine. Retour sur investissement attendu dès le premier mois.",
    casUsage: cas.map((c) => ({
      titre: capitalize(c),
      description: `Cas d'usage prioritaire pour le secteur ${input.secteur} : ${c}. Mise en œuvre simple, impact rapide et visible par les équipes.`,
    })),
    priorites: [
      `Former les équipes aux fondamentaux des outils d'IA (ChatGPT, Claude, Gemini, Copilot) appliqués au secteur ${input.secteur}`,
      `Industrialiser le cas d'usage à plus fort impact : ${cas[0]}`,
      "Constituer une bibliothèque de prompts métier réutilisables par toute l'équipe",
      "Définir une charte de bon usage (confidentialité, vérification, RGPD)",
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
  const ex = (s: string) => `« Agis comme un expert ${input.secteur}. ${s} »`;

  const modules: ModuleFormation[] = [
    {
      titre: "Introduction",
      objectif: `Donner du sens à la démarche et fixer le cap pour ${input.entreprise}`,
      slides: [
        slide(
          "Bienvenue et objectifs",
          `Cette formation est conçue sur mesure pour ${input.entreprise}. Elle vise à rendre vos équipes autonomes et efficaces avec l'IA. Nous alternerons explications, démonstrations en direct et exercices pratiques sur vos propres cas.`,
          `Tour de table : « Quelle tâche vous fait perdre le plus de temps dans votre quotidien ${input.secteur} ? »`,
          "Instaurez un climat de confiance : l'IA assiste les équipes, elle ne les remplace pas.",
        ),
        slide(
          "Pourquoi maintenant ?",
          `Les outils d'IA sont devenus accessibles, peu coûteux et simples d'usage. Les entreprises qui s'en emparent gagnent en réactivité et en qualité. L'enjeu n'est plus technique : il est de savoir bien les utiliser.`,
          `Exemple concret : rédiger un e-mail client professionnel passe de 15 minutes à moins de 2 minutes.`,
          "Reliez chaque notion à un bénéfice métier immédiat pour capter l'attention.",
        ),
      ],
    },
    {
      titre: "Comprendre l'IA générative",
      objectif: "Démystifier l'IA et poser un vocabulaire commun",
      slides: [
        slide(
          "Qu'est-ce que l'IA générative ?",
          `L'IA générative produit du texte, des images ou du son à partir d'une simple consigne. Elle s'appuie sur de grands modèles de langage entraînés sur d'immenses corpus. Elle ne « comprend » pas comme un humain : elle prédit la réponse la plus probable.`,
          `Demandez à l'outil d'expliquer un terme de votre métier à un client : la réponse est instantanée et reformulable à volonté.`,
          "Une image vaut mille mots : faites une démonstration en direct dès cette diapositive.",
        ),
        slide(
          "Forces et limites",
          `L'IA excelle pour rédiger, résumer, traduire, reformuler et structurer. Elle peut en revanche se tromper, inventer des informations (« hallucinations ») et n'a pas connaissance des faits récents ni de vos données internes. La vérification humaine reste indispensable.`,
          `Faites repérer aux participants une erreur volontairement glissée dans une réponse générée.`,
          "Règle d'or : l'IA propose, l'humain dispose et valide toujours.",
        ),
      ],
    },
    {
      titre: "Panorama des outils d'IA",
      objectif: "Découvrir l'écosystème complet, bien au-delà de ChatGPT",
      slides: [
        slide(
          "Les assistants conversationnels",
          `Plusieurs assistants se partagent le marché : ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Copilot (Microsoft) et Le Chat (Mistral AI). Chacun a ses points forts : rédaction longue, intégration bureautique, recherche, souveraineté des données.`,
          `Comparez la même demande métier (${input.secteur}) sur ChatGPT, Claude et Gemini, puis observez les différences.`,
          "Le bon réflexe : choisir l'outil selon la tâche, pas l'inverse.",
        ),
        slide(
          "Au-delà du texte : image, recherche, voix, vidéo",
          `L'IA ne se limite pas à l'écrit : Perplexity pour la recherche sourcée, Midjourney, DALL·E et Adobe Firefly pour les visuels, ElevenLabs pour la voix, HeyGen et Synthesia pour la vidéo, Gamma pour les présentations.`,
          `Générez un visuel promotionnel pour ${input.entreprise} avec Midjourney ou Firefly en direct.`,
          "Associez les outils (texte + image + voix) pour produire un livrable complet en quelques minutes.",
        ),
      ],
    },
    {
      titre: "L'art du prompt",
      objectif: "Apprendre à formuler des demandes qui donnent d'excellents résultats",
      slides: [
        slide(
          "La méthode R.C.T.F.",
          `Un bon prompt repose sur quatre piliers : le Rôle (« agis comme… »), le Contexte (votre situation), la Tâche (ce que vous voulez) et le Format attendu. Plus la consigne est précise, meilleur est le résultat. Cette méthode fonctionne sur tous les outils.`,
          ex("Rédige un message de relance commercial, ton chaleureux et professionnel, en 5 lignes maximum."),
          "Faites reformuler un mauvais prompt par les participants à l'aide de la méthode.",
        ),
        slide(
          "Itérer pour s'améliorer",
          `Le premier résultat est rarement parfait : on l'affine. Demandez à l'IA de raccourcir, changer de ton, ajouter un exemple ou corriger. Le dialogue est la clé d'un résultat de qualité.`,
          `« Reformule ce texte de façon plus concise et ajoute un appel à l'action adapté à un client ${input.secteur}. »`,
          "Montrez qu'on peut dire à l'IA ce qui ne va pas : elle s'ajuste immédiatement.",
        ),
      ],
    },
    {
      titre: "Cas d'usage métier",
      objectif: `Appliquer l'IA aux situations réelles du secteur ${input.secteur}`,
      slides: cas.map((c, i) =>
        slide(
          capitalize(c),
          `Comment l'IA accélère « ${c} » au quotidien. On gagne du temps, on gagne en régularité et on garde la main sur le ton et la validation finale. Outil recommandé pour cet usage : ${recommandeOutil(i)}.`,
          ex(`Aide-moi pour « ${c} » : propose une première version directement utilisable, puis deux variantes.`),
          "Partez toujours d'un vrai cas de l'entreprise plutôt que d'un exemple théorique.",
        ),
      ),
    },
    {
      titre: "Automatisations",
      objectif: "Gagner du temps sur les tâches récurrentes, sans coder",
      slides: [
        slide(
          "Automatiser sans écrire de code",
          `Des outils comme Make, Zapier ou Copilot connectent l'IA à vos applications (e-mails, documents, réseaux sociaux, agenda). On crée des automatisations en assemblant des blocs, sans compétence technique.`,
          `Exemple : à chaque nouvel avis client, l'IA rédige une réponse personnalisée et vous la soumet pour validation.`,
          "Commencez petit, mesurez le gain de temps, puis étendez progressivement.",
        ),
        slide(
          "Un workflow concret",
          `Prenons « ${cas[0]} » : déclencheur, génération du contenu par l'IA, relecture humaine, puis publication ou envoi. Le collaborateur passe du rôle de rédacteur à celui de validateur.`,
          `Construisez ce workflow en direct avec les participants sur un cas de ${input.entreprise}.`,
          "Gardez toujours une étape de validation humaine avant l'envoi final.",
        ),
      ],
    },
    {
      titre: "Bonnes pratiques",
      objectif: "Utiliser l'IA de manière responsable, sûre et conforme",
      slides: [
        slide(
          "Confidentialité et RGPD",
          `Ne partagez jamais de données sensibles ou personnelles non anonymisées avec un outil d'IA grand public. Privilégiez des versions professionnelles lorsque c'est nécessaire et respectez le RGPD. La donnée client est précieuse : protégez-la.`,
          `Avant de soumettre un dossier, remplacez les noms réels par « [Client] » et « [Adresse] ».`,
          "Établissez une charte simple de bon usage, affichée et connue de tous.",
        ),
        slide(
          "Esprit critique et vérification",
          `L'IA peut se tromper avec aplomb. Vérifiez systématiquement les chiffres, les faits, les citations et les références juridiques. Vous restez responsable de ce que vous publiez ou envoyez.`,
          `Faites vérifier une donnée chiffrée générée par l'IA à l'aide de Perplexity et de ses sources.`,
          "« Faites confiance, mais vérifiez » : c'est le réflexe à ancrer.",
        ),
      ],
    },
    {
      titre: "Atelier pratique",
      objectif: "Mettre en pratique sur de vrais cas de l'entreprise",
      slides: [
        slide(
          "Atelier guidé",
          `Chaque participant traite un cas concret de son quotidien ${input.secteur}, de la première consigne au livrable finalisé. L'objectif : repartir avec un résultat réellement utilisable dès demain.`,
          `Atelier : réaliser « ${cas[1] ?? cas[0]} » de A à Z, puis présenter son résultat au groupe.`,
          "Circulez, débloquez les participants et valorisez chaque réussite à voix haute.",
        ),
      ],
    },
    {
      titre: "Conclusion",
      objectif: "Ancrer les acquis et engager la suite",
      slides: [
        slide(
          "Synthèse et plan d'action",
          `Récapitulatif des acquis et feuille de route à 30 jours. Chaque participant repart avec ses 3 prompts prioritaires, une liste d'outils adaptés à ses besoins et un premier objectif concret à mettre en œuvre.`,
          `Chacun s'engage sur une action précise : « Dès lundi, j'utilise l'IA pour ${cas[0]}. »`,
          "Proposez un point de suivi à un mois pour ancrer durablement les nouveaux usages.",
        ),
      ],
    },
  ];

  return {
    titre: `Formation à l'intelligence artificielle — ${input.entreprise}`,
    introduction: `Cette formation de ${input.duree} (niveau ${input.niveau}) est entièrement personnalisée pour ${input.entreprise} et le secteur ${input.secteur}. Concrète et opérationnelle, elle rend les équipes autonomes avec les principaux outils d'IA et leur fournit une boîte à outils directement applicable : prompts, automatisations et bonnes pratiques.`,
    modules,
    conclusion: `À l'issue de cette formation, les équipes de ${input.entreprise} maîtrisent les usages clés de l'IA pour le secteur ${input.secteur}, savent choisir le bon outil selon la tâche et disposent d'une bibliothèque de prompts prête à l'emploi. Le gain de temps est immédiat et mesurable dès les premières semaines.`,
  };
}

export function mockExercices(input: { secteur: string }): Exercice[] {
  const cas = useCasesPourSecteur(input.secteur);
  const themes = [
    ...cas,
    "rédaction d'e-mails professionnels",
    "synthèse d'une réunion à partir de notes",
    "création de contenu pour les réseaux sociaux",
    "réponse à une réclamation client",
    "rédaction d'une fiche de poste",
    "création d'un plan de communication",
    "analyse de la concurrence",
  ];
  const out: Exercice[] = [];
  for (let i = 0; i < 10; i++) {
    const t = themes[i % themes.length];
    const outil = recommandeOutil(i);
    out.push({
      titre: `Exercice ${i + 1} — ${capitalize(t)}`,
      consigne: `Avec ${outil} (ou l'outil d'IA de votre choix), réalisez « ${t} » dans le contexte du secteur ${input.secteur}. Soignez le contexte fourni à l'IA, précisez le ton souhaité, puis itérez jusqu'à obtenir un résultat directement utilisable.`,
      corrige: `Corrigé modèle : commencez par définir le rôle (« Agis comme un expert ${input.secteur} »), le contexte précis, la tâche (« ${t} ») et le format attendu. Demandez ensuite une amélioration (ton, longueur, exemple). Le résultat doit toujours être relu et ajusté au ton de l'entreprise avant utilisation. Outil conseillé ici : ${outil}.`,
    });
  }
  return out;
}
