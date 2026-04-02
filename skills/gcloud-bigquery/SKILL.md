---
name: gcloud-bigquery
description: >
  Google Cloud, BigQuery, GitHub, and Case Law operations for the Valor Investigations project.
  Use this skill whenever the user mentions "database", "big query", "bigquery",
  "cloud", "gcloud", "bq", "query the data", "search the database", "check the records",
  "look up in the database", "find everything about", "what do we have on",
  "search for", "look up", "search the evidence", "evidence search", "ask the agent",
  "github", "search github", "search the repos", "what's in the repo",
  "check the repo", "case law", "legal research", "what research do we have",
  "what case supports", "what citation", "what's the holding", "find the case",
  "burden of proof", "attorney fees", "ORS 192", "stonewalling", "denial vs delay",
  or anything involving querying, searching, or analyzing investigation data.
  Also trigger this skill when the user asks questions about people, drugs, documents,
  evidence, witnesses, case law, or legal research that could be answered by searching
  the database, GitHub repos, or case law database -- even if they don't say "database"
  or "github" or "case law" explicitly.
  For example: "what documents mention Glenn Null?" or "find all the hospice records"
  or "who restricted visitation?" or "what medications was Russell given?" or
  "what case law supports our position?" or "find the PETA research" or
  "what case says ODHS has to search email?" or "what's the citation for the
  stonewalling holding?" should all trigger this skill. Be aggressive about using
  this -- Levi's investigation data is in BigQuery (15,554 docs), GitHub (5+ repos),
  and a local case law analysis database (13 Oregon cases + handbook, fully analyzed
  with citations and quotable language). Never fall back to searching local files
  as a substitute.
---

# Google Cloud / BigQuery / GitHub Skill -- Valor Investigations

## THE ABSOLUTE RULE

When Levi says "database", "big query", "bigquery", "cloud", "gcloud", "bq", "github", "search the repos", "case law", "what case supports", or asks any question about the case evidence or legal research -- use this skill. Never fall back to searching local files as a substitute. The data is in BigQuery (15,554 docs), GitHub (5+ repos), and a local case law analysis database (13 Oregon cases + AG handbook).

---

## FOUR MODES OF QUERYING

This skill has four complementary tools. Pick the right one based on what Levi is asking:

### Mode 1: EVIDENCE SEARCH (natural language -- use this FIRST)

For questions about the case, people, events, documents, or evidence. This calls the Vertex AI search agent which has indexed 15,554 documents and returns an AI-generated summary with citations.

**When to use:** The user asks a question in plain English about the case. They want an answer, not raw data.

```bash
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\evidence_search.py" "your question here"
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\evidence_search.py" "question" 10          # more results
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\evidence_search.py" "question" 5 --json    # JSON output
```

**Examples of when to use evidence search:**
- "What evidence exists of document manipulation?"
- "Who restricted Patricia from visiting Russell?"
- "What medications was Russell given?"
- "What did Emily Cooper do as Russell's attorney?"
- "Find everything about the hospice certification"
- "What role did Tempie Bartell play?"

The evidence search returns:
1. An **AI Summary** synthesized across multiple documents with citation numbers
2. A list of **Source Documents** with file names, categories, and paths
3. A **total match count** showing how many documents are relevant

After running the search, present the AI summary to Levi. If he wants to dig deeper into a specific source document, you can use the SQL mode to pull the full text.

### Mode 2: SQL QUERY (structured data -- for specific lookups)

For exact counts, specific field lookups, data manipulation, or when Levi explicitly asks for SQL. This hits BigQuery directly with SQL.

**When to use:** The user wants a count, wants to filter by specific fields, needs to update data, or asks something structural about the database itself.

```bash
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\bq_query.py" "SELECT COUNT(*) FROM \`valorinvestigates.valor_investigations.bingaman_documents\`"
```

**Examples of when to use SQL:**
- "How many documents do we have?"
- "List all categories"
- "Show me the schema for bingaman_documents"
- "Update the category on document X"
- "What's the row count across all tables?"

### Mode 3: GITHUB SEARCH (research files, case law, legal memos)

For finding content in the ValorInvestigator GitHub repos -- legal research, case law analysis, memos, and synthesized documents that live in the repos rather than BigQuery.

**When to use:** The user asks about case law, legal research, memos, or previously written analysis. Also useful for finding what research already exists before doing new work.

```bash
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\github_search.py" "search terms"
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\github_search.py" "PETA OHSU" --repo dhs-public-records-filing
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\github_search.py" --list-repos
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\github_search.py" "search" --json
```

**Key repos searched:**
- `dhs-public-records-filing` -- DHS lawsuit filing package, case law, legal research
- `Bingaman-Case-Evidence` -- Complete evidence archive (court filings, forensics, medical, witness)
- `odhs-state-health-law` -- Oregon State Plan, Medicare, OAR citations
- `oregon-legal-research` -- Searchable case law + statutes database
- `the-Quarterback` -- Research repository

**Important:** GitHub search only indexes text files (.md, code). It does NOT search inside PDFs. For PDF content, use Evidence Search (Mode 1) instead.

### Mode 4: CASE LAW SEARCH (legal arguments -- for lawsuit support)

For finding specific case law holdings, citations, and legal arguments from the fully analyzed Oregon public records case law database. This searches 5 local analysis files covering 13 Oregon cases and the AG Public Records Handbook.

**When to use:** The user asks about case law, legal holdings, attorney fees arguments, burden of proof, stonewalling doctrine, delay vs. denial, or any legal argument that supports the DHS lawsuit. This is the most targeted tool for "what case says X?" questions.

```bash
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\case_law_search.py" "search terms"
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\case_law_search.py" "attorney fees" --context 5   # more context lines
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\case_law_search.py" --cases                        # list all cases with citations
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\case_law_search.py" --list                         # list analysis files
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\case_law_search.py" "burden" --json                # JSON output
```

**Analysis files searched:**
- `CASE_LAW_STRATEGIC_REVIEW.md` -- Master synthesis with 7 pillars, case tiers, strategic recommendations
- `case_law_analysis_batch1.md` -- Chaimov v. State (COA 2021, SC 2022, DAS 2022)
- `case_law_analysis_batch2.md` -- PETA v. OHSU, In Defense of Animals, Kessler, Merrick
- `case_law_analysis_batch3.md` -- Bialostosky, Sause v. Hummel, Upham v. Forster
- `case_law_analysis_batch4.md` -- Pamplin Media, Pride Disposal, LOC Handbook Ch. 14

**Key cases available (with citations):**
- **Merrick v. City of Portland** (313 Or App 469, 2021) -- stonewalling = denial, partial prevailing = fees
- **PETA v. OHSU** (2025 Oregon) -- delay vs. denial bright line, fees only for denial
- **Chaimov v. State** (369 Or 174, 2022) -- burden on agency, exemptions narrowly construed
- **Kessler v. City of Portland** (302 Or App 383, 2020) -- $57,900 fee award affirmed
- **Bialostosky v. Cummings** (321 Or App 563, 2022) -- exemptions must be specific per document

**Examples of when to use case law search:**
- "What case supports the argument that stonewalling equals denial?"
- "What's the citation for the attorney fees holding?"
- "What does the case law say about burden of proof?"
- "Find the PETA v OHSU delay vs denial analysis"
- "What case says ODHS has to search their email?"
- "What's the strongest case for mandatory fee shifting?"

The case law search returns matching lines with context from the analysis files, organized by source file. Use `--cases` to get a quick reference of all 13 cases with their citations.

**Important:** Case law search covers the analyzed markdown files, not the raw PDFs. For the original PDF text of the cases, use Evidence Search (Mode 1). For case law research in the GitHub repos (memos, filings), use GitHub Search (Mode 3).

---

## DECISION GUIDE: Which mode?

| User says... | Use... | Why |
|--------------|--------|-----|
| "What do we have on Emily Cooper?" | Evidence Search | Natural language question about a person |
| "How many documents mention Cooper?" | SQL | Needs an exact count |
| "What medications was Russell given?" | Evidence Search | Investigative question needing synthesis |
| "List all unique drugs_mentioned values" | SQL | Structural query about field values |
| "Search the database for hospice fraud" | Evidence Search | Investigative research question |
| "Show me the table schema" | SQL | Database admin question |
| "What evidence supports the visitation claim?" | Evidence Search | Complex question needing AI reasoning |
| "Count rows in all tables" | SQL | Administrative count |
| "What case law do we have on AG orders?" | GitHub Search | Legal research in repo markdown files |
| "What's in the DHS repo?" | GitHub Search | Repo contents/structure |
| "Find the PETA v OHSU research" | GitHub Search | Previously written research docs |
| "What legal memos exist?" | GitHub Search | Synthesized analysis documents |
| "Search GitHub for fee shifting" | GitHub Search | Explicit GitHub search request |
| "What case says stonewalling = denial?" | Case Law Search | Legal holding/doctrine question |
| "What's the citation for Merrick?" | Case Law Search | Specific case citation lookup |
| "What supports the attorney fees argument?" | Case Law Search | Legal argument support |
| "What's the burden of proof standard?" | Case Law Search | Legal doctrine question |
| "List all the cases we have" | Case Law Search (--cases) | Case inventory request |
| "What does PETA v OHSU say about delay?" | Case Law Search | Specific case analysis question |

**When in doubt, use Evidence Search first** for factual/investigative questions. **Use Case Law Search** for legal argument questions ("what case supports...", "what's the holding on...", "what citation do we need for..."). Use GitHub Search for previously written research memos. Fall back to SQL for precise counts.

---

## NEW SESSION STARTUP -- DO THIS FIRST

Every new Claude session that needs BigQuery should start by running the health-check script. This confirms auth is working and shows what's available:

```bash
python "C:\Users\Big Levi\.claude\skills\gcloud-bigquery\scripts\bq_startup.py"
```

This script:
1. Gets a fresh auth token from the service account JSON key (no login required)
2. Lists all tables with row counts
3. Prints the project/dataset/region info
4. Confirms everything is ready to query

If the startup script prints `AUTH_EXPIRED`, the key file is missing or corrupted. Tell Levi: "The service account key at C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json is missing or invalid." Do not retry. Do not fall back to local files. Stop.

---

## AUTHENTICATION

Auth uses a service account JSON key at `C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json`. The `google-auth` library reads the key and mints a fresh token automatically. No `gcloud auth login` is ever needed.

### Inline token pattern (for quick one-offs)

```python
import json, urllib.request, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SERVICE_ACCOUNT_KEY = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
BQ_API = 'https://bigquery.googleapis.com/bigquery/v2/projects/valorinvestigates/queries'

def get_token():
    import google.oauth2.service_account as sa
    import google.auth.transport.requests as tr
    creds = sa.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_KEY,
        scopes=['https://www.googleapis.com/auth/bigquery']
    )
    creds.refresh(tr.Request())
    return creds.token

def bq_query(sql, token, timeout_ms=60000):
    body = json.dumps({
        'query': sql,
        'useLegacySql': False,
        'timeoutMs': timeout_ms
    }).encode()
    req = urllib.request.Request(BQ_API, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

token = get_token()
```

If a query returns HTTP 401 or 403, call `get_token()` again and retry once.

---

## PROJECT DETAILS

- **Project:** valorinvestigates (number: 989102413038)
- **Dataset:** valor_investigations
- **Region:** us-west1
- **Account:** levi@valorinvestigates.com
- **Full table prefix:** `valorinvestigates.valor_investigations.`
- **Vertex AI Engine:** bingaman-search-v2 (15,554 documents indexed)
- **Vertex AI Data Store:** bingaman-evidence-v2

---

## SCHEMA QUICK REFERENCE

### Primary evidence table (used by Vertex AI search)

| Table | Rows | Purpose | Key Columns |
|-------|------|---------|-------------|
| `bingaman_documents` | 15,596 | All case files (one row per file) | document_id, file_name, file_path, source_folder, category, file_type, extracted_text, text_length |

### Chunked text table

| Table | Rows | Purpose | Key Columns |
|-------|------|---------|-------------|
| `document_chunks` | 89,449 | Chunked text for granular search (~500 words each) | chunk_id, doc_id, chunk_index, chunk_text, page_number, word_count |

### Pipeline tables (being populated)

| Table | Rows | Purpose |
|-------|------|---------|
| `entities` | 0 | People, orgs, drugs extracted |
| `evidence_facts` | 0 | Verified facts with Bates numbers |
| `metadata_forensics` | 0 | PDF metadata analysis |
| `witness_statements` | 0 | Witness/insider accounts |
| `global_knowledge_graph` | 0 | Entity relationships |
| `task_queue` | 0 | Pending investigation tasks |

### Legacy table (older import, fewer files)

| Table | Rows | Purpose |
|-------|------|---------|
| `documents` | 10,599 | Older import with different schema |

---

## COMMON SQL PATTERNS

### Full-text search across all documents
```sql
SELECT document_id, file_name, file_path, category
FROM `valorinvestigates.valor_investigations.bingaman_documents`
WHERE LOWER(extracted_text) LIKE LOWER('%search term%')
```

### Search document chunks (more granular, includes page numbers)
```sql
SELECT dc.chunk_id, dc.chunk_text, dc.page_number, d.file_name
FROM `valorinvestigates.valor_investigations.document_chunks` dc
JOIN `valorinvestigates.valor_investigations.bingaman_documents` d
  ON dc.doc_id = d.document_id
WHERE LOWER(dc.chunk_text) LIKE LOWER('%search term%')
ORDER BY d.file_name, dc.chunk_index
```

### Count documents by category
```sql
SELECT category, COUNT(*) as doc_count
FROM `valorinvestigates.valor_investigations.bingaman_documents`
GROUP BY category
ORDER BY doc_count DESC
```

### Get full text for a specific document
```sql
SELECT document_id, file_name, extracted_text
FROM `valorinvestigates.valor_investigations.bingaman_documents`
WHERE document_id = 'THE_DOC_ID'
```

### DML operations (UPDATE, DELETE, INSERT)

Use a longer timeout (120000ms):

```python
sql = """UPDATE `valorinvestigates.valor_investigations.bingaman_documents`
SET category = 'new_category'
WHERE document_id = 'some_id'"""
result = bq_query(sql, token, timeout_ms=120000)
```

---

## HANDLING LARGE RESULTS

BigQuery paginates results. If `totalRows` is larger than what you received, use the `pageToken`:

```python
result = bq_query(sql, token)
all_rows = result.get('rows', [])

while 'pageToken' in result:
    page_token = result['pageToken']
    job_id = result['jobReference']['jobId']
    page_url = f'https://bigquery.googleapis.com/bigquery/v2/projects/valorinvestigates/queries/{job_id}?pageToken={page_token}'
    req = urllib.request.Request(page_url, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    result = json.loads(urllib.request.urlopen(req).read())
    all_rows.extend(result.get('rows', []))
```

---

## ERROR HANDLING

| Error | Meaning | Action |
|-------|---------|--------|
| HTTP 401 | Token stale | Call `get_token()` again and retry once |
| HTTP 403 | Permission denied | Check project/dataset name, tell user |
| HTTP 404 | Table not found | Check table name against schema reference |
| HTTP 400 | Bad SQL | Fix the query syntax |
| AUTH_EXPIRED | Key file missing/bad | Tell user key is missing or corrupted |
| Timeout | Query too slow | Increase timeoutMs or simplify query |

---

## GITHUB REPOS QUICK REFERENCE

| Repo | Description | Key Content |
|------|-------------|-------------|
| `dhs-public-records-filing` | DHS lawsuit filing package | Complaint, exhibits 1-13, case law (13 Oregon cases), legal research memos |
| `Bingaman-Case-Evidence` | Complete evidence archive | Court filings, metadata forensics, medical records, witness declarations |
| `odhs-state-health-law` | Oregon State Plan research | SPPC/PC20, Medicare, OAR citations, eligibility rules |
| `oregon-legal-research` | Case law + statutes DB | Searchable Oregon guardianship/probate law |
| `the-Quarterback` | Research repository | General investigation research |

---

## CRITICAL REMINDERS

1. **Evidence search first for factual questions, Case Law search first for legal questions.** For investigative questions about case evidence, use Vertex AI (Mode 1). For legal argument questions ("what case supports..."), use Case Law Search (Mode 4). For precise counts or structural queries, use SQL (Mode 2). For research memos in GitHub repos, use GitHub Search (Mode 3).
2. **Always use Standard SQL** (`useLegacySql: false`).
3. **Always backtick-escape table names** in SQL: `` `valorinvestigates.valor_investigations.tablename` ``
4. **Windows encoding**: Always set `sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')` at the top of any Python script.
5. **Never search local files as a substitute** for a database, GitHub, or case law query.
6. **The primary evidence table is `bingaman_documents`** (15,596 rows), not the older `documents` table (10,599 rows).
7. **GitHub search only finds text files** (.md, code). For PDF content, use Evidence Search.
8. **GitHub rate limits**: If you get rate limited, wait 60 seconds and retry. Don't spam the API.
9. **Case law search covers analyzed markdown files**, not raw PDFs. It searches 13 Oregon cases fully analyzed with citations, holdings, and quotable language. Use `--cases` for a quick reference of all cases.
