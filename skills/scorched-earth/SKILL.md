---
name: scorched-earth
description: "Comprehensive investigative report generator for the Bingaman/McSherry guardianship abuse case. Use when Levi says 'scorched earth on [person]', 'scorched earth [name]', or 'go scorched earth'. Produces exhaustive, publication-ready investigative reports by searching ALL available evidence across BigQuery, local files, witness databases, medication databases, recordings, and every other source accumulated over 19 months of investigation."
user_invocable: true
---

# Scorched Earth -- Comprehensive Investigative Report Generator

## What This Is

A scorched earth report is the culmination of 19 months of investigative work compressed into a single, devastating, publication-ready document about one specific person or entity. It uses EVERY source of evidence -- not just one file, not just one database, but everything: BigQuery (89,449 document chunks), local files across multiple drives, witness databases, medication databases, pharmacy records, court transcripts, photographs, audio recordings, staff logs, and anything else that exists.

No single file created before this skill existed is treated as a finished product. Every prior report, database, analysis, and note is RAW SOURCE MATERIAL to be searched, cross-referenced, verified, and synthesized into something new.

## When to Use This Skill

Trigger on any of these:
- "scorched earth on [name]"
- "go scorched earth on [name]"
- "scorched earth [name]"
- "we're going scorched earth"
- "burn [name]"
- "full investigation on [name]"

## The Methodology

### Phase 1: CAST THE WIDEST NET (Parallel Agents)

Launch 4 parallel agents simultaneously. Each agent searches different source categories. Do NOT constrain searches to known files -- search EVERYTHING. There may be evidence Levi has not yet discovered.

**Agent 1: BigQuery Deep Dive**
Query the `valorinvestigates.valor_investigations` dataset using the service account key:
```
Key: C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json
Project: valorinvestigates
Dataset: valor_investigations
Tables: documents (10,599 rows), document_chunks (89,449 rows), entities, evidence_facts, metadata_forensics, witness_statements, global_knowledge_graph
```

Run queries like:
```sql
SELECT source_file, chunk_text FROM valor_investigations.document_chunks
WHERE LOWER(chunk_text) LIKE '%target_name%' LIMIT 200

SELECT DISTINCT source_file FROM valor_investigations.document_chunks
WHERE LOWER(chunk_text) LIKE '%target_name%'

SELECT * FROM valor_investigations.evidence_facts
WHERE LOWER(description) LIKE '%target_name%'

SELECT * FROM valor_investigations.witness_statements
WHERE LOWER(content) LIKE '%target_name%'
```

Search for: the person's name, their role, their title, any known aliases, organizations they belong to, medications they prescribed, dates they were involved.

**Agent 2: Local File Search (Primary Evidence)**
Search across ALL of these directories using Grep and Glob:
- `D:\Bingaman Master Files\` -- Active case files (primary)
- `D:\Bingaman Master Files Old\` -- Archive and index files
- `D:\Bingaman New --3-4-26\` -- New complaints and filings
- `D:\The Stories\McSherry Database\` -- McSherry case (cross-case patterns)

Search for the person's name in ALL file types: .txt, .md, .pdf, .docx, .json
Search in subdirectories including:
- `Bartell\` -- Bartell-specific evidence
- `Murder\` -- Criminal evidence and final reports
- `DHS\` -- DHS investigation records
- `Guardian Manipulation\` -- Guardianship abuse evidence
- `Medicare Fraud\` -- Fraud evidence
- `My Time\` -- Levi's filings, BAR reports, exhibits
- `cloud_staging\extracted\` -- Brain-extracted text files (fastest reads)
- `Filed by Glenn without consent or notice\` -- Null evidence
- `Bingaman Master Files\Sus Hospices\` -- Hospice records

**Agent 3: Knowledge Databases**
Read and search all knowledge databases in `D:\Bingaman Master Files Old\Home Base Claude\`:
- `METADATA_FORENSIC_DATABASE.md` -- 131 PDF forensics files, 21 sections
- `MEDICATION_EVIDENCE_DATABASE.md` -- All drug findings
- `WITNESS_EVIDENCE_DATABASE.md` -- 13+ witnesses
- `CORPORATE_INFILTRATION_MEDIA_REPORT.md` -- 900+ line journalist report
- `MCSHERRY_CASE_DATABASE.md` -- McSherry cross-case patterns
- `BINGAMAN_COMPLETE_TIMELINE.md` -- Full case timeline

Also search the brain:
- `brain\BRAIN_LEAN.json` -- 45KB quick-load index
- `brain\case_index.json` -- 714 docs across 24 categories
- `brain\extracted\` -- Pre-extracted text files from all evidence

**Agent 4: Communications -- Text Messages, Emails, Letters, and Recordings**

This is CRITICAL. Patty Bingaman's text messages, emails, and correspondence are primary evidence. So are attorney emails, DHS correspondence, and caregiver communications. These are often the most damning evidence because they capture real-time reactions, admissions, and contradictions.

**Text Messages:**
- `D:\Bingaman Master Files\My Time\New Legal\Elicia Khoza - Patty Text Use to determine Russells condition Sept 7 -2022.pdf` -- Caregiver texts to Patty (Russell smiling, joking, eating seconds)
- `.eml` files named "Text", "Texts", "Text from Shawn" in Patty's email folder contain forwarded text messages
- `D:\Bingaman Master Files\My Time\BAR Reports\Glenn Null\_Evidence\2Gmails between patty and Null -recent- combined two emails contain text msgs to guardians of patty asking for more visits.pdf`
- Search BigQuery for `text message`, `sms`, `copied from text` to find more
- Search all files for `text message`, `copied from text`, `cell number` -- text evidence is often embedded inside PDFs and .txt files

**Patty's Email Archive (122 .eml files):**
- `D:\Bingaman Master Files\My Time\New Folder For Reports\EMAILS\Pattys emails\` -- 122 .eml files covering the full case
- `D:\Bingaman Master Files\My Time\New Folder For Reports\EMAILS\Pattys emails\parsed_emails.json` -- Structured index of all emails (READ THIS FIRST for fast search)
- `D:\Bingaman Master Files\My Time\New Folder For Reports\EMAILS\Pattys emails\combined_emails.eml` -- All emails combined
- Key subjects include: visits with Russell, settlement proposals, guardianship documents, communication with Glenn Null, forward communications, behavioral logs, Russell's guns, RHB records, motions, Bartell letters
- These emails contain Patty's real-time reactions, instructions to Glenn Null, evidence of Null ignoring her directives, and Baum's settlement proposals

**Attorney Email Correspondence:**
- `D:\Bingaman Master Files\My Time\Null BAR Report\Emails\` -- 50+ Gmail PDF exports showing Null/Patty/Baum email threads (filenames contain context annotations like "GLENN DISAPPEARS FOR A WEEK", "DECEMBER FRAUD", "MY CLIENT HAS DIRECTED ME")
- `D:\Bingaman Master Files\My Time\Null BAR Report\Emails\New emails\` -- Additional Gmail exports
- `D:\Bingaman Master Files\My Time\New Legal\Null\Emails\` -- Null correspondence including `emails.json` index
- `D:\Bingaman Master Files\My Time\New Legal\Null\Emails\zipped emails\` -- .eml originals
- `D:\Bingaman Master Files\Murder\Chief Of Staff\Glenn Null\Glenn Null to Patty Bingaman Emails\` -- Curated Null-to-Patty emails with `Significance of the emails.txt`
- `D:\Bingaman Master Files\Murder\Chief Of Staff\Emily Cooper\Synthesized for Report\The email.txt` -- Cooper correspondence
- `D:\Bingaman Master Files\My Time\Agency_Correspondence\` -- `email combined.pdf`, `emails glenn null combined OCR.pdf`

**Bartell/Baum Email Correspondence:**
- `D:\Bingaman Master Files\Guardian Manipulation\Tempie Emails Baum Directly.txt` -- Bartell-to-Baum direct emails
- `D:\Bingaman Master Files\My Time\Legal_Filings\Exhibits\36 Emails Pages from Tempie Efforts Against Patty.pdf`
- `D:\Bingaman Master Files\My Time\Legal_Filings\Exhibits\033 Baum Email Pages from Tempie Efforts Against Patty-2.pdf`
- `D:\Bingaman Master Files\Murder\Chief Of Staff\Glenn Null\Exhibits\Baum emails about property.pdf`

**Patty's Letters and Formal Notices:**
- `D:\Bingaman Master Files\New BAR\Patty Letters\` -- Patty's BAR complaint against Null, formal notice to Bartell, letter to DHS, bar complaint
- `D:\Bingaman Master Files\My Time\Personal_Writings\Patty demand for Case File from Emily Cooper.docx`
- `D:\Bingaman Master Files\My Time\Witness_Affidavits\Patty statement of records resistance.docx`
- `D:\Bingaman Master Files\My Time\New Legal\Null\Emails\Patty email to Glenn very clear orders to start guardianship on October 31 -2023.pdf`

**Caregiver Communications:**
- Alicia Potts-Khoza: text messages, staff log signatures, faxes to Cami Bean
  - `D:\Bingaman Master Files\My Time\Legal_Filings\Alicia Khoza Staff Logs Signatures.docx`
  - `D:\Bingaman Master Files\My Time\New Folder For Reports\Provider Nurse Practitioner Cami Bean\Faxes from Alicia Khoza to Cami Bean russells primary care provider.docx`
  - `D:\Bingaman Master Files\Murder\Chief Of Staff\Alice Shaw\Information\Shaw Exhibit Finder\Results\Federal_Deliverables\Final_Reports\Alicia Khoza.txt`
- Elisha Callahand: interview transcript, recordings, family text logs
- Other caregivers: search for caregiver names in staff logs and text evidence

**Audio Recordings:**
- `D:\Bingaman Master Files\recordings\` (397 recordings)
- Patty's recordings: Search for `Patty recording`, `patty talking about`
- Elisha recordings: Search for `Elisha Callahand`
- Whisper transcriptions (if available)

**Photos with Metadata:**
- Search for `.jpg`, `.png`, EXIF references
- Any file modified in the last 6 months that references the target

**DHS Correspondence:**
- `D:\Bingaman Master Files\DHS\Filed\DHS demand for correction of false statements email chain.pdf`
- `D:\Bingaman Master Files\DHS\Published\Facebook Post Looking for Info NN - DHS Internal emails.txt`
- Search for DHS email threads, investigation correspondence

### Phase 2: READ AND VERIFY (Sequential)

After all 4 agents return, read every file they found. Do NOT summarize from agent output alone. Open the actual files. Read the actual text. Verify:
- Dates (cross-reference multiple sources)
- Names and titles (exact spelling, credentials)
- Quotes (verbatim from source documents, not paraphrased)
- Prescription records (specific drugs, doses, dates, prescribers)
- Timeline consistency (does A happen before B across all sources?)

Flag anything that contradicts. Flag anything new that Levi may not have seen.

### Phase 3: WRITE THE REPORT

The report follows this structure (adapted to fit the target):

```markdown
# SCORCHED EARTH: THE [NAME] INVESTIGATION

## [Subtitle specific to their crime]

**Prepared by:** Valor Investigations
**Investigator:** Levi M. Bakke
**Date:** [Today's date]
**Classification:** Investigative Report -- Criminal Referral Support

---

## EXECUTIVE SUMMARY
3-5 paragraphs. Written for someone who knows NOTHING about the case.
Name the person. Name what they did. Name the evidence that proves it.
End with the most damning single fact.

---

## PART I through PART N
Each part covers one aspect of the person's conduct.
Every claim has a source citation.
Every date is verified.
Every quote is verbatim.

---

## TIMELINE
Chronological table of every relevant event with source citations.

---

## EVIDENCE INVENTORY
Numbered list of every document supporting the report.

---

## CRIMINAL EXPOSURE
Specific Oregon and federal statutes violated.
- Oregon: ORS 162.065 (perjury), ORS 163.225 (false imprisonment),
  ORS 163.205 (criminal mistreatment), ORS 124.005 (elder abuse),
  ORS 165.013 (forgery), etc.
- Federal: 18 U.S.C. 1347 (healthcare fraud), 18 U.S.C. 1035 (false statements),
  42 U.S.C. 1320a-7b (anti-kickback), etc.

---

## FINDINGS
Numbered list of what the evidence establishes.
Each finding starts with "[Name] did [specific thing]."
Each finding cites the evidence.

---

## CONCLUSION
Written in Levi's voice. Not legal boilerplate.
This is the paragraph that makes people angry.

---

*Footer with Valor Investigations contact info*
```

### Phase 4: SAVE AND REPORT

Save the report to: `D:\Bingaman New --3-4-26\[NAME]_SCORCHED_EARTH_INVESTIGATION.md`

Report to Levi:
- How many source files were searched
- How many unique evidence items found
- Any NEW evidence discovered that Levi may not have seen
- Any contradictions or gaps found
- The report location

## Key Rules

1. **No single source file is the final word.** Every prior report, database entry, analysis, and note is raw material. Cross-reference everything.

2. **Search for what Levi HASN'T found yet.** BigQuery has 89,449 chunks. The brain has 33,132 files cataloged. There is always more.

3. **Verify everything.** If an agent says "Bartell prescribed Chlorpromazine on June 20," open the pharmacy record and confirm the date, the dose, and the prescriber field.

4. **No em dashes.** Levi's style. Use -- (double hyphen) instead.

5. **Soupir and Swales are NEVER named.** Whistleblower protection required first.

6. **Write in Levi's voice.** Direct. Factual. Controlled anger. No legal jargon unless citing statutes. Short sentences. Evidence first, then what it means.

7. **Every claim has a source.** No unsourced assertions. If you cannot find the source document, say so and flag it as unverified.

8. **BigQuery authentication:**
```python
import google.oauth2.service_account as sa
import google.auth.transport.requests as tr
import json, urllib.request

key_path = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
creds = sa.Credentials.from_service_account_file(key_path, scopes=['https://www.googleapis.com/auth/bigquery'])
creds.refresh(tr.Request())
token = creds.token

sql = "YOUR QUERY HERE"
body = json.dumps({'query': sql, 'useLegacySql': False, 'timeoutMs': 30000}).encode()
req = urllib.request.Request(
    'https://bigquery.googleapis.com/bigquery/v2/projects/valorinvestigates/queries',
    data=body,
    headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
)
resp = json.loads(urllib.request.urlopen(req).read())
```

## Source File Locations (Quick Reference)

| Category | Path |
|----------|------|
| Active case files | `D:\Bingaman Master Files\` |
| Archive/index | `D:\Bingaman Master Files Old\` |
| Home Base workspace | `D:\Bingaman Master Files Old\Home Base Claude\` |
| New filings (2026) | `D:\Bingaman New --3-4-26\` |
| McSherry case | `D:\The Stories\McSherry Database\` |
| Knowledge databases | `D:\Bingaman Master Files Old\Home Base Claude\` |
| Brain index | `D:\Bingaman Master Files Old\Home Base Claude\brain\` |
| Brain extracted text | `D:\Bingaman Master Files Old\Home Base Claude\brain\extracted\` |
| BAR complaints | `C:\Users\Big Levi\Bingaman Master Files\My Time\BAR Reports\` |
| Murder/Chief of Staff | `D:\Bingaman Master Files\Murder\Chief Of Staff\` |
| BigQuery key | `C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json` |
| **Patty's emails (122 .eml)** | `D:\Bingaman Master Files\My Time\New Folder For Reports\EMAILS\Pattys emails\` |
| **Patty's email index** | `D:\Bingaman Master Files\My Time\New Folder For Reports\EMAILS\Pattys emails\parsed_emails.json` |
| **Null BAR emails (50+)** | `D:\Bingaman Master Files\My Time\Null BAR Report\Emails\` |
| **Null-to-Patty emails** | `D:\Bingaman Master Files\Murder\Chief Of Staff\Glenn Null\Glenn Null to Patty Bingaman Emails\` |
| **Attorney emails (Null)** | `D:\Bingaman Master Files\My Time\New Legal\Null\Emails\` |
| **Bartell-Baum emails** | `D:\Bingaman Master Files\Guardian Manipulation\Tempie Emails Baum Directly.txt` |
| **Patty's letters** | `D:\Bingaman Master Files\New BAR\Patty Letters\` |
| **Agency correspondence** | `D:\Bingaman Master Files\My Time\Agency_Correspondence\` |
| **Text message evidence** | Search for `copied from text`, `cell number`, `text message` across all files |
| **Caregiver comms (Khoza)** | `D:\Bingaman Master Files\My Time\New Legal\Elicia Khoza*` |
| **Audio recordings (397)** | `D:\Bingaman Master Files\recordings\` |

## The Battle Plan Context

This skill is part of a larger scorched earth campaign. See:
- `D:\Bingaman New --3-4-26\SCORCHED_EARTH_BATTLE_PLAN.md` -- Full release strategy
- `D:\Bingaman Master Files Old\Home Base Claude\memory\OPEN_LOOPS.md` -- Current status

Release sequence: Bartell (DONE) > Shaw > Bean > Conklin > Baum > Null > Cooper > DHS > Bingaman Sons > Judges

Each report is independent. Each is built from scratch using this methodology. Each draws on EVERYTHING, not just one prior file.

## Example: How the Bartell Report Was Built (March 6, 2026)

1. Read 5 initial evidence files (Perjury, Medication Pipeline, Emails, Staff Logs, Misconduct Timeline)
2. Wrote initial 17-part draft
3. Launched 4 agents to verify and find more:
   - Agent 1: Found Shaw's Feb 21 visit note (escape attempt, coat and hat), Shaw's Feb 16 intake note ("SCHEDULED TO MOVE"), Bartell's January home assessment
   - Agent 2: Found 2021 POA (financial only, 29 powers, zero healthcare), guardianship not filed until Dec 20, 2023, Glenn Null's on-record confirmation
   - Agent 3: Found quarterback designation, command-and-control evidence, DHS regulatory capture
   - Agent 4: Found residency agreement ($5,500-$7,000/month), $2,000 visitation surcharge, "I don't provide direct patient care" testimony
4. Added Parts I-IV (Capture, Illegal Detention, Tenant Not Patient, The Architect)
5. Launched 4 more agents for June-October timeline:
   - BigQuery: 8 queries returning ABHR composition, drug interaction alerts, Elisha content, recording references
   - Nursing board complaint: 6,432-line file with full medication escalation
   - Elisha interview + ABHR: 25+ page transcript, ABHR composition (Lorazepam/Diphenhydramine/Haloperidol/Metoclopramide), two known allergens
   - Recordings + undiscovered: Coffee-ground vomitus episodes, head staples, morphine contradiction, state investigators, Wildflower sedation letter
6. Expanded report to 22 parts, 54 evidence items, 14 findings

Total: 8 parallel agent searches, 8 BigQuery queries, 20+ source files read, cross-referenced against 3 knowledge databases. The final report contains evidence from pharmacy records, staff logs, court transcripts, witness interviews, hospice notes, medical records, photographs, audio recordings, DHS correspondence, guardianship accounting, and regulatory filings.

That is the standard. Every scorched earth report meets it.
