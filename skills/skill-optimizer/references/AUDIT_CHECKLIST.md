# Skill Optimizer -- 12-Point Audit Checklist

## How to Score

Read the target SKILL.md and all reference files. Score each check as:
- **PASS** -- meets the standard, no changes needed
- **WARN** -- functional but suboptimal, should improve
- **FAIL** -- actively hurting performance, must fix

---

## The 12 Checks

### 1. YAML Frontmatter Validity
- Does the frontmatter parse without errors?
- Are all values with colons properly quoted? (The colon-space bug silently kills skills.)
- Is `name` present and lowercase/URL-safe?
- Is `description` present?
- Test: mentally parse every line. Any `key: value` inside a string value that isn't quoted = FAIL.

### 2. Description Quality (Trigger Accuracy)
- Is the description short and specific (1-3 sentences)?
- Does it use the exact nouns users actually type?
- Does it avoid overlap with other skills' descriptions?
- Does it describe the task, not the tool? ("Summarize weekly logs" not "A skill for reports")
- Descriptions are injected into the prompt every turn. Every extra word costs tokens on EVERY message.

### 3. Body Length (Target: 30-80 lines)
- SKILL.md body under 80 lines? Content over 80 lines should use progressive disclosure (reference files).
- Is it under 30 lines? That might be too sparse for complex skills.
- Count only the body (after frontmatter closing `---`).

### 4. Progressive Disclosure Structure
- Is large reference material (API docs, actor lists, file paths) in separate reference files?
- Does SKILL.md contain a clear pointer to each reference file?
- Is there duplication between SKILL.md and reference files? (Each fact lives in exactly one place.)
- Reference files should be loaded only when the agent needs them, not every turn.

### 5. Deterministic Workflow (Runbook Quality)
- Does the body read like a numbered checklist an engineer could follow at 3am?
- Are steps ordered and unambiguous?
- Are stop conditions defined? (When to halt, when to escalate, when to ask the user.)
- Vague prose like "consider the options" = WARN. Specific steps like "1. Read X. 2. Write Y." = PASS.

### 6. Behavioral Constraints (Rules Section)
- Is there a `## Rules` section with explicit constraints?
- Do rules explain WHY they exist, not just WHAT to do? (The model generalizes better from explanations.)
- Are there anti-pattern examples? Remove them. The model sometimes fixates on anti-patterns and starts doing them. Only show desired behavior.

### 7. Urgency Marker Hygiene
- Are ALL-CAPS markers (CRITICAL, MUST, NEVER, ALWAYS) used sparingly?
- Overuse causes overtriggering in newer models. Reserve caps for genuinely critical rules (1-3 per skill max).
- Replace most caps with explanations: instead of "NEVER do X", write "Doing X causes [bad outcome] because [reason]."

### 8. Token Efficiency
- Are there redundant explanations? (Same concept explained twice in different sections.)
- Are there long examples that could be shortened?
- Are there verbose instructions that could be condensed without losing meaning?
- Is the description contributing unnecessary tokens to every turn?
- Estimate: ~4 characters = 1 token. A 300-line SKILL.md is ~2,000+ tokens loaded every session.

### 9. Version and Metadata
- Is `version` in the frontmatter? (Required for ClawHub, good practice regardless.)
- Is `user_invocable` set appropriately?
- Are runtime requirements declared in `metadata.openclaw.requires` if the skill depends on specific tools/env vars?

### 10. Error Recovery
- Does the skill define what to do when things go wrong?
- Are fallback strategies documented?
- Is there a "if X fails, try Y" pattern for critical operations?

### 11. Style Consistency
- Is formatting consistent? (Same heading levels, same list styles throughout.)
- Are code blocks used for commands/examples?
- Is the tone consistent? (Imperative for workflows, explanatory for rules.)

### 12. Cold Start Recovery
- If loaded from scratch with no session history, can the agent pick up where it left off?
- Are all file paths, API endpoints, and credentials either in the skill or clearly referenced?
- Is there a "start here" sequence for first-time execution?

---

## Rewrite Priority

Fix in this order (highest impact first):
1. YAML validity (broken YAML = skill doesn't load at all)
2. Description quality (bad description = skill never triggers)
3. Body length + progressive disclosure (too long = token waste every turn)
4. Urgency marker hygiene (overtriggering = wrong behavior)
5. Deterministic workflow (vague = inconsistent results)
6. Everything else

## Token Estimation Guide

To estimate token count:
- Count characters in the file, divide by 4 (rough approximation)
- Or count words and multiply by 1.3
- SKILL.md content is loaded when the skill activates
- Description text is loaded EVERY turn for ALL skills
- Reference files are loaded only on demand
