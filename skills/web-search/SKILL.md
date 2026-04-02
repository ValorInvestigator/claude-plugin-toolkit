---
name: web-search
description: |
  Dual-engine web search using BOTH Firecrawl AND Brave Search simultaneously.

  ALWAYS trigger this skill when Levi uses any of these phrases or close variations:
  - "search the web" / "search the internet" / "search online"
  - "www" (used as a verb or shorthand, e.g. "www this", "look it up on the www")
  - "internet" (as in "check the internet", "find on the internet", "look this up on the internet")
  - "go online", "look this up online", "check online"
  - "search for X" when context implies web search (not local files or database)
  - "find X online", "look up X", "research X on the web"

  This is Levi's preferred web research protocol. Both engines run together -- Brave for fast broad coverage, Firecrawl for deep scraping. Never use just one without the other when this skill triggers.
---

# Dual-Engine Web Search: Firecrawl + Brave

When Levi says "search the web", "www", "internet", or any synonym for web search, run BOTH engines. They complement each other: Brave is fast and broad, Firecrawl goes deeper and pulls clean full-text content.

## The Protocol

### Step 1: Run Both Engines in Parallel

Launch Firecrawl search AND Brave Search at the same time -- don't do one then wait for the other.

**Firecrawl (CLI):**
```bash
firecrawl search "QUERY" --limit 10 -o .firecrawl/search-QUERY.json --json
```

**Brave Search (MCP tool):** Use the `brave_web_search` MCP tool with the same or a slightly reformulated query.

Run both simultaneously. If Levi's request involves multiple facets (e.g., "search for X and Y"), run all queries in parallel.

### Step 2: Combine and Present Results

After both engines return:

1. **Deduplicate** -- if the same URL appears in both, mention it once but note it was confirmed by both sources
2. **Organize by source type** if relevant (news vs. general web vs. documentation)
3. **Lead with the most relevant results** regardless of which engine found them
4. **Note conflicts** -- if Firecrawl and Brave return contradictory information, flag it explicitly

Present results clearly. Don't dump raw JSON -- synthesize and summarize with source URLs.

### Step 3: Deep Dive on Demand

If a result looks especially relevant, scrape it with Firecrawl for full content:
```bash
firecrawl scrape "URL" --only-main-content -o .firecrawl/site-page.md
```

Do this proactively for the top 1-2 results if Levi is clearly doing research (not just a quick lookup).

## Firecrawl Quick Reference

```bash
# Basic search
firecrawl search "query" --limit 10 -o .firecrawl/search-query.json --json

# News-focused search
firecrawl search "query" --sources news --limit 10 -o .firecrawl/search-query-news.json --json

# Recent results only (past week)
firecrawl search "query" --tbs qdr:w --limit 10 -o .firecrawl/search-query-recent.json --json

# Scrape a specific URL
firecrawl scrape "https://example.com" --only-main-content -o .firecrawl/page.md
```

Always quote URLs and queries. Always use `-o` to write to file (avoids flooding context). Keep output in `.firecrawl/` folder.

## Brave Search Quick Reference

Use the `brave_web_search` MCP tool. Pass the query directly. Brave is good for:
- Fast general web results
- News and current events
- Checking if something is publicly known/indexed

## When One Engine Fails

If Firecrawl is not installed or errored: run Brave only, note that Firecrawl was unavailable.
If Brave MCP is unavailable: run Firecrawl only, note that Brave was unavailable.
Never silently fall back -- always tell Levi which engines ran.

## Output Format

After running both engines, present:

```
FIRECRAWL RESULTS (X results):
1. [Title] - URL
   Summary...

2. [Title] - URL
   Summary...

BRAVE RESULTS (Y results, Z new):
1. [Title] - URL
   Summary...

COMBINED: [overall synthesis / answer to the question]
```

Adapt the format to what's actually useful -- for a simple lookup, a short paragraph is fine. For research, use the structured format above.
