#!/usr/bin/env python3
"""
Bingaman Evidence Search Agent
Searches 15,554 documents via Vertex AI Agent Builder (Discovery Engine)

Usage:
  python evidence_search.py "your natural language question"
  python evidence_search.py "question" 10          # more results
  python evidence_search.py "question" 5 --json    # raw JSON output

This uses the Vertex AI search engine (bingaman-search-v2) which indexes
all 15,554 documents from the BigQuery bingaman_documents table. It returns
an AI-generated summary with citations plus the source documents.
"""
import google.oauth2.service_account as sa
import google.auth.transport.requests as tr
import urllib.request, json, sys, io, textwrap

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

KEY_FILE = r'C:\Users\Big Levi\.claude\keys\valorinvestigates-bigquery.json'
PROJECT_NUM = '989102413038'
ENGINE_ID = 'bingaman-search-v2'


def get_token():
    creds = sa.Credentials.from_service_account_file(
        KEY_FILE, scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    creds.refresh(tr.Request())
    return creds.token


def search(query, num_results=5):
    token = get_token()
    search_body = {
        'query': query,
        'pageSize': num_results,
        'queryExpansionSpec': {'condition': 'AUTO'},
        'spellCorrectionSpec': {'mode': 'AUTO'},
        'contentSearchSpec': {
            'snippetSpec': {'returnSnippet': True, 'maxSnippetCount': 3},
            'summarySpec': {
                'summaryResultCount': num_results,
                'includeCitations': True
            }
        }
    }
    url = (
        f'https://discoveryengine.googleapis.com/v1/projects/{PROJECT_NUM}'
        f'/locations/global/collections/default_collection'
        f'/engines/{ENGINE_ID}/servingConfigs/default_search:search'
    )
    body = json.dumps(search_body).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    })
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read().decode())


def display_human(result):
    """Pretty-print results for human reading."""
    # Summary
    if 'summary' in result:
        summary = result['summary'].get('summaryText', '')
        if summary:
            print('\n' + '=' * 70)
            print('AI SUMMARY (synthesized from 15,554 documents)')
            print('=' * 70)
            print(summary)
            print()

    # Source documents
    results = result.get('results', [])
    if results:
        print('-' * 70)
        total = result.get('totalSize', '?')
        print(f'SOURCE DOCUMENTS ({len(results)} shown, {total} total matches)')
        print('-' * 70)
        for i, r in enumerate(results):
            struct = r.get('document', {}).get('structData', {})
            fname = struct.get('file_name', '?')
            cat = struct.get('category', '?')
            path = struct.get('file_path', '?')
            text_len = struct.get('text_length', '?')
            print(f'\n  [{i+1}] {fname}')
            print(f'      Category: {cat}')
            print(f'      Text length: {text_len} chars')
            print(f'      Path: {path}')
        print()


def display_json(result):
    """Output structured JSON for programmatic consumption."""
    output = {
        'summary': result.get('summary', {}).get('summaryText', ''),
        'total_matches': result.get('totalSize', 0),
        'documents': []
    }
    for r in result.get('results', []):
        struct = r.get('document', {}).get('structData', {})
        output['documents'].append({
            'file_name': struct.get('file_name', ''),
            'category': struct.get('category', ''),
            'file_path': struct.get('file_path', ''),
            'document_id': struct.get('document_id', ''),
            'text_length': struct.get('text_length', 0)
        })
    print(json.dumps(output, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Bingaman Evidence Search Agent')
        print('Searches 15,554 documents via Vertex AI')
        print()
        print('Usage:')
        print('  python evidence_search.py "your question here"')
        print('  python evidence_search.py "question" 10          # more results')
        print('  python evidence_search.py "question" 5 --json    # JSON output')
        sys.exit(1)

    query = sys.argv[1]
    num = 5
    json_mode = False

    for arg in sys.argv[2:]:
        if arg == '--json':
            json_mode = True
        elif arg.isdigit():
            num = int(arg)

    if not json_mode:
        print(f'Searching 15,554 documents for: "{query}"')

    result = search(query, num)

    if json_mode:
        display_json(result)
    else:
        display_human(result)
