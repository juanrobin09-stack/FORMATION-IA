"use client";

import { useEffect, useState } from "react";
import { Check, Upload, Palette } from "lucide-react";
import { PageHeader, Field } from "@/components/ui";
import { brandingStore } from "@/lib/store";
import type { Branding } from "@/lib/types";

const PRESETS = ["#2563eb", "#0a0a0a", "#7c3aed", "#059669", "#dc2626", "#ea580c"];

export default function ParametresPage() {
  const [branding, setBranding] = useState<Branding>({
    cabinet: "Formator AI",
    couleur: "#2563eb",
    logoDataUrl: null,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => setBranding(brandingStore.get()), []);

  function save() {
    brandingStore.set(branding);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBranding((b) => ({ ...b, logoDataUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader
        title="Parametres"
        subtitle="Personnalisez l'identite appliquee a vos exports PDF (logo, couleurs, nom)."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-5 p-6">
          <Field label="Nom du cabinet / formateur" hint="Affiche en en-tete et pied de page des PDF.">
            <input className="input" value={branding.cabinet}
              onChange={(e) => setBranding({ ...branding, cabinet: e.target.value })} />
          </Field>

          <Field label="Couleur principale">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {PRESETS.map((c) => (
                  <button key={c} type="button" onClick={() => setBranding({ ...branding, couleur: c })}
                    className="h-8 w-8 rounded-full border-2 transition"
                    style={{ backgroundColor: c, borderColor: branding.couleur === c ? "#0a0a0a" : "transparent" }}
                    aria-label={c} />
                ))}
              </div>
              <input type="color" value={branding.couleur}
                onChange={(e) => setBranding({ ...branding, couleur: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-zinc-200" />
            </div>
          </Field>

          <Field label="Logo (PNG)" hint="Apparait sur la page de couverture des documents.">
            <label className="btn-ghost cursor-pointer">
              <Upload className="h-4 w-4" /> Importer un logo
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onLogo} />
            </label>
          </Field>

          <button className="btn-primary" onClick={save}>
            {saved ? <><Check className="h-4 w-4" /> Enregistre</> : "Enregistrer"}
          </button>
        </div>

        {/* Apercu */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 text-white" style={{ backgroundColor: branding.couleur }}>
            <div className="flex items-center gap-3">
              {branding.logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={branding.logoDataUrl} alt="logo" className="h-12 w-12 rounded bg-white/10 object-contain" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10">
                  <Palette className="h-6 w-6" />
                </div>
              )}
              <div>
                <div className="text-xs opacity-70">{branding.cabinet.toUpperCase()}</div>
                <div className="text-xl font-semibold">Support de formation</div>
              </div>
            </div>
          </div>
          <div className="p-6 text-sm text-zinc-500">
            <p className="font-medium text-zinc-700">Apercu de l'en-tete PDF</p>
            <p className="mt-1">
              Cette identite est appliquee a tous vos exports : audit, support, exercices, devis et attestation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
