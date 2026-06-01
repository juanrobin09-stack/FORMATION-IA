"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Trash2, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader, Field } from "@/components/ui";
import { devisStore, brandingStore } from "@/lib/store";
import { createDevis, defaultLigne } from "@/lib/devis";
import { pdfDevis } from "@/lib/pdf";
import { calcDevis, type Devis, type DevisLigne } from "@/lib/types";

function money(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[\u202f\u00a0\u2009\u2007]/g, " ") + " €";
}

export default function DevisPage() {
  const [list, setList] = useState<Devis[]>([]);
  const [form, setForm] = useState<Devis | null>(null);

  useEffect(() => {
    setList(devisStore.all());
    setForm(createDevis(brandingStore.get()));
  }, []);

  if (!form) return null;
  const totaux = calcDevis(form);

  function set<K extends keyof Devis>(k: K, v: Devis[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }
  function setLigne(i: number, patch: Partial<DevisLigne>) {
    setForm((f) => {
      if (!f) return f;
      const lignes = f.lignes.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
      return { ...f, lignes };
    });
  }
  function addLigne() {
    setForm((f) => (f ? { ...f, lignes: [...f.lignes, defaultLigne({ prixUnitaireHT: 0 })] } : f));
  }
  function removeLigne(i: number) {
    setForm((f) => (f ? { ...f, lignes: f.lignes.filter((_, idx) => idx !== i) } : f));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setList(devisStore.save(form));
    await pdfDevis(form, brandingStore.get());
    // Prepare un nouveau devis numerote pour la saisie suivante
    setForm(createDevis(brandingStore.get()));
  }

  function remove(id: string) {
    setList(devisStore.remove(id));
  }

  const b = brandingStore.get();
  const brandingIncomplet = !b.siret || !b.adresse;

  return (
    <div>
      <PageHeader title="Génération de devis" subtitle="Devis PDF professionnel conforme aux mentions légales françaises." />

      {brandingIncomplet && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            Pour un devis conforme, complétez votre identité de prestataire (SIRET, adresse, mentions TVA) dans les{" "}
            <Link href="/parametres" className="font-medium underline">Paramètres</Link>.
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="card space-y-5 p-6 lg:col-span-2">
          {/* Client */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">Client</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Raison sociale / Nom">
                <input required className="input" value={form.entreprise} onChange={(e) => set("entreprise", e.target.value)} />
              </Field>
              <Field label="Contact (nom, email)">
                <input className="input" value={form.clientContact} onChange={(e) => set("clientContact", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Adresse du client">
                  <input className="input" value={form.clientAdresse} onChange={(e) => set("clientAdresse", e.target.value)} placeholder="N°, rue, code postal, ville" />
                </Field>
              </div>
            </div>
          </div>

          {/* Prestation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">Prestation</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date de prestation">
                <input type="date" className="input" value={form.dateExecution} onChange={(e) => set("dateExecution", e.target.value)} />
              </Field>
              <Field label="Lieu d'exécution">
                <input className="input" value={form.lieuExecution} onChange={(e) => set("lieuExecution", e.target.value)} placeholder="Présentiel / Distanciel" />
              </Field>
              <Field label="Durée">
                <input className="input" value={form.duree} onChange={(e) => set("duree", e.target.value)} />
              </Field>
              <Field label="Nombre de participants">
                <input type="number" className="input" value={form.nbParticipants} onChange={(e) => set("nbParticipants", Number(e.target.value))} />
              </Field>
            </div>
          </div>

          {/* Lignes */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-700">Lignes du devis</h3>
              <button type="button" className="btn-ghost" onClick={addLigne}>
                <Plus className="h-4 w-4" /> Ligne
              </button>
            </div>
            <div className="space-y-2">
              {form.lignes.map((l, i) => (
                <div key={i} className="grid grid-cols-12 items-end gap-2">
                  <div className="col-span-12 sm:col-span-6">
                    <input className="input" placeholder="Désignation" value={l.designation} onChange={(e) => setLigne(i, { designation: e.target.value })} />
                  </div>
                  <div className="col-span-3 sm:col-span-1">
                    <input type="number" className="input" title="Quantité" value={l.quantite} onChange={(e) => setLigne(i, { quantite: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input className="input" title="Unité" value={l.unite} onChange={(e) => setLigne(i, { unite: e.target.value })} />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" className="input" title="P.U. HT" value={l.prixUnitaireHT} onChange={(e) => setLigne(i, { prixUnitaireHT: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-1 flex justify-center pb-2">
                    {form.lignes.length > 1 && (
                      <button type="button" onClick={() => removeLigne(i)} className="text-zinc-300 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TVA & conditions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Taux de TVA (%)">
              <input type="number" className="input" value={form.tvaRate} disabled={form.franchiseTVA} onChange={(e) => set("tvaRate", Number(e.target.value))} />
            </Field>
            <Field label="Acompte (%)">
              <input type="number" className="input" value={form.acompte} onChange={(e) => set("acompte", Number(e.target.value))} />
            </Field>
            <Field label="Validité (jours)">
              <input type="number" className="input" value={form.validiteJours} onChange={(e) => set("validiteJours", Number(e.target.value))} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input type="checkbox" checked={form.franchiseTVA} onChange={(e) => set("franchiseTVA", e.target.checked)} />
            Franchise en base de TVA (art. 293 B du CGI — auto-entrepreneur)
          </label>
          <Field label="Conditions de règlement">
            <textarea className="input min-h-[70px]" value={form.conditions} onChange={(e) => set("conditions", e.target.value)} />
          </Field>

          <button type="submit" className="btn-primary w-full">
            <Download className="h-4 w-4" /> Générer le devis PDF
          </button>
        </form>

        {/* Recap + liste */}
        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-1 text-xs text-zinc-400">{form.numero}</div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Total HT</span><span>{money(totaux.totalHT)}</span></div>
              <div className="flex justify-between">
                <span className="text-zinc-500">TVA {form.franchiseTVA ? "(franchise)" : `${form.tvaRate} %`}</span>
                <span>{form.franchiseTVA ? "—" : money(totaux.montantTVA)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-1.5 text-base font-semibold">
                <span>Total TTC</span><span className="text-brand-600">{money(totaux.totalTTC)}</span>
              </div>
              {form.acompte > 0 && (
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Acompte {form.acompte} %</span><span>{money(totaux.montantAcompte)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-zinc-700">Devis enregistrés</h2>
            {list.length === 0 ? (
              <div className="card flex flex-col items-center justify-center px-6 py-12 text-center text-zinc-400">
                <FileText className="mb-3 h-8 w-8" />
                <p className="text-sm font-medium text-zinc-600">Aucun devis</p>
              </div>
            ) : (
              <div className="card divide-y divide-zinc-100">
                {list.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{d.entreprise || "—"}</div>
                      <div className="text-xs text-zinc-400">{d.numero} · {money(calcDevis(d).totalTTC)} TTC</div>
                    </div>
                    <div className="flex gap-1">
                      <button className="btn-ghost px-2" onClick={() => pdfDevis(d, brandingStore.get())}>
                        <Download className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(d.id)} className="px-2 text-zinc-300 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
