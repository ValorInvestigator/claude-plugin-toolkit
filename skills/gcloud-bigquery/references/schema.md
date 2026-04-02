# BigQuery Schema Reference -- valorinvestigates.valor_investigations

Live schema pulled from BigQuery API on Feb 27, 2026.

## Table of Contents
1. [documents](#documents) -- 10,599 rows
2. [document_chunks](#document_chunks) -- 89,449 rows
3. [entities](#entities) -- 0 rows (ready for population)
4. [evidence_facts](#evidence_facts) -- 0 rows (ready for population)
5. [metadata_forensics](#metadata_forensics) -- 0 rows (ready for population)
6. [witness_statements](#witness_statements) -- 0 rows (ready for population)
7. [global_knowledge_graph](#global_knowledge_graph) -- 0 rows (ready for population)
8. [task_queue](#task_queue) -- 0 rows (ready for population)

---

## documents

One row per uploaded document. Contains full extracted text plus metadata.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| doc_id | STRING | REQUIRED | Unique document identifier (hash-based) |
| filename | STRING | NULLABLE | Original filename |
| filepath | STRING | NULLABLE | Full original path on disk |
| rel_path | STRING | NULLABLE | Relative path from investigation root |
| folder | STRING | NULLABLE | Top-level folder category |
| category | STRING | NULLABLE | Evidence category from case_index |
| subcategory | STRING | NULLABLE | Evidence subcategory |
| full_text | STRING | NULLABLE | Complete extracted text |
| page_count | INTEGER | NULLABLE | Number of pages |
| file_size_bytes | INTEGER | NULLABLE | Original file size |
| char_count | INTEGER | NULLABLE | Character count of extracted text |
| extraction_method | STRING | NULLABLE | local_docx, local_pymupdf, document_ai, local_binary |
| extraction_date | TIMESTAMP | NULLABLE | When text was extracted |
| original_created | TIMESTAMP | NULLABLE | File creation timestamp |
| original_modified | TIMESTAMP | NULLABLE | File modification timestamp |
| file_extension | STRING | NULLABLE | .pdf, .docx, .doc, .txt |
| source_index | STRING | NULLABLE | Which index originally tracked this file |
| tags | STRING | REPEATED | Tags/labels array |
| people_mentioned | STRING | REPEATED | People found in document |
| orgs_mentioned | STRING | REPEATED | Organizations found in document |
| drugs_mentioned | STRING | REPEATED | Drugs/medications found in document |
| anomaly_flags | STRING | REPEATED | Metadata anomaly flags |

**Typical queries:**
```sql
-- Full-text search
SELECT doc_id, filename, filepath
FROM valorinvestigates.valor_investigations.documents
WHERE LOWER(full_text) LIKE LOWER('%search term%')

-- Find by filename
WHERE filename LIKE '%keyword%'

-- Find by category
WHERE category = 'Legal'

-- Find by person mentioned
WHERE 'Glenn Null' IN UNNEST(people_mentioned)

-- Find by drug mentioned
WHERE 'lorazepam' IN UNNEST(drugs_mentioned)
```

---

## document_chunks

Documents split into ~500-word chunks for granular search. Each chunk has a page number.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| chunk_id | STRING | REQUIRED | Unique chunk identifier |
| doc_id | STRING | REQUIRED | FK to documents.doc_id |
| chunk_index | INTEGER | NULLABLE | Sequential chunk number within document (0-based) |
| chunk_text | STRING | NULLABLE | ~500-word text segment |
| page_number | INTEGER | NULLABLE | Approximate page number |
| char_offset | INTEGER | NULLABLE | Character offset in full document |
| word_count | INTEGER | NULLABLE | Word count of this chunk |

**Typical queries:**
```sql
-- Search chunks (more granular than full documents)
SELECT dc.chunk_id, dc.chunk_text, dc.page_number, d.filename
FROM valorinvestigates.valor_investigations.document_chunks dc
JOIN valorinvestigates.valor_investigations.documents d ON dc.doc_id = d.doc_id
WHERE LOWER(dc.chunk_text) LIKE LOWER('%search term%')
ORDER BY d.filename, dc.chunk_index

-- Get all chunks for a specific document
SELECT chunk_index, page_number, chunk_text
FROM valorinvestigates.valor_investigations.document_chunks
WHERE doc_id = 'THE_DOC_ID'
ORDER BY chunk_index
```

---

## entities

Extracted named entities (people, organizations, places, drugs, etc.) from documents.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| entity_id | STRING | REQUIRED | Unique entity instance ID |
| doc_id | STRING | REQUIRED | FK to documents |
| chunk_id | STRING | NULLABLE | FK to document_chunks |
| entity_type | STRING | NULLABLE | person, organization, location, date, drug, legal_ref, facility |
| entity_value | STRING | NULLABLE | The actual name/value |
| normalized_value | STRING | NULLABLE | Standardized form (e.g., Tempie Bartell -> BARTELL_TEMPIE) |
| context_snippet | STRING | NULLABLE | Surrounding text for context |
| confidence | FLOAT | NULLABLE | Extraction confidence 0-1 |

---

## evidence_facts

Verified facts extracted from documents, with categorization and source attribution.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| fact_id | STRING | REQUIRED | Unique fact identifier |
| doc_id | STRING | REQUIRED | FK to documents |
| chunk_id | STRING | NULLABLE | FK to document_chunks |
| fact_text | STRING | NULLABLE | The specific finding/fact |
| category | STRING | NULLABLE | medication, legal, financial, abuse, fraud, obstruction |
| subcategory | STRING | NULLABLE | More specific categorization |
| bates_number | STRING | NULLABLE | Bates stamp if available |
| date_referenced | DATE | NULLABLE | Date the fact refers to |
| people_involved | STRING | REPEATED | Names involved in this fact |
| orgs_involved | STRING | REPEATED | Organizations involved |
| confidence | STRING | NULLABLE | high, medium, low |
| source_page | INTEGER | NULLABLE | Page number in source document |

---

## metadata_forensics

PDF metadata forensic analysis results for court filings and other documents.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| doc_id | STRING | REQUIRED | FK to documents |
| pdf_author | STRING | NULLABLE | PDF Author field |
| pdf_creator | STRING | NULLABLE | PDF Creator application |
| pdf_producer | STRING | NULLABLE | PDF Producer application |
| xmp_toolkit | STRING | NULLABLE | XMP Core toolkit version (e.g., c018, c142) |
| creation_date | TIMESTAMP | NULLABLE | PDF creation timestamp |
| modification_date | TIMESTAMP | NULLABLE | PDF modification timestamp |
| timezone_create | STRING | NULLABLE | Timezone of creation |
| timezone_modify | STRING | NULLABLE | Timezone of modification |
| page_count | INTEGER | NULLABLE | PDF page count |
| file_size_bytes | INTEGER | NULLABLE | File size |
| pdf_version | STRING | NULLABLE | PDF version (1.4, 1.6, 2.0, etc.) |
| deleted_object_count | INTEGER | NULLABLE | Number of deleted PDF objects |
| revision_count | INTEGER | NULLABLE | Number of incremental saves |
| has_incremental_updates | BOOLEAN | NULLABLE | Whether file has incremental saves |
| anomaly_flags | STRING | REPEATED | Anomaly codes array |
| anomaly_severity | STRING | NULLABLE | CRITICAL, WARNING, INFO |
| machine_id | STRING | NULLABLE | Machine identifier (c018, c142, etc.) |
| font_names | STRING | REPEATED | Fonts found in document |
| image_count | INTEGER | NULLABLE | Number of embedded images |
| notes | STRING | NULLABLE | Forensic analysis notes |

---

## witness_statements

Witness and insider accounts with tiered classification and corroboration tracking.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| witness_id | STRING | REQUIRED | Unique witness record ID |
| doc_id | STRING | REQUIRED | FK to documents |
| witness_name | STRING | NULLABLE | Witness name |
| statement_date | DATE | NULLABLE | Date of statement |
| tier | INTEGER | NULLABLE | 1=ready, 2=need protection, 3=corroborating, 4=institutional |
| role | STRING | NULLABLE | Witness role/relationship |
| summary | STRING | NULLABLE | Statement summary |
| key_claims | STRING | REPEATED | Key claims array |
| people_referenced | STRING | REPEATED | People mentioned |
| corroborates | STRING | REPEATED | Other witness IDs this corroborates |
| source_file | STRING | NULLABLE | Original source file path |
| retaliation_risk | STRING | NULLABLE | Assessment of retaliation risk |

---

## global_knowledge_graph

Relationships between entities (people, orgs, drugs, locations) -- the investigation's connection map.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| fact_id | STRING | REQUIRED | Unique fact identifier |
| entity_a | STRING | REQUIRED | Subject entity (person, org, drug, location, etc.) |
| relationship | STRING | REQUIRED | The proven connection (prescribed, drafted, employed_by, shares_address_with, etc.) |
| entity_b | STRING | REQUIRED | Object entity |
| source_doc | STRING | NULLABLE | Source document or Bates number |
| source_desk | STRING | NULLABLE | Which desk proved this (ops, tech, research) |
| confidence | STRING | NULLABLE | proven, strong, circumstantial, suspected |
| date_relevant | DATE | NULLABLE | Date the fact refers to |
| notes | STRING | NULLABLE | Additional context |
| created_at | TIMESTAMP | NULLABLE | When this fact was recorded |
| tags | STRING | REPEATED | Tags for categorization |

---

## task_queue

Pending investigation tasks and follow-ups, organized by desk.

| Column | Type | Mode | Description |
|--------|------|------|-------------|
| task_id | STRING | REQUIRED | Unique task identifier |
| target_desk | STRING | REQUIRED | ops, tech, or research |
| from_desk | STRING | NULLABLE | Which desk created this task |
| description | STRING | REQUIRED | What needs to be done |
| priority | STRING | NULLABLE | high, medium, low |
| status | STRING | REQUIRED | todo, in_progress, done, blocked |
| created_at | TIMESTAMP | NULLABLE | When task was created |
| completed_at | TIMESTAMP | NULLABLE | When task was completed |
| result_summary | STRING | NULLABLE | Brief result when done |
| related_docs | STRING | REPEATED | Related document IDs |

---

## Fully Qualified Table Names

Use these in SQL (backticks optional when no special characters):

```
valorinvestigates.valor_investigations.documents
valorinvestigates.valor_investigations.document_chunks
valorinvestigates.valor_investigations.entities
valorinvestigates.valor_investigations.evidence_facts
valorinvestigates.valor_investigations.metadata_forensics
valorinvestigates.valor_investigations.witness_statements
valorinvestigates.valor_investigations.global_knowledge_graph
valorinvestigates.valor_investigations.task_queue
```

## REPEATED Field Query Patterns

Several tables use REPEATED (array) fields. Query them with UNNEST:

```sql
-- Find documents mentioning a specific person
SELECT doc_id, filename
FROM valorinvestigates.valor_investigations.documents
WHERE 'Glenn Null' IN UNNEST(people_mentioned)

-- Find documents mentioning a specific drug
SELECT doc_id, filename
FROM valorinvestigates.valor_investigations.documents
WHERE 'lorazepam' IN UNNEST(drugs_mentioned)

-- Cross-query: find all tags on a document
SELECT doc_id, tag
FROM valorinvestigates.valor_investigations.documents, UNNEST(tags) AS tag
WHERE doc_id = 'xxx'
```
