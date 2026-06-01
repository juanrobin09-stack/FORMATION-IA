"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  TrendingUp,
  Euro,
  ArrowRight,
  ClipboardCheck,
  GraduationCap,
  Library,
} from "lucide-react";
import { PageHeader } from "@/components/ui";
import { prospectStore, knowledgeStore } from "@/lib/store";
import type { Prospect, KnowledgeEntry } from "@/lib/types";

export default function DashboardPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);

  useEffect(() => {
    setProspects(prospectStore.all());
    setKnowledge(knowledgeStore.all());
  }, []);

  const signes = prospects.filter(
    (p) => p.statut === "Client signe" || p.statut === "Formation realisee",
  );
  const caSigne = signes.reduce((s, p) => s + (p.montant ?? 0), 0);
  const caPotentiel = prospects
    .filter((p) => !["Client signe", "Formation realisee"].includes(p.statut))
    .reduce((s, p) => s + (p.montant ?? 0), 0);
  const taux = prospects.length
    ? Math.round((signes.length / prospects.length) * 100)
    : 0;

  const stats = [
    { label: "Prospects", value: prospects.length, icon: Users, color: "text-brand-600" },
    { label: "Taux conversion", value: `${taux}%`, icon: TrendingUp, color: "text-emerald-600" },
    {
      label: "CA signe",
      value: `${caSigne.toLocaleString("fr-FR")} EUR`,
      icon: Euro,
      color: "text-ink",
    },
    {
      label: "CA potentiel",
      value: `${caPotentiel.toLocaleString("fr-FR")} EUR`,
      icon: Euro,
      color: "text-amber-600",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre activite de formateur IA."
      />

      {/* Magic CTA */}
      <Link
        href="/magique"
        className="group mb-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-ink p-6 text-white transition hover:bg-ink-soft sm:flex-row sm:items-center"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-lg font-semibold">Creer une formation complete</div>
            <div className="text-sm text-white/60">
              Audit + programme + support + exercices + prompts + devis en moins de 2 minutes.
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium transition group-hover:bg-brand-500">
          Lancer <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/audit" icon={ClipboardCheck} title="Audit IA" desc="Diagnostiquer un client" />
        <QuickLink
          href="/formation"
          icon={GraduationCap}
          title="Generateur"
          desc="Construire une formation"
        />
        <QuickLink href="/bibliotheque" icon={Library} title="Prompts" desc="Bibliotheque metier" />
      </div>

      {/* Recent */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">Productions recentes</h2>
        {knowledge.length === 0 ? (
          <div className="card p-6 text-sm text-zinc-400">
            Aucune production pour l'instant. Lancez une formation complete pour commencer.
          </div>
        ) : (
          <div className="card divide-y divide-zinc-100">
            {knowledge.slice(0, 6).map((k) => (
              <div key={k.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium">{k.titre}</div>
                  <div className="text-xs text-zinc-400">
                    {k.entreprise} - {k.secteur}
                  </div>
                </div>
                <span className="badge bg-zinc-100 text-zinc-600 capitalize">{k.kind}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="card group p-5 transition hover:border-brand-300">
      <Icon className="h-5 w-5 text-brand-600" />
      <div className="mt-3 font-medium">{title}</div>
      <div className="text-sm text-zinc-400">{desc}</div>
    </Link>
  );
}
