# Search Engine Hierarchy

Use in this order. Higher = preferred.

| Priority | Tool | When to Use | When NOT to Use |
|----------|------|-------------|-----------------|
| 1 | **CourtListener API** | Legal research, case law, statutes | Non-legal topics |
| 2 | **OSINT MCP tools** | Username/email/domain enumeration | Broad topic research |
| 3 | **Apify actors** | Structured data, OSINT, web scraping | Quick one-off lookups |
| 4 | **Firecrawl** | Anti-bot bypass, deep scraping | Simple public pages |
| 5 | **RAG browser** | Quick Google + scrape combos | Primary research (use SERP) |
| 6 | **WebSearch** | Broad discovery | Anything above can handle |
| 7 | **WebFetch** | Known URLs only | Discovery (no search) |
| 8 | **Python urllib** | Direct file downloads (XML, PDF) | HTML pages |

## Key Rule

ALWAYS `fetch-actor-details` BEFORE `call-actor` -- unless the actor is in SCHEMAS.md (pre-built schemas skip this step).

The RAG browser (`apify-slash-rag-web-browser`) is convenience only. Never use it as the primary search tool. The PreToolUse hook will block it if you haven't used call-actor first.
