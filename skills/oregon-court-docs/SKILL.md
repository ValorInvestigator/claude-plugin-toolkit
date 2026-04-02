---
name: oregon-court-docs
description: Generate properly formatted Oregon court documents for Circuit Courts, Court of Appeals, and Supreme Court. Handles case captions, page numbering, signature blocks, and standard legal formatting. Circuit court uses Times New Roman 12pt with tab-aligned captions; appellate courts use proportionally spaced 14pt (Century Schoolbook, Times New Roman, or Arial) or monospaced 10cpi.
---

# Oregon Court Document Generator

## Overview

Generate professional Oregon court documents using docx-js. Supports two distinct formatting regimes:

1. **Circuit Court** — UTCR rules, Times New Roman 12pt, tab-aligned captions
2. **Appellate Courts** (Court of Appeals + Supreme Court) — ORAP rules, proportionally spaced 14pt, word-count limits, structured briefs

## Quick Start

```bash
node /path/to/skill/scripts/generate_court_doc.js <config.json> <output.docx>
```

Or use the patterns below directly in new documents.

---

# PART 1: CIRCUIT COURT DOCUMENTS

## Document Structure

### Required Elements

1. **Court Header** (centered, bold):
   - "IN THE CIRCUIT COURT OF THE STATE OF OREGON"
   - "FOR THE COUNTY OF [COUNTY NAME]"

2. **Case Caption** — tab-aligned with `)` column:
   - Plaintiff name and designation on left
   - Tab stop at 3.25" for `)` character
   - Tab stop at 3.50" for right-side text (case number, document title)
   - Format: `left_text\t)\tright_text`
   - NO closing underline -- caption ends with "Defendant." line
   - All caption text in same font/weight (no bold mixing to prevent width issues)

3. **Page Footer** (body pages only, NOT on Certificate of Service):
   - Format: "[SHORT TITLE] | [CASE NO] | Page X of Y"
   - Centered, Times New Roman 10pt
   - Use Word field codes for page numbers (PAGE and NUMPAGES)
   - Certificate of Service goes in a separate section with empty footer

4. **Signature Block**:
   - "DATED: ____________________"
   - Signature line with name, Pro Se designation
   - Address

## Caption Alignment — Tab Stops (Required for Proportional Fonts)

For Times New Roman (proportional), use tab stops for `)` column alignment.
Tab stop at 3.25" for the `)` character, 3.50" for right-side text.
All caption text uses a single run with no bold mixing.

```python
# Python (python-docx) -- preferred approach
from docx.shared import Inches
TAB_POS_PAREN = Inches(3.25)  # ) column
TAB_POS_RIGHT = Inches(3.50)  # right text starts

def cap_line(doc, left, right=''):
    p = doc.add_paragraph()
    tabs = p.paragraph_format.tab_stops
    tabs.add_tab_stop(TAB_POS_PAREN)
    tabs.add_tab_stop(TAB_POS_RIGHT)
    text = f'{left}\t)\t{right}' if right else f'{left}\t)'
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.bold = False  # critical: no bold in caption
    return p
```

### Shared Module

A reusable `court_format.py` module exists at:
`D:\Bingaman Master Files\DHS\Lawsuit\March_24_Filing\court_format.py`

Usage:
```python
from court_format import CourtDoc
cd = CourtDoc('Case No. 26CV11493', 'DOCUMENT TITLE', 'Short Title')
cd.header()
cd.caption([('LEVI BAKKE,', 'Case No. 26CV11493'), ...])
cd.body('Paragraph text.')
cd.signature_block()
cd.certificate_of_service("FULL DOCUMENT TITLE")
cd.save('output.docx')
```

## Page Break Rules (Critical)

**Never have signature block on a page by itself.** Use // marks to fill remaining space when content must continue on next page.

### // Mark Usage
- Left-aligned (not centered)
- Use to fill space at bottom of page when more content follows
- Indicates to reader there is more text on next page
- Place BEFORE the content that needs to stay together

```javascript
// Correct: left-aligned // marks
new Paragraph({
  spacing: { after: 240 },
  children: [new TextRun({ text: "//" })]
})
```

## Circuit Court Formatting Rules

| Element | Format |
|---------|--------|
| Font | Times New Roman 12pt |
| Margins | 1 inch all sides (1440 DXA) |
| Page size | US Letter (12240 x 15840 DXA) |
| Line spacing | 1.5 for body text |
| Paragraph indent | First line 0.5 inch (720 DXA) |
| Sub-point indent | 1 inch left (1440 DXA) |
| Footer font | Times New Roman 10pt |
| Footer format | Short Title \| Case No. \| Page X of Y |
| Caption tab stops | 3.25" (paren), 3.50" (right text) |

## Common Circuit Court Document Types

### Summons (ORS 192.431)
- Include "NOTICE TO DEFENDANT" section (bold, underlined, centered)
- 30-day appearance requirement
- Oregon State Bar Lawyer Referral info

### Motion
- "COMES NOW Plaintiff..." opening
- "POINTS AND AUTHORITIES" section header
- Numbered points with underlined titles
- "WHEREFORE" conclusion paragraph

### Declaration
- "I, [NAME], declare under penalty of perjury..."
- Numbered paragraphs
- "I declare under penalty of perjury that the foregoing is true and correct."

### Complaint
- Jurisdictional statement
- "PARTIES", "FACTUAL ALLEGATIONS", "CLAIMS FOR RELIEF" sections
- "PRAYER FOR RELIEF"

---

# PART 2: APPELLATE COURT DOCUMENTS (ORAP)

The Oregon Rules of Appellate Procedure (ORAP) govern practice before both the
Oregon Court of Appeals and the Oregon Supreme Court. These rules are **substantially
different** from circuit court formatting.

**Authority**: ORAP (current edition effective January 1, 2025)
**Source**: https://www.courts.oregon.gov/rules/ORAP/ORAP2025FullPermanentTempAmendments.pdf

## Key Differences from Circuit Court

| Element | Circuit Court | Appellate Courts |
|---------|--------------|-----------------|
| Font | Courier New 12pt only | Century Schoolbook, Times New Roman, or Arial 14pt; OR monospaced 10cpi |
| Spacing | 1.5 line spacing | Double-spaced (with double space around block quotes) |
| Length limit | None (practical) | Word count: 14,000 (SC) / 10,000 (COA) opening; 50 pages if no word count |
| Caption style | Tab/space aligned with `)` | Cover page format per Appendix 5.05-1 |
| Required sections | Varies by document | 12 mandatory sections in strict order (ORAP 5.40) |
| Filing | Paper or eFiling | Mandatory eFiling for attorneys (ORAP 16.60); pro se may paper file |
| Copies | Per local rules | COA: 1 original + 5 copies; SC: 1 original + 12 copies |
| Binding | Staples | Binderclip (preferred) or staples |
| Covers | Not required | Required — specific colors by brief type |

## Appellate Brief Formatting (ORAP 5.05)

### Typography
- **Proportionally spaced**: Century Schoolbook, Times New Roman, or Arial
  - Minimum 14pt for body AND footnotes
  - Reducing/condensing typeface to increase word count is prohibited
- **Monospaced (alternative)**: Any monospaced font, max 10 characters per inch
- **ALL CAPS briefs prohibited**: "Briefs printed entirely or substantially in uppercase are not acceptable"
- **No color highlighting** on any part of the text

### Page Layout
- Paper: 8.5" × 11" (same as circuit court)
- Margins: Standard 1" all sides
- Double-spaced body text
- Double space above and below block quotations
- Page numbers required

### Word Count Limits

| Document | Court of Appeals | Supreme Court |
|----------|-----------------|---------------|
| Opening brief | 10,000 words | 14,000 words |
| Answering brief | 10,000 words | 14,000 words |
| Reply brief | 3,300 words | 4,000 words |
| Page limit (if no word count) | 35 pages (opening) / 10 pages (reply) | 50 pages |
| Excerpt of record / appendix | 50 pages | 50 pages |
| Petition for review | 15 pages (13pt) or 18 pages (14pt) | N/A |

### Certificate of Compliance (ORAP 5.05(2)(d), Appendix 5.05-2)
Every brief must include a certificate stating:
1. The brief complies with word count limits (state exact count), OR certify no access to word-count software and comply with page limits
2. The type size is not smaller than 14pt for proportionally spaced type
3. Must be signed
4. Placed immediately before or on same page as proof of service

```
CERTIFICATE OF COMPLIANCE WITH BRIEF LENGTH
AND TYPE SIZE REQUIREMENTS

I certify that (1) this brief complies with the word-count limitation
in ORAP 5.05(2)(b) and (2) the size of the type in this brief is not
smaller than 14 point for both the text of the brief and footnotes as
required by ORAP 5.05(4)(f).

Word count (as calculated by [software]): [NUMBER] words.

________________________________________
[Signature]
[Typed name]
```

## Brief Cover Pages (ORAP 5.05(4)(a)-(c))

### Cover Colors

| Brief Type | Original | Copies |
|-----------|----------|--------|
| Opening brief (COA) | White | Blue, 65-lb weight |
| Answering brief (COA) | White | Red |
| Reply brief (COA) | White | Gray |
| Petition for Review (SC) | White | White |
| Response to Petition (SC) | Orange | Orange |
| Merits Brief (SC) | Per COA rules | Per COA rules |

### Cover Page Content (ORAP 5.05(4)(c))
The front cover must include:
1. Court name ("IN THE COURT OF APPEALS OF THE STATE OF OREGON" or "IN THE SUPREME COURT OF THE STATE OF OREGON")
2. Case number (appellate court number)
3. Case title
4. Trial court case number and county
5. Brief title (e.g., "APPELLANT'S OPENING BRIEF")
6. Author name and bar number (or "Pro Se")
7. Law firm name (if applicable)
8. Month and year of filing (lower right corner)

## Required Brief Structure (ORAP 5.35, 5.40, 5.45)

Briefs must contain these sections **in this order**:

### 1. Index (ORAP 5.35)
- Index of contents (with summaries of each assignment of error)
- Index of appendices (if any)
- Index of authorities (cases alphabetical, then constitutions, statutes, texts)

### 2. Statement of the Case (ORAP 5.40) — 12 required items:
1. Nature of the action/proceeding and relief sought
2. Nature of the judgment being reviewed
3. Statutory basis of appellate jurisdiction
4. Date of judgment entry, date notice of appeal filed, timeliness explanation
5. (Agency cases) Nature and jurisdictional basis of agency action
6. Questions presented on appeal
7. **Summary of argument** (concise overview)
8. Request for de novo review (if applicable, with reasons)
9. **Statement of facts** (concise, with record references)
10. (Dissolution cases) Date of marriage, ages, custody, support
11. Significant motions filed in the appeal
12. Other relevant matters from the record

### 3. Assignments of Error (ORAP 5.45)
Each assignment must include:
- **Preservation**: Show the issue was raised below (with record cite) or is "error apparent on the record"
- **Standard of review**: Identify which standard applies
- **Argument**: Explain why the lower court erred

### 4. Excerpt of Record (ORAP 5.50)
- Follows assignments of error
- Copies of pertinent trial court documents
- Chronological order
- Must begin with an index

### 5. Appendix (ORAP 5.52) — optional
- Helpful materials not in excerpt of record (e.g., statutes, rules)

### 6. Certificate of Compliance (ORAP 5.05(2)(d))

### 7. Proof of Service (ORAP 5.10(3)-(4))
- Must be the last page of the brief
- May be printed on or attached inside the back cover

## Appellate eFiling (ORAP Chapter 16)

### Key Requirements
- **Mandatory for attorneys** (ORAP 16.60); pro se parties may eFile or paper file
- **Single unified PDF** — do not submit as principal + supporting documents
- **PDF security**: Must allow text searching and copying
- **Bookmarks required** in eFiled briefs (ORAP 16.50)
- **Hyperlinks**: Internal cross-references should be hyperlinked
- **File size**: Check court's current limits
- **Electronic signatures**: "/s/ [Name]" acceptable (ORAP 16.40)

### What Goes in One PDF
Examples of unified filings:
1. Notice of appeal + judgment being appealed + certificate of service
2. Motion + affidavit/declaration + certificate of service
3. Brief + excerpt of record + certificate of compliance + proof of service
4. Petition for review + COA decision + certificate of service

## Petition for Review (ORAP 9.05) — Supreme Court

When seeking review of a Court of Appeals decision:
- **Page limit**: 15 pages (13pt type) or 18 pages (14pt type)
- **Cover**: Must identify petitioner, respondent, COA decision date, means of disposition
- **Criteria**: ORAP 9.07 — significant constitutional/legal question, conflict with other decisions, important public interest question
- **Filing**: 1 original + 12 copies to Supreme Court
- **Service**: 2 copies on every other party
- **Response**: Same page/type limits as petition; cover is orange

## Motions in Appellate Court (ORAP 7.05-7.55)

### Format (ORAP 7.10, Appendix 7.10-2)
- Caption: Appellate court case number and title
- Heading identifying the motion
- Statement of opposing counsel's position (whether to expect written objection)
  - **Exception**: First motion to extend time (28 days or less) — no position statement needed
- Supporting facts and legal argument
- Certificate of service

### Common Motion Titles (Appendix 7.10-1)
- Motion for Extension of Time
- Motion to Dismiss Appeal
- Motion to Stay
- Motion for Leave to File Overlength Brief
- Motion to Take Judicial Notice

## Notice of Appeal (ORAP 2.05, Appendix 2.05)

### Required Contents
1. Heading: "NOTICE OF APPEAL" or "NOTICE OF CROSS-APPEAL"
2. Identity of appellant
3. Designation of judgment being appealed
4. Designation of adverse parties
5. Litigant contact information (ORAP 1.30)
6. Designation of record (transcript, exhibits)
7. Proof of service
8. Filing fee or fee waiver/deferral

### Caption Format
```
IN THE COURT OF APPEALS OF THE STATE OF OREGON

[Case Title per ORAP 2.25]

[County] County Circuit Court
Case No. [trial court number]
```

## Mandamus Proceedings (ORAP 11.05-11.17)

Original proceedings in the Supreme Court:
- Petition + memorandum (combined max 35 pages or 10,000 words)
- Must include copy of challenged order/decision
- Answering brief: same length limits
- Reply: only with leave of court

---

# GENERAL REFERENCE

## Service Addresses

### Oregon DHS
```
Oregon Department of Human Services
Attn: Liesl Wendt, Director
500 Summer St. NE E-15
Salem, OR 97301
```

### Oregon DOJ
```
Oregon Department of Justice
Attn: Dan Rayfield, Attorney General
1162 Court Street NE
Salem, OR 97301-4096
```

### Appellate Court Records Section
```
Appellate Court Administrator
Appellate Court Records Section
1163 State Street
Salem, Oregon 97301-2563
```

## Default Plaintiff Info

```
LEVI BAKKE, Pro Se
501 C Avenue
La Grande, OR 97850
```

## See Also

- `references/oregon-formatting.md` — Circuit court formatting details
- `references/oregon-appellate-formatting.md` — Appellate formatting details
- `scripts/generate_court_doc.js` — Reusable circuit court generation script
