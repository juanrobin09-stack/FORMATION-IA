// ===========================================================================
// FORMATOR AI - Generation de PDF professionnels (jsPDF, cote client)
// ===========================================================================

"use client";

import { jsPDF } from "jspdf";
import type {
  AuditResult,
  Branding,
  Devis,
  Exercice,
  FormationResult,
} from "./types";

interface DocMeta {
  client: string;
  secteur?: string;
  branding: Branding;
}

// Helper de mise en page : gere les sauts de page et le rythme vertical.
class Layout {
  doc: jsPDF;
  y = 0;
  margin = 18;
  width: number;
  height: number;
  accent: [number, number, number];
  branding: Branding;

  constructor(branding: Branding) {
    this.doc = new jsPDF({ unit: "mm", format: "a4" });
    this.width = this.doc.internal.pageSize.getWidth();
    this.height = this.doc.internal.pageSize.getHeight();
    this.accent = hexToRgb(branding.couleur) ?? [37, 99, 235];
    this.branding = branding;
    this.y = this.margin;
  }

  ensure(space: number) {
    if (this.y + space > this.height - this.margin) {
      this.doc.addPage();
      this.y = this.margin;
    }
  }

  cover(title: string, subtitle: string, meta: DocMeta) {
    const [r, g, b] = this.accent;
    this.doc.setFillColor(r, g, b);
    this.doc.rect(0, 0, this.width, 70, "F");

    if (meta.branding.logoDataUrl) {
      try {
        this.doc.addImage(meta.branding.logoDataUrl, "PNG", this.margin, 14, 26, 26);
      } catch {
        /* logo invalide ignore */
      }
    }

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.text(meta.branding.cabinet.toUpperCase(), this.width - this.margin, 22, {
      align: "right",
    });

    this.doc.setFontSize(26);
    this.doc.text(wrap(this.doc, title, this.width - 2 * this.margin), this.margin, 50);

    this.doc.setTextColor(20, 20, 20);
    this.y = 90;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(13);
    this.doc.text(subtitle, this.margin, this.y);
    this.y += 8;
    this.doc.setFontSize(10);
    this.doc.setTextColor(110, 110, 110);
    this.doc.text(
      `Client : ${meta.client}${meta.secteur ? "  -  Secteur : " + meta.secteur : ""}`,
      this.margin,
      this.y,
    );
    this.y += 5;
    this.doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, this.margin, this.y);
    this.y += 14;
    this.doc.setTextColor(20, 20, 20);
  }

  h1(text: string) {
    this.ensure(16);
    const [r, g, b] = this.accent;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(16);
    this.doc.setTextColor(r, g, b);
    this.doc.text(text, this.margin, this.y);
    this.y += 3;
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(0.6);
    this.doc.line(this.margin, this.y, this.width - this.margin, this.y);
    this.y += 7;
    this.doc.setTextColor(20, 20, 20);
  }

  h2(text: string) {
    this.ensure(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.setTextColor(20, 20, 20);
    this.doc.text(wrap(this.doc, text, this.width - 2 * this.margin), this.margin, this.y);
    this.y += 7;
  }

  label(text: string) {
    this.ensure(8);
    const [r, g, b] = this.accent;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(r, g, b);
    this.doc.text(text.toUpperCase(), this.margin, this.y);
    this.y += 5;
    this.doc.setTextColor(20, 20, 20);
  }

  body(text: string) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(40, 40, 40);
    const lines = wrap(this.doc, text, this.width - 2 * this.margin);
    for (const line of lines as string[]) {
      this.ensure(6);
      this.doc.text(line, this.margin, this.y);
      this.y += 5.4;
    }
    this.y += 2;
  }

  bullet(text: string) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(40, 40, 40);
    const lines = wrap(this.doc, text, this.width - 2 * this.margin - 6) as string[];
    this.ensure(6);
    const [r, g, b] = this.accent;
    this.doc.setFillColor(r, g, b);
    this.doc.circle(this.margin + 1.2, this.y - 1.3, 1, "F");
    lines.forEach((line, i) => {
      this.ensure(6);
      this.doc.text(line, this.margin + 6, this.y);
      this.y += 5.4;
      if (i < lines.length - 1) this.ensure(6);
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
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        `${this.branding.cabinet}  -  Genere avec Formator AI`,
        this.margin,
        this.height - 8,
      );
      this.doc.text(`${i} / ${pages}`, this.width - this.margin, this.height - 8, {
        align: "right",
      });
    }
  }

  save(filename: string) {
    this.footer();
    this.doc.save(filename);
  }
}

function wrap(doc: jsPDF, text: string, maxWidth: number) {
  return doc.splitTextToSize(text || "", maxWidth);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Documents ---

export function pdfAudit(audit: AuditResult, meta: DocMeta) {
  const l = new Layout(meta.branding);
  l.cover("Audit IA", "Diagnostic et opportunites d'intelligence artificielle", meta);

  l.h1("Resume de l'entreprise");
  l.body(audit.resumeEntreprise);

  l.h1("Opportunites IA");
  audit.opportunites.forEach((o) => {
    l.h2(o.titre);
    l.body(o.description);
  });

  l.h1("Gains de temps estimes");
  l.body(audit.gainsTemps);

  l.h1("Cas d'usage recommandes");
  audit.casUsage.forEach((c) => {
    l.h2(c.titre);
    l.body(c.description);
  });

  l.h1("Priorites");
  audit.priorites.forEach((p) => l.bullet(p));

  l.save(`audit-${slug(meta.client)}.pdf`);
}

export function pdfFormation(formation: FormationResult, meta: DocMeta) {
  const l = new Layout(meta.branding);
  l.cover("Support de formation", formation.titre, meta);

  l.h1("Introduction");
  l.body(formation.introduction);

  formation.modules.forEach((m, i) => {
    l.h1(`Module ${i + 1} : ${m.titre}`);
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

export function pdfExercices(exercices: Exercice[], meta: DocMeta) {
  const l = new Layout(meta.branding);
  l.cover("Exercices pratiques", "Cahier d'exercices avec corriges", meta);
  exercices.forEach((e, i) => {
    l.h1(e.titre || `Exercice ${i + 1}`);
    l.label("Consigne");
    l.body(e.consigne);
    l.label("Corrige");
    l.body(e.corrige);
    l.space(2);
  });
  l.save(`exercices-${slug(meta.client)}.pdf`);
}

export function pdfDevis(devis: Devis, branding: Branding) {
  const l = new Layout(branding);
  l.cover("Devis", "Proposition de formation IA", {
    client: devis.entreprise,
    branding,
  });

  l.h1("Detail de la prestation");
  l.label("Entreprise");
  l.body(devis.entreprise);
  l.label("Duree de la formation");
  l.body(devis.duree);
  l.label("Nombre de participants");
  l.body(String(devis.nbParticipants));
  l.label("Date");
  l.body(new Date(devis.date).toLocaleDateString("fr-FR"));

  l.space(4);
  l.h1("Montant");
  l.h2(`Total : ${devis.prix.toLocaleString("fr-FR")} EUR`);

  l.h1("Conditions");
  l.body(devis.conditions || "Reglement a 30 jours. Formation realisable en presentiel ou distanciel.");

  l.space(10);
  l.label("Signature (client)");
  l.space(18);
  l.body("________________________________");

  l.save(`devis-${slug(devis.entreprise)}.pdf`);
}

export function pdfAttestation(
  meta: DocMeta & { intitule: string; duree: string; participant?: string },
) {
  const l = new Layout(meta.branding);
  l.cover("Attestation de formation", meta.intitule, meta);
  l.space(6);
  l.h1("Atteste que");
  l.body(
    `${meta.participant ? meta.participant : "Le participant designe ci-dessous"} a suivi la formation "${meta.intitule}" d'une duree de ${meta.duree}, dispensee par ${meta.branding.cabinet} pour ${meta.client}.`,
  );
  l.space(20);
  l.label("Fait le");
  l.body(new Date().toLocaleDateString("fr-FR"));
  l.space(14);
  l.label("Signature du formateur");
  l.space(16);
  l.body("________________________________");
  l.save(`attestation-${slug(meta.client)}.pdf`);
}
