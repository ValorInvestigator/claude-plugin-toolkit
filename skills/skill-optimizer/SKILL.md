---
name: skill-optimizer
description: "Audit and rewrite OpenClaw skills for maximum efficiency. Validates YAML, tightens descriptions, enforces progressive disclosure, eliminates token waste, and restructures skill bodies into deterministic runbooks."
version: 1.0.0
user_invocable: true
---

# Skill Optimizer -- OpenClaw Skill Auditor and Rewriter

## What This Does

Reads any OpenClaw skill, scores it against 12 quality checks, then rewrites it to be as efficient and effective as possible. Produces a before/after diff and explains every change.

## Workflow

1. **Identify target skill.** Read the SKILL.md and any reference files from the skill directory.
2. **Run the 12-point audit.** Score each dimension pass/warn/fail (see `references/AUDIT_CHECKLIST.md`).
3. **Generate the rewrite.** Fix every warn/fail finding. Preserve all functional content.
4. **Show the diff.** Present a before/after summary so the user can see what changed and why.
5. **Write the files.** Replace the SKILL.md (and restructure reference files if needed).
6. **Verify.** Re-read the written file and confirm YAML parses cleanly.

## Rules

- Never delete functional content. Every instruction, API token, file path, and workflow step must survive the rewrite.
- When moving content to reference files, leave a clear pointer in SKILL.md (e.g., "Read `references/X.md` for details").
- The rewrite must parse without YAML errors. Validate by re-reading the file after writing.
- Explain WHY each change improves the skill, not just what changed.
- Do not invent new functionality. Only restructure and optimize what exists.
- Always back up the original SKILL.md to SKILL.md.bak before overwriting.

## Output Format

After the audit, present results as:

```
## Skill Audit: [skill-name]

| # | Check | Score | Finding |
|---|-------|-------|---------|
| 1 | YAML validity | PASS/WARN/FAIL | ... |
| ... | ... | ... | ... |

## Changes Made
1. [Change description] -- [WHY this improves the skill]
2. ...

## Token Impact
- Before: ~[N] tokens in SKILL.md
- After: ~[N] tokens in SKILL.md
- Savings: ~[N] tokens per turn ([X]% reduction)
```
