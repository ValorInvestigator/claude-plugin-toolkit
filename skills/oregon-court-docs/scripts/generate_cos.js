/**
 * Generate Certificate of Service — Catalyst Fee Objection
 * Oregon Circuit Court format: Courier New 12pt, 1.5 spacing, 1" margins
 * Service info from Pray's actual filing (Catalyst Probate Filing.pdf)
 */
const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, Header, Footer, PageNumber, NumberFormat, UnderlineType } = require("docx");
const fs = require("fs");

const BASE = "C:\\Users\\Big Levi Local\\Desktop\\Catalyst Billing Package";
const OUT = `${BASE}\\CERTIFICATE OF SERVICE - Catalyst Fee Objection.docx`;

// Helper: create a formatted run
function h(text, opts = {}) {
  return new TextRun({
    text,
    font: "Courier New",
    size: opts.size || 24, // 12pt = 24 half-points
    bold: opts.bold || false,
    underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
  });
}

// Space-padded caption line (65 chars max for Courier New 12pt, 1" margins)
const PAD = 34;
function capLine(left, right, afterVal = 0, rightBold = false) {
  const padded = (left || "").padEnd(PAD) + ")";
  const fullText = right ? padded + "  " : padded;
  const runs = [h(fullText)];
  if (right) runs.push(h(right, { bold: rightBold }));
  return new Paragraph({
    spacing: { after: afterVal },
    children: runs,
  });
}

// Body paragraph with first-line indent
function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 120, line: 360 }, // 1.5 spacing
    indent: { firstLine: opts.noIndent ? 0 : 720 },
    children: [h(text)],
  });
}

// Simple line (no indent)
function line(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 0, before: opts.before || 0, line: opts.lineSpacing || 240 },
    indent: { left: opts.left || 0 },
    children: [h(text, { bold: opts.bold, underline: opts.underline, size: opts.size })],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children: [
        // ── Court Header ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
          children: [h("IN THE CIRCUIT COURT OF THE STATE OF OREGON", { bold: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [h("FOR THE COUNTY OF UNION", { bold: true })],
        }),

        // ── Caption ──
        capLine("In the Matter of the", "Case No. 25PB01832"),
        capLine("", ""),
        capLine("ESTATE OF RUSSELL H.", "CERTIFICATE OF SERVICE", 0, true),
        capLine("BINGAMAN,", ""),
        capLine("", "(CATALYST LAW LLC"),
        capLine("     Decedent.", "ATTORNEY FEES)", 360),

        // ── Title ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240, line: 360 },
          children: [h("CERTIFICATE OF SERVICE", { bold: true })],
        }),

        // ── Body ──
        bodyPara(
          "I HEREBY CERTIFY that on February 23, 2026, " +
          "I caused to be served a true and correct copy " +
          "of the foregoing OBJECTION TO PETITION FOR " +
          "LIMITED JUDGMENT (CATALYST LAW LLC ATTORNEY " +
          "FEES), EXHIBIT LIST, and supporting Exhibits " +
          "A through G upon the following party entitled " +
          "to service:",
          { after: 200 }
        ),

        // ── Served Party Header ──
        new Paragraph({
          spacing: { after: 0, before: 200, line: 240 },
          indent: { left: 1440 },
          children: [h("Prior Attorneys for Personal Representative", { bold: true, underline: true })],
        }),

        // ── Served Party Info ──
        line("CATALYST LAW, LLC", { left: 1440, bold: true }),
        line("Kimberly Pray, OSB #084464", { left: 1440 }),
        line("kimberly@catalystlawllc.com", { left: 1440, underline: true }),
        line("11820 SW King James Pl., Suite 50", { left: 1440 }),
        line("King City, OR 97224", { left: 1440 }),
        line("Phone:  (503) 207-1711", { left: 1440 }),
        line("Fax:    (503) 710-9057", { left: 1440 }),

        // ── Service Method ──
        bodyPara("by the following method(s):", { after: 120 }),

        // Checkboxes
        line("\u2612  Email/Electronic Service", { left: 1440 }),
        line("\u2610  First Class U.S. Mail", { left: 1440 }),
        line("\u2610  Hand Delivery", { left: 1440 }),
        line("\u2610  iCourt/Odyssey File & Serve", { left: 1440 }),

        // ── DATED + Signature ──
        new Paragraph({
          spacing: { before: 480, after: 0 },
          children: [h("DATED: Feb. 23, 2026.")],
        }),

        // s/ signature line
        new Paragraph({
          spacing: { before: 360, after: 0 },
          indent: { left: 4320 },
          children: [h("s/ Carol J. Fredrick", { underline: true })],
        }),
        new Paragraph({
          spacing: { after: 0 },
          indent: { left: 4320 },
          children: [h("Carol J. Fredrick, OSB #883705")],
        }),

        // ── Filing Attorney Info Block ──
        new Paragraph({
          spacing: { before: 360, after: 0, line: 240 },
          children: [h("Current Attorneys for Personal", { bold: true, underline: true })],
        }),
        new Paragraph({
          spacing: { after: 0, line: 240 },
          children: [h("Representative", { bold: true, underline: true })],
        }),
        line("FREDRICK & FINCH, LLP", { bold: true }),
        line("Carol J. Fredrick, OSB #883705"),
        line("carol@fredrickandfinch.com", { underline: true }),
        line("2046 N. Hwy 99W, Suite D"),
        line("McMinnville, OR 97128"),
        line("Phone:  (503) 435-1455"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT, buffer);
  console.log("Created: CERTIFICATE OF SERVICE - Catalyst Fee Objection.docx");
  console.log("\nFormat details:");
  console.log("  - Courier New 12pt, 1.5 spacing body, 1\" margins");
  console.log("  - Space-padded caption (65 char width)");
  console.log("  - Pray's info from actual filing: OSB #084464, (503) 207-1711");
  console.log("  - s/ Carol J. Fredrick signature (matching Pray's s/ format)");
  console.log("  - 'Prior Attorneys for Personal Representative' (bold/underline)");
  console.log("  - 'Current Attorneys for Personal Representative' (bold/underline)");
});
