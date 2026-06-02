"use client";

import { useState } from "react";
import { GraduationCap, Download, Save, Wand2, ListChecks, Presentation as PresentationIcon } from "lucide-react";
import { PageHeader, Field, Spinner, ProviderBadge, ErrorBanner } from "@/components/ui";
import { knowledgeStore, brandingStore, uid } from "@/lib/store";
import { pdfFormation, pdfExercices, pdfSlides } from "@/lib/pdf";
import Presentation from "@/components/Presentation";
import type { Exercice, FormationInput, FormationResult, Niveau } from "@/lib/types";

const NIVEAUX: Niveau[] = ["Debutant", "Intermediaire", "Avance"];
const DUREES = ["Demi-journee (3h30)", "1 journee (7h)", "2 journees (14h)"];

export default function FormationPage() {
  const [input, setInput] = useState<FormationInput>({
    entreprise: "",
    secteur: "",
    nbSalaries: null,
    objectifs: "",
    duree: DUREES[1],
    niveau: "Debutant",
  });
  const [formation, setFormation] = useState<FormationResult | null>(null);
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [provider, setProvider] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [loadingEx, setLoadingEx] = useState(false);
  const [saved, setSaved] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [error, setError] = useState<string>();

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormation(null);
    setExercices([]);
    setSaved(false);
    setError(undefined);
    try {
      const res = await fetch("/api/generate/formation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "La génération a échoué.");
        return;
      }
      setFormation(data.result);
      setProvider(data.provider);
    } catch {
      setError("Impossible de contacter le service de génération. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function generateExercices() {
    setLoadingEx(true);
    setError(undefined);
    try {
      const res = await fetch("/api/generate/exercices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entreprise: input.entreprise,
          secteur: input.secteur,
          niveau: input.niveau,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "La génération des exercices a échoué.");
        return;
      }
      setExercices(data.result);
    } catch {
      setError("Impossible de contacter le service de génération. Réessayez.");
    } finally {
      setLoadingEx(false);
    }
  }

  function save() {
    if (!formation) return;
    knowledgeStore.add({
      id: uid(),
      kind: "formation",
      entreprise: input.entreprise,
      secteur: input.secteur,
      titre: formation.titre,
      createdAt: new Date().toISOString(),
      formation,
      exercices: exercices.length ? exercices : undefined,
    });
    setSaved(true);
  }

  const branding = () => brandingStore.get();
  const meta = () => ({ client: input.entreprise, secteur: input.secteur, branding: branding() });

  return (
    <div>
      <PageHeader
        title="Generateur de formation"
        subtitle="Programme, support de slides et exercices entierement personnalises au metier."
      />

      {error && <ErrorBanner message={error} />}

      <form onSubmit={generate} className="card mb-6 grid gap-4 p-6 md:grid-cols-3">
        <Field label="Entreprise">
          <input required className="input" value={input.entreprise}
            onChange={(e) => setInput({ ...input, entreprise: e.target.value })} />
        </Field>
        <Field label="Secteur">
          <input required className="input" value={input.secteur} placeholder="Immobilier, Restaurant, BTP..."
            onChange={(e) => setInput({ ...input, secteur: e.target.value })} />
        </Field>
        <Field label="Nombre de participants">
          <input type="number" className="input" value={input.nbSalaries ?? ""}
            onChange={(e) => setInput({ ...input, nbSalaries: e.target.value ? Number(e.target.value) : null })} />
        </Field>
        <div className="md:col-span-3">
          <Field label="Objectifs">
            <textarea className="input min-h-[60px]" value={input.objectifs}
              onChange={(e) => setInput({ ...input, objectifs: e.target.value })} />
          </Field>
        </div>
        <Field label="Duree de formation">
          <select className="input" value={input.duree} onChange={(e) => setInput({ ...input, duree: e.target.value })}>
            {DUREES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Niveau des participants">
          <select className="input" value={input.niveau} onChange={(e) => setInput({ ...input, niveau: e.target.value as Niveau })}>
            {NIVEAUX.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Field>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Spinner label="Generation..." /> : <><Wand2 className="h-4 w-4" /> Generer la formation</>}
          </button>
        </div>
      </form>

      {loading && (
        <div className="card flex items-center justify-center py-16">
          <Spinner label="Construction du programme personnalise..." />
        </div>
      )}

      {formation && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{formation.titre}</h2>
                <ProviderBadge provider={provider} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost" onClick={save}>
                  <Save className="h-4 w-4" /> {saved ? "Enregistre" : "Enregistrer"}
                </button>
                <button className="btn-primary" onClick={() => setPresenting(true)}>
                  <PresentationIcon className="h-4 w-4" /> Mode présentation
                </button>
                <button className="btn-ghost" onClick={() => pdfSlides(formation, meta())}>
                  <Download className="h-4 w-4" /> Diapositives PDF
                </button>
                <button className="btn-dark" onClick={() => pdfFormation(formation, meta())}>
                  <Download className="h-4 w-4" /> Support PDF
                </button>
              </div>
            </div>
            <p className="text-sm text-zinc-600">{formation.introduction}</p>
          </div>

          {formation.modules.map((m, i) => (
            <div key={i} className="card p-6">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                Module {i + 1}
              </div>
              <h3 className="text-base font-semibold">{m.titre}</h3>
              <p className="mb-4 text-sm text-zinc-500">{m.objectif}</p>
              <div className="space-y-3">
                {m.slides.map((s, j) => (
                  <div key={j} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="text-sm font-medium">{s.titre}</div>
                    <p className="mt-1 text-sm text-zinc-600">{s.contenu}</p>
                    {s.exemple && (
                      <p className="mt-2 text-sm text-zinc-500">
                        <span className="font-medium text-zinc-700">Exemple : </span>{s.exemple}
                      </p>
                    )}
                    {s.conseils && (
                      <p className="mt-1 text-sm text-zinc-500">
                        <span className="font-medium text-zinc-700">Conseil : </span>{s.conseils}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="card p-6">
            <h3 className="text-base font-semibold">Conclusion</h3>
            <p className="mt-1 text-sm text-zinc-600">{formation.conclusion}</p>
          </div>

          {/* Exercices */}
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Exercices pratiques</h3>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={generateExercices} disabled={loadingEx}>
                  {loadingEx ? <Spinner label="Generation..." /> : <><ListChecks className="h-4 w-4" /> Generer 10 exercices</>}
                </button>
                {exercices.length > 0 && (
                  <button className="btn-dark" onClick={() => pdfExercices(exercices, meta())}>
                    <Download className="h-4 w-4" /> PDF
                  </button>
                )}
              </div>
            </div>
            {exercices.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Generez 10 exercices avec corriges adaptes au secteur {input.secteur || "du client"}.
              </p>
            ) : (
              <div className="space-y-3">
                {exercices.map((ex, i) => (
                  <details key={i} className="rounded-lg border border-zinc-100 p-4">
                    <summary className="cursor-pointer text-sm font-medium">{ex.titre}</summary>
                    <p className="mt-2 text-sm text-zinc-600">{ex.consigne}</p>
                    <p className="mt-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                      <span className="font-medium">Corrige : </span>{ex.corrige}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!formation && !loading && (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center text-zinc-400">
          <GraduationCap className="mb-3 h-8 w-8" />
          <p className="font-medium text-zinc-600">Votre formation apparaitra ici</p>
        </div>
      )}

      {presenting && formation && (
        <Presentation
          formation={formation}
          client={input.entreprise}
          secteur={input.secteur}
          branding={brandingStore.get()}
          onClose={() => setPresenting(false)}
        />
      )}
    </div>
  );
}
