"use client";

import { useEffect, useState } from "react";
import { Database, Download, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { knowledgeStore, brandingStore } from "@/lib/store";
import { pdfAudit, pdfFormation, pdfExercices } from "@/lib/pdf";
import type { KnowledgeEntry } from "@/lib/types";

const KIND_LABELS: Record<string, string> = {
  formation: "Formation",
  audit: "Audit",
  exercices: "Exercices",
  devis: "Devis",
};

const KIND_COLORS: Record<string, string> = {
  formation: "bg-brand-50 text-brand-700",
  audit: "bg-indigo-50 text-indigo-700",
  exercices: "bg-emerald-50 text-emerald-700",
  devis: "bg-amber-50 text-amber-700",
};

export default function BaseConnaissancesPage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setEntries(knowledgeStore.all()), []);

  const filtered = entries.filter((e) => {
    const q = query.toLowerCase();
    return !q || e.titre.toLowerCase().includes(q) || e.entreprise.toLowerCase().includes(q) || e.secteur.toLowerCase().includes(q);
  });

  function remove(id: string) {
    setEntries(knowledgeStore.remove(id));
  }

  function exportEntry(e: KnowledgeEntry) {
    const meta = { client: e.entreprise, secteur: e.secteur, branding: brandingStore.get() };
    if (e.kind === "audit" && e.audit) pdfAudit(e.audit, meta);
    else if (e.kind === "formation" && e.formation) pdfFormation(e.formation, meta);
    else if (e.kind === "exercices" && e.exercices) pdfExercices(e.exercices, meta);
  }

  return (
    <div>
      <PageHeader
        title="Base de connaissances"
        subtitle="Toutes vos formations, audits et exercices generes, recherchables instantanement."
      />

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          className="input pl-9"
          placeholder="Rechercher par entreprise, secteur, titre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center text-zinc-400">
          <Database className="mb-3 h-8 w-8" />
          <p className="font-medium text-zinc-600">Aucune production enregistree</p>
          <p className="mt-1 text-sm">Les formations et audits que vous enregistrez apparaitront ici.</p>
        </div>
      ) : (
        <div className="card divide-y divide-zinc-100">
          {filtered.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`badge ${KIND_COLORS[e.kind]}`}>{KIND_LABELS[e.kind]}</span>
                  <span className="truncate text-sm font-medium">{e.titre}</span>
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {e.entreprise} - {e.secteur} - {new Date(e.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {e.kind !== "devis" && (
                  <button className="btn-ghost" onClick={() => exportEntry(e)}>
                    <Download className="h-4 w-4" /> PDF
                  </button>
                )}
                <button onClick={() => remove(e.id)} className="text-zinc-300 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
