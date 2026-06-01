"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, Plus, Trash2, X, Library } from "lucide-react";
import { PageHeader, Field } from "@/components/ui";
import { SEED_PROMPTS, PROMPT_CATEGORIES } from "@/lib/promptLibrary";
import { customPromptStore, uid } from "@/lib/store";
import type { PromptCategorie, PromptItem } from "@/lib/types";

export default function BibliothequePage() {
  const [custom, setCustom] = useState<PromptItem[]>([]);
  const [filter, setFilter] = useState<PromptCategorie | "Toutes">("Toutes");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PromptItem>({
    id: "",
    categorie: "Commercial",
    titre: "",
    objectif: "",
    prompt: "",
    resultatAttendu: "",
  });

  useEffect(() => setCustom(customPromptStore.all()), []);

  const all = useMemo(() => [...custom, ...SEED_PROMPTS], [custom]);
  const filtered = all.filter((p) => {
    const okCat = filter === "Toutes" || p.categorie === filter;
    const q = query.toLowerCase();
    const okQ = !q || p.titre.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
    return okCat && okQ;
  });

  async function copy(p: PromptItem) {
    await navigator.clipboard.writeText(p.prompt);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 1500);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    setCustom(customPromptStore.add({ ...form, id: uid() }));
    setOpen(false);
    setForm({ ...form, titre: "", objectif: "", prompt: "", resultatAttendu: "" });
  }

  function remove(id: string) {
    setCustom(customPromptStore.remove(id));
  }

  const isCustom = (id: string) => custom.some((c) => c.id === id);

  return (
    <div>
      <PageHeader
        title="Bibliotheque de prompts"
        subtitle="Des prompts metier prets a l'emploi, copiables en un clic."
        action={
          <button className="btn-primary" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Ajouter un prompt
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input max-w-xs"
          placeholder="Rechercher un prompt..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {(["Toutes", ...PROMPT_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`badge transition ${
                filter === c ? "bg-ink text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center text-zinc-400">
          <Library className="mb-3 h-8 w-8" />
          <p className="font-medium text-zinc-600">Aucun prompt trouve</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="card flex flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="badge bg-brand-50 text-brand-700">{p.categorie}</span>
                {isCustom(p.id) && (
                  <button onClick={() => remove(p.id)} className="text-zinc-300 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="font-semibold">{p.titre}</h3>
              <p className="mt-0.5 text-sm text-zinc-500">{p.objectif}</p>
              <pre className="mt-3 flex-1 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 font-sans text-sm text-zinc-700">
                {p.prompt}
              </pre>
              <p className="mt-2 text-xs text-zinc-400">
                <span className="font-medium">Resultat attendu : </span>{p.resultatAttendu}
              </p>
              <button onClick={() => copy(p)} className="btn-ghost mt-3 self-start">
                {copied === p.id ? (
                  <><Check className="h-4 w-4 text-emerald-600" /> Copie</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copier</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nouveau prompt</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={add} className="space-y-4">
              <Field label="Categorie">
                <select className="input" value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value as PromptCategorie })}>
                  {PROMPT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Titre">
                <input required className="input" value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })} />
              </Field>
              <Field label="Objectif">
                <input className="input" value={form.objectif}
                  onChange={(e) => setForm({ ...form, objectif: e.target.value })} />
              </Field>
              <Field label="Prompt">
                <textarea required className="input min-h-[100px]" value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
              </Field>
              <Field label="Resultat attendu">
                <input className="input" value={form.resultatAttendu}
                  onChange={(e) => setForm({ ...form, resultatAttendu: e.target.value })} />
              </Field>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
