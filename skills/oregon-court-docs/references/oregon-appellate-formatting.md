# Oregon Appellate Court Formatting Reference

## Authority
Oregon Rules of Appellate Procedure (ORAP), effective January 1, 2025
https://www.courts.oregon.gov/rules/ORAP/ORAP2025FullPermanentTempAmendments.pdf

## Typography (ORAP 5.05(4)(f))

### Proportionally Spaced Type (standard)
- **Fonts**: Century Schoolbook, Times New Roman, or Arial
- **Size**: Minimum 14pt for body text AND footnotes
- **Prohibited**: Reducing or condensing typeface to increase word count
- **Prohibited**: Briefs printed entirely or substantially in UPPERCASE
- **Prohibited**: Color highlighting on any part of text

### Monospaced Type (alternative)
- Any monospaced font (e.g., Courier New)
- Maximum 10 characters per inch (cpi)
- Same size minimums apply to footnotes

### Spacing
- Body text: Double-spaced
- Block quotations: Double space above and below
- Block quotes may be single-spaced and indented

## Page Layout

### Paper and Margins
- 8.5" × 11" uniform size for pages and covers
- Standard 1" margins all sides
- Page numbers required (may be in margins, but no text in margins)

### DXA Values for docx-js
```javascript
const APPELLATE_PAGE = {
  page: {
    size: { width: 12240, height: 15840 },  // 8.5" × 11"
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }  // 1" all sides
  }
};

// Font defaults for appellate brief
const APPELLATE_FONT = {
  document: {
    run: {
      font: "Times New Roman",
      size: 28  // 14pt in half-points
    }
  }
};
```

## Word Count and Page Limits (ORAP 5.05(2))

### Court of Appeals
| Brief Type | Word Limit | Page Limit (no word count) |
|-----------|-----------|--------------------------|
| Opening brief | 10,000 | 35 pages |
| Answering brief | 10,000 | 35 pages |
| Combined brief¹ | 13,300 | 45 pages |
| Reply brief | 3,300 | 10 pages |
| Excerpt of record | 50 pages | 50 pages |
| Appendix | 25 pages | 25 pages |

### Supreme Court
| Brief Type | Word Limit | Page Limit (no word count) |
|-----------|-----------|--------------------------|
| Opening brief (merits) | 14,000 | 50 pages |
| Answering brief (merits) | 14,000 | 50 pages |
| Reply brief | 4,000 | N/A |
| Petition for review | 15 pages (13pt) or 18 pages (14pt) | Same |
| Response to petition | 15 pages (13pt) or 18 pages (14pt) | Same |
| Mandamus petition + memo | 10,000 words or 35 pages combined | Same |

¹ Combined respondent's answering/cross-appellant's opening brief, etc.

### Overlength Briefs
- Must file motion under ORAP 5.05(3) stating specific reason
- File motion at least 7 days before brief is due
- Court may deny untimely motions

## Brief Covers (ORAP 5.05(4)(a)-(d))

### Color Chart
| Brief | Original Cover | Copy Covers |
|-------|---------------|-------------|
| Appellant's opening | White | Blue (65-lb) |
| Respondent's answering | White | Red |
| Reply | White | Gray |
| Cross-appellant's opening | White | Green |
| Amicus curiae | White | Tan |
| Petition for review | White | White |
| Response to petition | Orange | Orange |

### Cover Content (ORAP 5.05(4)(c))
Must include, formatted per Appendix 5.05-1:
1. Court name (centered, top)
2. Appellate case number
3. Case title (per ORAP 2.25)
4. Trial court/agency name and case number
5. Brief title (e.g., "APPELLANT'S OPENING BRIEF")
6. Author: name, bar number (or "Pro Se"), firm name
7. Filing date: month and year (lower right corner)

### Cover Example
```
IN THE COURT OF APPEALS OF THE STATE OF OREGON

CA A123456

JOHN DOE,
     Plaintiff-Appellant,

v.

JANE ROE,
     Defendant-Respondent.

Baker County Circuit Court
Case No. 24CV12345

Honorable Matthew Shirtcliff, Judge

APPELLANT'S OPENING BRIEF

John Doe
Pro Se
123 Main Street
Baker City, Oregon 97814
(541) 555-1234

                                                    February 2026
```

## Required Brief Sections — Strict Order

### Opening Brief (ORAP 5.35, 5.40, 5.45, 5.50)

1. **Cover** (front and back)
2. **Index** (ORAP 5.35)
   - Table of contents with assignment of error summaries
   - Table of appendices
   - Table of authorities (cases alphabetical → constitutions → statutes → texts)
3. **Statement of the Case** (ORAP 5.40) — 12 items in order:
   - (1) Nature of action, relief sought
   - (2) Nature of judgment being reviewed; jury or bench trial
   - (3) Statutory basis of appellate jurisdiction
   - (4) Date of judgment, date of notice of appeal, timeliness
   - (5) [Agency cases] Nature of agency action
   - (6) Questions presented on appeal
   - (7) Summary of argument
   - (8) De novo review request (if applicable)
   - (9) Statement of facts — concise, with record references
   - (10) [Dissolution cases] Marriage details
   - (11) Significant motions in the appeal
   - (12) Other relevant matters from the record
4. **Assignments of Error** (ORAP 5.45)
   - Each separately numbered
   - Must state: Preservation, Standard of Review, Argument
5. **Excerpt of Record** (ORAP 5.50)
   - Chronological order
   - Begins with index
   - Only pertinent documents
6. **Appendix** (ORAP 5.52) — optional
7. **Certificate of Compliance** (ORAP 5.05(2)(d))
8. **Proof of Service** — must be last page

### Answering Brief (ORAP 5.55)
- Same general format
- Need not repeat facts unless contesting
- May include cross-assignments of error (ORAP 5.57)

### Reply Brief (ORAP 5.70)
- Confined to matters raised in answering brief
- Need not contain summary of argument

## Assignments of Error (ORAP 5.45) — Detail

### Required Components
Each assignment must include:

1. **Identification of ruling**: Precisely identify the legal, procedural, factual, or other ruling being challenged, with record reference

2. **Preservation of error** (ORAP 5.45(1), (4)):
   - Show issue was raised below
   - Cite where in the record the objection/argument was made
   - OR argue "error apparent on the record" (plain error)

3. **Standard of review** (ORAP 5.45(5)):
   - Identify the one applicable standard
   - Common standards: abuse of discretion, de novo, substantial evidence, errors of law

4. **Argument** (ORAP 5.45(6)):
   - Legal reasoning with citations
   - If multiple assignments raise the same legal question, may combine argument

### Model Format (Appendix 5.45)
```
FIRST ASSIGNMENT OF ERROR

The trial court erred in granting defendant's motion for summary
judgment. (Record [page number].)

Preservation of Error

Plaintiff preserved this issue by filing a response to defendant's
motion for summary judgment and arguing against it at the hearing on
[date]. (Record [page number].)

Standard of Review

The standard of review is for errors of law. [Citation.]

Argument

[Legal argument with citations to the record and authorities.]
```

## Record References (ORAP 5.20)

### Standard Abbreviations
| Source | Abbreviation |
|--------|-------------|
| Transcript | Tr |
| Trial court file | TCF |
| Exhibit | Ex |
| Excerpt of Record | ER |
| Supplemental Excerpt of Record | SER |
| Supplemental Transcript | Supp Tr |

### Format
- "Tr 45" (transcript page 45)
- "TCF 12" (trial court file page 12)
- "Ex 3" (exhibit 3)
- "ER 15" (excerpt of record page 15)

## eFiling Requirements (ORAP Chapter 16)

### Who Must eFile
- **Attorneys**: Mandatory (ORAP 16.60)
- **Pro se parties**: Optional — may eFile or paper file (ORAP 16.60(2))

### Document Format (ORAP 16.15)
- **PDF format** required
- **Single unified PDF** — not principal + attachments
- **Text-searchable**: Must allow text searching and copying
- **No password protection** that prevents court access
- **Bookmarks**: Required in eFiled briefs (ORAP 16.50)
- **Hyperlinks**: Internal cross-references should be hyperlinked (ORAP 16.50)

### Electronic Signatures (ORAP 16.40)
- Format: "/s/ [Name]"
- Filer must retain the original signed document for 3 years

### What Goes in One PDF (examples)
1. Notice of appeal + judgment + certificate of service
2. Motion + declaration + certificate of service
3. Brief + excerpt of record + cert of compliance + proof of service
4. Petition for review + COA decision + certificate of service

## Notice of Appeal (ORAP 2.05)

### Required Contents
1. Heading: "NOTICE OF APPEAL"
2. Identity of appellant
3. Designation of judgment being appealed (with register date)
4. Designation of adverse parties
5. Litigant contact information (ORAP 1.30)
6. Designation of record (what transcript/exhibits to include)
7. Proof of service on all parties
8. Filing fee ($281 civil, check current amount) or fee waiver

### Filing
- File with trial court administrator (not appellate court)
- Within 30 days of judgment entry (ORS 19.255)
- Only the original need be filed

### Caption
```
IN THE COURT OF APPEALS OF THE STATE OF OREGON

[APPELLANT NAME],
     [Trial court designation]-Appellant,

v.

[RESPONDENT NAME],
     [Trial court designation]-Respondent.

[County] County Circuit Court
Case No. [trial court number]
```

## Petition for Review — Supreme Court (ORAP 9.05)

### When to File
- Within 35 days of COA decision (ORS 2.520)

### Criteria for Review (ORAP 9.07)
The Supreme Court considers:
1. Significant question of constitutional or statutory law
2. Conflict with other COA or SC decisions
3. Important question of law of first impression
4. Issue of significant public interest

### Cover Must Include
- Identity of petitioner and respondent on review
- Date of COA decision
- Means of disposition (opinion author, concurrence, dissent; or per curiam)
- Whether petitioner intends to file merits brief or rely on petition

### Filing
- 1 original + 12 copies to Supreme Court
- Serve 2 copies on every other party

## Mandamus in Supreme Court (ORAP 11.05-11.17)

### When Available
- To compel a public officer/body to perform a duty
- To challenge trial court orders not otherwise appealable

### Documents
- Petition: Filed with Supreme Court
- Memorandum of law: Combined with petition, max 10,000 words or 35 pages
- Must include copy of challenged order/decision
- Answering brief: Same length limits
- Reply: Only with leave of court

## Amicus Curiae (ORAP 8.15)

### Requirements
- Application stating: party alignment, timeliness, interest in case
- Brief: Subject to same formatting rules
- Must identify whether aligned with petitioner, respondent, or unaligned

## Filing Deadlines — Key Dates

### Civil Appeal Timeline
1. Notice of appeal: 30 days after judgment entry
2. Transcript designation: In notice of appeal
3. Opening brief: 49 days after transcript settled (or record deemed settled)
4. Answering brief: 49 days after opening brief served
5. Reply brief: 21 days after answering brief served

### Supreme Court Review
1. Petition for review: 35 days after COA decision
2. Response: 14 days after petition served
3. Merits briefs: Per court order after review is allowed

## Common Pitfalls

1. **Wrong font size**: Must be 14pt minimum — 12pt will be rejected
2. **Single-spaced body**: Must be double-spaced (block quotes excepted)
3. **Missing certificate of compliance**: Brief will be stricken
4. **Missing proof of service**: Filing may be refused
5. **Separate PDFs**: Must be single unified PDF for eFiling
6. **Missing preservation**: Each assignment of error must show the issue was raised below
7. **Wrong cover color**: Can delay processing
8. **Exceeding word count**: Brief may be stricken without leave for overlength
