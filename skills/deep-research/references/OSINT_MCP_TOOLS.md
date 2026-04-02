# OSINT MCP Tools (Docker Container)

Seven tools running in Docker (`osint-tools-mcp-server:latest`), available as MCP tools:

| MCP Tool | What It Does | Input | Speed |
|----------|-------------|-------|-------|
| `sherlock_username_search` | Search 399+ social media sites | `username` | Fast |
| `maigret_username_search` | Search 3000+ sites with false-positive detection | `username` | Medium |
| `blackbird_username_search` | Fast search across 581 sites | `username` | Fast |
| `holehe_email_search` | Check if email is on 120+ platforms | `email` | Fast |
| `ghunt_google_search` | Extract Google account info | `identifier` | Fast |
| `theharvester_domain_search` | Emails, subdomains, hosts from public sources | `domain` | Medium |
| `spiderfoot_scan` | Deep recon (auto-detects target type) | `target` | Slow (5-30 min) |

## When to Use

- Found a new person's name? Run `sherlock_username_search` + `maigret_username_search` in parallel
- Found an email? Run `holehe_email_search` to see what platforms they're on
- Found a domain? Run `theharvester_domain_search` for emails, subdomains, employees
- Need deep recon? `spiderfoot_scan` (slow -- launch it and move on)

## Usage Pattern (parallel launch)

Call all relevant MCP tools in a single message:
```
sherlock_username_search(username="johndoe")
maigret_username_search(username="johndoe")
holehe_email_search(email="john@example.com")
theharvester_domain_search(domain="example.com")
```

These are MCP tools, NOT Apify actors. Call them directly. No fetch-actor-details needed.
