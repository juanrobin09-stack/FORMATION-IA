"use client";

import { useState } from "react";
import {
  Sparkles,
  Check,
  Download,
  Save,
  ClipboardCheck,
  GraduationCap,
  ListChecks,
  Award,
  Presentation as PresentationIcon,
} from "lucide-react";
import { PageHeader, Field, ProviderBadge, ErrorBanner } from "@/components/ui";
import { knowledgeStore, brandingStore, uid } from "@/lib/store";
import { pdfAudit, pdfFormation, pdfExercices, pdfAttestation, pdfSlides } from "@/lib/pdf";
import Presentation from "@/components/Presentation";
import type { AuditResult, Exercice, FormationResult, Niveau } from "@/lib/types";

const NIVEAUX: Niveau[] = ["Debutant", "Intermediaire", "Avance"];
const STEPS = ["Audit IA", "Programme & support", "Exercices"];

interface Result {
  audit: AuditResult;
  formation: FormationResult;
  exercices: Exercice[];
  provider: string;
}

export default function MagiquePage() {
  const [entreprise, setEntreprise] = useState("");
  const [secteur, setSecteur] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [niveau, setNiveau] = useState<Niveau>("Debutant");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [error, setError] = useState<string>();

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSaved(false);
    setError(undefined);
    setStep(0);
    try {
      // Appels SEQUENTIELS : on évite de saturer la limite de débit Anthropic,
      // et chaque appel reste largement sous les 60 s.
      const post = async (url: string, body: unknown) => {
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const text = await r.text();
        let j: { error?: string; result?: unknown; provider?: string } = {};
        try {
          j = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            r.status === 504
              ? "Délai dépassé (timeout). La génération est trop longue — réessaie."
              : `Erreur ${r.status} : ${text.slice(0, 140)}`,
          );
        }
        if (!r.ok) throw new Error(j?.error || `Erreur ${r.status}`);
        return j;
      };

      const a = await post("/api/generate/audit", {
        entreprise, secteur, activite: objectifs, tachesRepetitives: "",
        outils: "", difficultes: "", niveauEquipes: niveau, objectifs,
      });
      setStep(1);
      const f = await post("/api/generate/formation", {
        entreprise, secteur, nbSalaries: null, objectifs,
        duree: "1 journée (7h)", niveau,
      });
      setStep(2);
      const ex = await post("/api/generate/exercices", { entreprise, secteur, niveau });
      setStep(3);

      setResult({
        audit: a.result as AuditResult,
        formation: f.result as FormationResult,
        exercices: (ex.result as Exercice[]) ?? [],
        provider: f.provider ?? "anthropic",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de contacter le service de génération. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const meta = () => ({ client: entreprise, secteur, branding: brandingStore.get() });

  function saveAll() {
    if (!result) return;
    knowledgeStore.add({
      id: uid(), kind: "formation", entreprise, secteur,
      titre: result.formation.titre, createdAt: new Date().toISOString(),
      formation: result.formation, exercices: result.exercices,
    });
    knowledgeStore.add({
      id: uid(), kind: "audit", entreprise, secteur,
      titre: `Audit IA - ${entreprise}`, createdAt: new Date().toISOString(),
      audit: result.audit,
    });
    setSaved(true);
  }

  const modules = result?.formation?.modules ?? [];

  return (
    <div>
      <PageHeader
        title="Créer une formation complète"
        subtitle="Audit, programme, support de slides et exercices — générés en une seule fois."
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={generate} className="card mb-6 p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
          <Sparkles className="h-5 w-5 text-brand-600" /> Fonction magique
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Entreprise">
            <input required className="input" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
          </Field>
          <Field label="Secteur">
            <input required className="input" value={secteur} placeholder="Immobilier, Restaurant, BTP..."
              onChange={(e) => setSecteur(e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Objectifs">
              <textarea className="input min-h-[60px]" value={objectifs}
                onChange={(e) => setObjectifs(e.target.value)} placeholder="Ce que le client souhaite accomplir avec l'IA..." />
            </Field>
          </div>
          <Field label="Niveau des participants">
            <select className="input" value={niveau} onChange={(e) => setNiveau(e.target.value as Niveau)}>
              {NIVEAUX.map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
        </div>
        <button type="submit" className="btn-dark mt-5 w-full py-3 text-base" disabled={loading}>
          <Sparkles className="h-5 w-5" />
          {loading ? "Génération en cours..." : "Générer la formation complète"}
        </button>
      </form>

      {(loading || result) && (
        <div className="card mb-6 p-6">
          <div className="flex flex-wrap gap-6">
            {STEPS.map((s, i) => {
              const done = step > i;
              const active = loading && step === i;
              return (
                <div key={s} className="flex items-center gap-2 text-sm">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white animate-pulse" : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={done || active ? "text-zinc-700" : "text-zinc-400"}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Barre d'actions */}
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-50 text-emerald-700">
                <Check className="mr-1 h-3.5 w-3.5" /> Formation prête
              </span>
              <ProviderBadge provider={result.provider} />
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={() => setPresenting(true)}>
                <PresentationIcon className="h-4 w-4" /> Présenter
              </button>
              <button className="btn-primary" onClick={saveAll}>
                <Save className="h-4 w-4" /> {saved ? "Enregistré" : "Tout enregistrer"}
              </button>
            </div>
          </div>

          {/* Exports */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ExportCard icon={ClipboardCheck} title="Audit IA"
              desc={`${result.audit?.opportunites?.length ?? 0} opportunités`}
              onExport={() => pdfAudit(result.audit, meta())} />
            <ExportCard icon={GraduationCap} title="Support"
              desc={`${modules.length} modules`}
              onExport={() => pdfFormation(result.formation, meta())} />
            <ExportCard icon={PresentationIcon} title="Diapositives" highlight
              desc="À projeter en session"
              onExport={() => pdfSlides(result.formation, meta())} />
            <ExportCard icon={ListChecks} title="Exercices"
              desc={`${result.exercices?.length ?? 0} avec corrigés`}
              onExport={() => pdfExercices(result.exercices, meta())} />
          </div>

          {/* Aperçu de la formation */}
          <div className="card overflow-hidden">
            <div className="border-b border-zinc-100 bg-zinc-50/60 px-6 py-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">Programme</div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">{result.formation.titre}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{result.formation.introduction}</p>
            </div>
            <div className="divide-y divide-zinc-100">
              {modules.map((m, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-medium text-white">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-medium">{m.titre}</div>
                      <div className="text-sm text-zinc-500">{m.objectif}</div>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1 pl-8">
                    {(m.slides ?? []).map((s, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-zinc-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> {s.titre}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu de l'audit */}
          <div className="card p-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">Audit IA — points clés</div>
            <p className="text-sm leading-relaxed text-zinc-600">{result.audit.resumeEntreprise}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(result.audit.opportunites ?? []).map((o, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
                  <div className="text-sm font-medium">{o.titre}</div>
                  <div className="mt-0.5 text-sm text-zinc-500">{o.description}</div>
                </div>
              ))}
            </div>
            {result.audit.gainsTemps && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                <span className="font-medium">Gains de temps estimés : </span>{result.audit.gainsTemps}
              </div>
            )}
          </div>

          {/* Aperçu des exercices */}
          {result.exercices?.length > 0 && (
            <div className="card p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Exercices pratiques ({result.exercices.length})
              </div>
              <ol className="grid gap-2 sm:grid-cols-2">
                {result.exercices.map((ex, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600">
                    <span className="font-medium text-zinc-400">{i + 1}.</span> {ex.titre}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Attestation */}
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-brand-600" />
              <div className="text-sm text-zinc-600">
                Générer une <span className="font-medium text-ink">attestation de fin de formation</span> (preuve de suivi).
              </div>
            </div>
            <button className="btn-ghost" onClick={() => pdfAttestation({ ...meta(), intitule: result.formation.titre, duree: "1 journée (7h)" })}>
              <Download className="h-4 w-4" /> Attestation PDF
            </button>
          </div>
        </div>
      )}

      {presenting && result && (
        <Presentation
          formation={result.formation}
          client={entreprise}
          secteur={secteur}
          branding={brandingStore.get()}
          onClose={() => setPresenting(false)}
        />
      )}
    </div>
  );
}

function ExportCard({
  icon: Icon, title, desc, onExport, highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; onExport: () => void; highlight?: boolean;
}) {
  return (
    <div className={`card flex flex-col p-5 ${highlight ? "ring-1 ring-brand-200" : ""}`}>
      <Icon className="h-5 w-5 text-brand-600" />
      <div className="mt-3 font-medium">{title}</div>
      <div className="mb-3 flex-1 text-sm text-zinc-400">{desc}</div>
      <button className="btn-dark self-start" onClick={onExport}>
        <Download className="h-4 w-4" /> PDF
      </button>
    </div>
  );
}
