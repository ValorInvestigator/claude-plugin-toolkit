"""Oregon Appellate Filing Format Validator (ORAP compliance checker).

Validates Markdown legal filings against Oregon Rules of Appellate Procedure.
Checks required sections, word count, structural elements, and filing-type rules.

Usage:
    python validate.py <file> --type opening-brief
    python validate.py <file> --type notice-of-appeal
    python validate.py <file> --type mandamus
    python validate.py <file> --word-count
    python validate.py --checklist opening-brief
    python validate.py --rules
"""

import argparse
import re
import sys
from pathlib import Path


# ============================================================================
# ORAP RULES DATA
# ============================================================================

WORD_LIMITS = {
    "coa": {
        "opening-brief": 10000,
        "answering-brief": 10000,
        "reply-brief": 3300,
        "supplemental": None,  # 5 pages max, no word count
    },
    "sc": {
        "opening-brief": 14000,
        "answering-brief": 14000,
        "reply-brief": 4000,
        "supplemental": None,
    },
}

PAGE_LIMITS = {
    "coa": {
        "opening-brief": 35,
        "answering-brief": 35,
        "reply-brief": 10,
        "supplemental": 5,
        "appendix": 25,
    },
    "sc": {
        "opening-brief": 50,
        "answering-brief": 50,
        "reply-brief": 15,
        "supplemental": 5,
        "appendix": 25,
    },
}

# Required sections for each filing type, in order
# Each tuple: (section_name, required_bool, search_patterns)
OPENING_BRIEF_SECTIONS = [
    ("Cover Page / Caption", True, [
        r"(?i)(IN THE (COURT OF APPEALS|SUPREME COURT)|APPELLANT.S OPENING BRIEF)",
    ]),
    ("Table of Contents", True, [
        r"(?i)(TABLE OF CONTENTS|INDEX)",
    ]),
    ("Table of Authorities", True, [
        r"(?i)(TABLE OF AUTHORITIES|INDEX OF AUTHORITIES|AUTHORITIES)",
    ]),
    ("Statement of the Case", True, [
        r"(?i)STATEMENT OF THE CASE",
    ]),
    ("Nature of the Action", True, [
        r"(?i)NATURE OF THE (ACTION|PROCEEDING)",
    ]),
    ("Nature of the Judgment", True, [
        r"(?i)NATURE OF THE JUDGMENT",
    ]),
    ("Jurisdictional Basis", True, [
        r"(?i)JURISDICTI",
    ]),
    ("Timeliness of Appeal", True, [
        r"(?i)TIMELIN",
    ]),
    ("Questions Presented", True, [
        r"(?i)(QUESTIONS PRESENTED|ISSUES (ON|FOR) (APPEAL|REVIEW))",
    ]),
    ("Summary of Argument", True, [
        r"(?i)SUMMARY OF (THE )?ARGUMENT",
    ]),
    ("Statement of Facts", True, [
        r"(?i)STATEMENT OF (THE )?FACTS",
    ]),
    ("Assignments of Error", True, [
        r"(?i)(ASSIGNMENT|ERROR|FIRST ASSIGNMENT|SECOND ASSIGNMENT)",
    ]),
    ("Preservation of Error", True, [
        r"(?i)PRESERV",
    ]),
    ("Standard of Review", True, [
        r"(?i)STANDARD OF REVIEW",
    ]),
    ("Argument", True, [
        r"(?i)^#+\s*(?:V\.?\s+)?ARGUMENT",
        r"(?i)^#+\s*[IVX]+\.?\s+ARGUMENT",
    ]),
    ("Conclusion", True, [
        r"(?i)^#+\s*(?:V?I\.?\s+)?CONCLUSION",
        r"(?i)^#+\s*[IVX]+\.?\s+CONCLUSION",
    ]),
    ("Certificate of Word Count", True, [
        r"(?i)(CERTIFICATE OF COMPLIANCE|WORD.COUNT CERT|CERTIFICATE.*WORD)",
    ]),
    ("Certificate of Filing", True, [
        r"(?i)CERTIFICATE OF FILING",
    ]),
    ("Certificate of Service", True, [
        r"(?i)(CERTIFICATE OF (SERVICE|FILING AND SERVICE|FILING & SERVICE)|PROOF OF SERVICE)",
    ]),
    ("Signature", True, [
        r"(?i)(DATED|RESPECTFULLY SUBMITTED|_____|Pro Se)",
    ]),
]

NOTICE_OF_APPEAL_SECTIONS = [
    ("Case Title / Caption", True, [
        r"(?i)(IN THE CIRCUIT COURT|Case No\.)",
    ]),
    ("NOTICE OF APPEAL Heading", True, [
        r"(?i)NOTICE OF APPEAL",
    ]),
    ("Identification of Judgment", True, [
        r"(?i)(ORDER|JUDGMENT|APPEALED FROM|ORDERS AND JUDGMENTS)",
    ]),
    ("Assignments of Error", True, [
        r"(?i)(ASSIGNMENT|ERROR|ISSUES|POINTS)",
    ]),
    ("Record Designation", True, [
        r"(?i)(DESIGNATION OF RECORD|RECORD|TRANSCRIPT|DESIGNATION)",
    ]),
    ("Certificate of Service", True, [
        r"(?i)(CERTIFICATE OF (SERVICE|FILING AND SERVICE|FILING & SERVICE)|PROOF OF SERVICE)",
    ]),
    ("Signature / Date", True, [
        r"(?i)(DATED|_____|Pro Se|APPELLANT)",
    ]),
]

MANDAMUS_SECTIONS = [
    ("Caption / Title Page", True, [
        r"(?i)(IN THE SUPREME COURT|PETITION|WRIT|MANDAMUS)",
    ]),
    ("Writ Type (Alternative or Peremptory)", True, [
        r"(?i)(ALTERNATIVE|PEREMPTORY|WRIT OF MANDAMUS)",
    ]),
    ("Lower Court Case Number", True, [
        r"(?i)(Case No|CIRCUIT COURT|BAKER COUNTY)",
    ]),
    ("Factual Summary", True, [
        r"(?i)(FACT|BACKGROUND|STATEMENT OF (THE )?CASE|INTRODUCTION)",
    ]),
    ("Why Appeal Is Not Adequate", True, [
        r"(?i)(INADEQUA|NO ADEQUATE|APPEAL.*NOT.*ADEQUATE|ADEQUATE REMEDY|EXTRAORDINARY|IRREPARABLE)",
    ]),
    ("Memorandum of Law / Argument", True, [
        r"(?i)(MEMORANDUM|ARGUMENT|LEGAL (ANALYSIS|STANDARD|AUTHORITY))",
    ]),
    ("Copy of Challenged Order", True, [
        r"(?i)(EXHIBIT|ATTACH|CHALLENGED ORDER|ORDER.*(DENIED|DENYING|GRANTING))",
    ]),
    ("Certificate of Service", True, [
        r"(?i)(CERTIFICATE OF (SERVICE|FILING AND SERVICE|FILING & SERVICE)|PROOF OF SERVICE)",
    ]),
    ("Service on Attorney General", False, [
        r"(?i)(ATTORNEY GENERAL|DEPT\.? OF JUSTICE|DOJ|AG)",
    ]),
    ("Signature / Date", True, [
        r"(?i)(DATED|_____|Pro Se|RELATOR)",
    ]),
]

COVER_PAGE_ELEMENTS = [
    ("Court name (Court of Appeals or Supreme Court)", [
        r"(?i)(COURT OF APPEALS|SUPREME COURT)",
    ]),
    ("Case title with all parties", [
        r"(?i)(Appellant|Respondent|Petitioner|Relator|Protected Person)",
    ]),
    ("Trial court designations", [
        r"(?i)(Plaintiff|Defendant|Petitioner|Respondent|Protected Person|Guardian|Conservator)",
    ]),
    ("Appeal designations", [
        r"(?i)(Appellant|Respondent|Cross.Appellant|Relator)",
    ]),
    ("Trial court case number", [
        r"(?i)Case No",
    ]),
    ("Originating court and county", [
        r"(?i)(Circuit Court|County|Baker|Union|Multnomah)",
    ]),
    ("Trial judge name", [
        r"(?i)(Judge|Honorable|Hon\.)",
    ]),
    ("Contact information", [
        r"(?i)(Address|Phone|Email|Pro Se|Bar No)",
    ]),
    ("Filing date (month/year)", [
        r"(?i)(February|March|April|May|June|July|August|September|October|November|December|January)\s+\d{4}",
    ]),
]


# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def read_filing(filepath):
    """Read a filing and return its content."""
    path = Path(filepath)
    if not path.exists():
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)
    return path.read_text(encoding="utf-8", errors="replace")


def count_words_orap(text):
    """Count words per ORAP rules, excluding headings, TOC, authorities,
    certificates, excerpt of record, appendix, and signatures."""
    lines = text.split("\n")
    exclude_sections = False
    exclude_patterns = [
        r"(?i)^#+\s*(TABLE OF CONTENTS|INDEX)\s*$",
        r"(?i)^#+\s*(TABLE OF AUTHORITIES|INDEX OF AUTHORITIES)\s*$",
        r"(?i)^#+\s*CERTIFICATE",
        r"(?i)^#+\s*(PROOF|CERTIFICATE) OF SERVICE",
        r"(?i)^#+\s*EXCERPT OF RECORD",
        r"(?i)^#+\s*APPENDIX",
    ]
    resume_patterns = [
        r"(?i)^#+\s*(I+\.|V+\.|STATEMENT|NATURE|JURISDICTION|TIMELINESS|QUESTIONS|SUMMARY|ARGUMENT|ASSIGNMENT|CONCLUSION|INTRODUCTION|BACKGROUND|FACT|FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|[A-F]\.)",
    ]

    counted_lines = []
    for line in lines:
        stripped = line.strip()

        # Skip markdown headings (they're excluded from word count)
        if stripped.startswith("#"):
            # Check if we're entering an excluded section
            for pat in exclude_patterns:
                if re.match(pat, stripped):
                    exclude_sections = True
                    break
            else:
                # Check if we're resuming counted content
                for pat in resume_patterns:
                    if re.match(pat, stripped):
                        exclude_sections = False
                        break
            continue  # Headings themselves always excluded

        # Skip horizontal rules
        if stripped.startswith("---"):
            continue

        # Skip empty lines
        if not stripped:
            continue

        # Skip if we're in an excluded section
        if exclude_sections:
            continue

        # Skip lines that look like signature blocks
        if re.match(r"^_{3,}", stripped):
            continue

        # Skip caption/formatting lines
        if re.match(r"^\s*\)\s*$", stripped):
            continue

        counted_lines.append(stripped)

    # Count words
    all_text = " ".join(counted_lines)
    # Remove markdown formatting
    all_text = re.sub(r"\*\*([^*]+)\*\*", r"\1", all_text)  # bold
    all_text = re.sub(r"\*([^*]+)\*", r"\1", all_text)  # italic
    all_text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", all_text)  # links
    all_text = re.sub(r"`([^`]+)`", r"\1", all_text)  # code

    words = all_text.split()
    return len(words)


def check_sections(text, required_sections):
    """Check which required sections are present in the filing."""
    results = []
    for section_name, required, patterns in required_sections:
        found = False
        for pattern in patterns:
            if re.search(pattern, text, re.MULTILINE):
                found = True
                break
        results.append({
            "section": section_name,
            "required": required,
            "found": found,
            "status": "PASS" if found else ("MISSING" if required else "OPTIONAL - not found"),
        })
    return results


def check_cover_page(text):
    """Check cover page elements for the first ~50 lines of the filing."""
    # Get first 80 lines (cover page area)
    lines = text.split("\n")[:80]
    cover_text = "\n".join(lines)

    results = []
    for element_name, patterns in COVER_PAGE_ELEMENTS:
        found = False
        for pattern in patterns:
            if re.search(pattern, cover_text):
                found = True
                break
        results.append({
            "element": element_name,
            "found": found,
            "status": "PASS" if found else "MISSING",
        })
    return results


def check_record_references(text):
    """Check if Statement of Facts contains record/transcript references."""
    # Find the Statement of Facts section
    facts_match = re.search(
        r"(?i)(?:STATEMENT OF (?:THE )?FACTS|FACTUAL BACKGROUND)(.*?)(?=\n#{1,3}\s|\Z)",
        text,
        re.DOTALL,
    )
    if not facts_match:
        return None

    facts_text = facts_match.group(1)
    # Look for record references
    ref_patterns = [
        r"(?:Tr|TR)\s*(?:at\s*)?\d+",           # Tr 45, TR at 45
        r"(?:ER|App|Ex)\s*[-]?\s*\d+",            # ER-1, App-1, Ex 3
        r"(?:Record|Rec)\s*(?:at\s*)?\d+",        # Record at 45
        r"(?:Exhibit|Exh?)\s*(?:No\.?\s*)?\d+",   # Exhibit 3
        r"\(\s*R\s*\d+\s*\)",                      # (R 45)
        r"Case (?:No|file)",                       # Case No.
        r"(?:filed|entered|signed).*\d{4}",        # filed January 9, 2026
        r"Bates\s*\d+",                            # Bates 01234
    ]

    has_refs = False
    for pattern in ref_patterns:
        if re.search(pattern, facts_text):
            has_refs = True
            break

    return has_refs


def check_assignment_structure(text):
    """Check if assignments of error follow ORAP 5.45 structure."""
    issues = []

    # Check for numbered assignments
    assignment_pattern = r"(?i)((?:FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|\d+\.?\s*)\s*(?:ASSIGNMENT OF ERROR|assignment))"
    assignments = re.findall(assignment_pattern, text)

    if not assignments:
        # Check for alternative numbering
        alt_pattern = r"(?i)(?:\*\*\d+\.\s*(?:The trial court erred|Error))"
        assignments = re.findall(alt_pattern, text)

    if not assignments:
        issues.append("No separately numbered assignments of error found (ORAP 5.45 requires each to be separately stated)")

    # Check for preservation of error
    if not re.search(r"(?i)preserv", text):
        issues.append("No 'Preservation of Error' discussion found (ORAP 5.45 requires showing each issue was raised below)")

    # Check for standard of review
    if not re.search(r"(?i)standard of review", text):
        issues.append("No 'Standard of Review' section found (ORAP 5.45 requires identifying the applicable standard for each assignment)")

    return issues


def check_service_completeness(text):
    """Check if certificate of service identifies method and recipients."""
    service_match = re.search(
        r"(?i)(?:CERTIFICATE|PROOF) OF (?:SERVICE|FILING AND SERVICE|FILING & SERVICE)(.*?)(?=\n#{1,3}\s|\Z)",
        text,
        re.DOTALL,
    )
    if not service_match:
        return ["No certificate/proof of service found"]

    service_text = service_match.group(1)
    issues = []

    # Check for service method
    methods = ["mail", "email", "hand", "personal", "certified", "first class", "electronic"]
    has_method = any(m in service_text.lower() for m in methods)
    if not has_method:
        issues.append("Certificate of service does not specify method of service")

    # Check for date
    if not re.search(r"(?i)(on\s+\w+\s+\d+|dated|this\s+\d+)", service_text):
        issues.append("Certificate of service does not specify date of service")

    return issues


# ============================================================================
# CHECKLISTS
# ============================================================================

CHECKLISTS = {
    "opening-brief": """
OPENING BRIEF CHECKLIST (Oregon Court of Appeals) -- ORAP 5.40 + 5.45
=========================================================================

FORMAT (ORAP 5.05):
[ ] Font: Times New Roman, Arial, or Century Schoolbook, 14pt minimum
[ ] 14pt minimum for BOTH body text AND footnotes
[ ] Double-spaced body text
[ ] Margins: 1.25" inside (binding), 1.0" outside, 0.75" top/bottom
[ ] Page numbers at top of page, within 3/8" from top edge
[ ] Black print only (hyperlinks excepted)
[ ] No condensed/reduced typeface
[ ] Not substantially uppercase
[ ] Word count: 10,000 words max (COA) / 14,000 words max (SC)

COVER PAGE (ORAP 5.05(4)):
[ ] Court name (Court of Appeals or Supreme Court)
[ ] Full case title with ALL parties
[ ] Trial court party designations (plaintiff, defendant, etc.)
[ ] Appeal party designations (appellant, respondent, etc.)
[ ] BOTH case numbers (trial court + appellate)
[ ] Originating court name and county
[ ] Name of trial judge who signed judgment
[ ] Contact info: name, address, phone (pro se) OR name, bar#, firm, address, phone, email (attorney)
[ ] Filing month and year

REQUIRED SECTIONS (in this order):
[ ] Table of Contents
[ ] Table of Authorities (cases, statutes, other -- with page refs)
[ ] Statement of the Case:
    [ ] Nature of the Action (without argument)
    [ ] Nature of the Judgment (without argument)
    [ ] Jurisdictional Basis (statutory authority)
    [ ] Timeliness of Appeal (dates, explanation if >30 days)
    [ ] Questions Presented (without argument)
    [ ] Summary of Argument
    [ ] Statement of Facts (with record/transcript references)
[ ] Assignments of Error (each separately numbered):
    [ ] Preservation of Error (when raised, how, court's response, record cites)
    [ ] Standard of Review (with legal citations)
[ ] Argument (organized by assignment of error)
[ ] Conclusion (specific relief requested)
[ ] Certificate of Compliance with Word Count
[ ] Author signature + firm name + parties represented
[ ] Certificate of Filing
[ ] Proof/Certificate of Service
[ ] Excerpt of Record (ER-1 pagination, chronological, with index)
    [ ] Judgment/order being appealed
    [ ] Rulings on assignments of error
    [ ] Relevant pleadings and transcript excerpts
    [ ] eCourt Case Information register (LAST in excerpt)
[ ] Appendix (if needed -- App-1 pagination, max 25 pages)

eFILING (ORAP Chapter 16):
[ ] PDF format, text-searchable
[ ] Single unified PDF (brief + excerpt + appendix + certificates)
[ ] Under 25 MB file size
[ ] Bookmarks included

PRO SE ACCOMMODATIONS:
* May file on paper (eFiling optional)
* May omit excerpt of record entirely
* OR include only judgment/order + relevant rulings
* Pro se supplemental briefs need not be text-searchable
""",

    "notice-of-appeal": """
NOTICE OF APPEAL CHECKLIST -- ORAP 2.05
=========================================================================

REQUIRED ELEMENTS:
[ ] Full case title with ALL parties named
[ ] Trial court designations (plaintiff, defendant, guardian, etc.)
[ ] Appeal designations (appellant, respondent, etc.)
[ ] BOTH case numbers (trial court + appellate)
[ ] Heading: "NOTICE OF APPEAL" or "NOTICE OF CROSS-APPEAL"
[ ] Identification of judgment/order being appealed
[ ] Which court and county
[ ] Name of trial judge who signed it
[ ] Designation of adverse parties on appeal
[ ] Contact info per ORAP 1.30:
    Pro se: name, mailing address, telephone
    Attorney: name, bar#, firm, address, phone, email
[ ] Record designation:
    [ ] Testimony to be transcribed
    [ ] Exhibits
    [ ] Audio/video recordings
    [ ] Hearing dates (if transcription requested)
[ ] Statement of points (plain/concise intended arguments)
    NOTE: Not required if ALL testimony and instructions designated
[ ] Timeliness explanation (if filing >30 days after judgment)
[ ] Jurisdictional citation (if jurisdiction questionable)
[ ] Proof/Certificate of Service
[ ] Certificate of Filing (specifying filing date)
[ ] Attached copy of judgment/order being appealed

FILING:
[ ] File with Appellate Court Administrator
[ ] Deadline: 30 days after entry of judgment (general rule)
[ ] Cross-appeal deadline: 10 days after service of notice of appeal
[ ] Filing fee paid or waiver/deferral application submitted
""",

    "mandamus": """
MANDAMUS PETITION CHECKLIST -- ORAP 11.05
=========================================================================

CAPTION/TITLE:
[ ] Case caption per Appendix 11.05
[ ] Writ type specified: ALTERNATIVE or PEREMPTORY
[ ] Lower court case number(s)
[ ] Proper party designations:
    - If challenging judge actions: lower court title, "relator" + "adverse party"
    - Otherwise: "State ex rel [Relator], Plaintiff-Relator, v. [Defendant]"
[ ] If requesting stay: "STAY REQUESTED" in caption

REQUIRED CONTENT:
[ ] Concise factual summary of underlying dispute
[ ] Explanation of timeliness
[ ] Justification: why circuit court relief was not or could not be sought
[ ] Demonstration: appeal is NOT an adequate remedy (CRITICAL)
[ ] If requesting stay: show lower court stay was sought OR explain futility

REQUIRED ATTACHMENTS:
[ ] Memorandum of Law (supporting arguments per ORAP 7.10)
[ ] Excerpt of Record (if record exists, per ORAP 5.50(5))
[ ] Copy of challenged order/decision

SERVICE:
[ ] Proof of service on ALL adverse parties
[ ] Proof of service on ALL other lower court participants
[ ] If state entity involved: proof of service on Attorney General
[ ] Service compliant with ORCP 9 B

FORMAT:
[ ] ORAP 5.05(3) formatting compliance (same as briefs)
[ ] Filed as unified single PDF if eFiled
[ ] Confidential materials comply with ORAP 8.52
""",

    "reply-brief": """
REPLY BRIEF CHECKLIST -- ORAP 5.60
=========================================================================

CONTENT:
[ ] Limited to matters raised in the answering brief
[ ] Does NOT raise new issues
[ ] Responds to answering brief arguments

FORMAT:
[ ] Same formatting as opening brief (ORAP 5.05)
[ ] Word count: 3,300 max (COA) / 4,000 max (SC)
[ ] Page limit alternative: 10 pages (COA) / 15 pages (SC)
[ ] Certificate of Word Count compliance
[ ] Certificate of Service
[ ] Signature

NOTE: Reply brief is OPTIONAL -- not required.
""",
}

FORMAT_RULES = """
OREGON APPELLATE PROCEDURE -- FORMAT RULES SUMMARY (ORAP 5.05)
=========================================================================

FONT:
  Permitted: Times New Roman, Arial, Century Schoolbook
  Minimum:   14 point (body text AND footnotes)
  Color:     Black only (hyperlinks excepted)
  Prohibited: Condensed/reduced typeface; substantially uppercase

MARGINS:
  Inside (binding side): 1.25 inches
  Outside:               1.0 inch
  Top:                   0.75 inches
  Bottom:                0.75 inches
  Max printable area:    6.25" wide x 9.5" tall

SPACING:
  Body text:    Double-spaced
  Block quotes: Double-space above AND below
  Footnotes:    May be single-spaced (still 14pt minimum)

PAGE NUMBERS:
  Location: Top of page, within 3/8" from top edge
  Style:    Consecutive Arabic numerals
  Excerpt:  ER-1, ER-2, ER-3 (separate pagination)
  Appendix: App-1, App-2, App-3 (separate pagination)

WORD COUNT LIMITS:
  Court of Appeals:
    Opening/Answering brief:  10,000 words  (alt: 35 pages)
    Reply brief:               3,300 words  (alt: 10 pages)
    Supplemental brief:        5 pages max
    Appendix:                 25 pages max

  Supreme Court:
    Opening/Answering brief:  14,000 words  (alt: 50 pages)
    Reply brief:               4,000 words  (alt: 15 pages)
    Supplemental brief:        5 pages max
    Appendix:                 25 pages max

  EXCLUDED from word count:
    Headings, cover page, table of contents, table of authorities,
    excerpt of record, appendix, certificates, signatures

COVER PAGE (9 required elements):
  1. Case title (full, all parties)
  2. Trial court party designations
  3. Appeal party designations
  4. BOTH case numbers (trial + appellate)
  5. Identification of filing party
  6. Originating court name and county
  7. Name of trial judge
  8. Contact info (ORAP 1.30)
  9. Filing month and year

BINDING (paper filing):
  Preferred: Binder clips
  Acceptable: Staples
  File ONE original with Appellate Court Administrator
  Serve ONE copy on ALL parties

eFILING (ORAP Chapter 16):
  Mandatory for OSB members; optional for pro se
  Format: PDF, text-searchable, single unified file
  Max file size: 25 MB (split if larger)
  Deadline: 11:59 PM on due dates
  Help desk: 503-986-5582

LAST PAGE must include:
  Author's name and signature
  Law firm name (if applicable)
  Identification of parties represented
"""


# ============================================================================
# MAIN VALIDATION
# ============================================================================

def validate_filing(filepath, filing_type, court="coa"):
    """Run full validation on a filing."""
    text = read_filing(filepath)
    filename = Path(filepath).name

    print(f"\n{'=' * 72}")
    print(f"  ORAP VALIDATION REPORT")
    print(f"  File: {filename}")
    print(f"  Type: {filing_type}")
    print(f"  Court: {'Court of Appeals' if court == 'coa' else 'Supreme Court'}")
    print(f"{'=' * 72}\n")

    all_pass = True
    warnings = []
    errors = []

    # 1. WORD COUNT
    word_count = count_words_orap(text)
    limit = WORD_LIMITS.get(court, {}).get(filing_type)
    print(f"WORD COUNT: {word_count:,}")
    if limit:
        pct = (word_count / limit) * 100
        status = "PASS" if word_count <= limit else "OVER LIMIT"
        symbol = "[OK]" if word_count <= limit else "[!!]"
        print(f"  Limit: {limit:,} words ({court.upper()})")
        print(f"  Usage: {pct:.1f}%")
        print(f"  Status: {symbol} {status}")
        if word_count > limit:
            errors.append(f"Word count ({word_count:,}) exceeds {court.upper()} limit ({limit:,})")
            all_pass = False
        elif pct > 90:
            warnings.append(f"Word count is at {pct:.1f}% of limit -- tight on space")
    print()

    # 2. REQUIRED SECTIONS
    if filing_type in ("opening-brief", "answering-brief"):
        sections = OPENING_BRIEF_SECTIONS
    elif filing_type == "notice-of-appeal":
        sections = NOTICE_OF_APPEAL_SECTIONS
    elif filing_type == "mandamus":
        sections = MANDAMUS_SECTIONS
    else:
        sections = []

    if sections:
        print("REQUIRED SECTIONS:")
        results = check_sections(text, sections)
        for r in results:
            symbol = "[OK]" if r["found"] else ("[!!]" if r["required"] else "[--]")
            print(f"  {symbol} {r['section']}: {r['status']}")
            if r["required"] and not r["found"]:
                errors.append(f"Missing required section: {r['section']}")
                all_pass = False
        print()

    # 3. COVER PAGE ELEMENTS (for briefs)
    if filing_type in ("opening-brief", "answering-brief"):
        print("COVER PAGE ELEMENTS:")
        cover_results = check_cover_page(text)
        for r in cover_results:
            symbol = "[OK]" if r["found"] else "[!!]"
            print(f"  {symbol} {r['element']}: {r['status']}")
            if not r["found"]:
                warnings.append(f"Cover page may be missing: {r['element']}")
        print()

    # 4. RECORD REFERENCES IN STATEMENT OF FACTS (for briefs)
    if filing_type in ("opening-brief", "answering-brief"):
        has_refs = check_record_references(text)
        print("RECORD REFERENCES IN STATEMENT OF FACTS:")
        if has_refs is None:
            print("  [!!] Could not locate Statement of Facts section")
            errors.append("Statement of Facts section not found")
            all_pass = False
        elif has_refs:
            print("  [OK] Record/transcript references found")
        else:
            print("  [!!] No record or transcript references found")
            errors.append("Statement of Facts lacks record/transcript references (ORAP 5.40 requires them)")
            all_pass = False
        print()

    # 5. ASSIGNMENT OF ERROR STRUCTURE (for briefs)
    if filing_type in ("opening-brief", "answering-brief"):
        print("ASSIGNMENT OF ERROR STRUCTURE (ORAP 5.45):")
        aoe_issues = check_assignment_structure(text)
        if aoe_issues:
            for issue in aoe_issues:
                print(f"  [!!] {issue}")
                errors.append(issue)
                all_pass = False
        else:
            print("  [OK] Assignments of error appear properly structured")
        print()

    # 6. CERTIFICATE OF SERVICE
    print("CERTIFICATE OF SERVICE:")
    svc_issues = check_service_completeness(text)
    if svc_issues:
        for issue in svc_issues:
            print(f"  [!!] {issue}")
            if "not found" in issue.lower():
                errors.append(issue)
                all_pass = False
            else:
                warnings.append(issue)
    else:
        print("  [OK] Certificate of service appears complete")
    print()

    # 7. ADDITIONAL CHECKS
    print("ADDITIONAL CHECKS:")

    # Check for pro se identification
    if re.search(r"(?i)pro se", text):
        print("  [OK] Pro se status identified")
    else:
        warnings.append("No 'pro se' designation found -- if self-represented, this should be stated")
        print("  [--] No pro se designation found (add if self-represented)")

    # Check for ORAP citations
    if re.search(r"ORAP", text):
        print("  [OK] ORAP rule citations present")
    else:
        warnings.append("No ORAP citations found")
        print("  [--] No ORAP citations found")

    # Check for ORS citations
    ors_count = len(re.findall(r"ORS \d+\.\d+", text))
    print(f"  [OK] {ors_count} ORS citations found" if ors_count else "  [--] No ORS citations found")

    # Check for case citations
    case_count = len(re.findall(r"\d+ Or(?:egon)? (?:App )?\d+", text))
    case_count += len(re.findall(r"\d+ U\.S\. \d+", text))
    print(f"  [OK] {case_count} case citations found" if case_count else "  [--] No case citations found")

    print()

    # SUMMARY
    print(f"{'=' * 72}")
    print(f"  VALIDATION SUMMARY")
    print(f"{'=' * 72}")
    print(f"  Errors:   {len(errors)}")
    print(f"  Warnings: {len(warnings)}")
    print(f"  Status:   {'ALL CHECKS PASSED' if all_pass and not warnings else 'ISSUES FOUND'}")
    print()

    if errors:
        print("  ERRORS (must fix):")
        for i, e in enumerate(errors, 1):
            print(f"    {i}. {e}")
        print()

    if warnings:
        print("  WARNINGS (should review):")
        for i, w in enumerate(warnings, 1):
            print(f"    {i}. {w}")
        print()

    return all_pass


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Oregon Appellate Filing Format Validator (ORAP compliance)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python validate.py brief.md --type opening-brief
  python validate.py notice.md --type notice-of-appeal
  python validate.py petition.md --type mandamus
  python validate.py brief.md --word-count
  python validate.py --checklist opening-brief
  python validate.py --rules
        """,
    )
    parser.add_argument("file", nargs="?", help="Filing to validate (Markdown file)")
    parser.add_argument("--type", choices=[
        "opening-brief", "answering-brief", "reply-brief",
        "notice-of-appeal", "mandamus", "motion",
    ], help="Type of filing")
    parser.add_argument("--court", choices=["coa", "sc"], default="coa",
                        help="Court: coa=Court of Appeals, sc=Supreme Court (default: coa)")
    parser.add_argument("--word-count", action="store_true",
                        help="Only count words (ORAP-compliant)")
    parser.add_argument("--checklist", choices=[
        "opening-brief", "answering-brief", "reply-brief",
        "notice-of-appeal", "mandamus",
    ], help="Print checklist for a filing type")
    parser.add_argument("--rules", action="store_true",
                        help="Print ORAP format rules summary")

    args = parser.parse_args()

    # Print checklist
    if args.checklist:
        checklist = CHECKLISTS.get(args.checklist)
        if checklist:
            print(checklist)
        else:
            print(f"No checklist available for: {args.checklist}")
        return

    # Print rules
    if args.rules:
        print(FORMAT_RULES)
        return

    # Need a file for validation or word count
    if not args.file:
        parser.print_help()
        sys.exit(1)

    # Word count only
    if args.word_count:
        text = read_filing(args.file)
        count = count_words_orap(text)
        print(f"ORAP-compliant word count: {count:,}")
        limit_coa = WORD_LIMITS["coa"].get(args.type, 10000) if args.type else 10000
        limit_sc = WORD_LIMITS["sc"].get(args.type, 14000) if args.type else 14000
        print(f"  Court of Appeals limit: {limit_coa:,} ({count / limit_coa * 100:.1f}%)")
        print(f"  Supreme Court limit:    {limit_sc:,} ({count / limit_sc * 100:.1f}%)")
        return

    # Full validation
    if not args.type:
        # Try to auto-detect
        text = read_filing(args.file)
        if re.search(r"(?i)NOTICE OF APPEAL", text[:500]):
            args.type = "notice-of-appeal"
        elif re.search(r"(?i)MANDAMUS|WRIT", text[:500]):
            args.type = "mandamus"
        elif re.search(r"(?i)OPENING BRIEF|APPELLANT.S.*BRIEF", text[:500]):
            args.type = "opening-brief"
        elif re.search(r"(?i)REPLY BRIEF", text[:500]):
            args.type = "reply-brief"
        elif re.search(r"(?i)ANSWERING BRIEF|RESPONDENT.S.*BRIEF", text[:500]):
            args.type = "answering-brief"
        else:
            print("Could not auto-detect filing type. Use --type to specify.")
            sys.exit(1)
        print(f"Auto-detected filing type: {args.type}")

    validate_filing(args.file, args.type, args.court)


if __name__ == "__main__":
    main()
