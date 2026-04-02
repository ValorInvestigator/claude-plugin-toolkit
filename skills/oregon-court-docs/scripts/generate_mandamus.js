#!/usr/bin/env node
/**
 * Oregon Circuit Court — Petition for Peremptory Writ of Mandamus
 * Marion County Circuit Court
 *
 * Formatting: UTCR rules, Courier New 12pt, 1" margins, 1.5 line spacing
 * Caption: Space-padded alignment (monospaced font)
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber,
        TabStopPosition, TabStopType, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

// ── Constants ──────────────────────────────────────────────────────────
const FONT = "Courier New";
const SIZE = 24;          // 12pt in half-points
const FOOTER_SIZE = 20;   // 10pt
const LINE_SPACING = 360; // 1.5 line spacing
const SINGLE_SPACE = 240; // single
const MARGINS = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const DOC_TITLE = "PETITION FOR PEREMPTORY WRIT OF MANDAMUS";

// Helper: create a TextRun with defaults
function h(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, ...opts });
}

// Helper: create a bold TextRun
function b(text, opts = {}) {
  return h(text, { bold: true, ...opts });
}

// Helper: create an underlined+bold TextRun
function bu(text) {
  return h(text, { bold: true, underline: {} });
}

// Helper: italic TextRun
function it(text) {
  return h(text, { italics: true });
}

// ── Court Header ───────────────────────────────────────────────────────
function courtHeader() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [b("IN THE CIRCUIT COURT OF THE STATE OF OREGON")]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [b("FOR THE COUNTY OF MARION")]
    })
  ];
}

// ── Case Caption (tab-stop aligned) ────────────────────────────────────
// Tab stop at 3.25" (4680 DXA) for the ) column
// Tab stop at 3.5" (5040 DXA) for right-side text
const CAPTION_TABS = [
  { type: TabStopType.LEFT, position: 4680 },
  { type: TabStopType.LEFT, position: 5040 }
];

function capLine(left, right, afterVal = 0, rightBold = false) {
  const runs = [];
  runs.push(h(left || ''));
  runs.push(h('\t)'));
  if (right) {
    runs.push(h('\t'));
    runs.push(h(right, { bold: rightBold }));
  }
  return new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: afterVal },
    children: runs
  });
}

function caseCaption() {
  return [
    capLine("LEVI BAKKE,",          "Case No. ________________"),
    capLine("",                     ""),
    capLine("     Relator,",        "PETITION FOR PEREMPTORY", 0, true),
    capLine("",                     "WRIT OF MANDAMUS", 0, true),
    capLine("v.",                   "(ORS 34.110; ORS 34.160;"),
    capLine("",                     "ORS 192.411(2))"),
    capLine("OREGON DEPARTMENT OF"),
    capLine("HUMAN SERVICES,"),
    capLine(""),
    capLine("     Defendant."),
    // Closing underline
    new Paragraph({
      tabStops: CAPTION_TABS,
      spacing: { after: 360 },
      children: [h("_____________________________\t)")]
    })
  ];
}

// ── Section Header ─────────────────────────────────────────────────────
function sectionHeader(text, spacing = { before: 360, after: 240 }) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing,
    children: [bu(text)]
  });
}

// ── Subsection Header (left-aligned, bold) ─────────────────────────────
function subHeader(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [b(text)]
  });
}

// ── Numbered Paragraph ─────────────────────────────────────────────────
function numPara(num, runs, indent = 0) {
  const prefix = `     ${num}. `;
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    indent: indent ? { left: indent } : undefined,
    children: [h(prefix), ...runs]
  });
}

// ── Sub-lettered item (a., b., c., etc.) ───────────────────────────────
function subLetter(letter, runs) {
  return new Paragraph({
    spacing: { after: 80, line: LINE_SPACING },
    indent: { left: 720 },
    children: [h(`     ${letter}. `), ...runs]
  });
}

// ── Sub-roman or numbered item inside sub-letter (i., ii., etc.) ───────
function subRoman(label, runs) {
  return new Paragraph({
    spacing: { after: 80, line: LINE_SPACING },
    indent: { left: 1080 },
    children: [b(`${label} `), ...runs]
  });
}

// ── Plain body paragraph (1.5 spaced, first-line indent) ───────────────
function bodyPara(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    indent: opts.noIndent ? undefined : { firstLine: 720 },
    ...opts,
    children: runs
  });
}

// ── Prayer item ────────────────────────────────────────────────────────
function prayerItem(num, runs) {
  return new Paragraph({
    spacing: { after: 120, line: LINE_SPACING },
    indent: { left: 720 },
    children: [h(`${num}. `), ...runs]
  });
}

// ── Exhibit line ───────────────────────────────────────────────────────
function exhibitLine(num, desc) {
  return new Paragraph({
    spacing: { after: 80, line: LINE_SPACING },
    indent: { left: 720 },
    children: [b(`Exhibit ${num}: `), h(desc)]
  });
}

// ── Build the document body ────────────────────────────────────────────
function buildBody() {
  const p = [];

  // ═══════════════════════════════════════════════════════════════════
  // JURISDICTIONAL STATEMENT
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("JURISDICTIONAL STATEMENT"));

  p.push(numPara(1, [
    h("This Court has jurisdiction under ORS 34.120(1), which grants circuit courts exclusive jurisdiction over mandamus proceedings against public bodies exercising functions within the county.")
  ]));

  p.push(numPara(2, [
    h("Defendant Oregon Department of Human Services (\"ODHS\") is a state agency that exercises functions within Marion County, Oregon, with its principal offices located at 500 Summer Street NE, Salem, Oregon 97301.")
  ]));

  p.push(numPara(3, [
    h("This petition is authorized by ORS 192.411(2), which permits a person seeking disclosure of public records to \"institute proceedings for injunctive or declaratory relief or peremptory mandamus in the Circuit Court for Marion County\" when a state agency fails to comply with an Attorney General's order requiring disclosure.")
  ]));

  p.push(numPara(4, [
    h("This Court should issue a peremptory writ in the first instance under ORS 34.160 because the right to require performance is clear and it is apparent that no valid excuse can be given for ODHS's failure to comply with the Attorney General's Order.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // PARTIES
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("PARTIES"));

  p.push(numPara(5, [
    b("Relator Levi Bakke"),
    h(" is an investigative journalist residing at 501 C Avenue, La Grande, Oregon 97850, operating as Valor Investigations. Relator submitted a 21-part public records request to ODHS on September 27, 2025, and successfully petitioned the Attorney General for a disclosure order under ORS 192.407.")
  ]));

  p.push(numPara(6, [
    b("Defendant Oregon Department of Human Services"),
    h(" is a state agency subject to the Oregon Public Records Law, ORS 192.311 to 192.478, with its Public Records Officer located at 500 Summer Street NE, E-62, Salem, Oregon 97301.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // STATEMENT OF FACTS
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("STATEMENT OF FACTS"));

  // --- A. The Public Records Request and AG Order ---
  p.push(subHeader("A. The Public Records Request and Attorney General's Order"));

  p.push(numPara(7, [
    h("On September 27, 2025, Relator submitted a written 21-part public records request to ODHS concerning the agency's handling of abuse investigations, regulatory enforcement, and communications regarding the Bingaman/Nadine's Nest matter in Union County, Oregon.")
  ]));

  p.push(numPara(8, [
    h("ODHS failed to respond to Relator's request as required by ORS 192.329 within the prescribed timeframe.")
  ]));

  p.push(numPara(9, [
    h("On or about October 2025, Relator petitioned the Attorney General pursuant to ORS 192.407(1)(a) to review ODHS's failure to comply with ORS 192.329.")
  ]));

  p.push(numPara(10, [
    h("On November 12, 2025, Interim Deputy Attorney General Benjamin Gutman issued a Public Records Order (DOJ File No. 100305-GA0151-25) granting Relator's petition and finding that ODHS \"did not respond to Mr. Bakke's request as required by ORS 192.329 within the prescribed timeframe.\" A true copy of the Attorney General's Order is attached as "),
    b("Exhibit 1"),
    h(".")
  ]));

  p.push(numPara(11, [
    h("The Attorney General's Order specifically:")
  ]));

  p.push(subLetter("a", [
    h("Treated ODHS's failure to timely respond as a denial of Relator's request under ORS 192.407(1)(a);")
  ]));
  p.push(subLetter("b", [
    h("Ordered ODHS to complete its response within "),
    b("six weeks"),
    h(" of receiving payment or fee waiver;")
  ]));
  p.push(subLetter("c", [
    h("Required ODHS to \"produce nonexempt records to Mr. Bakke on a rolling basis as they become available\"; and")
  ]));
  p.push(subLetter("d", [
    h("Noted that if ODHS elected not to comply, it had seven days to announce its intention to seek judicial review under ORS 192.411(2).")
  ]));

  // --- B. ODHS's Improper Self-Generated Request ---
  p.push(subHeader("B. ODHS's Improper Self-Generated Request"));

  p.push(numPara(12, [
    h("On November 13, 2025 -- one day after the Attorney General's Order -- ODHS generated its own truncated request (Reference: 755WH7K) that did not reflect the full 21-part scope described in the Order. This acknowledgment omitted substantial portions of Relator's original request and appeared designed to limit the scope of required production. A true copy is attached as "),
    b("Exhibit 2"),
    h(".")
  ]));

  p.push(numPara(13, [
    h("On November 14, 2025, Relator submitted a formal \"Initiation of Compliance\" email correcting ODHS's action and explicitly stating that the self-generated acknowledgment \"was not generated by me and does not reflect the full 21-part scope described in the DOJ order.\" ODHS acknowledged this correction, generated Reference UVLNS4F, and confirmed the fee waiver. A true copy is attached as "),
    b("Exhibit 3"),
    h(".")
  ]));

  // --- C. The Compliance Deadline and ODHS's Failures ---
  p.push(subHeader("C. The Compliance Deadline and ODHS's Failures"));

  p.push(numPara(14, [
    h("Per the Attorney General's Order, the six-week compliance period began November 14, 2025 (fee waiver approval date). The deadline was therefore "),
    b("December 26, 2025"),
    h(".")
  ]));

  p.push(numPara(15, [
    h("Despite the Order's explicit requirement that ODHS \"produce nonexempt records to Mr. Bakke on a rolling basis as they become available,\" ODHS failed to produce records on a rolling basis as ordered.")
  ]));

  p.push(numPara(16, [
    h("On December 19, 2025, ODHS provided a woefully incomplete response containing demonstrably false certifications, including:")
  ]));

  p.push(subLetter("a", [
    h("Certifying that \"staff never received any appeal documents\" when ODHS was in possession of USPS tracking confirmation and an R. Berg signature proving delivery on March 17, 2025;")
  ]));
  p.push(subLetter("b", [
    h("Certifying that \"no responsive text messages were found\" when ODHS's own investigation case file (Investigation #00362508) contains a contact log entry dated October 4, 2024 explicitly documenting a \"Text message\" communication;")
  ]));
  p.push(subLetter("c", [
    h("Claiming ODHS \"does not have a way to show calls that were possibly made\" when the state operates a centralized VoIP system (Atos Unify OpenScape) managed by DAS Enterprise Information Services that automatically generates Call Detail Records.")
  ]));

  // --- D. Prior Notice and Litigation Hold ---
  p.push(subHeader("D. Prior Notice and Litigation Hold"));

  p.push(numPara(17, [
    h("Before ODHS issued its December 19, 2025 response, Relator had served ODHS with proof of the records' existence on three separate occasions:")
  ]));

  p.push(subLetter("a", [
    h("September 27, 2025 -- \"Urgent: Demand for Correction\" attaching USPS tracking and R. Berg signature;")
  ]));
  p.push(subLetter("b", [
    h("October 1, 2025 -- Formal demand to Director Wendt, again attaching R. Berg signature;")
  ]));
  p.push(subLetter("c", [
    h("October 14, 2025 -- Second demand explicitly stating ODHS was \"caught making a false statement.\"")
  ]));

  p.push(numPara(18, [
    h("On October 17, 2025, Relator issued a formal Litigation Hold Notice identifying specific systems and custodians for preservation, including SOQ Salem mailroom logs, CAM/CALMS logs/attachments, and personal devices.")
  ]));

  p.push(numPara(19, [
    h("ODHS therefore received Relator's demands attaching proof of record existence and was placed under a formal litigation hold "),
    b("before"),
    h(" it issued its December 19, 2025 response certifying \"no records.\" This transforms what might otherwise be administrative error into knowing falsehood.")
  ]));

  // --- E. ODHS Did Not Seek Judicial Review ---
  p.push(subHeader("E. ODHS Did Not Seek Judicial Review"));

  p.push(numPara(20, [
    h("Under ORS 192.411(2), ODHS was required to comply with the Attorney General's Order in full within seven days, or within that seven-day period issue notice of its intention to institute proceedings for injunctive or declaratory relief in this Court.")
  ]));

  p.push(numPara(21, [
    h("ODHS did not comply with the Order in full.")
  ]));

  p.push(numPara(22, [
    h("ODHS did not issue any notice of intention to seek judicial review.")
  ]));

  p.push(numPara(23, [
    h("ODHS has therefore forfeited its right to challenge the Attorney General's Order through the statutory process and is in continuing, willful non-compliance.")
  ]));

  // --- F. Specific False Certifications ---
  p.push(subHeader("F. Specific False Certifications and Withheld Records"));

  p.push(numPara(24, [
    h("ODHS's response contains at least the following categories of deficiency, each constituting a failure to comply with the Attorney General's Order:")
  ]));

  // Sub-roman items for the nine categories
  p.push(subRoman("i.", [
    b("False Certification: \"Appeal Never Received.\" "),
    h("Relator possesses (a) USPS tracking showing delivery on March 17, 2025, (b) proof of signature by ODHS staff member \"R. Berg,\" and (c) email correspondence with Jaime Howard-Chavez (SOQ Unit) dated March 25, 2025, responding to the very appeal ODHS claims was \"never received.\" ODHS cannot refuse to discuss a document it claims never to have received.")
  ]));

  p.push(subRoman("ii.", [
    b("False Certification: \"No Responsive Text Messages Found.\" "),
    h("ODHS's own Protective Service/Abuse Investigation Report for ID #00362508 explicitly documents a \"Text message\" contact on October 4, 2024 at 09:00 AM. Internal emails further confirm text messages were exchanged within the agency regarding Relator's matter.")
  ]));

  p.push(subRoman("iii.", [
    b("False Certification: \"No Way to Show Calls.\" "),
    h("Oregon state agencies utilize a centralized VoIP system (Atos Unify OpenScape) managed by DAS EIS that automatically generates Call Detail Records. The existence of the July 10, 2024 phone call is corroborated by (a) Wyatt Baum's billing statement filed under penalty of perjury, (b) the Murchison Guardian Journal (Bates 000127), (c) Selina Schaffer's contemporaneous email, and (d) Tempie Bartell's sworn testimony.")
  ]));

  p.push(subRoman("iv.", [
    b("Missing Meeting Records. "),
    h("No records were produced for a July 12, 2024 meeting between Aaron Lenox and Patricia Bingaman at the APD office, or for the October 10, 2024 meeting at which Relator personally witnessed Cody Yates taking notes. Under OAR 411-020-0100(4)(h), investigators must \"maintain a record of interviews and evidentiary review.\"")
  ]));

  p.push(subRoman("v.", [
    b("Records Previously Withheld Now Produced. "),
    h("ODHS's December production included Facebook surveillance emails and \"meeting choreography\" emails that existed during prior requests but were withheld, proving prior responses were inadequate or deliberately incomplete.")
  ]));

  p.push(subRoman("vi.", [
    b("Missing Policy Documents. "),
    h("ODHS failed to produce or provide \"no records\" statements for specifically requested policies including BYOD/personal device retention, external counsel consultation, Comms/PIO bias mitigation guidelines, and lockout authorization policies.")
  ]));

  p.push(subRoman("vii.", [
    b("No Privilege Log for Baum Communications. "),
    h("ODHS failed to produce any communications with external counsel Wyatt Baum or provide a privilege log as required under ORS 192.329.")
  ]));

  p.push(subRoman("viii.", [
    b("Improperly Redacted ROSE Report. "),
    h("ODHS's own productions establish that the redacted content in the September 9, 2024 \"Initial Contact/Media\" email chain was a \"ROSE\" (Risk of Significant Event) report -- an administrative media management document, not a confidential abuse investigation record -- yet ODHS applied abuse investigation confidentiality exemptions to shield it from disclosure. ODHS waived any privilege over this document by releasing its unredacted filename (\"ROSE 5417\") in a January 13, 2025 email.")
  ]));

  p.push(subRoman("ix.", [
    b("Investigation Records Withheld. "),
    h("No internal communications were produced regarding the January 27, 2025 decision to close Investigations #00362261 and #00362508 -- both closed 48 hours before Russell Bingaman's death on January 29, 2025, and both bearing \"Not Substantiated\" findings despite documented evidence of abuse.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL BASIS FOR MANDAMUS
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("LEGAL BASIS FOR MANDAMUS"));

  // --- A. Clear Legal Duty ---
  p.push(subHeader("A. Clear Legal Duty Exists"));

  p.push(numPara(25, [
    h("Under ORS 192.329, ODHS has a clear legal duty to \"complete its response to a written public records request . . . as soon as practicable and without unreasonable delay.\"")
  ]));

  p.push(numPara(26, [
    h("Under the Attorney General's Order, ODHS has a specific, judicially enforceable duty to complete its response within six weeks and produce nonexempt records on a rolling basis. The Attorney General's enforcement authority is expressly provided by ORS 192.407(2)-(3).")
  ]));

  p.push(numPara(27, [
    h("Under ORS 192.411(2), when the Attorney General orders a state agency to disclose public records, the agency \"shall comply with the order in full within seven days after issuance of the order\" unless it institutes proceedings for judicial review. ODHS did neither.")
  ]));

  p.push(numPara(28, [
    h("The duty to produce records under the Public Records Law is ministerial, not discretionary. The law \"specially enjoins\" production as \"a duty resulting from an office, trust or station\" within the meaning of ORS 34.110.")
  ]));

  // --- B. No Plain, Speedy, or Adequate Remedy ---
  p.push(subHeader("B. No Plain, Speedy, or Adequate Remedy Exists"));

  p.push(numPara(29, [
    h("The Attorney General has no enforcement mechanism beyond issuing orders. ORS 192.407(3) authorizes the AG to \"require disclosure\" and \"require the public body to pay a penalty,\" but provides no mechanism to compel an agency that simply ignores the order.")
  ]));

  p.push(numPara(30, [
    h("Relator has already exhausted the AG petition process under ORS 192.407. The AG granted the petition, issued the order, and ODHS has defied it. The AG cannot compel compliance.")
  ]));

  p.push(numPara(31, [
    h("The penalty provision of ORS 192.407(3)(b) -- a $200 payment -- is plainly inadequate to address willful non-compliance involving false certifications and potential evidence destruction.")
  ]));

  p.push(numPara(32, [
    h("ORS 192.411(2) itself contemplates mandamus as the remedy when a state agency fails to comply with an AG disclosure order, explicitly providing for \"peremptory mandamus in the Circuit Court for Marion County.\"")
  ]));

  p.push(numPara(33, [
    h("There is no other plain, speedy, or adequate remedy available to Relator within the meaning of ORS 34.110.")
  ]));

  // --- C. Peremptory Writ Should Issue ---
  p.push(subHeader("C. Peremptory Writ Should Issue in the First Instance"));

  p.push(numPara(34, [
    h("Under ORS 34.160, \"[w]hen the right to require the performance of the act is clear, and it is apparent that no valid excuse can be given for not performing it, a peremptory mandamus shall be allowed in the first instance.\"")
  ]));

  p.push(numPara(35, [
    h("Relator's right is clear: The Attorney General has already adjudicated the merits and found ODHS violated ORS 192.329. The Order is final and unreversed.")
  ]));

  p.push(numPara(36, [
    h("ODHS can offer no valid excuse: It did not seek judicial review within the seven-day period provided by ORS 192.411(2). It did not comply with the Order. Its December 19, 2025 response contains demonstrably false certifications. More than fourteen months have elapsed since Relator's original request, and more than three months since the AG's Order.")
  ]));

  p.push(numPara(37, [
    h("An alternative writ would serve no purpose other than to give ODHS additional time to delay, destroy, or conceal records that it has already falsely certified do not exist -- records that are the subject of a formal litigation hold and that are directly relevant to an active federal investigation (CMS Case #6567616).")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // PRAYER FOR RELIEF
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("PRAYER FOR RELIEF"));

  p.push(bodyPara([
    h("WHEREFORE, Relator respectfully requests that this Court:")
  ]));

  p.push(prayerItem("1", [
    b("Issue a Peremptory Writ of Mandamus"),
    h(" in the first instance under ORS 34.160, commanding ODHS to fully comply with the Attorney General's Public Records Order (File No. 100305-GA0151-25) dated November 12, 2025, within "),
    b("fourteen (14) days"),
    h(" of the date of the writ;")
  ]));

  p.push(prayerItem("2", [
    b("Order ODHS to conduct adequate searches"),
    h(" of all systems and custodians identified in Relator's 21-part request, including but not limited to:")
  ]));

  // Sub-items for prayer item 2
  const searchItems = [
    "Series 20 Postal Records logs for March 17, 2025;",
    "Oregon ACCESS Narratives (case notes);",
    "Document management system audit logs;",
    "DAS Billing Portal Console VoIP Call Detail Records;",
    "State-issued mobile device records (SMS/MMS/iMessage);",
    "Carrier billing records for state-issued devices;",
    "CAM/CALMS system entries;",
    "Outlook/Exchange calendar entries;",
    "All communications of the named custodians (Aaron Lenox, Erin Smith, Eric Stone, Brian Beck, Cody Yates, Nicki J. Holmes, Kimberly K. Norton, Elisa A. Williams, and others identified in the request);"
  ];
  searchItems.forEach((item, i) => {
    const letter = String.fromCharCode(97 + i); // a, b, c...
    p.push(new Paragraph({
      spacing: { after: 40, line: LINE_SPACING },
      indent: { left: 1440 },
      children: [h(`${letter}. ${item}`)]
    }));
  });

  p.push(prayerItem("3", [
    b("Order ODHS to produce the complete, unredacted ROSE 5417 report"),
    h(" and related \"Initial Contact/Media\" email chain, as these are administrative media management records, not abuse investigation records subject to ORS 124.090 confidentiality;")
  ]));

  p.push(prayerItem("4", [
    b("Order ODHS to provide a detailed privilege log"),
    h(" for any withheld documents, specifically identifying each document withheld, the date, author, all recipients, subject matter, the specific exemption claimed, and the basis for the claim, as required by ORS 192.329(2)(b);")
  ]));

  p.push(prayerItem("5", [
    b("Impose the maximum penalty"),
    h(" available under ORS 192.407(3)(b) for undue delay and willful non-compliance;")
  ]));

  p.push(prayerItem("6", [
    b("Order ODHS to certify"),
    h(" that its searches were conducted by a qualified records custodian using the agency's electronic search tools -- not by staff self-reporting -- and to provide Custodian Search Certifications documenting what was searched, by whom, and using what parameters;")
  ]));

  p.push(prayerItem("7", [
    b("Award Relator reasonable costs and disbursements"),
    h(" incurred in this proceeding; and")
  ]));

  p.push(prayerItem("8", [
    b("Grant such other and further relief"),
    h(" as the Court deems just and equitable.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════════════════════════════
  p.push(sectionHeader("VERIFICATION"));

  p.push(bodyPara([
    h("I, Levi Bakke, am the Relator in this proceeding. I have read this Petition and the facts stated herein are true to the best of my knowledge.")
  ]));

  // Signature block
  p.push(new Paragraph({
    spacing: { before: 480, after: 240 },
    children: [h("Dated: ________________, 2026")]
  }));

  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("____________________________________")]
  }));
  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("Levi Bakke, Relator (Pro Se)")]
  }));
  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("501 C Avenue")]
  }));
  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("La Grande, OR 97850")]
  }));
  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("levi@valorinvestigates.com")]
  }));
  p.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("(971) 303-4982")]
  }));

  // ═══════════════════════════════════════════════════════════════════
  // EXHIBIT LIST (new page)
  // ═══════════════════════════════════════════════════════════════════
  p.push(new Paragraph({
    spacing: { before: 0 },
    children: [h("", { break: 1 })]  // page break
  }));

  p.push(sectionHeader("EXHIBIT LIST", { after: 240 }));

  const exhibits = [
    ["1", "Attorney General's Public Records Order dated November 12, 2025 (DOJ File No. 100305-GA0151-25)"],
    ["2", "ODHS Acknowledgment 755WH7K (November 13, 2025) -- Self-generated truncated request"],
    ["3", "Relator's \"Initiation of Compliance\" email (November 14, 2025) and ODHS confirmation of fee waiver (Reference UVLNS4F)"],
    ["4", "USPS Tracking Confirmation and R. Berg Signature (March 17, 2025) -- proving delivery of appeal"],
    ["5", "Email from Jaime Howard-Chavez (March 25, 2025) -- proving ODHS receipt of and response to the very appeal it claims was \"never received\""],
    ["6", "Investigation #00362508 Contact Log -- showing October 4, 2024 \"Text message\" entry contradicting \"no texts found\" certification"],
    ["7", "Internal ODHS Emails re: Facebook Surveillance (September 16-17, 2024) -- Nicki Holmes joining Facebook group to monitor Relator"],
    ["8", "Facebook Group Admin Logs showing \"Nicki Cox Holmes\" join date matching surveillance email"],
    ["9", "Wyatt Baum Billing Statement (Court Filing) -- documenting July 10, 2024 call ODHS claims cannot be verified"],
    ["10", "Cheryl Murchison Guardian Journal (Bates 000127) -- documenting July 10, 2024 call and \"NN can lock door to keep Patty out\" authorization"],
    ["11", "Selina Schaffer Email documenting Aaron Lenox's statement re: \"policy analyst in Salem\""],
    ["12", "Aaron Lenox email confirming October 10, 2024 meeting attendees"],
    ["13", "Brian Beck email (January 13, 2025) with attachment filename \"RE Initial ContactROSE 5417D13AFHNadine's NestMedia.msg\" -- proving the redacted content was \"ROSE 5417\" and establishing privilege waiver"],
    ["14", "September 9, 2024 \"Initial Contact/D13/AFH/Nadine's Nest/Media\" email chain (redacted production) -- comparison with Exhibit 13 proves the [REDACTED] content is ROSE 5417"],
    ["15", "Relator's September 27-October 17, 2025 demand letters and Litigation Hold Notice -- proving ODHS was served with proof of record existence and placed under litigation hold before its December 19 response"],
    ["16", "Relator's Non-Compliance Notice (December 24, 2025) -- 33-page documented analysis of ODHS failures, previously served on ODHS, the Attorney General, and the Governor's Advocacy Office"]
  ];

  exhibits.forEach(([num, desc]) => {
    exhibitLine(num, desc);
    p.push(p.pop()); // already pushed by exhibitLine — this is a no-op fix
  });

  // Re-do exhibits properly
  // Remove the broken ones and redo
  // Actually exhibitLine returns a paragraph, it doesn't push. Let me fix this.
  // The exhibits forEach above calls exhibitLine which returns a Paragraph but doesn't push.
  // Let me just push the return values.

  return p;
}

// The exhibitLine function returns a paragraph but the forEach above didn't push it.
// Let me rebuild the body function properly.

function buildDocument() {
  const children = [
    ...courtHeader(),
    ...caseCaption()
  ];

  // ═══════════════════════════════════════════════════════════════════
  // JURISDICTIONAL STATEMENT
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("JURISDICTIONAL STATEMENT"));

  children.push(numPara(1, [
    h("This Court has jurisdiction under ORS 34.120(1), which grants circuit courts exclusive jurisdiction over mandamus proceedings against public bodies exercising functions within the county.")
  ]));

  children.push(numPara(2, [
    h("Defendant Oregon Department of Human Services (\"ODHS\") is a state agency that exercises functions within Marion County, Oregon, with its principal offices located at 500 Summer Street NE, Salem, Oregon 97301.")
  ]));

  children.push(numPara(3, [
    h("This petition is authorized by ORS 192.411(2), which permits a person seeking disclosure of public records to \"institute proceedings for injunctive or declaratory relief or peremptory mandamus in the Circuit Court for Marion County\" when a state agency fails to comply with an Attorney General's order requiring disclosure.")
  ]));

  children.push(numPara(4, [
    h("This Court should issue a peremptory writ in the first instance under ORS 34.160 because the right to require performance is clear and it is apparent that no valid excuse can be given for ODHS's failure to comply with the Attorney General's Order.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // PARTIES
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("PARTIES"));

  children.push(numPara(5, [
    b("Relator Levi Bakke"),
    h(" is an investigative journalist residing at 501 C Avenue, La Grande, Oregon 97850, operating as Valor Investigations. Relator submitted a 21-part public records request to ODHS on September 27, 2025, and successfully petitioned the Attorney General for a disclosure order under ORS 192.407.")
  ]));

  children.push(numPara(6, [
    b("Defendant Oregon Department of Human Services"),
    h(" is a state agency subject to the Oregon Public Records Law, ORS 192.311 to 192.478, with its Public Records Officer located at 500 Summer Street NE, E-62, Salem, Oregon 97301.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // STATEMENT OF FACTS
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("STATEMENT OF FACTS"));

  // --- A ---
  children.push(subHeader("A. The Public Records Request and Attorney General's Order"));

  children.push(numPara(7, [
    h("On September 27, 2025, Relator submitted a written 21-part public records request to ODHS concerning the agency's handling of abuse investigations, regulatory enforcement, and communications regarding the Bingaman/Nadine's Nest matter in Union County, Oregon.")
  ]));

  children.push(numPara(8, [
    h("ODHS failed to respond to Relator's request as required by ORS 192.329 within the prescribed timeframe.")
  ]));

  children.push(numPara(9, [
    h("On or about October 2025, Relator petitioned the Attorney General pursuant to ORS 192.407(1)(a) to review ODHS's failure to comply with ORS 192.329.")
  ]));

  children.push(numPara(10, [
    h("On November 12, 2025, Interim Deputy Attorney General Benjamin Gutman issued a Public Records Order (DOJ File No. 100305-GA0151-25) granting Relator's petition and finding that ODHS \"did not respond to Mr. Bakke's request as required by ORS 192.329 within the prescribed timeframe.\" A true copy of the Attorney General's Order is attached as "),
    b("Exhibit 1"),
    h(".")
  ]));

  children.push(numPara(11, [
    h("The Attorney General's Order specifically:")
  ]));

  children.push(subLetter("a", [
    h("Treated ODHS's failure to timely respond as a denial of Relator's request under ORS 192.407(1)(a);")
  ]));
  children.push(subLetter("b", [
    h("Ordered ODHS to complete its response within "),
    b("six weeks"),
    h(" of receiving payment or fee waiver;")
  ]));
  children.push(subLetter("c", [
    h("Required ODHS to \"produce nonexempt records to Mr. Bakke on a rolling basis as they become available\"; and")
  ]));
  children.push(subLetter("d", [
    h("Noted that if ODHS elected not to comply, it had seven days to announce its intention to seek judicial review under ORS 192.411(2).")
  ]));

  // --- B ---
  children.push(subHeader("B. ODHS's Improper Self-Generated Request"));

  children.push(numPara(12, [
    h("On November 13, 2025 -- one day after the Attorney General's Order -- ODHS generated its own truncated request (Reference: 755WH7K) that did not reflect the full 21-part scope described in the Order. This acknowledgment omitted substantial portions of Relator's original request and appeared designed to limit the scope of required production. A true copy is attached as "),
    b("Exhibit 2"),
    h(".")
  ]));

  children.push(numPara(13, [
    h("On November 14, 2025, Relator submitted a formal \"Initiation of Compliance\" email correcting ODHS's action and explicitly stating that the self-generated acknowledgment \"was not generated by me and does not reflect the full 21-part scope described in the DOJ order.\" ODHS acknowledged this correction, generated Reference UVLNS4F, and confirmed the fee waiver. A true copy is attached as "),
    b("Exhibit 3"),
    h(".")
  ]));

  // --- C ---
  children.push(subHeader("C. The Compliance Deadline and ODHS's Failures"));

  children.push(numPara(14, [
    h("Per the Attorney General's Order, the six-week compliance period began November 14, 2025 (fee waiver approval date). The deadline was therefore "),
    b("December 26, 2025"),
    h(".")
  ]));

  children.push(numPara(15, [
    h("Despite the Order's explicit requirement that ODHS \"produce nonexempt records to Mr. Bakke on a rolling basis as they become available,\" ODHS failed to produce records on a rolling basis as ordered.")
  ]));

  children.push(numPara(16, [
    h("On December 19, 2025, ODHS provided a woefully incomplete response containing demonstrably false certifications, including:")
  ]));

  children.push(subLetter("a", [
    h("Certifying that \"staff never received any appeal documents\" when ODHS was in possession of USPS tracking confirmation and an R. Berg signature proving delivery on March 17, 2025;")
  ]));
  children.push(subLetter("b", [
    h("Certifying that \"no responsive text messages were found\" when ODHS's own investigation case file (Investigation #00362508) contains a contact log entry dated October 4, 2024 explicitly documenting a \"Text message\" communication;")
  ]));
  children.push(subLetter("c", [
    h("Claiming ODHS \"does not have a way to show calls that were possibly made\" when the state operates a centralized VoIP system (Atos Unify OpenScape) managed by DAS Enterprise Information Services that automatically generates Call Detail Records.")
  ]));

  // --- D ---
  children.push(subHeader("D. Prior Notice and Litigation Hold"));

  children.push(numPara(17, [
    h("Before ODHS issued its December 19, 2025 response, Relator had served ODHS with proof of the records' existence on three separate occasions:")
  ]));

  children.push(subLetter("a", [
    h("September 27, 2025 -- \"Urgent: Demand for Correction\" attaching USPS tracking and R. Berg signature;")
  ]));
  children.push(subLetter("b", [
    h("October 1, 2025 -- Formal demand to Director Wendt, again attaching R. Berg signature;")
  ]));
  children.push(subLetter("c", [
    h("October 14, 2025 -- Second demand explicitly stating ODHS was \"caught making a false statement.\"")
  ]));

  children.push(numPara(18, [
    h("On October 17, 2025, Relator issued a formal Litigation Hold Notice identifying specific systems and custodians for preservation, including SOQ Salem mailroom logs, CAM/CALMS logs/attachments, and personal devices.")
  ]));

  children.push(numPara(19, [
    h("ODHS therefore received Relator's demands attaching proof of record existence and was placed under a formal litigation hold "),
    b("before"),
    h(" it issued its December 19, 2025 response certifying \"no records.\" This transforms what might otherwise be administrative error into knowing falsehood.")
  ]));

  // --- E ---
  children.push(subHeader("E. ODHS Did Not Seek Judicial Review"));

  children.push(numPara(20, [
    h("Under ORS 192.411(2), ODHS was required to comply with the Attorney General's Order in full within seven days, or within that seven-day period issue notice of its intention to institute proceedings for injunctive or declaratory relief in this Court.")
  ]));

  children.push(numPara(21, [
    h("ODHS did not comply with the Order in full.")
  ]));

  children.push(numPara(22, [
    h("ODHS did not issue any notice of intention to seek judicial review.")
  ]));

  children.push(numPara(23, [
    h("ODHS has therefore forfeited its right to challenge the Attorney General's Order through the statutory process and is in continuing, willful non-compliance.")
  ]));

  // --- F ---
  children.push(subHeader("F. Specific False Certifications and Withheld Records"));

  children.push(numPara(24, [
    h("ODHS's response contains at least the following categories of deficiency, each constituting a failure to comply with the Attorney General's Order:")
  ]));

  children.push(subRoman("i.", [
    b("False Certification: \"Appeal Never Received.\" "),
    h("Relator possesses (a) USPS tracking showing delivery on March 17, 2025, (b) proof of signature by ODHS staff member \"R. Berg,\" and (c) email correspondence with Jaime Howard-Chavez (SOQ Unit) dated March 25, 2025, responding to the very appeal ODHS claims was \"never received.\" ODHS cannot refuse to discuss a document it claims never to have received.")
  ]));

  children.push(subRoman("ii.", [
    b("False Certification: \"No Responsive Text Messages Found.\" "),
    h("ODHS's own Protective Service/Abuse Investigation Report for ID #00362508 explicitly documents a \"Text message\" contact on October 4, 2024 at 09:00 AM. Internal emails further confirm text messages were exchanged within the agency regarding Relator's matter.")
  ]));

  children.push(subRoman("iii.", [
    b("False Certification: \"No Way to Show Calls.\" "),
    h("Oregon state agencies utilize a centralized VoIP system (Atos Unify OpenScape) managed by DAS EIS that automatically generates Call Detail Records. The existence of the July 10, 2024 phone call is corroborated by (a) Wyatt Baum's billing statement filed under penalty of perjury, (b) the Murchison Guardian Journal (Bates 000127), (c) Selina Schaffer's contemporaneous email, and (d) Tempie Bartell's sworn testimony.")
  ]));

  children.push(subRoman("iv.", [
    b("Missing Meeting Records. "),
    h("No records were produced for a July 12, 2024 meeting between Aaron Lenox and Patricia Bingaman at the APD office, or for the October 10, 2024 meeting at which Relator personally witnessed Cody Yates taking notes. Under OAR 411-020-0100(4)(h), investigators must \"maintain a record of interviews and evidentiary review.\"")
  ]));

  children.push(subRoman("v.", [
    b("Records Previously Withheld Now Produced. "),
    h("ODHS's December production included Facebook surveillance emails and \"meeting choreography\" emails that existed during prior requests but were withheld, proving prior responses were inadequate or deliberately incomplete.")
  ]));

  children.push(subRoman("vi.", [
    b("Missing Policy Documents. "),
    h("ODHS failed to produce or provide \"no records\" statements for specifically requested policies including BYOD/personal device retention, external counsel consultation, Comms/PIO bias mitigation guidelines, and lockout authorization policies.")
  ]));

  children.push(subRoman("vii.", [
    b("No Privilege Log for Baum Communications. "),
    h("ODHS failed to produce any communications with external counsel Wyatt Baum or provide a privilege log as required under ORS 192.329.")
  ]));

  children.push(subRoman("viii.", [
    b("Improperly Redacted ROSE Report. "),
    h("ODHS's own productions establish that the redacted content in the September 9, 2024 \"Initial Contact/Media\" email chain was a \"ROSE\" (Risk of Significant Event) report -- an administrative media management document, not a confidential abuse investigation record -- yet ODHS applied abuse investigation confidentiality exemptions to shield it from disclosure. ODHS waived any privilege over this document by releasing its unredacted filename (\"ROSE 5417\") in a January 13, 2025 email.")
  ]));

  children.push(subRoman("ix.", [
    b("Investigation Records Withheld. "),
    h("No internal communications were produced regarding the January 27, 2025 decision to close Investigations #00362261 and #00362508 -- both closed 48 hours before Russell Bingaman's death on January 29, 2025, and both bearing \"Not Substantiated\" findings despite documented evidence of abuse.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL BASIS FOR MANDAMUS
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("LEGAL BASIS FOR MANDAMUS"));

  children.push(subHeader("A. Clear Legal Duty Exists"));

  children.push(numPara(25, [
    h("Under ORS 192.329, ODHS has a clear legal duty to \"complete its response to a written public records request . . . as soon as practicable and without unreasonable delay.\"")
  ]));

  children.push(numPara(26, [
    h("Under the Attorney General's Order, ODHS has a specific, judicially enforceable duty to complete its response within six weeks and produce nonexempt records on a rolling basis. The Attorney General's enforcement authority is expressly provided by ORS 192.407(2)-(3).")
  ]));

  children.push(numPara(27, [
    h("Under ORS 192.411(2), when the Attorney General orders a state agency to disclose public records, the agency \"shall comply with the order in full within seven days after issuance of the order\" unless it institutes proceedings for judicial review. ODHS did neither.")
  ]));

  children.push(numPara(28, [
    h("The duty to produce records under the Public Records Law is ministerial, not discretionary. The law \"specially enjoins\" production as \"a duty resulting from an office, trust or station\" within the meaning of ORS 34.110.")
  ]));

  children.push(subHeader("B. No Plain, Speedy, or Adequate Remedy Exists"));

  children.push(numPara(29, [
    h("The Attorney General has no enforcement mechanism beyond issuing orders. ORS 192.407(3) authorizes the AG to \"require disclosure\" and \"require the public body to pay a penalty,\" but provides no mechanism to compel an agency that simply ignores the order.")
  ]));

  children.push(numPara(30, [
    h("Relator has already exhausted the AG petition process under ORS 192.407. The AG granted the petition, issued the order, and ODHS has defied it. The AG cannot compel compliance.")
  ]));

  children.push(numPara(31, [
    h("The penalty provision of ORS 192.407(3)(b) -- a $200 payment -- is plainly inadequate to address willful non-compliance involving false certifications and potential evidence destruction.")
  ]));

  children.push(numPara(32, [
    h("ORS 192.411(2) itself contemplates mandamus as the remedy when a state agency fails to comply with an AG disclosure order, explicitly providing for \"peremptory mandamus in the Circuit Court for Marion County.\"")
  ]));

  children.push(numPara(33, [
    h("There is no other plain, speedy, or adequate remedy available to Relator within the meaning of ORS 34.110.")
  ]));

  children.push(subHeader("C. Peremptory Writ Should Issue in the First Instance"));

  children.push(numPara(34, [
    h("Under ORS 34.160, \"[w]hen the right to require the performance of the act is clear, and it is apparent that no valid excuse can be given for not performing it, a peremptory mandamus shall be allowed in the first instance.\"")
  ]));

  children.push(numPara(35, [
    h("Relator's right is clear: The Attorney General has already adjudicated the merits and found ODHS violated ORS 192.329. The Order is final and unreversed.")
  ]));

  children.push(numPara(36, [
    h("ODHS can offer no valid excuse: It did not seek judicial review within the seven-day period provided by ORS 192.411(2). It did not comply with the Order. Its December 19, 2025 response contains demonstrably false certifications. More than fourteen months have elapsed since Relator's original request, and more than three months since the AG's Order.")
  ]));

  children.push(numPara(37, [
    h("An alternative writ would serve no purpose other than to give ODHS additional time to delay, destroy, or conceal records that it has already falsely certified do not exist -- records that are the subject of a formal litigation hold and that are directly relevant to an active federal investigation (CMS Case #6567616).")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // PRAYER FOR RELIEF
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("PRAYER FOR RELIEF"));

  children.push(bodyPara([
    h("WHEREFORE, Relator respectfully requests that this Court:")
  ]));

  children.push(prayerItem("1", [
    b("Issue a Peremptory Writ of Mandamus"),
    h(" in the first instance under ORS 34.160, commanding ODHS to fully comply with the Attorney General's Public Records Order (File No. 100305-GA0151-25) dated November 12, 2025, within "),
    b("fourteen (14) days"),
    h(" of the date of the writ;")
  ]));

  children.push(prayerItem("2", [
    b("Order ODHS to conduct adequate searches"),
    h(" of all systems and custodians identified in Relator's 21-part request, including but not limited to:")
  ]));

  const searchItems = [
    "Series 20 Postal Records logs for March 17, 2025;",
    "Oregon ACCESS Narratives (case notes);",
    "Document management system audit logs;",
    "DAS Billing Portal Console VoIP Call Detail Records;",
    "State-issued mobile device records (SMS/MMS/iMessage);",
    "Carrier billing records for state-issued devices;",
    "CAM/CALMS system entries;",
    "Outlook/Exchange calendar entries;",
    "All communications of the named custodians (Aaron Lenox, Erin Smith, Eric Stone, Brian Beck, Cody Yates, Nicki J. Holmes, Kimberly K. Norton, Elisa A. Williams, and others identified in the request);"
  ];
  searchItems.forEach((item, i) => {
    const letter = String.fromCharCode(97 + i);
    children.push(new Paragraph({
      spacing: { after: 40, line: LINE_SPACING },
      indent: { left: 1440 },
      children: [h(`${letter}. ${item}`)]
    }));
  });

  children.push(prayerItem("3", [
    b("Order ODHS to produce the complete, unredacted ROSE 5417 report"),
    h(" and related \"Initial Contact/Media\" email chain, as these are administrative media management records, not abuse investigation records subject to ORS 124.090 confidentiality;")
  ]));

  children.push(prayerItem("4", [
    b("Order ODHS to provide a detailed privilege log"),
    h(" for any withheld documents, specifically identifying each document withheld, the date, author, all recipients, subject matter, the specific exemption claimed, and the basis for the claim, as required by ORS 192.329(2)(b);")
  ]));

  children.push(prayerItem("5", [
    b("Impose the maximum penalty"),
    h(" available under ORS 192.407(3)(b) for undue delay and willful non-compliance;")
  ]));

  children.push(prayerItem("6", [
    b("Order ODHS to certify"),
    h(" that its searches were conducted by a qualified records custodian using the agency's electronic search tools -- not by staff self-reporting -- and to provide Custodian Search Certifications documenting what was searched, by whom, and using what parameters;")
  ]));

  children.push(prayerItem("7", [
    b("Award Relator reasonable costs and disbursements"),
    h(" incurred in this proceeding; and")
  ]));

  children.push(prayerItem("8", [
    b("Grant such other and further relief"),
    h(" as the Court deems just and equitable.")
  ]));

  // ═══════════════════════════════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════════════════════════════
  children.push(sectionHeader("VERIFICATION"));

  children.push(bodyPara([
    h("I, Levi Bakke, am the Relator in this proceeding. I have read this Petition and the facts stated herein are true to the best of my knowledge.")
  ]));

  children.push(new Paragraph({
    spacing: { before: 480, after: 240 },
    children: [h("Dated: ________________, 2026")]
  }));

  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("____________________________________")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("Levi Bakke, Relator (Pro Se)")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("501 C Avenue")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("La Grande, OR 97850")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("levi@valorinvestigates.com")]
  }));
  children.push(new Paragraph({
    spacing: { after: 360 },
    children: [h("(971) 303-4982")]
  }));

  // ═══════════════════════════════════════════════════════════════════
  // EXHIBIT LIST (new page)
  // ═══════════════════════════════════════════════════════════════════
  children.push(new Paragraph({
    children: [new TextRun({ text: "", font: FONT, size: SIZE, break: 1 })]
  }));

  children.push(sectionHeader("EXHIBIT LIST", { after: 240 }));

  const exhibits = [
    ["1", "Attorney General's Public Records Order dated November 12, 2025 (DOJ File No. 100305-GA0151-25)"],
    ["2", "ODHS Acknowledgment 755WH7K (November 13, 2025) -- Self-generated truncated request"],
    ["3", "Relator's \"Initiation of Compliance\" email (November 14, 2025) and ODHS confirmation of fee waiver (Reference UVLNS4F)"],
    ["4", "USPS Tracking Confirmation and R. Berg Signature (March 17, 2025) -- proving delivery of appeal"],
    ["5", "Email from Jaime Howard-Chavez (March 25, 2025) -- proving ODHS receipt of and response to the very appeal it claims was \"never received\""],
    ["6", "Investigation #00362508 Contact Log -- showing October 4, 2024 \"Text message\" entry contradicting \"no texts found\" certification"],
    ["7", "Internal ODHS Emails re: Facebook Surveillance (September 16-17, 2024) -- Nicki Holmes joining Facebook group to monitor Relator"],
    ["8", "Facebook Group Admin Logs showing \"Nicki Cox Holmes\" join date matching surveillance email"],
    ["9", "Wyatt Baum Billing Statement (Court Filing) -- documenting July 10, 2024 call ODHS claims cannot be verified"],
    ["10", "Cheryl Murchison Guardian Journal (Bates 000127) -- documenting July 10, 2024 call and \"NN can lock door to keep Patty out\" authorization"],
    ["11", "Selina Schaffer Email documenting Aaron Lenox's statement re: \"policy analyst in Salem\""],
    ["12", "Aaron Lenox email confirming October 10, 2024 meeting attendees"],
    ["13", "Brian Beck email (January 13, 2025) with attachment filename \"RE Initial ContactROSE 5417D13AFHNadine's NestMedia.msg\" -- proving the redacted content was \"ROSE 5417\" and establishing privilege waiver"],
    ["14", "September 9, 2024 \"Initial Contact/D13/AFH/Nadine's Nest/Media\" email chain (redacted production) -- comparison with Exhibit 13 proves the [REDACTED] content is ROSE 5417"],
    ["15", "Relator's September 27-October 17, 2025 demand letters and Litigation Hold Notice -- proving ODHS was served with proof of record existence and placed under litigation hold before its December 19 response"],
    ["16", "Relator's Non-Compliance Notice (December 24, 2025) -- 33-page documented analysis of ODHS failures, previously served on ODHS, the Attorney General, and the Governor's Advocacy Office"]
  ];

  exhibits.forEach(([num, desc]) => {
    children.push(new Paragraph({
      spacing: { after: 120, line: LINE_SPACING },
      indent: { left: 720 },
      children: [b(`Exhibit ${num}: `), h(desc)]
    }));
  });

  // ═══════════════════════════════════════════════════════════════════
  // CERTIFICATE OF SERVICE (new page)
  // ═══════════════════════════════════════════════════════════════════
  children.push(new Paragraph({
    children: [new TextRun({ text: "", font: FONT, size: SIZE, break: 1 })]
  }));

  children.push(sectionHeader("CERTIFICATE OF SERVICE", { after: 240 }));

  children.push(bodyPara([
    h("I hereby certify that on ________________, 2026, I served a true copy of this Petition for Peremptory Writ of Mandamus with all exhibits upon:")
  ]));

  // Defendant service address
  children.push(new Paragraph({
    spacing: { before: 240, after: 0 },
    indent: { left: 720 },
    children: [b("Defendant:")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Caroline Burnell, Public Records Officer")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Oregon Department of Human Services")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("500 Summer Street NE, E-62")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Salem, Oregon 97301")]
  }));
  children.push(new Paragraph({
    spacing: { after: 240 },
    indent: { left: 720 },
    children: [h("Email: DHS.RecordsRequest@odhsoha.oregon.gov")]
  }));

  // AG courtesy copy
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [b("Attorney General (courtesy copy):")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Benjamin Gutman, Interim Deputy Attorney General")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Oregon Department of Justice")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("1162 Court Street NE")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    indent: { left: 720 },
    children: [h("Salem, Oregon 97301")]
  }));
  children.push(new Paragraph({
    spacing: { after: 360 },
    indent: { left: 720 },
    children: [h("Email: publicrecordsorder@doj.oregon.gov")]
  }));

  // Service method
  children.push(bodyPara([
    h("Service was made by: [ ] personal delivery  [ ] certified mail  [ ] email pursuant to ORCP 9 B")
  ], { noIndent: true }));

  // Final signature
  children.push(new Paragraph({
    spacing: { before: 480, after: 0 },
    children: [h("____________________________________")]
  }));
  children.push(new Paragraph({
    spacing: { after: 0 },
    children: [h("Levi Bakke, Relator")]
  }));

  return children;
}

// ── Generate the DOCX ─────────────────────────────────────────────────
async function main() {
  const outputPath = "D:\\Bingaman Master Files\\DHS\\New 12-14-24\\New stuff\\Levi\\PETITION_MANDAMUS_v2.docx";

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: MARGINS
        }
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `${DOC_TITLE} - Page `, font: FONT, size: FOOTER_SIZE }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FOOTER_SIZE }),
                new TextRun({ text: " of ", font: FONT, size: FOOTER_SIZE }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: FOOTER_SIZE })
              ]
            })
          ]
        })
      },
      children: buildDocument()
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document created: ${outputPath}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
