#!/usr/bin/env python3
"""CourtListener API wrapper for deep research.

Usage:
    python courtlistener.py --query "search terms" [--court or] [--type opinions|dockets]

Returns JSON results to stdout.
"""

import argparse
import json
import sys
import urllib.request
import urllib.parse

TOKEN = "48b2b5fd5858fe301286d216f6d1f4146507910c"
BASE_URL = "https://www.courtlistener.com/api/rest/v4"


def search(query, court="or", search_type="opinions"):
    """Search CourtListener for Oregon cases."""
    type_code = "o" if search_type == "opinions" else "d"

    params = urllib.parse.urlencode({
        "q": query,
        "type": type_code,
        "court": court,
    })

    url = f"{BASE_URL}/search/?{params}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Token {TOKEN}",
        "User-Agent": "Valor-Investigations/1.0",
    })

    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())

        results = []
        for r in data.get("results", [])[:10]:
            result = {
                "case_name": r.get("caseName", "Unknown"),
                "date_filed": r.get("dateFiled", "Unknown"),
                "court": r.get("court", "Unknown"),
                "citation": r.get("citation", []),
                "snippet": r.get("snippet", "")[:300],
                "cluster_id": r.get("cluster_id", r.get("id", "")),
            }
            results.append(result)

        output = {
            "query": query,
            "court": court,
            "type": search_type,
            "count": data.get("count", 0),
            "results": results,
        }

        print(json.dumps(output, indent=2))

    except urllib.error.HTTPError as e:
        print(json.dumps({
            "error": f"HTTP {e.code}: {e.reason}",
            "query": query,
        }), file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(json.dumps({
            "error": f"Connection failed: {str(e.reason)}",
            "query": query,
        }), file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Search CourtListener")
    parser.add_argument("--query", "-q", required=True, help="Search query")
    parser.add_argument("--court", "-c", default="or", help="Court code (default: or)")
    parser.add_argument("--type", "-t", default="opinions",
                        choices=["opinions", "dockets"],
                        help="Search type (default: opinions)")
    args = parser.parse_args()

    search(args.query, args.court, args.type)


if __name__ == "__main__":
    main()
