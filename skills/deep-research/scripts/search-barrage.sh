#!/bin/bash
# Deep Research Skill -- Search Barrage Command Generator
# Generates pre-built tool call payloads for diverse search waves.
# Usage: bash search-barrage.sh "query" [person|org|legal|general]
set -uo pipefail

QUERY="${1:?Usage: search-barrage.sh \"query\" [person|org|legal|general]}"
TYPE="${2:-general}"

# Generate 3 query variants
Q1="$QUERY"
Q2="$QUERY Oregon"
Q3="$QUERY site:oregon.gov OR site:linkedin.com"

# Escape for JSON
json_escape() {
    printf '%s' "$1" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()), end='')"
}

Q1_ESC=$(json_escape "$Q1")
Q2_ESC=$(json_escape "$Q2")
Q3_ESC=$(json_escape "$Q3")
QUERY_ESC=$(json_escape "$QUERY")

# Build queries string (newline-separated for Google SERP)
QUERIES_VAL=$(printf '%s\\n%s\\n%s' "$Q1" "$Q2" "$Q3")
QUERIES_ESC=$(json_escape "$QUERIES_VAL")

# Choose specialized actor based on type
case "$TYPE" in
    person)
        SPEC_ACTOR="apify/google-search-scraper"
        SPEC_INPUT="{\"queries\": \"$Q1 LinkedIn profile\\n$Q1 Facebook\", \"maxPagesPerQuery\": 1, \"resultsPerPage\": 10, \"languageCode\": \"en\", \"mobileResults\": false}"
        SPEC_NOTE="Person search -- also run sherlock_username_search and maigret_username_search via OSINT MCP tools"
        ;;
    org)
        SPEC_ACTOR="apify/website-content-crawler"
        SPEC_INPUT="{\"startUrls\": [{\"url\": \"https://www.google.com/search?q=$Q1\"}], \"maxCrawlPages\": 10, \"crawlerType\": \"cheerio\", \"maxCrawlDepth\": 1}"
        SPEC_NOTE="Organization search -- also run theharvester_domain_search if domain known"
        ;;
    legal)
        SPEC_ACTOR="COURTLISTENER"
        SPEC_INPUT="python3 scripts/courtlistener.py --query $QUERY_ESC --court or"
        SPEC_NOTE="Legal search -- run courtlistener.py script directly via Bash tool"
        ;;
    *)
        SPEC_ACTOR="easyapi/google-news-scraper"
        SPEC_INPUT="{\"query\": $QUERY_ESC, \"language\": \"en\", \"country\": \"US\", \"maxItems\": 100}"
        SPEC_NOTE="General search -- news coverage"
        ;;
esac

cat << ENDJSON
{
  "wave_tools": {
    "1_google_serp": {
      "tool": "call-actor",
      "actor": "apify/google-search-scraper",
      "input": {
        "queries": $QUERIES_ESC,
        "maxPagesPerQuery": 1,
        "resultsPerPage": 10,
        "languageCode": "en",
        "mobileResults": false
      },
      "note": "REQUIRED: Bulk Google search with 3 query variants"
    },
    "2_specialized": {
      "tool": "call-actor",
      "actor": "$SPEC_ACTOR",
      "input_raw": "$SPEC_INPUT",
      "note": "$SPEC_NOTE"
    },
    "3_rag_browser": {
      "tool": "apify-slash-rag-web-browser",
      "query": $QUERY_ESC,
      "note": "OPTIONAL: Targeted follow-up on best results from steps 1-2"
    }
  },
  "minimum_requirement": "Use tools 1 AND 2 before using tool 3. The PreToolUse hook will block tool 3 if tools 1-2 are skipped.",
  "type": "$TYPE"
}
ENDJSON
