# Installation Guide

## Prerequisites

- Claude Code CLI installed
- GitHub CLI (`gh`) authenticated

## Step 1: Add Marketplaces

Inside Claude Code, run each of these:

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add ananddtyagi/cc-marketplace
/plugin marketplace add davepoon/buildwithclaude
/plugin marketplace add ComposioHQ/awesome-claude-plugins
```

## Step 2: Install Priority Plugins

### Tier 1 - Essential (install these first)

```
/plugin install code-review@claude-plugins-official
/plugin install security-guidance@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin install context7@claude-plugins-official
/plugin install commit-commands@claude-plugins-official
/plugin install claude-md-management@claude-plugins-official
/plugin install feature-dev@claude-plugins-official
/plugin install typescript-lsp@claude-plugins-official
/plugin install playwright@claude-plugins-official
```

### Tier 2 - Legal & Investigation

```
/plugin install legal-advisor@cc-marketplace
/plugin install legal-compliance-checker@cc-marketplace
/plugin install compliance-automation-specialist@cc-marketplace
/plugin install trend-researcher@cc-marketplace
```

### Tier 3 - Document Processing

```
/plugin install vision-specialist@cc-marketplace
```

From buildwithclaude (bundles that include pdf, docx, xlsx, pptx skills):
```
/plugin install all-skills@buildwithclaude
```

### Tier 4 - Code Quality & Security

```
/plugin install pr-review-toolkit@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
/plugin install audit@cc-marketplace
/plugin install double-check@cc-marketplace
/plugin install audit-project@ComposioHQ/awesome-claude-plugins
```

### Tier 5 - Web Dev & Git

```
/plugin install web-dev@cc-marketplace
/plugin install senior-frontend@ComposioHQ/awesome-claude-plugins
/plugin install nextjs-expert@buildwithclaude
/plugin install fix-github-issue@cc-marketplace
/plugin install ship@ComposioHQ/awesome-claude-plugins
```

### Tier 6 - Automation & Workflow

```
/plugin install hookify@claude-plugins-official
/plugin install claude-code-setup@claude-plugins-official
/plugin install ultrathink@cc-marketplace
/plugin install lyra@cc-marketplace
/plugin install ralph-loop@claude-plugins-official
```

## Step 3: Verify

```
/plugin list
```

## Browsing for More

```
/plugin                              # Browse all installed marketplaces
/plugin search @cc-marketplace       # Search a specific marketplace
/plugin search @buildwithclaude      # Search buildwithclaude
```
