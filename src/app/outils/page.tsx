"use client";

import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { AI_TOOLS } from "@/lib/aiTools";

export default function OutilsPage() {
  return (
    <div>
      <PageHeader
        title="Panorama des outils d'IA"
        subtitle="Toutes les formations couvrent l'ensemble de ces outils — pas seulement ChatGPT."
      />

      <div className="space-y-6">
        {AI_TOOLS.map((cat) => (
          <div key={cat.categorie} className="card p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-ink">{cat.categorie}</h2>
              <p className="text-sm text-zinc-500">{cat.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.outils.map((o) => (
                <div key={o.nom} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{o.nom}</span>
                    {o.gratuit && (
                      <span className="badge bg-emerald-50 text-emerald-700">
                        <Check className="mr-0.5 h-3 w-3" /> Gratuit
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400">{o.editeur}</div>
                  <p className="mt-1.5 text-sm text-zinc-600">{o.usage}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
