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
  FileText,
  Award,
  Presentation as PresentationIcon,
} from "lucide-react";
import { PageHeader, Field, ProviderBadge, ErrorBanner } from "@/components/ui";
import { knowledgeStore, devisStore, brandingStore, uid } from "@/lib/store";
import { createDevis, defaultLigne } from "@/lib/devis";
import { pdfAudit, pdfFormation, pdfExercices, pdfDevis, pdfAttestation, pdfSlides } from "@/lib/pdf";
import Presentation from "@/components/Presentation";
import type { AuditResult, Devis, Exercice, FormationResult, Niveau } from "@/lib/types";

const NIVEAUX: Niveau[] = ["Debutant", "Intermediaire", "Avance"];
const STEPS = ["Audit", "Programme", "Support", "Exercices", "Prompts", "Devis", "PDF"];

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
  const [prix, setPrix] = useState(1200);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [devisObj, setDevisObj] = useState<Devis | null>(null);
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
    // Animation de progression pendant l'appel reel
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 700);
    try {
      const res = await fetch("/api/generate/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entreprise, secteur, objectifs, niveau }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "La génération a échoué.");
        return;
      }
      setResult(data);
      // Construit le devis associe (numerote, pre-rempli)
      setDevisObj(
        createDevis(brandingStore.get(), {
          entreprise,
          duree: "1 journée (7h)",
          nbParticipants: 6,
          lignes: [
            defaultLigne({
              designation: `Formation IA personnalisée — ${entreprise} (${secteur})`,
              prixUnitaireHT: prix,
            }),
          ],
        }),
      );
      setStep(STEPS.length);
    } catch {
      setError("Impossible de contacter le service de génération. Réessayez.");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  const branding = () => brandingStore.get();
  const meta = () => ({ client: entreprise, secteur, branding: branding() });

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
    if (devisObj) devisStore.save(devisObj);
    setSaved(true);
  }

  return (
    <div>
      <PageHeader
        title="Creer une formation complete"
        subtitle="Audit, programme, support, exercices, prompts et devis - generes en une seule fois."
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
          <Field label="Prix du devis (EUR)">
            <input type="number" className="input" value={prix} onChange={(e) => setPrix(Number(e.target.value))} />
          </Field>
        </div>
        <button type="submit" className="btn-dark mt-5 w-full py-3 text-base" disabled={loading}>
          <Sparkles className="h-5 w-5" />
          {loading ? "Generation en cours..." : "Generer la formation complete"}
        </button>
      </form>

      {(loading || result) && (
        <div className="card mb-6 p-6">
          <div className="flex flex-wrap gap-3">
            {STEPS.map((s, i) => {
              const done = step > i || (result && i < STEPS.length);
              const active = loading && step === i;
              return (
                <div key={s} className="flex items-center gap-2 text-sm">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={done ? "text-zinc-700" : "text-zinc-400"}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-50 text-emerald-700">
                <Check className="mr-1 h-3.5 w-3.5" /> Formation complete prete
              </span>
              <ProviderBadge provider={result.provider} />
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={() => setPresenting(true)}>
                <PresentationIcon className="h-4 w-4" /> Présenter
              </button>
              <button className="btn-primary" onClick={saveAll}>
                <Save className="h-4 w-4" /> {saved ? "Tout enregistre" : "Tout enregistrer"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ExportCard icon={ClipboardCheck} title="Audit IA"
              desc={`${result.audit.opportunites.length} opportunites identifiees`}
              onExport={() => pdfAudit(result.audit, meta())} />
            <ExportCard icon={GraduationCap} title="Support de formation"
              desc={`${result.formation.modules.length} modules personnalises`}
              onExport={() => pdfFormation(result.formation, meta())} />
            <ExportCard icon={PresentationIcon} title="Diapositives 16:9"
              desc="Support à projeter en session"
              onExport={() => pdfSlides(result.formation, meta())} />
            <ExportCard icon={ListChecks} title="Exercices"
              desc={`${result.exercices.length} exercices avec corriges`}
              onExport={() => pdfExercices(result.exercices, meta())} />
            <ExportCard icon={FileText} title="Devis"
              desc={devisObj ? `${devisObj.numero}` : `${prix} €`}
              onExport={() => devisObj && pdfDevis(devisObj, branding())} />
            <ExportCard icon={Award} title="Attestation"
              desc="Attestation de formation"
              onExport={() => pdfAttestation({ ...meta(), intitule: result.formation.titre, duree: "1 journee (7h)" })} />
          </div>

          {/* Apercu */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold">{result.formation.titre}</h2>
            <p className="mt-1 text-sm text-zinc-600">{result.formation.introduction}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {result.formation.modules.map((m, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-2.5 text-sm">
                  <span className="font-medium">Module {i + 1} :</span> {m.titre}
                </div>
              ))}
            </div>
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
  icon: Icon, title, desc, onExport,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; onExport: () => void;
}) {
  return (
    <div className="card flex flex-col p-5">
      <Icon className="h-5 w-5 text-brand-600" />
      <div className="mt-3 font-medium">{title}</div>
      <div className="mb-3 flex-1 text-sm text-zinc-400">{desc}</div>
      <button className="btn-dark self-start" onClick={onExport}>
        <Download className="h-4 w-4" /> Exporter PDF
      </button>
    </div>
  );
}
