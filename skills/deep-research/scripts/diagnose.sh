#!/bin/bash
# Deep Research Skill -- Self-Diagnostic
# Run FIRST every session to check tool availability
set -uo pipefail

echo "=========================================="
echo " Deep Research v6.0 -- Diagnostic"
echo "=========================================="
echo ""

check() {
    local name="$1"
    local cmd="$2"
    local note="$3"
    if eval "$cmd" > /dev/null 2>&1; then
        printf "  %-35s [OK]    %s\n" "$name" "$note"
    else
        printf "  %-35s [MISS]  %s\n" "$name" "$note"
    fi
}

echo "--- Core Tools ---"
check "Python3" "python3 --version" ""
check "Git" "git --version" ""
check "curl" "curl --version" ""
check "jq" "command -v jq" "optional but recommended"

echo ""
echo "--- Docker / OSINT MCP ---"
check "Docker running" "docker ps" ""
check "OSINT MCP image" "docker images osint-tools-mcp-server --format '{{.Repository}}' | grep -q osint" "Sherlock/Maigret/Holehe/etc"

echo ""
echo "--- API Connectivity ---"
CL_TOKEN="48b2b5fd5858fe301286d216f6d1f4146507910c"
check "CourtListener API" "curl -s --head -H 'Authorization: Token $CL_TOKEN' https://www.courtlistener.com/api/rest/v4/ | grep -q '200'" ""

BQ_KEY="C:\\Users\\Big Levi\\.claude\\keys\\valorinvestigates-bigquery.json"
check "BigQuery service account" "test -f '$BQ_KEY'" ""

echo ""
echo "--- Reports ---"
R1="D:\\Bingaman New --3-4-26\\NETWORK_INTEL_REPORT.md"
R2="D:\\Bingaman Master Files Old\\Home Base Claude\\deep-research\\reports\\NETWORK_INTEL_REPORT.md"
check "Report (primary)" "test -f '$R1'" ""
check "Report (repo copy)" "test -f '$R2'" ""

echo ""
echo "--- Git Status ---"
REPO="D:\\Bingaman Master Files Old\\Home Base Claude\\deep-research"
if [ -d "$REPO/.git" ] || [ -d "$REPO/../.git" ]; then
    BRANCH=$(cd "$REPO" 2>/dev/null && git branch --show-current 2>/dev/null || echo "unknown")
    STATUS=$(cd "$REPO" 2>/dev/null && git status --porcelain 2>/dev/null | wc -l || echo "?")
    printf "  %-35s [OK]    branch: %s, uncommitted: %s\n" "Deep research repo" "$BRANCH" "$STATUS"
else
    printf "  %-35s [MISS]  not a git repo\n" "Deep research repo"
fi

echo ""
echo "--- Wave Tracker ---"
TRACKER_FILE="${TMPDIR:-/tmp}/deep-research-wave-tracker.json"
if [ -f "$TRACKER_FILE" ]; then
    RAG=$(python3 -c "import json; d=json.load(open('$TRACKER_FILE')); print(d.get('rag_browser',0))" 2>/dev/null || echo "?")
    CA=$(python3 -c "import json; d=json.load(open('$TRACKER_FILE')); print(d.get('call_actor',0))" 2>/dev/null || echo "?")
    printf "  %-35s [OK]    rag_browser: %s, call_actor: %s\n" "Wave tracker" "$RAG" "$CA"
else
    printf "  %-35s [NEW]   no active wave\n" "Wave tracker"
fi

echo ""
echo "=========================================="
echo " Ready. Use references/SCHEMAS.md for"
echo " pre-built actor input schemas."
echo "=========================================="
