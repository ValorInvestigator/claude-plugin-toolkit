# File Locations -- Deep Research Engine

## Git Repo (canonical, always commit + push at end of session)

| File | Purpose |
|------|---------|
| `deep-research/CLAUDE.md` | Session checklist, sync rules, repo guide |
| `deep-research/reports/NETWORK_INTEL_REPORT.md` | MASTER DOCUMENT -- single source of truth |
| `deep-research/reports/BAUM_FAMILY_INTEL_REPORT.md` | Baum dynasty report |
| `deep-research/reports/KEFFER-DOSSIER.md` | Angela Keffer (OJD) dossier |
| `deep-research/findings/ROADBLOCKS.md` | Roadblock tracker |
| `deep-research/findings/active_work.md` | Wave-by-wave log |
| `deep-research/findings/*.md` | Per-topic analysis files |
| `deep-research/findings/*.xml` | Raw IRS 990 XML source files |
| `deep-research/findings/eocco-minutes/` | Bulk CAC + Board minutes |

## Working Copy (keep in sync with repo)

| File | Location |
|------|----------|
| `NETWORK_INTEL_REPORT.md` | `D:\Bingaman New --3-4-26\` |

## Memory Files (cross-session state)

| File | Location |
|------|----------|
| `active_work.md` | `D:\Bingaman Master Files Old\Home Base Claude\memory\` |
| `OPEN_LOOPS.md` | `D:\Bingaman Master Files Old\Home Base Claude\memory\` |
| `MEMORY.md` | `D:\Bingaman Master Files Old\Home Base Claude\memory\` |

## Brain / Index Hierarchy

1. `HOME_BASE.md` -- master navigation map for entire PC
2. `brain\BRAIN_LEAN.json` -- 45KB quick-load index
3. `brain\ACTION_ITEMS_AND_REMINDERS.md` -- read on "check the brain"
4. `brain\case_index.json` -- 714 docs across 24 categories
5. `brain\file_inventory.json` -- 33,132 files cataloged

## Primary Case File Locations

- Active DB: `D:\Bingaman Master Files\`
- Archive/Index: `D:\Bingaman Master Files Old\`
- Home Base: `D:\Bingaman Master Files Old\Home Base Claude\`
- McSherry: `D:\The Stories\McSherry Database\After Jeans Death\`

## Knowledge Databases (single sources of truth)

- `METADATA_FORENSIC_DATABASE.md` -- all PDF forensics (131 files, 21 sections)
- `MEDICATION_EVIDENCE_DATABASE.md` -- all drug findings
- `WITNESS_EVIDENCE_DATABASE.md` -- all witness/insider findings (13+ witnesses)
- `CORPORATE_INFILTRATION_MEDIA_REPORT.md` -- 900+ line journalist-ready report
- `MCSHERRY_CASE_DATABASE.md` -- McSherry full case database
- All in: `D:\Bingaman Master Files Old\Home Base Claude\`

## API Tokens

| Service | Token | Notes |
|---------|-------|-------|
| CourtListener | `48b2b5fd5858fe301286d216f6d1f4146507910c` | Free account, direct API at courtlistener.com/api/rest/v4/ |

## Tracked Repositories

| Repo | Local Path | Branch | Remote | Content |
|------|-----------|--------|--------|---------|
| deep-research | `D:\Bingaman Master Files Old\Home Base Claude\deep-research` | `claude/setup-apify-client-2OEPU` | `https://github.com/ValorInvestigator/deep-research.git` | OSINT reports, findings, wave logs |
| dhs-public-records-filing | `D:\Bingaman Master Files Old\Home Base Claude\dhs-public-records-filing` | `master` | `https://github.com/ValorInvestigator/dhs-public-records-filing.git` | DHS lawsuit research, ROSE analysis, court prep, legal research |

## Git Workflow

- Use `bash ~/.claude/skills/deep-research/scripts/git-push-all.sh [wave] "[summary]"` to commit and push ALL repos with changes
- Commit format: `Wave XX: <summary>` (deep-research), `<summary> (via deep-research wave XX)` (other repos)
- Always `git pull` before pushing (multiple machines -- handled by script)
