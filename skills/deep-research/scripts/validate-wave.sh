#!/bin/bash
# Deep Research Skill -- Pre-Commit Wave Validation
# Run before git commit to verify wave quality
set -uo pipefail

echo "--- Wave Validation ---"
PASS=true

# Check wave tracker for tool diversity
TRACKER_FILE="${TMPDIR:-/tmp}/deep-research-wave-tracker.json"
if [ -f "$TRACKER_FILE" ]; then
    RAG=$(python3 -c "import json; d=json.load(open('$TRACKER_FILE')); print(d.get('rag_browser',0))" 2>/dev/null || echo "0")
    CA=$(python3 -c "import json; d=json.load(open('$TRACKER_FILE')); print(d.get('call_actor',0))" 2>/dev/null || echo "0")

    if [ "$CA" -eq 0 ] && [ "$RAG" -gt 0 ]; then
        echo "  [FAIL] Tool diversity: $RAG RAG-browser calls, 0 call-actor calls"
        echo "         Fix: Use apify/google-search-scraper via call-actor before committing"
        PASS=false
    else
        echo "  [PASS] Tool diversity: $CA call-actor, $RAG RAG-browser"
    fi
else
    echo "  [WARN] No wave tracker found -- cannot verify tool diversity"
fi

# Check if report was updated
REPO="D:\\Bingaman Master Files Old\\Home Base Claude\\deep-research"
if cd "$REPO" 2>/dev/null; then
    REPORT_CHANGES=$(git diff --name-only 2>/dev/null | grep -c "NETWORK_INTEL_REPORT\|findings/" || echo "0")
    REPORT_CHANGES=$(echo "$REPORT_CHANGES" | tr -d '[:space:]')
    if [ "$REPORT_CHANGES" -gt 0 ]; then
        echo "  [PASS] Report/findings updated ($REPORT_CHANGES files changed)"
    else
        echo "  [WARN] No report or findings files changed"
    fi
else
    echo "  [SKIP] Could not access repo"
fi

# Check dhs-public-records-filing repo
DHS_REPO="D:\\Bingaman Master Files Old\\Home Base Claude\\dhs-public-records-filing"
if cd "$DHS_REPO" 2>/dev/null; then
    DHS_CHANGES=$(git status --porcelain 2>/dev/null | wc -l)
    DHS_CHANGES=$(echo "$DHS_CHANGES" | tr -d '[:space:]')
    if [ "$DHS_CHANGES" -gt 0 ]; then
        echo "  [INFO] DHS filing repo has $DHS_CHANGES uncommitted change(s)"
    else
        echo "  [PASS] DHS filing repo is clean"
    fi
else
    echo "  [SKIP] Could not access DHS filing repo"
fi

# Check memory files
MEMORY="D:\\Bingaman Master Files Old\\Home Base Claude\\memory"
if [ -f "$MEMORY/active_work.md" ]; then
    echo "  [INFO] active_work.md exists -- remember to update it"
else
    echo "  [WARN] active_work.md not found"
fi

echo ""
if [ "$PASS" = true ]; then
    echo "  RESULT: PASS -- ready to commit"
else
    echo "  RESULT: FAIL -- fix issues above before committing"
fi
