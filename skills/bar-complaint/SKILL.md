---
name: bar-complaint
description: "Generate formal Oregon State Bar complaints against attorneys under BR 2.5, structured with ORPC-specific counts, exhibit references, and certification. Use this skill whenever the user mentions 'bar complaint', 'attorney misconduct', 'disciplinary complaint', 'ORPC violation', 'bar referral', 'disciplinary counsel', 'BR 2.5', or wants to draft a formal complaint to the Oregon State Bar about lawyer conduct. Also triggers when the user describes attorney behavior that sounds like professional misconduct (conflicts of interest, candor violations, fee disputes, coercive tactics) and wants to formalize it as a complaint. Produces .docx files ready for submission to OSB."
argument-hint: "[attorney-name] [bar-number]"
allowed-tools: Bash(node *), Read, Write, Grep, Glob
---

# Oregon State Bar Complaint Generator

Generate formal complaints to the Oregon State Bar requesting referral to Disciplinary Counsel under Bar Rule 2.5. Output is a .docx file using docx-js.

Generate documents using docx-js (Node.js). On this Windows system:
- Node.js: `C:/nodejs/node.exe` (v22.22.0)
- docx package: `C:/nodejs/node_modules/docx` (v9.6.0)
- Require with: `const { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber, BorderStyle, LevelFormat, UnderlineType } = require('C:/nodejs/node_modules/docx');`
- Write output: `const { writeFileSync } = require('fs'); Packer.toBuffer(doc).then(buf => writeFileSync(outputPath, buf));`
- Run scripts: `node script.js`
- Default output dir: `C:\Users\Big Levi\Bingaman Master Files\My Time\BAR Reports\[Attorney Name]\`

## What Makes an Effective Bar Complaint

The Oregon State Bar receives thousands of complaints. Most get dismissed because they read like grievances rather than disciplinary referrals. An effective complaint is fundamentally different from a letter of frustration:

**It's about the lawyer, not the case outcome.** The complaint doesn't ask the Bar to reverse a court ruling or revisit case strategy. It identifies specific attorney conduct that violated specific rules. Every sentence should connect to a rule violation, not to how the complainant feels about what happened.

**Each count stands alone.** A count isn't a chapter in a narrative — it's a self-contained allegation with its own rule citation, its own evidence, and its own referral rationale. If you removed every other count, each remaining one should still make sense to a reviewer reading it cold.

**Separate counts force separate responses.** The CAO is required to provide written justification for dismissing each count individually. A complaint with 4 tightly separated counts forces 4 separate written explanations. A complaint with everything merged into a narrative can be dismissed in one paragraph. Structure is a forcing function.

**Evidence is cited, not argued.** The complaint points to exhibits and lets them speak. Instead of "Baum clearly lied to the court," it says "The AFH owner testified doors were locked based on licensing permission (Ex. K); counsel had received contradicting records five months earlier (Ex. I) but filed no correction." The reviewer draws the conclusion.

**Machine-generated evidence beats everything.** The #1 dismissal reason is "bad strategy" — the reviewer says the attorney made a judgment call the client disagrees with. Forensic metadata (PDF creation timestamps, Tyler Odyssey signing timestamps, XMP annotations) is machine-generated and tamper-evident. It cannot be characterized as strategy. Lead with forensic evidence when it exists; structure other counts around it.

**Tone is clinical, not emotional.** No exclamation points. No "shocking" or "outrageous." No all-caps demands. The complaint reads like it was written by someone who understands the disciplinary process and respects the reviewer's intelligence.

**Brevity is strength.** A 7-page complaint with 8 tight counts will be read. A 15-page complaint with the same information spread thin will not. The Summary section uses 1-2 sentence bullets, not paragraphs. Referral Rationales are 2-3 sentences max — state the rule connection, name the subpoena targets, stop. Every word earns its place.

**Supporting declarations strengthen marginal counts.** Eyewitness declarations from non-party witnesses (signed under ORS 194.800 penalty of perjury — no notary required) authenticate transcripts, corroborate timeline facts, and are harder to dismiss than uncorroborated complainant narrative. When a count turns on what an attorney said in a private meeting, a declaration from a witness who was present transforms it.

## Document Structure

The complaint follows this exact sequence. The entire header block (title through case information) fits on the top half of page 1 — it should never spill across multiple pages.

### 1. Title Block
```
FORMAL COMPLAINT AGAINST [ATTORNEY NAME] (OSB #[NUMBER])
```
Bold, large font, left-aligned.

### 2. Date
Format: `Date: [Month Day, Year]`

### 3. Complainant Information

**Each field is a single line with the bold label and normal-weight value on the same line.** This is critical for density — the header block must be compact.

```
COMPLAINANT INFORMATION
Name: Levi M. Bakke
Address: 501 C Ave, La Grande, OR 97850
Phone: (971) 303-4982
Email: MRDcontractor@gmail.com
```

Implementation: Each line is ONE Paragraph containing TWO TextRuns — the first bold (the label), the second normal (the value). Do NOT put labels and values on separate lines. Do NOT put each field in its own paragraph with the value as a second paragraph.

### 4. Respondent Information

Same inline format:
```
RESPONDENT INFORMATION
Attorney: Wyatt S. Baum
Oregon Bar No.: 111773
Firm: Baum Smith LLC
Address: 808 Adams Avenue, La Grande, OR 97850
Phone: (541) 963-3104
Email: wyatt@baumsmith.com
```

If the user doesn't provide a firm name, omit the Firm line entirely. Do not invent one.

### 5. Case Information

Same inline format:
```
CASE INFORMATION
Case: In re Guardianship/Conservatorship of Russell Bingaman (Deceased Jan. 29, 2025)
Court: Circuit Court of the State of Oregon for Union County
Case No.: 23PR02271
Prior CAO Ref.: DPA 2500773 (dismissed May 2025)
```

If this is a first-time complaint, omit the Prior CAO Ref line. If it follows a prior dismissal, include the reference number and note the disposition.

### 6. I. SCOPE AND BASIS FOR REFERRAL UNDER BR 2.5

Use roman numeral format for section headers: "I. SCOPE AND BASIS..." not "SECTION I —". This matches the standard bar complaint format.

This section frames the entire complaint in two short paragraphs:

1. **Disclaim case relief** — State explicitly that the complaint does not seek to alter or revisit any court order.
2. **Identify the referral basis** — State that attached records and timestamps support a reasonable belief that violations of the ORPC may have occurred. Name the categories: candor, discovery diligence, conflicts, fees, etc.
3. If following a prior CAO dismissal, the second paragraph describes what new evidence has emerged.

### 7. II. SUMMARY OF KEY MISCONDUCT (Overview)

A bulleted overview — each bullet is 1-2 sentences max. This is a roadmap, not a retelling. Each bullet names the misconduct category with a colon, then states the core allegation in one tight sentence.

Example of correct length:
```
Extra-Judicial Isolation: Coordinated a pre-hearing spousal lockout through IBL misuse and "licensing permission," despite DHS's prior directive that IBLs cannot be used to bar spousal access.
```

Example of too long (avoid this):
```
Extra-Judicial Isolation (Counts 1-2): Baum coordinated with guardians to execute an Initial Behavior Level (IBL) restriction excluding Russell's wife from visits, despite receiving DHS guidance in October 2023 that IBLs cannot restrict spousal access, and without obtaining court authorization. The AFH owner testified she locked the doors based on "licensing permission" from the guardians, not a court order. Baum failed to correct this misimpression when served contradictory records in February 2025.
```

The second example belongs in the Detailed Counts section, not the Summary.

### 8. III. DETAILED COUNTS AND EVIDENCE

Each count follows this structure:

```
Count [N] — [Descriptive Title]

Rules: ORPC [rule numbers] ([parenthetical]), [rule] ([parenthetical])

  * [Bold date/source label:] Evidence statement. (Ex. [letter])
  * [Bold date/source label:] Evidence statement. (Ex. [letter])

Referral Rationale: [2-3 sentences connecting facts to rules, naming subpoena targets]
```

**Count titles** should be descriptive: "Extra-Judicial Spousal Lockout via IBL and 'Licensing Permission'" not "Misconduct Regarding Visitation."

**Rules line** cites specific ORPC rules with parentheticals, and includes UTCR citations when a court procedural rule was exploited or violated: `ORPC 1.2(d) (assisting unlawful conduct), 3.3 (candor), 4.1(a) (truthfulness to third persons), 8.4(d) (prejudice); UTCR 21.080(4)(a) (proposed orders exempt from submission date stamp — procedural rule exploited to conceal delay)`

Citing the UTCR or other procedural rules alongside ORPC rules forces the BAR to engage with the technical mechanism of the misconduct, not just the outcome.

**Evidence bullets** lead with a bold date and source type, then state the fact, then cite the exhibit:
```
DHS Directive (10/26/2023): DHS/APS informed the spouse in writing that an IBL is a support document and cannot be used to restrict spousal access. (Ex. A)
```

**Referral Rationale** is 2-3 sentences. First sentence connects the evidence to the rule. Second sentence names what the DCO should subpoena or obtain. Stop there. Do not write a paragraph-length analysis.

Example of correct length:
```
Referral Rationale: Knowing DHS had barred IBL-based exclusion, counsel coordinated and then allowed reliance on extra-judicial "licensing permission" while a motion was pending — supporting 1.2(d), 3.3, 4.1, 8.4(d). DCO should subpoena all correspondence between Baum and the guardians regarding the IBL restriction and interview the AFH owner about who instructed her to lock the doors.
```

### 9. IV. RESULTING HARM

Brief bulleted section. Use only categories that apply:
- **To the Protected Person / Client:** [1-2 sentences]
- **To the Estate / Financial Interests:** [1-2 sentences]
- **To the Legal System:** [1-2 sentences]

### 10. V. REQUESTED ACTIONS

A numbered list of specific, actionable requests:
1. Referral to Disciplinary Counsel under BR 2.5.
2. Subpoenas for [specific records with date ranges and account numbers].
3. Witness/agency testimony from [specific witnesses about specific topics].
4. Appropriate discipline following investigation.

### 11. VI. EXHIBITS

A simple lettered list — NOT bulleted. Each exhibit is a plain paragraph with the letter bold:

```
A — DHS/APS email (10/26/2023): IBL not authority to restrict spousal access.
B — June 25, 2024 email chain re eviction threat (context).
C — Jan. 7-8, 2025 emails Baum<->Null (settlement context).
```

Use sub-numbers for related groups: N-1, N-2, N-3, etc.

### 12. VII. CERTIFICATION

```
I certify that the information provided in this complaint is true to the
best of my knowledge and belief and that the attached exhibits are
authentic copies obtained from court filings, provider disclosures,
or party productions.

[Signature line]

[Name]
[City, State]
Date: [date]
```

Page break before this section.

## Formatting Specification

| Element | Font | Size (half-pts) | Style |
|---------|------|-----------------|-------|
| Main title | Arial | 32 | Bold |
| Section headers (I, II, III...) | Arial | 28 | Bold |
| Count titles | Arial | 26 | Bold |
| Field labels (Name:, Attorney:, etc.) | Arial | 24 | Bold |
| Field values (on same line as label) | Arial | 24 | Normal |
| Body text | Arial | 24 | Normal |
| Exhibit list entries | Arial | 22 | Normal |
| Page footer | Arial | 20 | `Page X of Y` centered |

- Page: US Letter (12240 x 15840 DXA), 1" margins all sides
- Horizontal rule (paragraph bottom border) between major sections (after Case Info, between each roman numeral section)
- Evidence bullets: use `LevelFormat.BULLET` numbering config, 720 DXA indent
- Requested Actions: use `LevelFormat.DECIMAL` numbering config
- Exhibit list: plain paragraphs (no bullets), letter is bold
- Page break before Certification section only
- No color, no shading, no decorative elements

## Critical Implementation Details

These are the formatting issues that matter most and are easiest to get wrong:

### Inline field labels
Every info field (Name, Address, Phone, etc.) is ONE paragraph with TWO TextRuns:
```javascript
new Paragraph({
  children: [
    new TextRun({ text: "Name: ", bold: true, font: "Arial", size: 24 }),
    new TextRun({ text: "Levi M. Bakke", font: "Arial", size: 24 }),
  ]
})
```

### Smart quotes and special characters
Use proper Unicode characters in TextRun text strings — NOT escape sequences. JavaScript string literals handle these natively:
```javascript
// CORRECT — actual Unicode characters
new TextRun({ text: "the \u201csix-month\u201d predicate" })  // renders as curly quotes
new TextRun({ text: "July 2024\u2014April 2025" })  // renders as em dash

// ALSO CORRECT — literal characters pasted in
new TextRun({ text: 'the "six-month" predicate' })  // straight quotes are fine too
```

The key thing: docx-js TextRun text is plain string content. If you use `\u201c` in a JS string literal, JavaScript interprets it as the actual Unicode character and docx-js renders it correctly. Do NOT construct strings where the literal backslash-u sequence ends up in the output.

### Page numbering footer
```javascript
footers: {
  default: new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Page ", font: "Arial", size: 20 }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 20 }),
        new TextRun({ text: " of ", font: "Arial", size: 20 }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 20 }),
      ]
    })]
  })
}
```
Use `PageNumber.CURRENT` and `PageNumber.TOTAL_PAGES` (or `NumberOfTotalPagesSection`) — NOT a hardcoded "Page 1".

### Compact header block
The entire block from title through case information should use minimal spacing. Use `spacing: { after: 60 }` or `spacing: { after: 80 }` on info-field paragraphs, not the default. Section sub-headers (COMPLAINANT INFORMATION, RESPONDENT INFORMATION, CASE INFORMATION) should use `spacing: { before: 200, after: 100 }`.

### Target length
A complaint with 3-4 counts should be 4-5 pages. A complaint with 7-8 counts should be 6-8 pages. If your output exceeds these ranges, the Referral Rationales and Summary bullets are probably too long. Trim them.

## What the User Provides

The user provides some combination of: the attorney's name and bar number, the case name and number, a narrative or bullet points describing what happened, references to evidence, and their own contact information.

Your job is to structure it into the formal complaint format. If they provide a wall of text, extract distinct misconduct categories and organize them into separate counts. If they provide casual or emotional language, transform it into clinical complaint language.

**Do not invent facts.** If the user doesn't name a firm, omit the firm line. If they don't provide an exhibit for something, don't fabricate an exhibit reference. If a fact they mention doesn't clearly connect to an ORPC rule, leave it out.

**Identifying the right ORPC rules:**

| Rule | Short Name | Common Scenarios |
|------|-----------|-----------------|
| 1.2(d) | Assisting unlawful conduct | Lawyer helped client do something illegal |
| 1.3 | Diligence | Failed to act with reasonable diligence |
| 1.4 | Communication | Failed to keep client informed, respond to inquiries |
| 1.5 | Reasonable fees | Excessive billing, fee duplication |
| 1.7 | Conflict of interest | Representing adverse interests |
| 1.8(f) | Third-party compensation | Non-client paying fees without consent |
| 1.15 | Safekeeping property | Failed to hold client funds properly |
| 1.16 | Declining/terminating representation | Failed to return file, refund unearned fees |
| 3.3(a)(1) | False statement to tribunal | Directly lying to a court in a filing or oral argument |
| 3.3(a)(3) | Ongoing candor duty | Failed to remediate material misimpressions the attorney created or allowed to persist |
| 3.4(d) | Discovery diligence | Failed to make diligent disclosure |
| 4.1(a) | Truthfulness to third persons | False statements to opposing counsel, clients of other parties, witnesses, or non-parties. Distinct from 3.3: 3.3 covers statements TO the tribunal; 4.1(a) covers statements to everyone else. Use 4.1(a) when the attorney misled a third party (e.g., told a family member something false to discourage action, misrepresented a timeline to opposing counsel) |
| 4.4(a) | Rights of third persons | Actions with no purpose other than to burden or harass a non-party |
| 8.4(c) | Dishonesty/deceit/misrepresentation | Conduct involving dishonesty, fraud, deceit, or misrepresentation — including misrepresentation by omission, half-truths, and conduct that creates false impressions. Cite when the attorney was actively deceptive |
| 8.4(d) | Prejudicial to justice | Conduct prejudicial to the administration of justice — cite when coordinated misconduct undermines court oversight or fair process even without explicit dishonesty |

Don't force-fit rules. A complaint with 4 strong counts beats one with 8 where half are stretched.

**Key distinction — 3.3 vs. 4.1:** If the attorney's false or misleading statement was made IN a court filing or oral argument, cite 3.3. If it was made OUTSIDE the tribunal (in a client meeting, to opposing counsel, to a family member, in an email), cite 4.1. Both can apply when a lawyer files a document that he first misrepresented to a third party — the deception to the third party is 4.1; the false filing is 3.3(a)(1).

**ORPC 8.4 subsection map (Oregon-specific):**
- 8.4(c) = dishonesty, fraud, deceit, misrepresentation (cite for active deception)
- 8.4(d) = conduct prejudicial to administration of justice (cite for systematic misconduct, procedural abuse)
- Do NOT write 8.4(a)(3) or 8.4(a)(4) — those are not Oregon ORPC subsections. Oregon's 8.4 subsections are (a) through (f) directly, not nested.

## Oregon Disciplinary Precedents

These cases are useful in the Referral Rationale when the pattern of conduct matches. Brief citations only — the CAO will know them.

| Case | Year | Holding | Use When |
|------|------|---------|---------|
| In re Keller | 2023 | Disbarred for document falsification in court proceedings | Document forgery, backdating, fabricated signatures |
| In re Paulson | 2009 | Disbarred for filing postponements specifically to run out the clock on a matter adverse to the attorney's interest | Deliberate procedural delays that cause irreversible harm to a protected person |
| In re Honsowetz | 2002 | Disciplined under RPC 8.4(a)(4) for failure to timely prepare and file court orders | Court orders created but not filed, causing downstream procedural harm |
| In re Snyder | 2002 | Disciplined for failure to timely file court orders | Same pattern as Honsowetz — cite both when order delay is the core count |
| In re Conduct of Knappenberger | 2005 | Suspended for conflict of interest where prior relationship with opposing counsel was not disclosed | Shared institutional relationships between counsel that compromise client interests |

Only cite precedents where the factual match is genuine. A weak analogy invites rebuttal and undermines the count.

## Supporting Declarations

For counts that turn on contested verbal statements or meetings not captured in documents, an ORS 194.800 declaration from an independent witness transforms the count.

**Format:** Times New Roman 12pt, 1.25" margins, numbered paragraphs. Header: DECLARATION OF [NAME] / In Support of Bar Complaint Against [Attorney] ([OSB #]) / [Case Name and Number]. Opening and closing perjury certification per ORS 194.800. Signature line with printed name, city, and date.

**ORS 194.800 key language:** "I declare under penalty of perjury under the laws of the State of Oregon that the following is true and correct to the best of my knowledge." No notary required — the penalty-of-perjury certification is the authentication mechanism.

**What goes in the declaration:**
- Who the declarant is and their relationship to the events (paragraph 1)
- Date, time, and location of the meeting/event (paragraph 2)
- Who else was present (paragraph 3)
- Verbatim or near-verbatim quotes from the attorney, with context (subsequent paragraphs)
- What the declarant subsequently learned that gives the earlier statements significance (later paragraphs)
- A closing paragraph expressly connecting the declaration to the complaint count it supports

**Generate declarations with python-docx** (simpler than docx-js for this format). Use Times New Roman 12pt, 1.25" margins, `Pt(space_after)` for paragraph spacing, `OxmlElement` for signature lines. Save to the same output directory as the complaint.

## Research Resource

The NotebookLM notebook at `https://notebooklm.google.com/notebook/b07ebe3c-eea8-4c8a-827f-d36960b2e4b8` contains OSB disciplinary case law, ORPC rule text, CAO complaint strategy, and Oregon precedent analysis. Query it using the notebooklm skill when:
- Confirming which ORPC rules apply to a specific fact pattern
- Looking up Oregon disciplinary precedents by conduct type
- Verifying CAO procedural requirements (e.g., count-by-count justification requirement)
- Checking whether a count is likely to survive the "bad strategy" dismissal defense

## Tone Calibration

Avoid: exclamation points, all-caps emphasis (except titles), emotional language, speculation about motives, demands for specific punishment, references to criminal statutes, conspiracy language, slang or casual language from user input.

Use: precise dates, exhibit references, specific rule citations, neutral language, conditional phrasing where appropriate ("records appear to show," "the timeline supports a reasonable belief that"), specific subpoena targets.

If the user writes casually ("my lawyer ghosted me"), transform it: "Respondent ceased all communication with the client beginning June 2024 and failed to appear at a scheduled hearing in September 2024."
