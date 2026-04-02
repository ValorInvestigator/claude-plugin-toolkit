#!/usr/bin/env python3
"""
BigQuery REST API Query Helper for Valor Investigations
Usage: python bq_query.py "SELECT * FROM `valorinvestigates.valor_investigations.documents` LIMIT 5"
       python bq_query.py --file query.sql
       python bq_query.py --tables                  # List all tables
       python bq_query.py --schema documents        # Show table schema
       python bq_query.py --count                   # Count all tables
       python bq_query.py --check-auth              # Just check if auth works

Output: JSON to stdout (parseable), human-readable messages to stderr
Exit codes: 0=success, 1=auth expired, 2=query error, 3=other error
"""

import json
import urllib.request
import urllib.error
import sys
import io
import os
import argparse
from datetime import datetime

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# --- Configuration ---
SERVICE_ACCOUNT_KEY = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
PROJECT = 'valorinvestigates'
DATASET = 'valor_investigations'
BQ_API = f'https://bigquery.googleapis.com/bigquery/v2/projects/{PROJECT}/queries'
BQ_TABLES_API = f'https://bigquery.googleapis.com/bigquery/v2/projects/{PROJECT}/datasets/{DATASET}/tables'
DEFAULT_TIMEOUT_MS = 60000
DML_TIMEOUT_MS = 120000


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


def bq_query(sql, token, timeout_ms=None):
    """Execute a BigQuery SQL query. Returns parsed JSON response."""
    if timeout_ms is None:
        # Use longer timeout for DML operations
        is_dml = any(sql.strip().upper().startswith(kw) for kw in ['UPDATE', 'DELETE', 'INSERT', 'MERGE'])
        timeout_ms = DML_TIMEOUT_MS if is_dml else DEFAULT_TIMEOUT_MS

    body = json.dumps({
        'query': sql,
        'useLegacySql': False,
        'timeoutMs': timeout_ms
    }).encode('utf-8')

    req = urllib.request.Request(BQ_API, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })

    try:
        resp = urllib.request.urlopen(req, timeout=max(timeout_ms // 1000 + 10, 30))
        return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='replace')
        if e.code in (401, 403):
            print(f"AUTH_EXPIRED: HTTP {e.code}. Run: gcloud auth login", file=sys.stderr)
            sys.exit(1)
        try:
            error_json = json.loads(error_body)
            error_msg = error_json.get('error', {}).get('message', error_body[:500])
        except json.JSONDecodeError:
            error_msg = error_body[:500]
        print(f"QUERY_ERROR: HTTP {e.code}: {error_msg}", file=sys.stderr)
        sys.exit(2)


def list_tables(token):
    """List all tables in the dataset."""
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
            tables.append({
                'table_id': ref.get('tableId'),
                'type': t.get('type'),
                'row_count': t.get('numRows'),
                'size_bytes': t.get('numBytes'),
                'created': t.get('creationTime'),
                'modified': t.get('lastModifiedTime')
            })
        return tables
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            print(f"AUTH_EXPIRED: HTTP {e.code}. Run: gcloud auth login", file=sys.stderr)
            sys.exit(1)
        raise


def get_table_schema(token, table_name):
    """Get the schema for a specific table."""
    url = f'{BQ_TABLES_API}/{table_name}'
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode('utf-8'))
        schema = data.get('schema', {}).get('fields', [])
        return [{
            'name': f.get('name'),
            'type': f.get('type'),
            'mode': f.get('mode', 'NULLABLE'),
            'description': f.get('description', '')
        } for f in schema]
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            print(f"AUTH_EXPIRED: HTTP {e.code}. Run: gcloud auth login", file=sys.stderr)
            sys.exit(1)
        if e.code == 404:
            print(f"TABLE_NOT_FOUND: {table_name}", file=sys.stderr)
            sys.exit(2)
        raise


def format_rows(result):
    """Convert BigQuery result to list of dicts."""
    schema = result.get('schema', {}).get('fields', [])
    field_names = [f['name'] for f in schema]
    rows = []
    for row in result.get('rows', []):
        values = [cell.get('v') for cell in row.get('f', [])]
        rows.append(dict(zip(field_names, values)))
    return rows


def main():
    parser = argparse.ArgumentParser(description='BigQuery query helper for Valor Investigations')
    parser.add_argument('sql', nargs='?', help='SQL query to execute')
    parser.add_argument('--file', '-f', help='Read SQL from file')
    parser.add_argument('--tables', action='store_true', help='List all tables')
    parser.add_argument('--schema', '-s', help='Show schema for a table')
    parser.add_argument('--count', action='store_true', help='Count rows in all tables')
    parser.add_argument('--check-auth', action='store_true', help='Check if auth is valid')
    parser.add_argument('--timeout', '-t', type=int, help='Timeout in ms')
    parser.add_argument('--raw', action='store_true', help='Output raw BigQuery response')
    args = parser.parse_args()

    # Get token first
    token = get_token()
    if not token:
        print(json.dumps({
            'error': 'AUTH_EXPIRED',
            'message': 'Google Cloud auth token is expired or invalid.',
            'action': 'Run this command in a terminal: gcloud auth login'
        }))
        sys.exit(1)

    # Auth check only
    if args.check_auth:
        print(json.dumps({
            'status': 'ok',
            'message': 'Auth token is valid',
            'project': PROJECT,
            'dataset': DATASET,
            'timestamp': datetime.now().isoformat()
        }))
        sys.exit(0)

    # List tables
    if args.tables:
        tables = list_tables(token)
        print(json.dumps({'tables': tables}, indent=2))
        sys.exit(0)

    # Table schema
    if args.schema:
        schema = get_table_schema(token, args.schema)
        print(json.dumps({'table': args.schema, 'fields': schema}, indent=2))
        sys.exit(0)

    # Count all tables
    if args.count:
        tables = list_tables(token)
        counts = {}
        for t in tables:
            table_id = t['table_id']
            sql = f'SELECT COUNT(*) as cnt FROM `{PROJECT}.{DATASET}.{table_id}`'
            try:
                result = bq_query(sql, token, timeout_ms=30000)
                rows = format_rows(result)
                counts[table_id] = int(rows[0]['cnt']) if rows else 0
            except SystemExit:
                counts[table_id] = 'error'
        print(json.dumps({'row_counts': counts}, indent=2))
        sys.exit(0)

    # Read SQL from file or argument
    sql = args.sql
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            sql = f.read()

    if not sql:
        parser.print_help()
        sys.exit(3)

    # Execute query
    print(f"Executing query...", file=sys.stderr)
    result = bq_query(sql, token, timeout_ms=args.timeout)

    if args.raw:
        print(json.dumps(result, indent=2))
    else:
        # Format output
        total_rows = result.get('totalRows', '0')
        dml_affected = result.get('numDmlAffectedRows')
        rows = format_rows(result)

        output = {
            'totalRows': int(total_rows),
            'returnedRows': len(rows),
            'rows': rows
        }
        if dml_affected is not None:
            output['dmlAffectedRows'] = int(dml_affected)

        if result.get('pageToken'):
            output['hasMorePages'] = True
            output['note'] = 'Results are paginated. More rows available.'

        print(json.dumps(output, indent=2, ensure_ascii=False))

    print(f"Done. {total_rows} total rows.", file=sys.stderr)


if __name__ == '__main__':
    main()
