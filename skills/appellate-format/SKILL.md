---
name: appellate-format
description: Validate Oregon appellate court filings against ORAP format rules. Use when drafting or reviewing briefs, notices of appeal, mandamus petitions, or any filing for the Oregon Court of Appeals or Supreme Court.
---

# Oregon Appellate Filing Format Skill

Validates filings against Oregon Rules of Appellate Procedure (ORAP) format requirements. Checks font, margins, word count, required sections, cover page elements, and filing-type-specific rules.

## When to Use This Skill

Trigger when user:
- Drafts or reviews a brief for Oregon Court of Appeals or Supreme Court
- Asks about ORAP formatting requirements
- Needs to validate a filing before submission
- Mentions "appellate format", "ORAP", "brief format", "opening brief", "notice of appeal format"
- Is preparing to file anything with the Oregon appellate courts
- Asks about word count limits, font requirements, margin requirements
- Needs a checklist for an appellate filing
- Mentions mandamus petition format

## Core Commands

### Validate a Filing Against ORAP Rules
```
python "C:\Users\Big Levi\.claude\skills\appellate-format\scripts\validate.py" "path\to\filing.md" --type opening-brief
```

Filing types: `opening-brief`, `answering-brief`, `reply-brief`, `notice-of-appeal`, `mandamus`, `motion`

### Get Checklist for a Filing Type
```
python "C:\Users\Big Levi\.claude\skills\appellate-format\scripts\validate.py" --checklist opening-brief
```

### Get Format Rules Summary
```
python "C:\Users\Big Levi\.claude\skills\appellate-format\scripts\validate.py" --rules
```

### Count Words (ORAP-compliant, excludes headings/TOC/certificates)
```
python "C:\Users\Big Levi\.claude\skills\appellate-format\scripts\validate.py" "path\to\filing.md" --word-count
```

## Quick Reference: Key ORAP Rules

### Format (ORAP 5.05)
- **Font**: Times New Roman, Arial, or Century Schoolbook, 14pt minimum (body AND footnotes)
- **Margins**: 1.25" inside (binding), 1.0" outside, 0.75" top/bottom
- **Spacing**: Double-spaced body text; footnotes may be single-spaced
- **Print**: Black only (hyperlinks excepted)
- **Page numbers**: Top of page, within 3/8" from top edge

### Word Count Limits
| Court | Opening/Answering | Reply |
|-------|-------------------|-------|
| Court of Appeals | 10,000 words / 35 pages | 3,300 words / 10 pages |
| Supreme Court | 14,000 words / 50 pages | 4,000 words / 15 pages |

### What's EXCLUDED from word count:
Headings, cover page, table of contents, table of authorities, excerpt of record, appendix, certificates, signatures.

### Opening Brief Required Sections (ORAP 5.40 + 5.45)
1. Cover Page (9 required elements)
2. Table of Contents
3. Table of Authorities
4. Statement of the Case:
   - Nature of the Action
   - Nature of the Judgment
   - Jurisdictional Basis
   - Timeliness of Appeal
   - Questions Presented
   - Summary of Argument
   - Statement of Facts (with record references)
5. Assignments of Error (each separately numbered, with preservation + standard of review)
6. Argument (organized by assignment of error)
7. Conclusion (specific relief requested)
8. Certificate of Compliance with Word Count
9. Signature + parties represented
10. Certificate of Filing
11. Proof/Certificate of Service
12. Excerpt of Record (ER-1 pagination)
13. Appendix (if any, App-1 pagination, max 25 pages)

### Notice of Appeal Required Elements (ORAP 2.05)
1. Full case title with ALL parties
2. Trial court AND appeal designations
3. Both case numbers (trial + appellate)
4. "NOTICE OF APPEAL" heading
5. Identification of judgment being appealed
6. Court, county, judge name
7. Adverse party designations
8. Contact information (ORAP 1.30)
9. Record designation
10. Statement of points (unless all testimony designated)
11. Timeliness explanation (if >30 days)
12. Proof of service
13. Certificate of filing
14. Attached copy of judgment/order

### Mandamus Petition Required Elements (ORAP 11.05)
1. Caption per Appendix 11.05 (writ type, party designations)
2. Lower court case number(s)
3. Concise factual summary
4. Timeliness explanation
5. Why circuit court relief unavailable
6. Why appeal is not adequate remedy
7. Memorandum of law (ORAP 7.10)
8. Excerpt of record (if record exists)
9. Copy of challenged order/decision
10. Proof of service on ALL adverse parties + lower court participants
11. If state entity: service on Attorney General
12. If requesting stay: "STAY REQUESTED" in caption + futility explanation

### Pro Se Accommodations
- May file on paper (not required to eFile)
- May omit excerpt of record, OR include only judgment/order + relevant rulings
- Pro se supplemental briefs (ORAP 5.92) need not be text-searchable
- Fee waiver/deferral available
- Same substantive legal standards apply

## Decision Flow

```
User drafting/reviewing appellate filing
  |
  v
Determine filing type:
  - Opening/answering brief?  -> validate.py [file] --type opening-brief
  - Notice of appeal?         -> validate.py [file] --type notice-of-appeal
  - Mandamus petition?        -> validate.py [file] --type mandamus
  - Reply brief?              -> validate.py [file] --type reply-brief
  - Just need checklist?      -> validate.py --checklist [type]
  - Just need rules?          -> validate.py --rules
  |
  v
Review validation results -> Fix issues -> Re-validate
```

## Reference Data
- Full ORAP format rules: `C:\Users\Big Levi\.claude\skills\appellate-format\references\ORAP_FORMAT_RULES.md`
- Official ORAP rules (online): https://www.courts.oregon.gov/courts/appellate/rules/pages/orap.aspx
- Sample briefs: https://www.courts.oregon.gov/courts/appellate/samples/Pages/briefs.aspx
- eFiling portal: https://www.courts.oregon.gov/services/online/pages/appellate-efile.aspx
- Appellate Records Section: 503-986-5555
- eFiling Help Desk: 503-986-5582

## Key Contacts
- **Appellate Court Records Section**: 503-986-5555
- **eFiling Help Desk**: 503-986-5582 (7 AM - 5 PM M-F)
- **Brief Bank**: https://cdm17027.contentdm.oclc.org/digital
- **Fee Waiver Forms**: https://www.courts.oregon.gov/courts/appellate/rules/Pages/filing-fees.aspx
