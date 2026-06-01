"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { buildDeck, type DeckSlide } from "@/lib/deck";
import type { Branding, FormationResult } from "@/lib/types";

export default function Presentation({
  formation,
  client,
  secteur,
  branding,
  onClose,
}: {
  formation: FormationResult;
  client: string;
  secteur?: string;
  branding: Branding;
  onClose: () => void;
}) {
  const deck = buildDeck(formation, { client, secteur, cabinet: branding.cabinet });
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const accent = branding.couleur;

  const next = useCallback(() => setI((v) => Math.min(v + 1, deck.length - 1)), [deck.length]);
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  function toggleFullscreen() {
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }

  const slide = deck[i];

  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex flex-col bg-zinc-900">
      {/* Barre d'outils */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button onClick={toggleFullscreen} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20" title="Plein écran">
          <Maximize2 className="h-4 w-4" />
        </button>
        <button onClick={onClose} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20" title="Quitter (Échap)">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scène 16:9 */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-10">
        <div
          className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl"
          onClick={(e) => {
            // clic à droite = suivant, à gauche = précédent
            const x = e.clientX - (e.currentTarget.getBoundingClientRect().left || 0);
            if (x > e.currentTarget.clientWidth / 2) next();
            else prev();
          }}
        >
          <SlideView slide={slide} accent={accent} index={i} total={deck.length} cabinet={branding.cabinet} logo={branding.logoDataUrl} />
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-4 pb-6 text-white">
        <button onClick={prev} disabled={i === 0} className="rounded-lg bg-white/10 p-2 hover:bg-white/20 disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-[80px] text-center text-sm tabular-nums">{i + 1} / {deck.length}</span>
        <button onClick={next} disabled={i === deck.length - 1} className="rounded-lg bg-white/10 p-2 hover:bg-white/20 disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20" style={{ width: "100%" }}>
        <div className="h-full transition-all" style={{ width: `${((i + 1) / deck.length) * 100}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}

function SlideView({
  slide, accent, index, total, cabinet, logo,
}: {
  slide: DeckSlide; accent: string; index: number; total: number; cabinet: string; logo: string | null;
}) {
  const onAccent = { backgroundColor: accent };

  if (slide.kind === "cover") {
    return (
      <div className="flex h-full w-full flex-col justify-center px-[8%] text-white" style={onAccent}>
        <div className="absolute right-[6%] top-[8%] text-sm font-semibold uppercase tracking-wide opacity-80">{cabinet}</div>
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="absolute left-[6%] top-[7%] h-14 w-14 rounded bg-white/10 object-contain p-1" />
        )}
        <h1 className="text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold leading-tight">{slide.title}</h1>
        <p className="mt-4 text-[clamp(0.9rem,1.8vw,1.4rem)] opacity-90">{slide.subtitle}</p>
        <p className="absolute bottom-[7%] left-[8%] text-sm opacity-80">
          {slide.client}{slide.secteur ? ` • ${slide.secteur}` : ""} — {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>
    );
  }

  if (slide.kind === "section") {
    return (
      <div className="flex h-full w-full flex-col justify-center px-[8%] text-white" style={onAccent}>
        <div className="text-sm font-semibold uppercase tracking-wide opacity-80">Module {slide.index} / {slide.total}</div>
        <h2 className="mt-3 text-[clamp(1.6rem,4vw,3rem)] font-bold leading-tight">{slide.title}</h2>
        <p className="mt-4 text-[clamp(0.9rem,1.6vw,1.25rem)] opacity-90">{slide.objectif}</p>
      </div>
    );
  }

  if (slide.kind === "closing") {
    return (
      <div className="flex h-full w-full flex-col justify-center px-[8%] text-white" style={onAccent}>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold">{slide.title}</h2>
        <p className="mt-4 max-w-3xl text-[clamp(0.9rem,1.6vw,1.3rem)] opacity-90">{slide.text}</p>
        <p className="absolute bottom-[7%] left-[8%] text-sm font-semibold opacity-90">{slide.cabinet}</p>
      </div>
    );
  }

  // Header commun (agenda / content)
  const header = (label: string) => (
    <>
      <div className="absolute left-0 top-0 h-2 w-full" style={onAccent} />
      <div className="text-[clamp(0.7rem,1.2vw,0.95rem)] font-semibold uppercase tracking-wide" style={{ color: accent }}>{label}</div>
      <div className="mt-2 h-px w-full bg-zinc-200" />
    </>
  );

  if (slide.kind === "agenda") {
    return (
      <div className="flex h-full w-full flex-col px-[7%] py-[6%]">
        {header("Programme")}
        <ul className="mt-6 flex-1 space-y-4">
          {slide.items.map((it, k) => (
            <li key={k} className="flex items-center gap-4 text-[clamp(0.9rem,2vw,1.5rem)] text-zinc-700">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={onAccent} />
              {it}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // content
  return (
    <div className="flex h-full w-full flex-col px-[7%] py-[5.5%]">
      {header(`Module ${slide.moduleIndex} — ${slide.moduleTitre}`)}
      <h3 className="mt-4 text-[clamp(1.2rem,3vw,2.2rem)] font-bold text-zinc-900">{slide.title}</h3>
      <ul className="mt-5 flex-1 space-y-3">
        {slide.points.map((p, k) => (
          <li key={k} className="flex gap-3 text-[clamp(0.85rem,1.7vw,1.35rem)] leading-snug text-zinc-700">
            <span className="mt-[0.5em] inline-block h-2 w-2 shrink-0 rounded-full" style={onAccent} />
            {p}
          </li>
        ))}
      </ul>
      {slide.exemple && (
        <div className="mt-3 rounded-lg p-4" style={{ backgroundColor: `${accent}12` }}>
          <span className="text-[clamp(0.65rem,1vw,0.8rem)] font-bold uppercase tracking-wide" style={{ color: accent }}>Exemple</span>
          <p className="mt-1 text-[clamp(0.8rem,1.5vw,1.15rem)] text-zinc-700">{slide.exemple}</p>
        </div>
      )}
      {slide.conseils && (
        <p className="mt-2 text-[clamp(0.7rem,1.2vw,0.95rem)] italic text-zinc-500">Conseil : {slide.conseils}</p>
      )}
      <div className="mt-2 flex justify-between text-[clamp(0.6rem,0.9vw,0.8rem)] text-zinc-400">
        <span>{cabinet}</span><span>{index + 1} / {total}</span>
      </div>
    </div>
  );
}
