#!/usr/bin/env python3
"""
BigQuery Session Startup / Health Check
Run this at the start of any new Claude session that needs BigQuery.

What it does:
1. Gets a fresh auth token from gcloud
2. Lists all tables with current row counts
3. Prints project/dataset/region info
4. Confirms everything is ready to query

Usage:
    python bq_startup.py
    python bq_startup.py --quiet    # Just check auth, minimal output

Exit codes: 0=ready, 1=auth expired, 2=connection error
"""

import subprocess
import json
import urllib.request
import urllib.error
import sys
import io
from datetime import datetime

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# --- Configuration ---
GCLOUD_CMD = r'C:\Users\Big Levi\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'
SERVICE_ACCOUNT_KEY = r'C:\Users\Big Levi\Downloads\valorinvestigates-df32918a914f.json'
PROJECT = 'valorinvestigates'
DATASET = 'valor_investigations'
REGION = 'us-west1'
ACCOUNT = 'levi@valorinvestigates.com'
BQ_API = f'https://bigquery.googleapis.com/bigquery/v2/projects/{PROJECT}/queries'
BQ_TABLES_API = f'https://bigquery.googleapis.com/bigquery/v2/projects/{PROJECT}/datasets/{DATASET}/tables'


def get_token():
    """Get a token from the service account JSON key. No gcloud login required."""
    try:
        import google.oauth2.service_account as sa
        import google.auth.transport.requests as tr
        creds = sa.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY,
            scopes=['https://www.googleapis.com/auth/bigquery']
        )
        creds.refresh(tr.Request())
        if creds.token:
            return creds.token
        print("AUTH_EXPIRED: Service account token refresh returned empty token.", file=sys.stderr)
        return None
    except FileNotFoundError:
        print(f"AUTH_EXPIRED: Key file not found at {SERVICE_ACCOUNT_KEY}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"AUTH_EXPIRED: {e}", file=sys.stderr)
        return None


def list_tables_with_counts(token):
    """List all tables with row counts and sizes."""
    req = urllib.request.Request(BQ_TABLES_API, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode('utf-8'))
        tables = []
        for t in data.get('tables', []):
            ref = t.get('tableReference', {})
            rows = int(t.get('numRows', 0))
            size_kb = int(t.get('numBytes', 0)) / 1024
            tables.append({
                'table_id': ref.get('tableId'),
                'rows': rows,
                'size_kb': round(size_kb, 1),
                'status': 'populated' if rows > 0 else 'empty (ready for population)'
            })
        return tables
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            return None  # auth issue
        raise


def main():
    quiet = '--quiet' in sys.argv

    # Step 1: Get token
    token = get_token()
    if not token:
        print("=" * 60)
        print("AUTH_EXPIRED")
        print("=" * 60)
        print("Your Google Cloud auth token is expired or invalid.")
        print("Run this in a terminal to fix it:")
        print("")
        print("    gcloud auth login")
        print("")
        print("Then try again.")
        sys.exit(1)

    if quiet:
        print(json.dumps({
            'status': 'ready',
            'project': PROJECT,
            'dataset': DATASET,
            'timestamp': datetime.now().isoformat()
        }))
        sys.exit(0)

    # Step 2: List tables
    tables = list_tables_with_counts(token)
    if tables is None:
        print("AUTH_EXPIRED: Token worked for gcloud but failed on BigQuery API.")
        print("Run: gcloud auth login")
        sys.exit(1)

    # Step 3: Print results
    print("=" * 60)
    print("BIGQUERY SESSION READY")
    print("=" * 60)
    print(f"Project:   {PROJECT}")
    print(f"Dataset:   {DATASET}")
    print(f"Region:    {REGION}")
    print(f"Account:   {ACCOUNT}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    print("TABLES:")
    print("-" * 60)

    total_rows = 0
    for t in tables:
        rows_str = f"{t['rows']:,}"
        size_str = f"{t['size_kb']:,.1f} KB"
        status = ""
        if t['rows'] == 0:
            status = " (empty)"
        print(f"  {t['table_id']:<30} {rows_str:>10} rows  {size_str:>12}{status}")
        total_rows += t['rows']

    print("-" * 60)
    print(f"  {'TOTAL':<30} {total_rows:>10,} rows")
    print("")
    print("READY TO QUERY. Use Standard SQL with backtick-escaped table names:")
    print(f"  `{PROJECT}.{DATASET}.<table_name>`")
    print("=" * 60)

    # Also output JSON for programmatic use
    print("")
    print("JSON_DATA:" + json.dumps({
        'status': 'ready',
        'project': PROJECT,
        'dataset': DATASET,
        'region': REGION,
        'account': ACCOUNT,
        'tables': tables,
        'total_rows': total_rows,
        'timestamp': datetime.now().isoformat()
    }))


if __name__ == '__main__':
    main()
