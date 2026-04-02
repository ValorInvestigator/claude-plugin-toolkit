/**
 * Generate Motion for Order Compelling Production of Records
 * + Supporting Declaration of Patricia Bingaman
 * Oregon Circuit Court: Courier New 12pt, 1.5 spacing, 1" margins
 * Case No. 25PB01832 — Estate of Russell H. Bingaman
 */
const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType, PageBreak, Footer, PageNumber, NumberFormat } = require("docx");
const fs = require("fs");

const BASE = "C:\\Users\\Big Levi Local\\Desktop\\Catalyst Billing Package";

// ─── Helpers ────────────────────────────────────────
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
    children: [h(text, { bold: opts.bold, underline: opts.underline })],
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
    alignment: opts.center ? AlignmentType.CENTER : undefined,
    children: [h(text, { bold: opts.bold, underline: opts.underline, italics: opts.italics })],
  });
}

function slashMarks(count) {
  const marks = [];
  for (let i = 0; i < count; i++) {
    marks.push(line("//", { after: 0 }));
  }
  return marks;
}

// ─── Section properties ─────────────────────────────
const sectionProps = {
  page: {
    size: { width: 12240, height: 15840 },
    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
  },
};

// ═══════════════════════════════════════════════════
// DOCUMENT 1: MOTION TO COMPEL
// ═══════════════════════════════════════════════════
const motionChildren = [
  // Court header
  centered("IN THE CIRCUIT COURT OF THE STATE OF OREGON", { bold: true }),
  centered("FOR THE COUNTY OF UNION", { bold: true, after: 240 }),

  // Caption
  capLine("In the Matter of the", "Case No. 25PB01832"),
  capLine("", ""),
  capLine("ESTATE OF RUSSELL H.", "MOTION FOR ORDER COMPELLING", 0, true),
  capLine("BINGAMAN,", "PRODUCTION OF RECORDS", 0, true),
  capLine("", ""),
  capLine("     Decedent.", "", 360),

  // Body
  body([
    h("COMES NOW Patricia Bingaman, Personal Representative of the Estate of Russell H. Bingaman, through her attorney Carol J. Fredrick, and respectfully moves this Court for an Order compelling Nadine\u2019s Nest Adult Foster Home (\u201cNadine\u2019s Nest\u201d), owned and operated by Tempie Bartell (\u201cBartell\u201d), to produce all records pertaining to the decedent, Russell H. Bingaman, in support whereof states as follows:"),
  ], { after: 200 }),

  // Section I
  centered("I.", { before: 120, after: 120, bold: true }),
  centered("BACKGROUND", { bold: true, underline: true, after: 200 }),

  body([
    h("Russell H. Bingaman resided at Nadine\u2019s Nest, an adult foster home located in Union County, Oregon, operated by Bartell, from approximately 2021 until his death on January 29, 2025."),
  ]),

  body([
    h("Patricia Bingaman was appointed Personal Representative of the Estate of Russell H. Bingaman on or about February 28, 2025, and Letters Testamentary were issued by this Court in Case No. 25PB01832."),
  ]),

  body([
    h("As Personal Representative, Patricia Bingaman has a statutory duty to take possession and control of the estate, collect income, preserve assets, and administer the estate expeditiously. ORS 114.225; ORS 114.265."),
  ]),

  body([
    h("The decedent\u2019s care records, financial records, medication administration records, incident reports, visitor logs, and all other documents maintained by Nadine\u2019s Nest relating to Russell H. Bingaman are necessary for the proper administration of this estate, including but not limited to:"),
  ]),

  // Sub-points
  body([h("a. Determining whether any claims exist on behalf of the estate for negligence, abuse, exploitation, or wrongful conduct;")], { left: 720, noIndent: true }),
  body([h("b. Verifying the propriety of charges paid to Nadine\u2019s Nest from estate or guardianship funds;")], { left: 720, noIndent: true }),
  body([h("c. Accounting to heirs, devisees, and this Court regarding the decedent\u2019s care and condition;")], { left: 720, noIndent: true }),
  body([h("d. Fulfilling the Personal Representative\u2019s obligation to prosecute claims of the decedent, including claims for personal injury, pursuant to ORS 114.305(19)-(20);")], { left: 720, noIndent: true }),
  body([h("e. Completing the estate inventory and final accounting.")], { left: 720, noIndent: true, after: 200 }),

  // Section II
  centered("II.", { before: 120, after: 120, bold: true }),
  centered("REPEATED REQUESTS AND REFUSAL", { bold: true, underline: true, after: 200 }),

  body([
    h("Since at least September 2025, the Personal Representative, through counsel and through her authorized agent, has repeatedly requested that Bartell and Nadine\u2019s Nest produce the decedent\u2019s records. These requests have been refused, ignored, or otherwise not complied with for over one year."),
  ]),

  body([
    h("The specific requests and refusals are set forth in the Declaration of Patricia Bingaman filed concurrently herewith."),
  ]),

  body([
    h("The continued refusal to produce these records has materially impaired the Personal Representative\u2019s ability to fulfill her statutory duties and has delayed the administration of this estate."),
  ], { after: 200 }),

  // Section III
  centered("III.", { before: 120, after: 120, bold: true }),
  centered("LEGAL AUTHORITY", { bold: true, underline: true, after: 200 }),

  body([
    h("A. ORS 114.425 \u2014 Discovery of Property, Writings and Information", { bold: true, underline: true }),
  ], { noIndent: true }),

  body([
    h("ORS 114.425(1) provides that the Court may order "),
    h("any person", { italics: true }),
    h(" to appear and give testimony by deposition if it appears probable that the person:"),
  ]),

  body([h("\u201c(c) Has concealed, secreted or disposed of any writing, instrument or document pertaining to the estate;\u201d")], { left: 720, noIndent: true }),
  body([h("\u201c(d) Has knowledge or information that is necessary to the administration of the estate.\u201d")], { left: 720, noIndent: true }),

  body([
    h("ORS 114.425(2) further provides that if a person so ordered fails to appear or to answer questions, "),
    h("\u201cthe person is in contempt and may be punished as for other contempts.\u201d", { italics: true }),
  ], { after: 200 }),

  body([
    h("B. ORS 111.095(4) \u2014 Powers of the Probate Court", { bold: true, underline: true }),
  ], { noIndent: true }),

  body([
    h("ORS 111.095(4)(a) grants this Court the power to \u201ccompel the attendance of, or require the response to inquiries by and production of documents subject to discovery under ORCP 36 from, any person \u2026 who may have knowledge about the decedent\u2019s taxes, financial affairs or property.\u201d"),
  ]),

  body([
    h("ORS 111.095(4)(e) grants this Court the power to \u201crequire delivery of possession of property of the decedent, including records, accounts and documents relating to that property.\u201d"),
  ]),

  body([
    h("ORS 111.095(4)(f) grants this Court the power to \u201crequire the fiduciary to produce any and all records that might provide information about the condition of the estate\u2019s property.\u201d"),
  ], { after: 200 }),

  body([
    h("C. ORS 192.573 \u2014 Health Records of Deceased Individual", { bold: true, underline: true }),
  ], { noIndent: true }),

  body([
    h("Under ORS 192.573 and ORS 192.558, the Personal Representative appointed under ORS chapter 113 is the \u201cpersonal representative\u201d of the deceased individual for purposes of Oregon\u2019s protected health information statutes. Patricia Bingaman, as the court-appointed Personal Representative, has the legal right to access the decedent\u2019s health records. Nadine\u2019s Nest may not refuse production on the basis of patient privacy or HIPAA, as the Personal Representative stands in the shoes of the decedent for purposes of health information access."),
  ], { after: 200 }),

  body([
    h("D. ORS 443.880 \u2014 Residential Facility Has No Claim to Records", { bold: true, underline: true }),
  ], { noIndent: true }),

  body([
    h("ORS 443.880 provides that the admission of a person to a residential facility does not create in the facility any authority to manage, use or dispose of any property of the resident. The decedent\u2019s records, to the extent they constitute his personal information and property, are not the property of Nadine\u2019s Nest to withhold."),
  ], { after: 200 }),

  // Section IV
  centered("IV.", { before: 120, after: 120, bold: true }),
  centered("SPECIFIC RECORDS REQUESTED", { bold: true, underline: true, after: 200 }),

  body([
    h("The Personal Representative requests that this Court order Bartell and Nadine\u2019s Nest to produce the following categories of records pertaining to Russell H. Bingaman:"),
  ]),

  body([h("1. All care records, including daily care logs, caregiver notes, and service plans;")], { left: 720, noIndent: true }),
  body([h("2. All medication administration records (MARs);")], { left: 720, noIndent: true }),
  body([h("3. All incident reports, injury reports, and fall reports;")], { left: 720, noIndent: true }),
  body([h("4. All visitor logs and records of visits;")], { left: 720, noIndent: true }),
  body([h("5. All financial records relating to payments received for the decedent\u2019s care, including invoices, receipts, and billing statements;")], { left: 720, noIndent: true }),
  body([h("6. All correspondence and communications regarding the decedent, including communications with guardians, conservators, family members, hospice providers, medical providers, DHS, and any other persons or agencies;")], { left: 720, noIndent: true }),
  body([h("7. All photographs, videos, or other recordings of or relating to the decedent;")], { left: 720, noIndent: true }),
  body([h("8. The decedent\u2019s complete resident file, including the admission agreement, all assessments, and any discharge or transfer documentation;")], { left: 720, noIndent: true }),
  body([h("9. Any and all other documents, records, or information pertaining to Russell H. Bingaman in the possession, custody, or control of Bartell or Nadine\u2019s Nest.")], { left: 720, noIndent: true, after: 200 }),

  // WHEREFORE
  centered("V.", { before: 120, after: 120, bold: true }),
  centered("PRAYER FOR RELIEF", { bold: true, underline: true, after: 200 }),

  body("WHEREFORE, the Personal Representative respectfully requests that this Court:"),

  body([h("a. Enter an Order compelling Tempie Bartell and Nadine\u2019s Nest Adult Foster Home to produce all records identified in Section IV above within fourteen (14) days of entry of the Order;")], { left: 720, noIndent: true }),
  body([h("b. Order that failure to comply with the Order shall subject Bartell to contempt of court pursuant to ORS 114.425(2);")], { left: 720, noIndent: true }),
  body([h("c. Award the Personal Representative her reasonable attorney fees and costs incurred in bringing this Motion; and")], { left: 720, noIndent: true }),
  body([h("d. Grant such other and further relief as this Court deems just and proper.")], { left: 720, noIndent: true, after: 200 }),

  // DATED + Signature
  new Paragraph({
    spacing: { before: 360, after: 0 },
    children: [h("DATED: ______________________")],
  }),

  // s/ signature
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

  // Attorney info block
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
];

// ═══════════════════════════════════════════════════
// DOCUMENT 2: DECLARATION OF PATRICIA BINGAMAN
// ═══════════════════════════════════════════════════
const declChildren = [
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

  // Body
  body([
    h("I, Patricia Bingaman, declare under penalty of perjury pursuant to ORS 162.055 that the following is true and correct:"),
  ], { after: 200 }),

  centered("1.", { after: 120 }),
  body([
    h("I am the Personal Representative of the Estate of Russell H. Bingaman, appointed by this Court in Case No. 25PB01832. Letters Testamentary were issued on or about February 28, 2025."),
  ]),

  centered("2.", { after: 120 }),
  body([
    h("Russell H. Bingaman was my husband. He resided at Nadine\u2019s Nest, an adult foster home in Union County, Oregon, owned and operated by Tempie Bartell (\u201cBartell\u201d), from approximately _______ until his death on January 29, 2025."),
  ]),

  centered("3.", { after: 120 }),
  body([
    h("As Personal Representative, I have a duty to take possession of and account for the property and records of the estate, and to determine whether any claims exist on behalf of the estate, including claims for negligence, abuse, or exploitation during the decedent\u2019s residence at Nadine\u2019s Nest."),
  ]),

  centered("4.", { after: 120 }),
  body([
    h("I have made the following requests for production of Russell\u2019s records from Nadine\u2019s Nest and/or Tempie Bartell:"),
  ]),

  body([h("[Patty: Please list each request you made, with approximate dates, how the request was made (phone, email, letter, in person, through attorney), and what the response was. For example:]")], { left: 720, noIndent: true }),

  body([h("a. On or about _________, 20__, I [or my attorney / my representative] requested Russell\u2019s complete care records from Bartell by [method]. Bartell [refused / did not respond / stated ___________].")], { left: 720, noIndent: true }),

  body([h("b. On or about _________, 20__, I [or my attorney / my representative] again requested the records by [method]. Bartell [refused / did not respond / stated ___________].")], { left: 720, noIndent: true }),

  body([h("c. [Continue for each additional request.]")], { left: 720, noIndent: true }),

  body([h("[NOTE: Include the September 5, 2025 email to Carol Fredrick referencing this request, and any other documented communications.]")], { left: 720, noIndent: true, after: 200 }),

  centered("5.", { after: 120 }),
  body([
    h("Despite these repeated requests over a period of more than one year, Bartell and Nadine\u2019s Nest have refused and/or failed to produce any records pertaining to Russell H. Bingaman."),
  ]),

  centered("6.", { after: 120 }),
  body([
    h("The refusal to produce these records has materially impaired my ability to administer the estate, including my ability to:"),
  ]),

  body([h("a. Determine whether claims exist on behalf of the estate for negligence, abuse, or exploitation;")], { left: 720, noIndent: true }),
  body([h("b. Verify the propriety of payments made to Nadine\u2019s Nest from estate or guardianship funds;")], { left: 720, noIndent: true }),
  body([h("c. Complete the estate inventory and final accounting; and")], { left: 720, noIndent: true }),
  body([h("d. Account to heirs, devisees, and this Court regarding the decedent\u2019s care and condition during his residence.")], { left: 720, noIndent: true, after: 200 }),

  centered("7.", { after: 120 }),
  body([
    h("I have reason to believe that records in the possession of Nadine\u2019s Nest contain information that is necessary to the administration of this estate and that may support claims on behalf of the estate."),
  ]),

  centered("8.", { after: 120 }),
  body([
    h("I make this declaration based on my personal knowledge and, where stated, on information and belief."),
  ], { after: 200 }),

  // Penalty of perjury
  body([
    h("I hereby declare that the above statement is true to the best of my knowledge and belief, and that I understand it is made for use as evidence in court and is subject to penalty for perjury.", { bold: true }),
  ], { after: 200 }),

  // DATED + Signature
  new Paragraph({
    spacing: { before: 360, after: 0 },
    children: [h("DATED: ______________________")],
  }),

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

// ═══════════════════════════════════════════════════
// BUILD BOTH DOCUMENTS
// ═══════════════════════════════════════════════════

// Motion
const motionDoc = new Document({
  sections: [{ properties: sectionProps, children: motionChildren }],
});

// Declaration
const declDoc = new Document({
  sections: [{ properties: sectionProps, children: declChildren }],
});

async function build() {
  const motionBuf = await Packer.toBuffer(motionDoc);
  fs.writeFileSync(`${BASE}\\MOTION TO COMPEL RECORDS - Nadines Nest.docx`, motionBuf);
  console.log("Created: MOTION TO COMPEL RECORDS - Nadines Nest.docx");

  const declBuf = await Packer.toBuffer(declDoc);
  fs.writeFileSync(`${BASE}\\DECLARATION OF PATRICIA BINGAMAN - Motion to Compel.docx`, declBuf);
  console.log("Created: DECLARATION OF PATRICIA BINGAMAN - Motion to Compel.docx");

  console.log("\n--- MOTION SUMMARY ---");
  console.log("Statutory basis:");
  console.log("  ORS 114.425 - Discovery of property, writings and information");
  console.log("  ORS 111.095(4)(a) - Probate court discovery power (ORCP 36)");
  console.log("  ORS 111.095(4)(e) - Delivery of possession of records");
  console.log("  ORS 192.573 - PR is HIPAA personal representative");
  console.log("  ORS 443.880 - Facility has no claim to resident records");
  console.log("\nRelief requested:");
  console.log("  - 14-day deadline to produce all records");
  console.log("  - Contempt for non-compliance");
  console.log("  - Attorney fees and costs");
  console.log("\n--- DECLARATION ---");
  console.log("  - Patty needs to fill in: dates of requests, methods, responses");
  console.log("  - Blanks marked with _______ for completion");
  console.log("  - Perjury declaration included (bold)");
}

build();
