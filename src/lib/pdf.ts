// ===========================================================================
// FORMATOR AI - Generation de PDF professionnels (jsPDF + police Unicode)
// ===========================================================================
// - Police Liberation Sans embarquee (accents francais + symbole € parfaits)
// - Formatage monetaire aux normes francaises (espaces normaux, 2 decimales)
// - Devis conforme aux mentions obligatoires (France / UE)
// Toutes les fonctions d'export sont asynchrones (chargement de la police).
// ===========================================================================

"use client";

import { jsPDF } from "jspdf";
import {
  calcDevis,
  type AuditResult,
  type Branding,
  type Devis,
  type Exercice,
  type FormationResult,
} from "./types";
import { buildDeck, type DeckSlide } from "./deck";

// --- Police embarquee (chargee une fois, mise en cache) ---
const FONT_REGULAR = "/fonts/LiberationSans-Regular.ttf";
const FONT_BOLD = "/fonts/LiberationSans-Bold.ttf";
let cache: { regular: string; bold: string } | null = null;

async function loadBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, sub as unknown as number[]);
  }
  return btoa(binary);
}

async function newDoc(opts?: {
  orientation?: "portrait" | "landscape";
  format?: string | number[];
}): Promise<jsPDF> {
  if (!cache) {
    const [regular, bold] = await Promise.all([loadBase64(FONT_REGULAR), loadBase64(FONT_BOLD)]);
    cache = { regular, bold };
  }
  const doc = new jsPDF({
    unit: "mm",
    orientation: opts?.orientation ?? "portrait",
    format: opts?.format ?? "a4",
  });
  doc.addFileToVFS("LiberationSans-Regular.ttf", cache.regular);
  doc.addFont("LiberationSans-Regular.ttf", "Liberation", "normal");
  doc.addFileToVFS("LiberationSans-Bold.ttf", cache.bold);
  doc.addFont("LiberationSans-Bold.ttf", "Liberation", "bold");
  doc.setFont("Liberation", "normal");
  return doc;
}

// --- Helpers de formatage ---
function clean(s: string): string {
  // Remplace les espaces fine/insecable (U+202F, U+00A0) par un espace normal.
  return (s ?? "").replace(/[\u202f\u00a0\u2009\u2007]/g, " ");
}

function money(n: number): string {
  const s = n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return clean(s) + " €";
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [37, 99, 235];
}

function slug(s: string): string {
  return (s || "document")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Mise en page pour les documents de contenu (audit, formation...) ---
class Layout {
  doc: jsPDF;
  y = 0;
  margin = 18;
  width: number;
  height: number;
  accent: [number, number, number];
  branding: Branding;

  constructor(doc: jsPDF, branding: Branding) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.height = doc.internal.pageSize.getHeight();
    this.accent = hexToRgb(branding.couleur);
    this.branding = branding;
    this.y = this.margin;
  }

  ensure(space: number) {
    if (this.y + space > this.height - 18) {
      this.doc.addPage();
      this.y = this.margin;
    }
  }

  cover(title: string, subtitle: string, client: string, secteur?: string) {
    const [r, g, b] = this.accent;
    this.doc.setFillColor(r, g, b);
    this.doc.rect(0, 0, this.width, 72, "F");

    if (this.branding.logoDataUrl) {
      try {
        this.doc.addImage(this.branding.logoDataUrl, "PNG", this.margin, 16, 24, 24);
      } catch {
        /* logo invalide ignore */
      }
    }
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont("Liberation", "bold");
    this.doc.setFontSize(11);
    this.doc.text(clean(this.branding.cabinet).toUpperCase(), this.width - this.margin, 24, { align: "right" });

    this.doc.setFontSize(28);
    this.doc.text(clean(title), this.margin, 52);

    this.doc.setTextColor(20, 20, 20);
    this.y = 88;
    this.doc.setFont("Liberation", "normal");
    this.doc.setFontSize(13);
    this.doc.setTextColor(90, 90, 90);
    this.doc.text(clean(subtitle), this.margin, this.y);
    this.y += 9;
    this.doc.setFontSize(10);
    this.doc.setTextColor(120, 120, 120);
    this.doc.text(
      `Client : ${clean(client)}${secteur ? "   •   Secteur : " + clean(secteur) : ""}`,
      this.margin,
      this.y,
    );
    this.y += 5;
    this.doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, this.margin, this.y);
    this.y += 12;
    this.doc.setTextColor(20, 20, 20);
  }

  h1(text: string) {
    this.ensure(18);
    const [r, g, b] = this.accent;
    this.doc.setFont("Liberation", "bold");
    this.doc.setFontSize(15);
    this.doc.setTextColor(r, g, b);
    this.doc.text(clean(text), this.margin, this.y);
    this.y += 3;
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.y, this.width - this.margin, this.y);
    this.y += 7;
    this.doc.setTextColor(20, 20, 20);
  }

  h2(text: string) {
    this.ensure(12);
    this.doc.setFont("Liberation", "bold");
    this.doc.setFontSize(11.5);
    this.doc.setTextColor(25, 25, 25);
    const lines = this.doc.splitTextToSize(clean(text), this.width - 2 * this.margin) as string[];
    lines.forEach((l) => {
      this.ensure(7);
      this.doc.text(l, this.margin, this.y);
      this.y += 6;
    });
    this.y += 1;
  }

  label(text: string) {
    this.ensure(8);
    const [r, g, b] = this.accent;
    this.doc.setFont("Liberation", "bold");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(r, g, b);
    this.doc.text(clean(text).toUpperCase(), this.margin, this.y);
    this.y += 5;
    this.doc.setTextColor(20, 20, 20);
  }

  body(text: string) {
    this.doc.setFont("Liberation", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(45, 45, 45);
    const lines = this.doc.splitTextToSize(clean(text), this.width - 2 * this.margin) as string[];
    for (const line of lines) {
      this.ensure(6);
      this.doc.text(line, this.margin, this.y);
      this.y += 5.4;
    }
    this.y += 2;
  }

  bullet(text: string) {
    this.doc.setFont("Liberation", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(45, 45, 45);
    const lines = this.doc.splitTextToSize(clean(text), this.width - 2 * this.margin - 6) as string[];
    this.ensure(6);
    const [r, g, b] = this.accent;
    this.doc.setFillColor(r, g, b);
    this.doc.circle(this.margin + 1.2, this.y - 1.3, 1, "F");
    lines.forEach((line) => {
      this.ensure(6);
      this.doc.text(line, this.margin + 6, this.y);
      this.y += 5.4;
    });
    this.y += 1;
  }

  space(mm = 4) {
    this.y += mm;
  }

  footer() {
    const pages = this.doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      this.doc.setPage(i);
      this.doc.setDrawColor(230, 230, 230);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, this.height - 12, this.width - this.margin, this.height - 12);
      this.doc.setFont("Liberation", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(`${clean(this.branding.cabinet)} — Généré avec Formator AI`, this.margin, this.height - 7);
      this.doc.text(`Page ${i} / ${pages}`, this.width - this.margin, this.height - 7, { align: "right" });
    }
  }

  save(filename: string) {
    this.footer();
    this.doc.save(filename);
  }
}

// ===========================================================================
// Documents de contenu
// ===========================================================================

export async function pdfAudit(audit: AuditResult, meta: { client: string; secteur?: string; branding: Branding }) {
  const l = new Layout(await newDoc(), meta.branding);
  l.cover("Audit IA", "Diagnostic et opportunités d'intelligence artificielle", meta.client, meta.secteur);

  l.h1("Résumé de l'entreprise");
  l.body(audit.resumeEntreprise);

  l.h1("Opportunités IA");
  audit.opportunites.forEach((o) => {
    l.h2(o.titre);
    l.body(o.description);
  });

  l.h1("Gains de temps estimés");
  l.body(audit.gainsTemps);

  l.h1("Cas d'usage recommandés");
  audit.casUsage.forEach((c) => {
    l.h2(c.titre);
    l.body(c.description);
  });

  l.h1("Priorités");
  audit.priorites.forEach((p) => l.bullet(p));

  l.save(`audit-${slug(meta.client)}.pdf`);
}

export async function pdfFormation(formation: FormationResult, meta: { client: string; secteur?: string; branding: Branding }) {
  const l = new Layout(await newDoc(), meta.branding);
  l.cover("Support de formation", formation.titre, meta.client, meta.secteur);

  l.h1("Introduction");
  l.body(formation.introduction);

  formation.modules.forEach((m, i) => {
    l.h1(`Module ${i + 1} — ${m.titre}`);
    l.label("Objectif");
    l.body(m.objectif);
    m.slides.forEach((s) => {
      l.h2(s.titre);
      l.body(s.contenu);
      if (s.exemple) {
        l.label("Exemple");
        l.body(s.exemple);
      }
      if (s.conseils) {
        l.label("Conseils");
        l.body(s.conseils);
      }
      l.space(2);
    });
  });

  l.h1("Conclusion");
  l.body(formation.conclusion);

  l.save(`formation-${slug(meta.client)}.pdf`);
}

export async function pdfExercices(exercices: Exercice[], meta: { client: string; secteur?: string; branding: Branding }) {
  const l = new Layout(await newDoc(), meta.branding);
  l.cover("Exercices pratiques", "Cahier d'exercices avec corrigés", meta.client, meta.secteur);
  exercices.forEach((e, i) => {
    l.h1(e.titre || `Exercice ${i + 1}`);
    l.label("Consigne");
    l.body(e.consigne);
    l.label("Corrigé");
    l.body(e.corrige);
    l.space(2);
  });
  l.save(`exercices-${slug(meta.client)}.pdf`);
}

export async function pdfAttestation(meta: {
  client: string;
  branding: Branding;
  intitule: string;
  duree: string;
  participant?: string;
}) {
  const l = new Layout(await newDoc(), meta.branding);
  l.cover("Attestation de formation", meta.intitule, meta.client);
  l.space(6);
  l.h1("Atteste que");
  l.body(
    `${meta.participant || "Le participant désigné ci-dessous"} a suivi la formation « ${meta.intitule} » d'une durée de ${meta.duree}, dispensée par ${meta.branding.cabinet} pour ${meta.client}.`,
  );
  l.space(18);
  l.label("Fait le");
  l.body(new Date().toLocaleDateString("fr-FR"));
  l.space(12);
  l.label("Signature du formateur");
  l.space(16);
  l.body("________________________________");
  l.save(`attestation-${slug(meta.client)}.pdf`);
}

// ===========================================================================
// DEVIS conforme (mentions obligatoires France / UE)
// ===========================================================================

export async function pdfDevis(devis: Devis, b: Branding) {
  const doc = await newDoc();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const [ar, ag, ab] = hexToRgb(b.couleur);
  const t = calcDevis(devis);
  let y = M;

  const text = (s: string, x: number, yy: number, opt?: { align?: "left" | "right" | "center"; size?: number; bold?: boolean; color?: [number, number, number] }) => {
    doc.setFont("Liberation", opt?.bold ? "bold" : "normal");
    doc.setFontSize(opt?.size ?? 9);
    const c = opt?.color ?? [40, 40, 40];
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(clean(s), x, yy, { align: opt?.align ?? "left" });
  };

  // --- En-tete : emetteur (gauche) + bloc DEVIS (droite) ---
  if (b.logoDataUrl) {
    try {
      doc.addImage(b.logoDataUrl, "PNG", M, y, 20, 20);
    } catch {
      /* ignore */
    }
  }
  const exX = b.logoDataUrl ? M + 25 : M;
  text(b.cabinet || "Votre cabinet", exX, y + 5, { size: 13, bold: true, color: [20, 20, 20] });
  let ey = y + 10;
  const emetteur = [
    b.formeJuridique,
    b.adresse,
    b.codePostalVille,
    [b.telephone, b.email].filter(Boolean).join(" • "),
  ].filter(Boolean);
  emetteur.forEach((line) => {
    text(line, exX, ey, { size: 8.5, color: [90, 90, 90] });
    ey += 4;
  });

  // Bloc DEVIS encadre a droite
  const boxW = 66;
  const boxX = W - M - boxW;
  doc.setFillColor(ar, ag, ab);
  doc.roundedRect(boxX, y, boxW, 12, 1.5, 1.5, "F");
  text("DEVIS", boxX + boxW / 2, y + 8, { size: 15, bold: true, align: "center", color: [255, 255, 255] });
  let by = y + 18;
  const meta: [string, string][] = [
    ["N° de devis", devis.numero],
    ["Date d'émission", new Date(devis.date).toLocaleDateString("fr-FR")],
    ["Valable jusqu'au", new Date(new Date(devis.date).getTime() + devis.validiteJours * 86400000).toLocaleDateString("fr-FR")],
  ];
  meta.forEach(([k, v]) => {
    text(k, boxX, by, { size: 8.5, color: [120, 120, 120] });
    text(v, W - M, by, { size: 9, bold: true, align: "right", color: [30, 30, 30] });
    by += 5;
  });

  y = Math.max(ey, by) + 6;

  // --- Bloc client ---
  doc.setFillColor(247, 248, 250);
  doc.roundedRect(M, y, W - 2 * M, 24, 1.5, 1.5, "F");
  text("ADRESSÉ À", M + 4, y + 6, { size: 8, bold: true, color: [ar, ag, ab] });
  text(devis.entreprise || "[Nom du client]", M + 4, y + 12, { size: 11, bold: true, color: [20, 20, 20] });
  const clientLines = [devis.clientAdresse, devis.clientContact].filter(Boolean);
  let cy = y + 17;
  clientLines.forEach((line) => {
    text(line, M + 4, cy, { size: 9, color: [70, 70, 70] });
    cy += 4.5;
  });
  // Infos prestation a droite du bloc client
  const infoX = W - M - 70;
  let iy = y + 6;
  const infos = [
    devis.dateExecution ? ["Date de prestation", new Date(devis.dateExecution).toLocaleDateString("fr-FR")] : null,
    devis.duree ? ["Durée", devis.duree] : null,
    devis.nbParticipants ? ["Participants", String(devis.nbParticipants)] : null,
    devis.lieuExecution ? ["Lieu", devis.lieuExecution] : null,
  ].filter(Boolean) as [string, string][];
  infos.forEach(([k, v]) => {
    text(k, infoX, iy, { size: 8, color: [120, 120, 120] });
    text(v, W - M, iy, { size: 8.5, align: "right", color: [50, 50, 50] });
    iy += 4.5;
  });
  y += 30;

  // --- Tableau des prestations ---
  // Colonnes numeriques alignees a droite, avec un espacement evitant tout chevauchement.
  const cols = { des: M, qteR: 124, uniteL: 128, puR: 170, totR: W - M };
  doc.setFillColor(ar, ag, ab);
  doc.rect(M, y, W - 2 * M, 8, "F");
  text("DÉSIGNATION", cols.des + 2, y + 5.4, { size: 8.5, bold: true, color: [255, 255, 255] });
  text("Qté", cols.qteR, y + 5.4, { size: 8.5, bold: true, align: "right", color: [255, 255, 255] });
  text("Unité", cols.uniteL, y + 5.4, { size: 8.5, bold: true, color: [255, 255, 255] });
  text("P.U. HT", cols.puR, y + 5.4, { size: 8.5, bold: true, align: "right", color: [255, 255, 255] });
  text("Total HT", cols.totR - 1, y + 5.4, { size: 8.5, bold: true, align: "right", color: [255, 255, 255] });
  y += 8;

  doc.setFont("Liberation", "normal");
  devis.lignes.forEach((ligne, idx) => {
    const desLines = doc.splitTextToSize(clean(ligne.designation), cols.qteR - cols.des - 8) as string[];
    const uniteLines = doc.splitTextToSize(clean(ligne.unite), cols.puR - 14 - cols.uniteL) as string[];
    const rowH = Math.max(9, desLines.length * 4.6 + 3.6, uniteLines.length * 4.6 + 3.6);
    if (y + rowH > H - 70) {
      doc.addPage();
      y = M;
    }
    if (idx % 2 === 1) {
      doc.setFillColor(248, 249, 251);
      doc.rect(M, y, W - 2 * M, rowH, "F");
    }
    desLines.forEach((dl, i) => text(dl, cols.des + 2, y + 5.4 + i * 4.6, { size: 9, color: [40, 40, 40] }));
    const midY = y + 5.4;
    text(String(ligne.quantite), cols.qteR, midY, { size: 9, align: "right" });
    uniteLines.forEach((ul, i) => text(ul, cols.uniteL, midY + i * 4.6, { size: 9 }));
    text(money(ligne.prixUnitaireHT), cols.puR, midY, { size: 9, align: "right" });
    text(money(ligne.quantite * ligne.prixUnitaireHT), cols.totR - 1, midY, { size: 9, align: "right", bold: true });
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.2);
    doc.line(M, y + rowH, W - M, y + rowH);
    y += rowH;
  });

  // --- Totaux (bloc a droite) ---
  y += 4;
  const totX = W - M - 70;
  const totW = 70;
  const rowTot = (k: string, v: string, opt?: { bold?: boolean; bg?: boolean }) => {
    if (opt?.bg) {
      doc.setFillColor(ar, ag, ab);
      doc.rect(totX, y, totW, 9, "F");
      text(k, totX + 3, y + 6, { size: 9.5, bold: true, color: [255, 255, 255] });
      text(v, W - M - 3, y + 6, { size: 10.5, bold: true, align: "right", color: [255, 255, 255] });
      y += 9;
    } else {
      text(k, totX + 3, y + 5, { size: 9, bold: opt?.bold, color: [70, 70, 70] });
      text(v, W - M - 3, y + 5, { size: 9.5, bold: opt?.bold, align: "right", color: [30, 30, 30] });
      y += 6.5;
    }
  };
  rowTot("Total HT", money(t.totalHT));
  if (devis.franchiseTVA) {
    rowTot("TVA", "—");
  } else {
    rowTot(`TVA ${devis.tvaRate} %`, money(t.montantTVA));
  }
  rowTot("TOTAL TTC", money(t.totalTTC), { bg: true });
  if (devis.acompte > 0) {
    y += 1;
    rowTot(`Acompte (${devis.acompte} %)`, money(t.montantAcompte), { bold: true });
  }

  // --- Mention franchise TVA ---
  let my = y + 6;
  if (devis.franchiseTVA) {
    text("TVA non applicable, article 293 B du CGI.", M, my, { size: 8.5, color: [90, 90, 90] });
    my += 6;
  }

  // --- Conditions de reglement ---
  doc.setDrawColor(230, 230, 230);
  doc.line(M, my, W - M, my);
  my += 6;
  text("CONDITIONS DE RÈGLEMENT", M, my, { size: 8.5, bold: true, color: [ar, ag, ab] });
  my += 5;
  const condLines = doc.splitTextToSize(clean(devis.conditions || b.conditionsReglement), W - 2 * M) as string[];
  condLines.forEach((cl) => {
    text(cl, M, my, { size: 9, color: [70, 70, 70] });
    my += 4.6;
  });
  if (b.iban) {
    my += 1;
    text(`IBAN : ${b.iban}`, M, my, { size: 9, color: [70, 70, 70] });
    my += 5;
  }

  // --- Bon pour accord / signature ---
  my += 4;
  if (my > H - 50) {
    doc.addPage();
    my = M;
  }
  const sigW = 80;
  const sigX = W - M - sigW;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(sigX, my, sigW, 34, 1.5, 1.5, "S");
  text("Bon pour accord", sigX + 4, my + 6, { size: 9, bold: true, color: [40, 40, 40] });
  text("Date et signature du client précédées de la", sigX + 4, my + 11, { size: 7.5, color: [120, 120, 120] });
  text("mention « Devis reçu avant exécution des travaux ».", sigX + 4, my + 15, { size: 7.5, color: [120, 120, 120] });
  text("Devis gratuit.", M, my + 6, { size: 8.5, color: [120, 120, 120] });
  text(`Offre valable ${devis.validiteJours} jours à compter de la date d'émission.`, M, my + 11, { size: 8.5, color: [120, 120, 120] });

  // --- Pied de page legal (mentions obligatoires prestataire) ---
  const legal = [
    b.cabinet && b.formeJuridique ? `${b.cabinet} — ${b.formeJuridique}` : b.cabinet,
    b.siret ? `SIRET ${b.siret}` : "",
    b.rcsRm,
    b.tvaIntra ? `TVA ${b.tvaIntra}` : "",
  ].filter(Boolean).join("  •  ");
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(M, H - 12, W - M, H - 12);
    const legalLines = doc.splitTextToSize(legal, W - 2 * M) as string[];
    doc.setFont("Liberation", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(150, 150, 150);
    doc.text(legalLines[0] || "", W / 2, H - 8, { align: "center" });
    doc.text(`Page ${i} / ${pages}`, W - M, H - 4, { align: "right" });
  }

  doc.save(`devis-${devis.numero || slug(devis.entreprise)}.pdf`);
}

// ===========================================================================
// DIAPOSITIVES 16:9 (support a projeter en session de formation)
// ===========================================================================

export async function pdfSlides(formation: FormationResult, meta: { client: string; secteur?: string; branding: Branding }) {
  const b = meta.branding;
  const deck = buildDeck(formation, { client: meta.client, secteur: meta.secteur, cabinet: b.cabinet });
  // Format 16:9 (paysage)
  const doc = await newDoc({ orientation: "landscape", format: [297, 167] });
  const W = 297;
  const H = 167;
  const M = 18;
  const [ar, ag, ab] = hexToRgb(b.couleur);

  const T = (s: string, x: number, y: number, opt?: { align?: "left" | "right" | "center"; size?: number; bold?: boolean; color?: [number, number, number] }) => {
    doc.setFont("Liberation", opt?.bold ? "bold" : "normal");
    doc.setFontSize(opt?.size ?? 14);
    const c = opt?.color ?? [30, 30, 30];
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(clean(s), x, y, { align: opt?.align ?? "left" });
  };
  // IMPORTANT : fixer la taille/graisse AVANT de mesurer le retour a la ligne,
  // sinon splitTextToSize calcule la largeur avec la mauvaise police.
  const wrap = (s: string, w: number, size = 14, bold = false) => {
    doc.setFont("Liberation", bold ? "bold" : "normal");
    doc.setFontSize(size);
    return doc.splitTextToSize(clean(s), w) as string[];
  };

  deck.forEach((slide, idx) => {
    if (idx > 0) doc.addPage([297, 167], "landscape");

    if (slide.kind === "cover") {
      doc.setFillColor(ar, ag, ab);
      doc.rect(0, 0, W, H, "F");
      if (b.logoDataUrl) {
        try {
          doc.addImage(b.logoDataUrl, "PNG", M, M, 22, 22);
        } catch {
          /* ignore */
        }
      }
      T(b.cabinet.toUpperCase(), W - M, M + 8, { align: "right", size: 12, bold: true, color: [255, 255, 255] });
      const titleLines = wrap(slide.title, W - 2 * M, 28, true);
      let ty = H / 2 - (titleLines.length - 1) * 6 - 6;
      titleLines.forEach((l) => {
        T(l, M, ty, { size: 28, bold: true, color: [255, 255, 255] });
        ty += 12;
      });
      T(slide.subtitle, M, ty + 4, { size: 14, color: [255, 255, 255] });
      T(`${slide.client}${slide.secteur ? "  •  " + slide.secteur : ""}   —   ${new Date().toLocaleDateString("fr-FR")}`, M, H - M, { size: 11, color: [255, 255, 255] });
      return;
    }

    if (slide.kind === "agenda") {
      slideHeader("Programme");
      const top = 42;
      const gap = Math.min(13, (H - top - 16) / Math.max(slide.items.length, 1));
      const sz = gap < 10 ? 12 : 15;
      let yy = top + gap / 2;
      slide.items.forEach((it) => {
        doc.setFillColor(ar, ag, ab);
        doc.circle(M + 2, yy - 1.6, 1.5, "F");
        T(it, M + 9, yy, { size: sz, color: [40, 40, 40] });
        yy += gap;
      });
      footerSlide(idx);
      return;
    }

    if (slide.kind === "section") {
      doc.setFillColor(ar, ag, ab);
      doc.rect(0, 0, W, H, "F");
      T(`MODULE ${slide.index} / ${slide.total}`, M, 46, { size: 14, bold: true, color: [255, 255, 255] });
      const tl = wrap(slide.title, W - 2 * M, 26, true);
      let ty = 70;
      tl.forEach((l) => {
        T(l, M, ty, { size: 26, bold: true, color: [255, 255, 255] });
        ty += 11;
      });
      wrap(slide.objectif, W - 2 * M, 13).forEach((l) => {
        T(l, M, ty + 2, { size: 13, color: [255, 255, 255] });
        ty += 7;
      });
      return;
    }

    if (slide.kind === "content") {
      slideHeader(`Module ${slide.moduleIndex} — ${slide.moduleTitre}`);
      // Titre de la diapo
      let yy = 40;
      wrap(slide.title, W - 2 * M, 22, true).forEach((l) => {
        T(l, M, yy, { size: 22, bold: true, color: [25, 25, 25] });
        yy += 9.5;
      });
      yy += 4;
      // Puces
      slide.points.forEach((p) => {
        const lines = wrap(p, W - 2 * M - 8, 13);
        doc.setFillColor(ar, ag, ab);
        doc.circle(M + 2, yy - 1.6, 1.5, "F");
        lines.forEach((l) => {
          T(l, M + 8, yy, { size: 13, color: [50, 50, 50] });
          yy += 6.6;
        });
        yy += 1.5;
      });
      // Callouts exemple / conseil en bas
      let cy = H - 16;
      if (slide.conseils) {
        const cl = wrap(`Conseil : ${slide.conseils}`, W - 2 * M - 6, 10.5);
        cy -= cl.length * 5;
        cl.forEach((l, i) => T(l, M, cy + 4 + i * 5, { size: 10.5, color: [120, 120, 120] }));
      }
      if (slide.exemple) {
        const exLines = wrap(slide.exemple, W - 2 * M - 34, 10.5);
        const boxH = exLines.length * 5 + 8;
        const boxY = (slide.conseils ? cy - boxH - 4 : H - 16 - boxH);
        if (boxY > yy) {
          doc.setFillColor(245, 247, 252);
          doc.roundedRect(M, boxY, W - 2 * M, boxH, 2, 2, "F");
          T("EXEMPLE", M + 5, boxY + 6, { size: 8.5, bold: true, color: [ar, ag, ab] });
          exLines.forEach((l, i) => T(l, M + 32, boxY + 6 + i * 5, { size: 10.5, color: [60, 60, 60] }));
        }
      }
      footerSlide(idx);
      return;
    }

    if (slide.kind === "closing") {
      doc.setFillColor(ar, ag, ab);
      doc.rect(0, 0, W, H, "F");
      T(slide.title, M, 60, { size: 34, bold: true, color: [255, 255, 255] });
      wrap(slide.text, W - 2 * M, 13).forEach((l, i) => T(l, M, 78 + i * 7, { size: 13, color: [255, 255, 255] }));
      T(slide.cabinet, M, H - M, { size: 12, bold: true, color: [255, 255, 255] });
      return;
    }
  });

  function slideHeader(label: string) {
    doc.setFillColor(ar, ag, ab);
    doc.rect(0, 0, W, 4, "F");
    T(label, M, 18, { size: 11, bold: true, color: [ar, ag, ab] });
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.3);
    doc.line(M, 22, W - M, 22);
  }
  function footerSlide(i: number) {
    T(b.cabinet, M, H - 7, { size: 8.5, color: [170, 170, 170] });
    T(`${i + 1} / ${deck.length}`, W - M, H - 7, { size: 8.5, align: "right", color: [170, 170, 170] });
  }

  doc.save(`diapositives-${slug(meta.client)}.pdf`);
}

export type { DeckSlide };
