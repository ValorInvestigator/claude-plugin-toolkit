/**
 * Generate UPDATED Declaration of Patricia Bingaman
 * With specific documented facts from Bingaman Master Files
 * Oregon Circuit Court: Courier New 12pt, 1.5 spacing, 1" margins
 */
const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } = require("docx");
const fs = require("fs");

const BASE = "C:\\Users\\Big Levi Local\\Desktop\\Catalyst Billing Package";

function h(text, opts = {}) {
  return new TextRun({
    text,
    font: "Courier New",
    size: opts.size || 24,
    bold: opts.bold || false,
    underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
    italics: opts.italics || false,
  });
}

const PAD = 34;
function capLine(left, right, afterVal = 0, rightBold = false) {
  const padded = (left || "").padEnd(PAD) + ")";
  const fullText = right ? padded + "  " : padded;
  const runs = [h(fullText)];
  if (right) runs.push(h(right, { bold: rightBold }));
  return new Paragraph({ spacing: { after: afterVal }, children: runs });
}

function centered(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.after || 0, before: opts.before || 0 },
    children: [h(text, { bold: opts.bold })],
  });
}

function body(runs, opts = {}) {
  const children = typeof runs === "string" ? [h(runs)] : runs;
  return new Paragraph({
    spacing: { after: opts.after || 120, before: opts.before || 0, line: 360 },
    indent: { firstLine: opts.noIndent ? 0 : 720, left: opts.left || 0 },
    children,
  });
}

function line(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 0, before: opts.before || 0, line: opts.lineSpacing || 240 },
    indent: { left: opts.left || 0 },
    children: [h(text, { bold: opts.bold, underline: opts.underline, italics: opts.italics })],
  });
}

const sectionProps = {
  page: {
    size: { width: 12240, height: 15840 },
    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
  },
};

const children = [
  // Court header
  centered("IN THE CIRCUIT COURT OF THE STATE OF OREGON", { bold: true }),
  centered("FOR THE COUNTY OF UNION", { bold: true, after: 240 }),

  // Caption
  capLine("In the Matter of the", "Case No. 25PB01832"),
  capLine("", ""),
  capLine("ESTATE OF RUSSELL H.", "DECLARATION OF PATRICIA", 0, true),
  capLine("BINGAMAN,", "BINGAMAN IN SUPPORT OF", 0, true),
  capLine("", "MOTION FOR ORDER COMPELLING"),
  capLine("     Decedent.", "PRODUCTION OF RECORDS", 360),

  // Opening
  body([
    h("I, Patricia Bingaman, declare under penalty of perjury pursuant to ORS 162.055 that the following is true and correct:"),
  ], { after: 200 }),

  // Para 1 — Appointment
  centered("1.", { after: 120 }),
  body([
    h("I am the Personal Representative of the Estate of Russell H. Bingaman, appointed by this Court in Case No. 25PB01832. Letters Testamentary were issued on or about February 28, 2025."),
  ]),

  // Para 2 — Residence
  centered("2.", { after: 120 }),
  body([
    h("Russell H. Bingaman was my husband. He resided at Nadine\u2019s Nest, an adult foster home located at 605 16th Street, La Grande, Oregon 97850, owned and operated by Tempie Bartell (\u201cBartell\u201d). Russell was placed at Nadine\u2019s Nest approximately in 2021 during the pendency of a guardianship proceeding (Case No. 23PR02271) and remained there until his death on January 29, 2025."),
  ]),

  // Para 3 — Duty
  centered("3.", { after: 120 }),
  body([
    h("As Personal Representative, I have a duty to take possession of and account for the property and records of the estate, to determine whether any claims exist on behalf of the estate, and to preserve, settle and distribute the estate. ORS 114.225; ORS 114.265."),
  ]),

  // Para 4 — Why records matter
  centered("4.", { after: 120 }),
  body([
    h("The decedent\u2019s care records from Nadine\u2019s Nest are critical to the administration of this estate. During Russell\u2019s residence, I personally observed conditions and treatment that I believe warrant investigation, including concerns about medication administration, quality of care, visitor restrictions imposed without lawful authority, and potential financial exploitation. Determining whether claims exist on behalf of the estate for negligence, abuse, or exploitation requires access to the facility\u2019s records."),
  ]),

  // Para 5 — Requests and refusals
  centered("5.", { after: 120 }),
  body([
    h("I have made repeated requests for Russell\u2019s records from Nadine\u2019s Nest and Tempie Bartell, both personally and through counsel, over a period exceeding one year. These requests have been refused or ignored:"),
  ]),

  // Sub-para a
  body([
    h("a. On or about September 5, 2025, my authorized representative sent a written communication to my probate attorney, Carol J. Fredrick, identifying as the top priority that I needed \u201cRussell\u2019s file from the care home, Nadine\u2019s Nest.\u201d That communication stated: \u201cAs I\u2019m sure you realized, there has been criminal misconduct and it\u2019s Patty\u2019s right and duty as PR to get justice for her husband.\u201d Ms. Fredrick was asked to assist in obtaining these records."),
  ], { left: 720, noIndent: true }),

  // Sub-para b
  body([
    h("b. Prior to and following the September 2025 communication, I and/or my representatives made additional requests to Bartell and Nadine\u2019s Nest for Russell\u2019s records, including his complete care file, medication administration records, incident reports, visitor logs, and financial records. ["),
    h("Patty: Please add the approximate dates and methods of any direct requests you or anyone on your behalf made to Bartell or the foster home — phone calls, in-person requests, letters, emails, requests through DHS, etc.", { italics: true }),
    h("]"),
  ], { left: 720, noIndent: true }),

  // Sub-para c
  body([
    h("c. In approximately February 2026, a complaint was filed with the U.S. Department of Health and Human Services, Office for Civil Rights (\u201cHHS OCR\u201d) regarding Nadine\u2019s Nest\u2019s refusal to release Russell\u2019s protected health information to me as his Personal Representative. As of the date of this declaration, HHS has not taken enforcement action."),
  ], { left: 720, noIndent: true }),

  // Sub-para d
  body([
    h("d. A complaint was also filed with the Oregon Long-Term Care Ombudsman regarding Bartell\u2019s obstruction of records access."),
  ], { left: 720, noIndent: true }),

  // Sub-para e
  body([
    h("e. Despite all of the foregoing, to date, Bartell and Nadine\u2019s Nest have refused and/or failed to produce any records pertaining to Russell H. Bingaman to me or to my counsel."),
  ], { left: 720, noIndent: true, after: 200 }),

  // Para 6 — Pattern of obstruction
  centered("6.", { after: 120 }),
  body([
    h("This refusal is part of a pattern of obstruction by Bartell. During Russell\u2019s lifetime, Bartell imposed unlawful visitor restrictions on me through an Individually-Based Limitations (\u201cIBL\u201d) form dated August 14, 2023, which restricted my visits to twice weekly, supervised by one of my children, for no more than thirty minutes. On October 26, 2023, Cody Yeates of the Oregon Department of Human Services confirmed by email that there was no legal basis to restrict me from seeing my husband. Five days later, on October 31, 2023, Bartell called law enforcement and had me removed from the premises while I was visiting Russell."),
  ]),

  // Para 7 — Harm
  centered("7.", { after: 120 }),
  body([
    h("The continued refusal to produce these records has materially impaired my ability to administer the estate, including my ability to:"),
  ]),

  body([h("a. Determine whether claims exist on behalf of the estate for negligence, abuse, or financial exploitation;")], { left: 720, noIndent: true }),
  body([h("b. Verify the propriety of payments made to Nadine\u2019s Nest from estate or guardianship funds;")], { left: 720, noIndent: true }),
  body([h("c. Investigate concerns regarding the medication administered to Russell, including whether medications were administered without proper authorization;")], { left: 720, noIndent: true }),
  body([h("d. Complete the estate inventory and final accounting; and")], { left: 720, noIndent: true }),
  body([h("e. Account to heirs, devisees, and this Court regarding the decedent\u2019s care and condition during his residence.")], { left: 720, noIndent: true, after: 200 }),

  // Para 8 — Reason to believe
  centered("8.", { after: 120 }),
  body([
    h("I have reason to believe, based on my personal observations during visits to Nadine\u2019s Nest and on information gathered in connection with my duties as Personal Representative, that records in the possession of Nadine\u2019s Nest contain information that is necessary to the administration of this estate and that may support claims on behalf of the estate."),
  ]),

  // Para 9 — Personal knowledge
  centered("9.", { after: 120 }),
  body([
    h("I make this declaration based on my personal knowledge and, where stated, on information and belief."),
  ], { after: 200 }),

  // Perjury
  body([
    h("I hereby declare that the above statement is true to the best of my knowledge and belief, and that I understand it is made for use as evidence in court and is subject to penalty for perjury.", { bold: true }),
  ], { after: 200 }),

  // DATED
  new Paragraph({
    spacing: { before: 360, after: 0 },
    children: [h("DATED: ______________________")],
  }),

  // Signature
  new Paragraph({
    spacing: { before: 480, after: 0 },
    indent: { left: 4320 },
    children: [h("_________________________________")],
  }),
  new Paragraph({
    spacing: { after: 0 },
    indent: { left: 4320 },
    children: [h("Patricia Bingaman")],
  }),
  new Paragraph({
    spacing: { after: 0 },
    indent: { left: 4320 },
    children: [h("Personal Representative")],
  }),
];

const doc = new Document({
  sections: [{ properties: sectionProps, children }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(`${BASE}\\DECLARATION OF PATRICIA BINGAMAN - Motion to Compel.docx`, buffer);
  console.log("Created: DECLARATION OF PATRICIA BINGAMAN - Motion to Compel.docx");
  console.log("\nPopulated with documented facts:");
  console.log("  - 605 16th St, La Grande, OR 97850 (from IBL form)");
  console.log("  - Sep 5, 2025 email to Carol re: records (from EML)");
  console.log("  - HHS OCR HIPAA complaint filed Feb 2026 (from action items)");
  console.log("  - Lenox/Ombudsman complaint re: obstruction (from enrichment)");
  console.log("  - IBL form dated Aug 14, 2023 (from extracted text)");
  console.log("  - Cody Yeates DHS email Oct 26, 2023 (from extracted text)");
  console.log("  - Police called Oct 31, 2023 (from CAD records)");
  console.log("\nOne remaining blank for Patty:");
  console.log("  - Para 5(b): direct requests to Bartell (dates/methods)");
});
