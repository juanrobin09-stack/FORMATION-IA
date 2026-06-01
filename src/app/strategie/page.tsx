"use client";

import { Download, Check, Globe, Star, Users, ShieldCheck, Crown } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { brandingStore, devisStore, uid } from "@/lib/store";
import { pdfDevis } from "@/lib/pdf";
import {
  PHASE_DECOUVERTE,
  OFFRES_CONTRAT,
  REPUTATION_ACTIONS,
  EXCLUSIVITE,
  PARCOURS_COMMERCIAL,
  type OffreEssai,
  type OffreContrat,
} from "@/lib/strategie";
import type { Devis } from "@/lib/types";

export default function StrategiePage() {
  function devisEssai(o: OffreEssai) {
    const d: Devis = {
      id: uid(),
      entreprise: "[Nom du client]",
      prix: o.type === "payante" ? 450 : 0,
      duree: o.duree,
      nbParticipants: 1,
      conditions: `Phase de decouverte - ${o.titre}. ${o.description}`,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    devisStore.save(d);
    pdfDevis(d, brandingStore.get());
  }

  function devisContrat(o: OffreContrat) {
    const d: Devis = {
      id: uid(),
      entreprise: "[Nom du client]",
      prix: 1200,
      duree: o.engagement,
      nbParticipants: 1,
      conditions: `${o.titre} - Engagement : ${o.engagement}. ${o.description}`,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    devisStore.save(d);
    pdfDevis(d, brandingStore.get());
  }

  return (
    <div>
      <PageHeader
        title="Strategie commerciale"
        subtitle="Plan de developpement client & offres de services, de la decouverte a la fidelisation."
      />

      {/* Parcours commercial */}
      <div className="card mb-8 p-6">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">Parcours commercial</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PARCOURS_COMMERCIAL.map((p, i) => (
            <div key={i} className="relative rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
              <div className="text-sm font-semibold text-brand-600">{p.etape}</div>
              <p className="mt-1 text-sm text-zinc-500">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Phase de decouverte */}
      <Section
        num="1"
        icon={<Users className="h-5 w-5" />}
        title="Phase de decouverte"
        subtitle="Echantillons et periode d'essai pour decouvrir la qualite des services sans prise de risque."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {PHASE_DECOUVERTE.map((o) => (
            <div key={o.id} className="card flex flex-col p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{o.titre}</h3>
                <span
                  className={`badge ${
                    o.type === "payante" ? "bg-brand-50 text-brand-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {o.prix}
                </span>
              </div>
              <div className="text-xs text-zinc-400">Duree : {o.duree}</div>
              <p className="mt-2 text-sm text-zinc-600">{o.description}</p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {o.points.map((pt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {pt}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost mt-4 self-start" onClick={() => devisEssai(o)}>
                <Download className="h-4 w-4" /> Devis decouverte
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* 2. Reputation */}
      <Section
        num="2"
        icon={<Star className="h-5 w-5" />}
        title="Valorisation de la reputation"
        subtitle="Capitaliser sur les retours d'experience via un site web et un espace d'avis en ligne."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {REPUTATION_ACTIONS.map((a, i) => (
            <div key={i} className="card flex gap-3 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                {i === 0 ? <Globe className="h-5 w-5" /> : i === 1 ? <Star className="h-5 w-5" /> : i === 2 ? <Users className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-medium">{a.titre}</div>
                <p className="mt-0.5 text-sm text-zinc-500">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Offres contractuelles */}
      <Section
        num="3"
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Offres contractuelles"
        subtitle="Des formules structurees, avec ou sans engagement, pour repondre a tous les profils."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {OFFRES_CONTRAT.map((o) => (
            <div
              key={o.id}
              className={`card flex flex-col p-5 ${o.recommande ? "ring-2 ring-brand-500" : ""}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{o.titre}</h3>
                {o.recommande && <span className="badge bg-brand-600 text-white">Recommande</span>}
              </div>
              <div className="text-xs text-zinc-400">Engagement : {o.engagement}</div>
              <p className="mt-2 text-sm text-zinc-600">{o.description}</p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {o.points.map((pt, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {pt}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost mt-4 self-start" onClick={() => devisContrat(o)}>
                <Download className="h-4 w-4" /> Devis contrat
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Exclusivite */}
      <Section
        num="4"
        icon={<Crown className="h-5 w-5" />}
        title="Offre d'exclusivite"
        subtitle="Recompenser les premiers clients fideles et etablir des partenariats solides."
      >
        <div className="card bg-ink p-6 text-white">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold">{EXCLUSIVITE.titre}</h3>
          </div>
          <p className="mt-2 text-sm text-white/70">{EXCLUSIVITE.description}</p>
          <ul className="mt-4 space-y-2">
            {EXCLUSIVITE.points.map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {pt}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}

function Section({
  num,
  icon,
  title,
  subtitle,
  children,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            <span className="text-zinc-300">{num}.</span> {title}
          </h2>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
