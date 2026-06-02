# Formator AI

> Generez en quelques minutes une formation IA complete, personnalisee et professionnelle pour n'importe quelle entreprise.

Formator AI fait passer la preparation d'une formation IA de **4-8 heures** a **moins de 10 minutes** : un formulaire, un clic, et l'audit, le programme, le support, les exercices, les prompts et le devis sont prets a l'export PDF.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design inspire de Notion / Linear / Stripe (blanc, noir, bleu)
- **Claude API** (Anthropic, prioritaire, avec prompt caching) + **OpenAI** (repli)
- **jsPDF** — export PDF professionnel cote client
- **Supabase** — persistance serveur optionnelle (chemin de production)

> **Une cle IA est requise** pour la generation : renseignez `ANTHROPIC_API_KEY`
> (Claude, prioritaire) ou `OPENAI_API_KEY` (repli) dans `.env.local`. Sans cle,
> l'application affiche un message invitant a la configurer (aucun contenu simule).

## Demarrage

```bash
npm install
cp .env.example .env.local   # (optionnel) renseignez vos cles IA
npm run dev
```

Ouvrez http://localhost:3000.

## Déploiement sur Vercel

Le projet est prêt pour Vercel (zéro configuration, Next.js détecté automatiquement).

1. Sur [vercel.com](https://vercel.com), **Add New → Project** puis importez le dépôt
   GitHub `juanrobin09-stack/FORMATION-IA`.
2. **Framework** : Next.js (auto). **Build** : `next build` (auto). Rien à changer.
3. Onglet **Environment Variables**, ajoutez (au moins une clé IA) :

   | Variable | Exemple |
   |----------|---------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `OPENAI_API_KEY` | `sk-...` (repli, optionnel) |
   | `ANTHROPIC_MODEL` | `claude-sonnet-4-6` (optionnel) |
   | `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (optionnel) |

4. **Deploy**. Chaque `git push` redéploie automatiquement.

> Une clé IA est requise : pensez à renseigner `ANTHROPIC_API_KEY` (ou `OPENAI_API_KEY`)
> dans les variables d'environnement Vercel. La route « formation complète » est
> calibrée à 60 s (limite du plan Hobby).

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Prospects, taux de conversion, CA signe / potentiel |
| **CRM** | Fiches prospects + pipeline (Prospect -> Formation realisee) |
| **Audit IA** | Questionnaire intelligent -> rapport d'opportunites IA |
| **Generateur de formation** | Programme + support de slides + exercices, personnalises au metier |
| **Bibliotheque de prompts** | Prompts metier prets a l'emploi, copiables en un clic |
| **Devis** | Devis PDF professionnel avec signature |
| **Base de connaissances** | Historique recherchable de toutes les productions |
| **Parametres** | Branding (logo, couleurs, nom) applique aux PDF |
| **Formation complete** ✨ | La fonction magique : tout genere en une seule fois |

## Personnalisation metier

Tout le contenu s'adapte automatiquement au secteur (immobilier, restaurant, BTP,
artisan, commerce, PME...). Voir `src/lib/prompts.ts` (`METIER_USE_CASES`).

## Configuration IA

| Variable | Role |
|----------|------|
| `ANTHROPIC_API_KEY` | Active Claude (fournisseur prioritaire) |
| `OPENAI_API_KEY` | Repli si Anthropic absente |
| `ANTHROPIC_MODEL` | Modele Claude (defaut : `claude-sonnet-4-6`) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Persistance Supabase (optionnel) |

## Architecture

```
src/
  app/
    api/generate/{audit,formation,exercices,complete}/  # routes IA (serveur)
    {crm,audit,formation,bibliotheque,devis,...}/        # pages des modules
  components/        # Sidebar, UI partagee
  lib/
    ai.ts            # Anthropic + OpenAI + repli mock
    prompts.ts       # system prompts + personnalisation metier
    pdf.ts           # generation PDF (jsPDF)
    store.ts         # persistance (localStorage en V1)
    supabase.ts      # client + schema SQL (production)
    promptLibrary.ts # bibliotheque de prompts pre-remplie
    types.ts         # modeles de donnees
```

## Persistance

En V1, les donnees (prospects, productions, devis) sont stockees dans le
navigateur (`localStorage`). Pour une persistance serveur, renseignez les cles
Supabase et executez le schema SQL fourni dans `src/lib/supabase.ts`.

## Notes

- V1 mono-utilisateur (un seul formateur), conformement au cahier des charges.
- Les exports PDF sont generes cote client : aucune donnee client n'est envoyee a un serveur tiers (hors appel IA si une cle est configuree).
