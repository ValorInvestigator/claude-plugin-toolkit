# Wave Protocol v4.0 -- Full Reference

## Phase 1: SEARCH BARRAGE (8-10 parallel searches)

Launch in a SINGLE message with MULTIPLE tool calls:

**Batch 1 (5+ parallel):**
- 1x `apify/google-search-scraper` with 3-4 query strings (see SCHEMAS.md)
- 1x `apify-slash-rag-web-browser` for a specific deep-dive URL
- 1x Category-specific actor (LinkedIn, court records, news, etc.)
- 1x Firecrawl for sites that block standard crawlers
- 1x Additional actor from ACTOR_INVENTORY.md

**Batch 2 (3-5 parallel, based on Batch 1 findings):**
- LinkedIn scrapes for new names discovered
- Court records for any legal entities found
- Website crawls for new organizations
- Email/contact finders for key targets

**Search target selection:**
- Never repeat a search that returned nothing in a prior wave
- Prioritize searches that confirm/deny a specific hypothesis
- Mix broad org searches with specific person searches
- Include at least one search aimed at a NEW connection

---

## Phase 2: DEEP DIVE (follow up on 2-3 best findings)

See INVESTIGATION_PLAYBOOKS.md for person/org/document recipes.

---

## Phase 2.5: GAP ANALYSIS (every 5th wave)

Run a systematic gap check before integrating:

1. **Entity completeness** -- For each person in the report, check:
   - [ ] Full name + DOB/age if discoverable
   - [ ] Current employer + title
   - [ ] At least 1 board/org affiliation confirmed
   - [ ] LinkedIn or professional profile located
   - [ ] Connection to at least 1 other entity in the network
   - [ ] Confidence grade assigned (A/B/C/D)

2. **Relationship gaps** -- For each entity pair that SHOULD be connected:
   - [ ] Is the connection documented with a source?
   - [ ] Is it direct or indirect?
   - [ ] Are there missing intermediaries?

3. **Open questions** -- Generate 3-5 specific, answerable questions the report can't answer yet. These become next wave's targets.

4. **Stale leads** -- Flag any leads older than 30 days with no progress.

---

## Phase 3: INTEGRATE (update reports)

1. Sync NETWORK_INTEL_REPORT.md (check both locations, use newer)
2. Read the relevant section, write findings in report style
3. Add sources, update lead count in Section 17
4. Update version in header, update footer
5. Copy to both locations (repo + working dir)

**Style rules:** No em dashes (use --). No semi-colons. Contractions OK. Hedge unconfirmed claims. Cite sources. Every sentence should contain a verifiable fact.

---

## Phase 4: MEMORY UPDATE

1. Update `active_work.md` (wave log entry)
2. Update `OPEN_LOOPS.md` (status, new findings)
3. Update `ROADBLOCKS.md` if applicable

---

## Phase 5: GIT COMMIT AND PUSH

```
bash ~/.claude/skills/deep-research/scripts/git-push-all.sh [wave_number] "[summary]"
```

This pushes to ALL tracked repos with changes, not just deep-research:
- **deep-research** (branch: claude/setup-apify-client-2OEPU) -- OSINT reports, findings, wave logs
- **dhs-public-records-filing** (branch: master) -- DHS lawsuit research, ROSE analysis, court prep

The script auto-detects which repos have changes and only commits/pushes those.

NEVER skip Phase 5.

---

## WAVE EXECUTION CHECKLIST

```
[ ] Phase 1: 8-10 parallel searches using MULTIPLE tool types
[ ] Phase 1: At least 1 Google SERP + 1 specialized actor + 1 RAG browser
[ ] Phase 2: Deep dives on 2-3 best findings
[ ] Phase 2: New names cross-referenced against existing reports
[ ] Phase 2.5: Gap analysis run (every 5th wave)
[ ] Phase 3: Report updated (content, sources, leads, version)
[ ] Phase 4: Memory files updated
[ ] Phase 4: Report copied to both locations
[ ] Phase 5: git add, commit, pull, push
```
