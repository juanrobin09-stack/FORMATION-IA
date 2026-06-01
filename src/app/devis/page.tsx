"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { PageHeader, Field } from "@/components/ui";
import { devisStore, brandingStore, uid } from "@/lib/store";
import { pdfDevis } from "@/lib/pdf";
import type { Devis } from "@/lib/types";

const DEFAULT_CONDITIONS =
  "Reglement a 30 jours par virement. Formation realisable en presentiel ou distanciel. Support PDF et attestation inclus. Devis valable 30 jours.";

export default function DevisPage() {
  const [list, setList] = useState<Devis[]>([]);
  const [form, setForm] = useState<Devis>({
    id: "",
    entreprise: "",
    prix: 0,
    duree: "1 journee (7h)",
    nbParticipants: 1,
    conditions: DEFAULT_CONDITIONS,
    date: new Date().toISOString().slice(0, 10),
    createdAt: "",
  });

  useEffect(() => setList(devisStore.all()), []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const d: Devis = { ...form, id: uid(), createdAt: new Date().toISOString() };
    setList(devisStore.save(d));
    pdfDevis(d, brandingStore.get());
  }

  function remove(id: string) {
    setList(devisStore.remove(id));
  }

  return (
    <div>
      <PageHeader title="Generation de devis" subtitle="Creez un devis PDF professionnel en quelques secondes." />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="card space-y-4 p-6">
          <Field label="Nom entreprise">
            <input required className="input" value={form.entreprise}
              onChange={(e) => setForm({ ...form, entreprise: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (EUR)">
              <input type="number" required className="input" value={form.prix || ""}
                onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} />
            </Field>
            <Field label="Nombre de participants">
              <input type="number" className="input" value={form.nbParticipants}
                onChange={(e) => setForm({ ...form, nbParticipants: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duree">
              <input className="input" value={form.duree}
                onChange={(e) => setForm({ ...form, duree: e.target.value })} />
            </Field>
            <Field label="Date">
              <input type="date" className="input" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>
          <Field label="Conditions">
            <textarea className="input min-h-[90px]" value={form.conditions}
              onChange={(e) => setForm({ ...form, conditions: e.target.value })} />
          </Field>
          <button type="submit" className="btn-primary w-full">
            <Download className="h-4 w-4" /> Generer le devis PDF
          </button>
        </form>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-700">Devis enregistres</h2>
          {list.length === 0 ? (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center text-zinc-400">
              <FileText className="mb-3 h-8 w-8" />
              <p className="font-medium text-zinc-600">Aucun devis</p>
            </div>
          ) : (
            <div className="card divide-y divide-zinc-100">
              {list.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium">{d.entreprise}</div>
                    <div className="text-xs text-zinc-400">
                      {d.prix.toLocaleString("fr-FR")} EUR - {d.duree} - {d.nbParticipants} pers.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost" onClick={() => pdfDevis(d, brandingStore.get())}>
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(d.id)} className="text-zinc-300 hover:text-red-500">
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
  );
}
