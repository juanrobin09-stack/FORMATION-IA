"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { PageHeader, Field, EmptyState } from "@/components/ui";
import { prospectStore, uid } from "@/lib/store";
import {
  PROSPECT_STATUTS,
  type Prospect,
  type ProspectStatut,
} from "@/lib/types";

const STATUT_COLORS: Record<ProspectStatut, string> = {
  Prospect: "bg-zinc-100 text-zinc-600",
  Contacte: "bg-blue-50 text-blue-700",
  "RDV fixe": "bg-indigo-50 text-indigo-700",
  "Proposition envoyee": "bg-amber-50 text-amber-700",
  "Client signe": "bg-emerald-50 text-emerald-700",
  "Formation realisee": "bg-emerald-100 text-emerald-800",
};

const EMPTY: Prospect = {
  id: "",
  entreprise: "",
  secteur: "",
  nbSalaries: null,
  contact: "",
  telephone: "",
  email: "",
  besoin: "",
  dateRdv: "",
  statut: "Prospect",
  montant: null,
  createdAt: "",
};

export default function CrmPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Prospect>(EMPTY);

  useEffect(() => setProspects(prospectStore.all()), []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p: Prospect = {
      ...form,
      id: form.id || uid(),
      createdAt: form.createdAt || new Date().toISOString(),
    };
    setProspects(prospectStore.save(p));
    setOpen(false);
    setForm(EMPTY);
  }

  function updateStatut(p: Prospect, statut: ProspectStatut) {
    setProspects(prospectStore.save({ ...p, statut }));
  }

  function remove(id: string) {
    setProspects(prospectStore.remove(id));
  }

  return (
    <div>
      <PageHeader
        title="CRM"
        subtitle="Suivez vos prospects, du premier contact a la formation realisee."
        action={
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setOpen(true); }}>
            <Plus className="h-4 w-4" /> Nouveau prospect
          </button>
        }
      />

      {prospects.length === 0 ? (
        <EmptyState
          title="Aucun prospect"
          description="Ajoutez votre premier prospect pour suivre votre pipeline commercial."
          icon={<Plus className="h-8 w-8" />}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3 font-medium">Entreprise</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Besoin</th>
                  <th className="px-4 py-3 font-medium">RDV</th>
                  <th className="px-4 py-3 font-medium">Montant</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {prospects.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{p.entreprise}</div>
                      <div className="text-xs text-zinc-400">
                        {p.secteur}
                        {p.nbSalaries ? ` - ${p.nbSalaries} sal.` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      <div>{p.contact}</div>
                      <div className="text-xs text-zinc-400">{p.email || p.telephone}</div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-zinc-600">{p.besoin}</td>
                    <td className="px-4 py-3 text-zinc-600">
                      {p.dateRdv ? new Date(p.dateRdv).toLocaleDateString("fr-FR") : "-"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {p.montant ? `${p.montant.toLocaleString("fr-FR")} EUR` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.statut}
                        onChange={(e) => updateStatut(p, e.target.value as ProspectStatut)}
                        className={`badge cursor-pointer border-0 ${STATUT_COLORS[p.statut]}`}
                      >
                        {PROSPECT_STATUTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => remove(p.id)}
                        className="text-zinc-300 transition hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nouveau prospect</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Nom entreprise">
                  <input
                    required
                    className="input"
                    value={form.entreprise}
                    onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Secteur">
                <input
                  className="input"
                  value={form.secteur}
                  onChange={(e) => setForm({ ...form, secteur: e.target.value })}
                />
              </Field>
              <Field label="Nombre de salaries">
                <input
                  type="number"
                  className="input"
                  value={form.nbSalaries ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, nbSalaries: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </Field>
              <Field label="Contact">
                <input
                  className="input"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </Field>
              <Field label="Telephone">
                <input
                  className="input"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                />
              </Field>
              <div className="col-span-2">
                <Field label="Email">
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Besoin identifie">
                  <textarea
                    className="input min-h-[70px]"
                    value={form.besoin}
                    onChange={(e) => setForm({ ...form, besoin: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Date de rendez-vous">
                <input
                  type="date"
                  className="input"
                  value={form.dateRdv}
                  onChange={(e) => setForm({ ...form, dateRdv: e.target.value })}
                />
              </Field>
              <Field label="Montant (EUR)">
                <input
                  type="number"
                  className="input"
                  value={form.montant ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, montant: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </Field>
              <div className="col-span-2 mt-2 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
