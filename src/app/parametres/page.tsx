"use client";

import { useEffect, useState } from "react";
import { Check, Upload, Palette } from "lucide-react";
import { PageHeader, Field } from "@/components/ui";
import { brandingStore, DEFAULT_BRANDING } from "@/lib/store";
import type { Branding } from "@/lib/types";

const PRESETS = ["#2563eb", "#0a0a0a", "#7c3aed", "#059669", "#dc2626", "#ea580c"];

export default function ParametresPage() {
  const [b, setB] = useState<Branding>(DEFAULT_BRANDING);
  const [saved, setSaved] = useState(false);

  useEffect(() => setB(brandingStore.get()), []);

  function set<K extends keyof Branding>(k: K, v: Branding[K]) {
    setB((prev) => ({ ...prev, [k]: v }));
  }

  function save() {
    brandingStore.set(b);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader
        title="Paramètres"
        subtitle="Identité, coordonnées et mentions légales appliquées à vos PDF et devis."
        action={
          <button className="btn-primary" onClick={save}>
            {saved ? <><Check className="h-4 w-4" /> Enregistré</> : "Enregistrer"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Identité */}
          <Card title="Identité du prestataire">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Raison sociale / nom commercial">
                <input className="input" value={b.cabinet} onChange={(e) => set("cabinet", e.target.value)} />
              </Field>
              <Field label="Forme juridique">
                <input className="input" value={b.formeJuridique} onChange={(e) => set("formeJuridique", e.target.value)} placeholder="Auto-entrepreneur, SARL..." />
              </Field>
            </div>
          </Card>

          {/* Coordonnées */}
          <Card title="Coordonnées">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Adresse">
                  <input className="input" value={b.adresse} onChange={(e) => set("adresse", e.target.value)} placeholder="N° et rue" />
                </Field>
              </div>
              <Field label="Code postal et ville">
                <input className="input" value={b.codePostalVille} onChange={(e) => set("codePostalVille", e.target.value)} />
              </Field>
              <Field label="Téléphone">
                <input className="input" value={b.telephone} onChange={(e) => set("telephone", e.target.value)} />
              </Field>
              <Field label="Email">
                <input type="email" className="input" value={b.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="IBAN (pour le règlement)">
                <input className="input" value={b.iban} onChange={(e) => set("iban", e.target.value)} />
              </Field>
            </div>
          </Card>

          {/* Mentions légales */}
          <Card title="Mentions légales & facturation">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SIRET">
                <input className="input" value={b.siret} onChange={(e) => set("siret", e.target.value)} />
              </Field>
              <Field label="RCS / RM (+ ville)">
                <input className="input" value={b.rcsRm} onChange={(e) => set("rcsRm", e.target.value)} placeholder="RCS Paris 123 456 789" />
              </Field>
              <Field label="N° TVA intracommunautaire">
                <input className="input" value={b.tvaIntra} onChange={(e) => set("tvaIntra", e.target.value)} placeholder="FR12345678901" disabled={b.franchiseTVA} />
              </Field>
              <Field label="Taux de TVA par défaut (%)">
                <input type="number" className="input" value={b.tvaRate} onChange={(e) => set("tvaRate", Number(e.target.value))} disabled={b.franchiseTVA} />
              </Field>
              <Field label="Validité des devis (jours)">
                <input type="number" className="input" value={b.validiteJours} onChange={(e) => set("validiteJours", Number(e.target.value))} />
              </Field>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-zinc-600">
                  <input type="checkbox" checked={b.franchiseTVA} onChange={(e) => set("franchiseTVA", e.target.checked)} />
                  Franchise en base de TVA (293 B du CGI)
                </label>
              </div>
              <div className="sm:col-span-2">
                <Field label="Conditions de règlement par défaut">
                  <textarea className="input min-h-[70px]" value={b.conditionsReglement} onChange={(e) => set("conditionsReglement", e.target.value)} />
                </Field>
              </div>
            </div>
          </Card>

          {/* Apparence */}
          <Card title="Apparence des documents">
            <div className="space-y-4">
              <Field label="Couleur principale">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {PRESETS.map((c) => (
                      <button key={c} type="button" onClick={() => set("couleur", c)}
                        className="h-8 w-8 rounded-full border-2 transition"
                        style={{ backgroundColor: c, borderColor: b.couleur === c ? "#0a0a0a" : "transparent" }}
                        aria-label={c} />
                    ))}
                  </div>
                  <input type="color" value={b.couleur} onChange={(e) => set("couleur", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-zinc-200" />
                </div>
              </Field>
              <Field label="Logo (PNG)" hint="Apparaît sur la couverture des documents et l'en-tête des devis.">
                <label className="btn-ghost cursor-pointer">
                  <Upload className="h-4 w-4" /> Importer un logo
                  <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onLogo} />
                </label>
              </Field>
            </div>
          </Card>
        </div>

        {/* Aperçu en-tête */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 p-6 text-white" style={{ backgroundColor: b.couleur }}>
              {b.logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logoDataUrl} alt="logo" className="h-12 w-12 rounded bg-white/10 object-contain" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10">
                  <Palette className="h-6 w-6" />
                </div>
              )}
              <div>
                <div className="text-xs opacity-70">{(b.cabinet || "").toUpperCase()}</div>
                <div className="text-lg font-semibold">Document professionnel</div>
              </div>
            </div>
            <div className="space-y-1 p-5 text-xs text-zinc-500">
              <p className="font-medium text-zinc-700">{b.cabinet} {b.formeJuridique && `— ${b.formeJuridique}`}</p>
              {b.adresse && <p>{b.adresse}, {b.codePostalVille}</p>}
              {b.siret && <p>SIRET {b.siret}</p>}
              {b.tvaIntra && !b.franchiseTVA && <p>TVA {b.tvaIntra}</p>}
              {b.franchiseTVA && <p>TVA non applicable, art. 293 B du CGI</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">{title}</h3>
      {children}
    </div>
  );
}
