---
name: deep-research
description: |
  Autonomous deep OSINT research engine for the Bingaman/McSherry guardianship case.
  Builds intelligence reports through iterative "waves" of web searches, Apify scraping,
  cross-referencing, and lead generation. Each wave produces new findings that generate
  leads for the next wave. Uses 132+ Apify actors across 9 categories, 7 OSINT MCP tools
  (Sherlock, Maigret, Holehe, TheHarvester, SpiderFoot, GHunt, Blackbird), CourtListener
  API, Firecrawl, and the full osint-skill social media arsenal (55+ actors for Instagram,
  Facebook, TikTok, YouTube, Google Maps).

  ALWAYS trigger this skill when Levi says ANY of these (including typos):
  - "deep research" / "deep reserach" / "deep reseach"
  - "continue deep research" / "start deep research" / "resume research"
  - "keep researching" / "run more waves" / "next wave"
  - "continue OSINT" / "continue scorched earth OSINT" / "continue operation scorched earth"
  - "scrape" / "investigate" / "dig into"
  - "search for" / "search the web" / "look on the web" / "look online"
  - "find out about" / "find info on" / "find information"
  - "look into" / "look up" / "lookup"
  - "research" / "reserach" / "reasearch" / "reseach"
  - "what can you find on" / "what do we know about"
  - "who is" (followed by a person name in the investigation)
  - "check on" / "pull up" / "look at" (when referring to a person, org, or entity)
  - "web search" / "online search" / "google"
  - "osint" / "intel" / "intelligence"
  - "apify" / "scrape" / "crawl"
  - "court records" / "courtlistener" / "court listener"
  - "deep research scrape" / "full arsenal" / "hit it with everything"
  - "username search" / "email search" / "sherlock" / "maigret" / "holehe"

  This skill is designed for COLD START recovery. Even with a brand new PC, a fresh
  Claude Code install, no saved sessions -- if the data files exist, this skill tells
  Claude exactly how to pick up where it left off.
user_invocable: true
---

# Deep Research -- Autonomous OSINT Intelligence Engine v6.0

## RULE ZERO: NEVER STOP

When Levi starts deep research, he is LEAVING. Run wave after wave autonomously until:
1. Hard technical wall (API down, budget exhausted, rate limited)
2. Context window about to overflow
3. Levi explicitly says stop

**KEEP GOING UNTIL YOU CAN'T.**

---

## CRITICAL: BANNED TOOL -- apify/rag-web-browser

**NEVER use the `apify-slash-rag-web-browser` tool (also called `mcp__Apify__apify-slash-rag-web-browser`).**

This tool has been REMOVED from the MCP server configuration. It is a weak, general-purpose Google search + scrape that:
- Returns bloated HTML instead of clean structured data
- Cannot handle JS-rendered sites
- Cannot do bulk extraction
- Wastes tokens with irrelevant content
- Is the WRONG tool for OSINT research

**If you find yourself about to call `apify-slash-rag-web-browser`, STOP and do this instead:**

1. **For web search**: Use `call-actor` with `apify/google-search-scraper` (SERP results, 10x more queries)
2. **For page content**: Use `call-actor` with `apify/website-content-crawler` (clean markdown)
3. **For JS sites**: Use `call-actor` with `apify/playwright-scraper` (headless browser)
4. **For PDFs**: Use `call-actor` with `jirimoravcik/pdf-text-extractor` (free)
5. **For news**: Use `call-actor` with `easyapi/google-news-scraper` (structured news)
6. **For court records**: Use `call-actor` with `automation-lab/court-records-scraper`
7. **For quick URL fetch**: Use the `WebFetch` built-in tool (no Apify needed)

All schemas are in `references/SCHEMAS.md` -- no `fetch-actor-details` needed for these 10 actors.

---

## ADAPTIVE RECONNAISSANCE (mandatory before scraping)

Before scraping ANY new target type, you MUST follow this 3-step pipeline:

**Step 1 -- DISCOVER**: Run `search-actors` with keywords related to the target
```
Example: search-actors with keywords "Oregon court records" or "nonprofit 990"
```

**Step 2 -- VALIDATE**: Run `fetch-actor-details` on the best match to get input schema
```
Example: fetch-actor-details for "automation-lab/court-records-scraper"
```

**Step 3 -- EXECUTE**: Run `call-actor` with the validated schema
```
Example: call-actor with the exact input format from Step 2
```

Skip Steps 1-2 ONLY for actors already in the QUICK ACTOR REFERENCE table below (schemas pre-built).

---

## TOOL DIVERSITY ENFORCEMENT

A **PreToolUse hook** in settings.json HARD BLOCKS the RAG browser. Additionally:

1. Run `bash ~/.claude/skills/deep-research/scripts/search-barrage.sh "query" general` to generate diverse payloads
2. Read `references/SCHEMAS.md` for pre-built actor input schemas (no fetch-actor-details needed)
3. Use call-actor with Google SERP FIRST, then specialized actors for deep dives

---

## SCRIPTS (run via Bash tool)

| Script | Usage | Purpose |
|--------|-------|---------|
| `scripts/diagnose.sh` | Run FIRST every session | Check all tool availability |
| `scripts/search-barrage.sh "query" type` | type: person/org/legal/general | Generate diverse tool call payloads |
| `scripts/validate-wave.sh` | Run before git commit | Pre-commit quality check |
| `scripts/courtlistener.py --query "terms" --court or` | Legal research | CourtListener API wrapper |

---

## QUICK ACTOR REFERENCE

| Category | Go-To Actor | Free? |
|----------|------------|-------|
| Google SERP | `apify/google-search-scraper` | No |
| Web Crawling | `apify/website-content-crawler` | Yes |
| News | `easyapi/google-news-scraper` | No |
| Email/Contact | `caprolok/website-email-phone-finder` | No |
| Court Records | `automation-lab/court-records-scraper` | No |
| PDF Extraction | `jirimoravcik/pdf-text-extractor` | Yes |
| Headless Browser | `apify/playwright-scraper` | Yes |

Full catalog: `references/ACTOR_INVENTORY.md` | Pre-built schemas: `references/SCHEMAS.md`

---

## OSINT MCP TOOLS (Docker)

| Tool | Input | What It Does |
|------|-------|-------------|
| `sherlock_username_search` | username | 399+ social media sites |
| `maigret_username_search` | username | 3000+ sites |
| `holehe_email_search` | email | 120+ platform check |
| `theharvester_domain_search` | domain | Emails, subdomains |

Full reference: `references/OSINT_MCP_TOOLS.md`

---

## CONFIDENCE GRADING

- **A**: 2+ independent sources or official documents
- **B**: 1 credible source (LinkedIn, court record, news)
- **C**: Indirect evidence (metadata, connections, inference)
- **D**: Single unverified mention

---

## COLD START RECOVERY

Read in order:
1. `references/FILE_LOCATIONS.md` -- paths, tokens, git workflow
2. `memory/MEMORY.md` -- master index
3. `memory/active_work.md` -- wave log
4. `memory/OPEN_LOOPS.md` -- open leads
5. `reports/NETWORK_INTEL_REPORT.md` -- first 10 lines (version, wave count)

---

## WAVE PROTOCOL (summary)

Phase 1: Search barrage (8-10 parallel, multiple tool types)
Phase 2: Deep dive (2-3 best findings, specialized actors)
Phase 2.5: Gap analysis (every 5th wave)
Phase 3: Integrate (update report, sources, leads)
Phase 4: Memory update (active_work, OPEN_LOOPS)
Phase 5: Git commit and push

Full protocol: `references/WAVE_PROTOCOL.md`

---

## INVESTIGATION CONTEXT

Eastern Oregon healthcare governance network. Same people control hospital boards, Medicaid CCO ($600M+), behavioral health org, and employ attorneys on both sides of guardianship disputes.

Key entities: EOCCO, GOBHI, Moda/ODS, Good Shepherd/GRH Foundation, Baum Family, OJD/Keffer

Full playbooks: `references/INVESTIGATION_PLAYBOOKS.md`

---

## COURTLISTENER

Token: `48b2b5fd5858fe301286d216f6d1f4146507910c`
Base URL: `https://www.courtlistener.com/api/rest/v4/`
Quick search: `python3 scripts/courtlistener.py --query "terms" --court or`

---

## REFERENCE FILE INDEX

| File | Contents |
|------|----------|
| `references/WAVE_PROTOCOL.md` | Full 5-phase protocol + gap analysis |
| `references/SCHEMAS.md` | 10 pre-built actor input schemas |
| `references/INVESTIGATION_PLAYBOOKS.md` | Person/org/document investigation recipes |
| `references/OSINT_MCP_TOOLS.md` | 7 Docker OSINT tools |
| `references/SOCIAL_MEDIA_ACTORS.md` | 55+ social media actors |
| `references/SEARCH_HIERARCHY.md` | 8-tier search engine priority |
| `references/ACTOR_INVENTORY.md` | 132-actor catalog |
| `references/FILE_LOCATIONS.md` | Paths, tokens, git workflow |

---

## CURRENT STATUS (v6.0, March 21, 2026)

- Report: 950+ leads, 155 waves, NETWORK_INTEL_REPORT.md v98.0
- New: PreToolUse hook enforces tool diversity, embedded scripts, subagent definition
- Apify budget: $20/month. BE AGGRESSIVE.

## VERSION HISTORY

- v1.0 (Mar 8): Initial skill, 60 waves
- v2.0 (Mar 14): Added full Apify arsenal
- v3.0 (Mar 16): Added skip trace, Firecrawl
- v4.0 (Mar 17): Complete rebuild, 132 actors, progressive disclosure
- v5.0 (Mar 21): Added 7 OSINT MCP tools (Docker), 55+ social media actors, confidence grading
- v5.1 (Mar 21): Added Phase 2.5 Gap Analysis
- v5.2 (Mar 21): Added pre-built schemas, hard enforcement rule, minimum wave composition
- v6.0 (Mar 21): Full architectural rebuild. PreToolUse hook enforcement, embedded bash scripts (diagnose, search-barrage, validate-wave, courtlistener), specialized deep-researcher subagent, progressive disclosure (491 -> 180 lines). Governance layer: hooks enforce, skills instruct, agents execute.
