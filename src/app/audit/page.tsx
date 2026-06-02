"use client";

import { useState } from "react";
import { ClipboardCheck, Download, Save, Wand2 } from "lucide-react";
import { PageHeader, Field, Spinner, ProviderBadge, ErrorBanner } from "@/components/ui";
import { knowledgeStore, brandingStore, uid } from "@/lib/store";
import { pdfAudit } from "@/lib/pdf";
import type { AuditInput, AuditResult, Niveau } from "@/lib/types";

const NIVEAUX: Niveau[] = ["Debutant", "Intermediaire", "Avance"];

export default function AuditPage() {
  const [input, setInput] = useState<AuditInput>({
    entreprise: "",
    secteur: "",
    activite: "",
    tachesRepetitives: "",
    outils: "",
    difficultes: "",
    niveauEquipes: "Debutant",
    objectifs: "",
  });
  const [result, setResult] = useState<AuditResult | null>(null);
  const [provider, setProvider] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSaved(false);
    setError(undefined);
    try {
      const res = await fetch("/api/generate/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "La génération a échoué.");
        return;
      }
      setResult(data.result);
      setProvider(data.provider);
    } catch {
      setError("Impossible de contacter le service de génération. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!result) return;
    knowledgeStore.add({
      id: uid(),
      kind: "audit",
      entreprise: input.entreprise,
      secteur: input.secteur,
      titre: `Audit IA - ${input.entreprise}`,
      createdAt: new Date().toISOString(),
      audit: result,
    });
    setSaved(true);
  }

  async function exportPdf() {
    if (!result) return;
    await pdfAudit(result, {
      client: input.entreprise,
      secteur: input.secteur,
      branding: brandingStore.get(),
    });
  }

  const set = (k: keyof AuditInput) => (e: { target: { value: string } }) =>
    setInput({ ...input, [k]: e.target.value });

  return (
    <div>
      <PageHeader
        title="Audit IA"
        subtitle="Questionnaire intelligent pour diagnostiquer les opportunites IA d'un client."
      />

      {error && <ErrorBanner message={error} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={generate} className="card space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Entreprise">
              <input required className="input" value={input.entreprise} onChange={set("entreprise")} />
            </Field>
            <Field label="Secteur">
              <input required className="input" value={input.secteur} onChange={set("secteur")} placeholder="Immobilier, BTP..." />
            </Field>
          </div>
          <Field label="Activite de l'entreprise">
            <textarea className="input min-h-[60px]" value={input.activite} onChange={set("activite")} />
          </Field>
          <Field label="Taches repetitives">
            <textarea className="input min-h-[60px]" value={input.tachesRepetitives} onChange={set("tachesRepetitives")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Outils utilises">
              <input className="input" value={input.outils} onChange={set("outils")} />
            </Field>
            <Field label="Niveau IA des equipes">
              <select className="input" value={input.niveauEquipes} onChange={set("niveauEquipes")}>
                {NIVEAUX.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Difficultes rencontrees">
            <textarea className="input min-h-[60px]" value={input.difficultes} onChange={set("difficultes")} />
          </Field>
          <Field label="Objectifs recherches">
            <textarea className="input min-h-[60px]" value={input.objectifs} onChange={set("objectifs")} />
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Spinner label="Generation..." /> : <><Wand2 className="h-4 w-4" /> Generer l'audit</>}
          </button>
        </form>

        <div>
          {!result && !loading && (
            <div className="card flex h-full flex-col items-center justify-center px-6 py-16 text-center text-zinc-400">
              <ClipboardCheck className="mb-3 h-8 w-8" />
              <p className="font-medium text-zinc-600">Le rapport d'audit apparaitra ici</p>
              <p className="mt-1 text-sm">Remplissez le questionnaire puis cliquez sur Generer.</p>
            </div>
          )}
          {loading && (
            <div className="card flex h-full items-center justify-center py-16">
              <Spinner label="Analyse en cours..." />
            </div>
          )}
          {result && (
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <ProviderBadge provider={provider} />
                <div className="flex gap-2">
                  <button className="btn-ghost" onClick={save}>
                    <Save className="h-4 w-4" /> {saved ? "Enregistre" : "Enregistrer"}
                  </button>
                  <button className="btn-dark" onClick={exportPdf}>
                    <Download className="h-4 w-4" /> PDF
                  </button>
                </div>
              </div>

              <Section title="Resume de l'entreprise">
                <p className="text-sm text-zinc-600">{result.resumeEntreprise}</p>
              </Section>
              <Section title="Opportunites IA">
                <div className="space-y-3">
                  {result.opportunites.map((o, i) => (
                    <div key={i}>
                      <div className="text-sm font-medium">{o.titre}</div>
                      <div className="text-sm text-zinc-500">{o.description}</div>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Gains de temps estimes">
                <p className="text-sm text-zinc-600">{result.gainsTemps}</p>
              </Section>
              <Section title="Cas d'usage recommandes">
                <div className="space-y-3">
                  {result.casUsage.map((c, i) => (
                    <div key={i}>
                      <div className="text-sm font-medium">{c.titre}</div>
                      <div className="text-sm text-zinc-500">{c.description}</div>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Priorites">
                <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                  {result.priorites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-zinc-100 py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">{title}</h3>
      {children}
    </div>
  );
}
