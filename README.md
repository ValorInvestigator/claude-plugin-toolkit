# Claude Plugin Toolkit

Curated Claude Code plugins for legal, investigative, document processing, code quality, web development, and research workflows.

Assembled from the official Anthropic marketplace, cc-marketplace, buildwithclaude, ComposioHQ, paddo-tools, and repomix.

## Quick Setup

```bash
# Run the setup script to add all marketplaces and install curated plugins
./setup.sh

# Or manually add marketplaces first:
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add ananddtyagi/cc-marketplace
/plugin marketplace add davepoon/buildwithclaude
/plugin marketplace add ComposioHQ/awesome-claude-plugins
```

---

## Curated Plugin List

### Legal / Compliance / Regulatory

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| legal-advisor | cc-marketplace | `legal-advisor@cc-marketplace` | Legal advisory, compliance docs, RFP responses, enterprise contract support, regulatory analysis |
| legal-compliance-checker | cc-marketplace | `legal-compliance-checker@cc-marketplace` | Reviews TOS, privacy policies, GDPR compliance, regulatory navigation |
| compliance-automation-specialist | cc-marketplace | `compliance-automation-specialist@cc-marketplace` | SOC 2, ISO 27001, GDPR, HIPAA automation, audit prep, continuous monitoring |
| data-privacy-engineer | cc-marketplace | `data-privacy-engineer@cc-marketplace` | GDPR compliance, privacy-by-design, consent management, data minimization |
| legal-advisor (agent) | buildwithclaude | `agents-business-finance@buildwithclaude` | Privacy policies, TOS, disclaimers, GDPR, cookie policies, DPA drafting |
| docusign-automation | buildwithclaude | `all-skills@buildwithclaude` | DocuSign e-signature and contract automation |

### Investigation / Research / OSINT

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| academic-research-synthesizer | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Multi-source synthesis with citations, literature reviews, trend analysis |
| comprehensive-researcher | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Broad multi-source research |
| research-orchestrator | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Multi-source research orchestration |
| research-synthesizer | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Research synthesis and summarization |
| market-research-analyst | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Market and competitive research |
| lead-research-assistant | buildwithclaude | `all-skills@buildwithclaude` | Lead research |
| content-research-writer | buildwithclaude | `all-skills@buildwithclaude` | Content research and writing |
| url-link-extractor | buildwithclaude | `agents-specialized-domains@buildwithclaude` | URL and link extraction from content |
| trend-researcher | cc-marketplace | `trend-researcher@cc-marketplace` | Market opportunity, trending topics, emerging behaviors |
| competitive-ads-extractor | buildwithclaude | `all-skills@buildwithclaude` | Competitor ad extraction and analysis |
| data-analyst | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Data analysis and insights |

### Document Processing / PDF / OCR

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| pdf | buildwithclaude | `all-skills@buildwithclaude` | PDF document processing and analysis |
| docx | buildwithclaude | `all-skills@buildwithclaude` | Word document creation, editing, analysis |
| pptx | buildwithclaude | `all-skills@buildwithclaude` | PowerPoint handling |
| xlsx | buildwithclaude | `all-skills@buildwithclaude` | Excel spreadsheet processing |
| ocr-grammar-fixer | buildwithclaude | `agents-specialized-domains@buildwithclaude` | OCR text grammar correction |
| ocr-quality-assurance | buildwithclaude | `agents-specialized-domains@buildwithclaude` | OCR output QA |
| visual-analysis-ocr | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Visual analysis and OCR |
| text-comparison-validator | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Text comparison and validation |
| report-generator | buildwithclaude | `agents-specialized-domains@buildwithclaude` | Automated report generation |
| vision-specialist | cc-marketplace | `vision-specialist@cc-marketplace` | Vision models, OCR, barcode detection, GPT-4V, Claude Vision |
| invoice-organizer | buildwithclaude | `all-skills@buildwithclaude` | Invoice organization |

### Code Quality / Review / Security

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| code-review | official | `code-review@claude-plugins-official` | Multi-agent code review with confidence scoring (50K installs) |
| security-guidance | official | `security-guidance@claude-plugins-official` | Warns about injection, XSS, unsafe patterns on file edit (25.5K installs) |
| pr-review-toolkit | official | `pr-review-toolkit@claude-plugins-official` | 6 specialized PR review agents (comments, tests, errors, types, quality, simplification) |
| code-simplifier | official | `code-simplifier@claude-plugins-official` | Simplify and refine code for clarity and maintainability |
| audit | cc-marketplace | `audit@cc-marketplace` | Full security audit of codebase |
| enterprise-security-reviewer | cc-marketplace | `enterprise-security-reviewer@cc-marketplace` | SOC 2/GDPR/ISO 27001 compliance validation, multi-tenant security |
| audit-project | ComposioHQ | `audit-project@ComposioHQ/awesome-claude-plugins` | Multi-agent iterative code review until zero issues |
| double-check | cc-marketplace | `double-check@cc-marketplace` | Forces re-verification of "job done" claims |

### Web Development (Next.js / Tailwind / Vercel)

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| frontend-design | official | `frontend-design@claude-plugins-official` | Production-grade UI, bold aesthetics, avoids generic AI look (96.4K installs) |
| typescript-lsp | official | `typescript-lsp@claude-plugins-official` | TS/JS language server (go-to-def, find refs, error checking) |
| nextjs-expert | buildwithclaude | `nextjs-expert@buildwithclaude` | Next.js framework specialization |
| web-dev | cc-marketplace | `web-dev@cc-marketplace` | React, Next.js, NestJS, TypeScript, Tailwind expert |
| senior-frontend | ComposioHQ | `senior-frontend@ComposioHQ/awesome-claude-plugins` | React, Next.js, TS, Tailwind, bundle analysis, a11y |
| artifacts-builder | ComposioHQ | `artifacts-builder@ComposioHQ/awesome-claude-plugins` | Multi-component HTML with React + Tailwind + shadcn/ui |
| vercel-automation | buildwithclaude | `all-skills@buildwithclaude` | Vercel deployment automation |
| webflow-automation | buildwithclaude | `all-skills@buildwithclaude` | Webflow website automation |
| figma-automation | buildwithclaude | `all-skills@buildwithclaude` | Figma design automation |
| theme-factory | ComposioHQ | `theme-factory@ComposioHQ/awesome-claude-plugins` | 10 pre-set themes for slides, docs, reports, landing pages |

### Git Workflows

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| commit-commands | official | `commit-commands@claude-plugins-official` | `/commit`, `/push`, `/pr` workflow |
| fix-github-issue | cc-marketplace | `fix-github-issue@cc-marketplace` | Analyzes GitHub issues, implements fixes, runs tests, commits |
| create-pr | cc-marketplace | `create-pr@cc-marketplace` | Full PR workflow with formatting and submission |
| ship | ComposioHQ | `ship@ComposioHQ/awesome-claude-plugins` | Complete PR-to-production workflow with validation |
| fix-pr | cc-marketplace | `fix-pr@cc-marketplace` | Fetches and fixes unresolved PR comments |

### Search / Web Scraping / Documentation

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| context7 | official | `context7@claude-plugins-official` | Up-to-date library docs injected into context (71.8K installs) |
| playwright | official | `playwright@claude-plugins-official` | Browser automation, screenshots, form filling, E2E testing (28.1K installs) |
| repomix-mcp | repomix | `repomix-mcp@repomix` | AI-powered codebase analysis, security scanning, 70% token reduction |
| repomix-explorer | repomix | `repomix-explorer@repomix` | Natural language repo analysis and pattern discovery |
| analyze-codebase | cc-marketplace | `analyze-codebase@cc-marketplace` | Comprehensive codebase analysis and documentation |
| headless | paddo-tools | `headless@paddo-tools` | Browser automation for site comparison and E2E testing |

### Testing

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| test-writer-fixer | cc-marketplace | `test-writer-fixer@cc-marketplace` | Writes tests, runs them, analyzes failures, fixes them |
| api-tester | cc-marketplace | `api-tester@cc-marketplace` | API performance, load, and contract testing |
| webapp-testing | buildwithclaude | `all-skills@buildwithclaude` | Web application testing |

### Claude Code Configuration / Meta

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| claude-code-setup | official | `claude-code-setup@claude-plugins-official` | Analyzes codebase, recommends hooks/skills/MCP servers/subagents |
| claude-md-management | official | `claude-md-management@claude-plugins-official` | Audit and improve CLAUDE.md files, capture session learnings |
| hookify | official | `hookify@claude-plugins-official` | Create custom hooks from conversation patterns, no coding needed |
| feature-dev | official | `feature-dev@claude-plugins-official` | 7-phase feature development workflow with architecture design |
| plugin-dev | official | `plugin-dev@claude-plugins-official` | Full plugin development toolkit (hooks, MCP, commands, agents, skills) |
| skill-creator | official | `skill-creator@claude-plugins-official` | Create, improve, and benchmark skills |

### Automation / Multi-Agent / Workflow

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| ralph-loop | official | `ralph-loop@claude-plugins-official` | Autonomous multi-hour coding sessions with context resets (57K installs) |
| ultrathink | cc-marketplace | `ultrathink@cc-marketplace` | 4 specialist sub-agents: Architect, Research, Coder, Tester |
| lyra | cc-marketplace | `lyra@cc-marketplace` | Master-level AI prompt optimization |
| explore | cc-marketplace | `explore@cc-marketplace` | Read planning docs, explore related files (Explore > Plan > Execute) |
| plan | cc-marketplace | `plan@cc-marketplace` | Planning step after Explore for complex problems |

### Business / Product / Integrations

| Plugin | Source | Install | What It Does |
|--------|--------|---------|--------------|
| notion-automation | buildwithclaude | `all-skills@buildwithclaude` | Notion workspace automation |
| gmail-automation | buildwithclaude | `all-skills@buildwithclaude` | Gmail automation |
| google-drive-automation | buildwithclaude | `all-skills@buildwithclaude` | Google Drive automation |
| slack-automation | buildwithclaude | `all-skills@buildwithclaude` | Slack messaging automation |
| hubspot-automation | buildwithclaude | `all-skills@buildwithclaude` | HubSpot CRM and marketing |

---

## Marketplaces Index

| Marketplace | Repo | Plugins | Focus |
|-------------|------|---------|-------|
| claude-plugins-official | `anthropics/claude-plugins-official` | 42 | Official, vetted plugins + LSPs |
| cc-marketplace | `ananddtyagi/cc-marketplace` | 119 | Community plugins, commands |
| buildwithclaude | `davepoon/buildwithclaude` | 481 | Agents, commands, skills, hooks |
| awesome-claude-plugins | `Chat2AnyLLM/awesome-claude-plugins` | 834 | Aggregator of 43 marketplaces |
| ComposioHQ | `ComposioHQ/awesome-claude-plugins` | 24 | Quality community plugins |
| paddo-tools | `paddo/claude-tools` | 6 | Headless, Codex, DNS, Miro, Gemini, Mobile |
| repomix | `repomix` | 3 | Codebase analysis + packing |

## Gap Analysis

These categories have **no existing plugins** and represent opportunities for custom development:

- **OSINT / Skip Tracing / People Search** - No plugins for public records, reverse lookups, social media intelligence
- **Case Management** - No investigation case tracking or evidence management
- **Court Records / Legal Research** - No Westlaw/LexisNexis/PACER integration
- **Audio Transcription / Voice Analysis** - Limited to podcast-focused tools

---

## License

MIT
