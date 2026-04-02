#!/usr/bin/env python3
"""
Valor Investigations GitHub Repo Search
Searches across ValorInvestigator GitHub repos for documents and research.

Usage:
  python github_search.py "search term"                    # search all investigation repos
  python github_search.py "search term" --repo REPO_NAME   # search specific repo
  python github_search.py "search term" --json             # JSON output
  python github_search.py --list-repos                     # list all repos

Uses `gh search code` which has better rate limits than raw API.
Best for searching .md research files, code, and text content.
Does NOT search inside PDFs -- use BigQuery evidence search for that.
"""
import subprocess, json, sys, io, time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ORG = 'ValorInvestigator'

# Key repos for investigation work
INVESTIGATION_REPOS = [
    'dhs-public-records-filing',
    'Bingaman-Case-Evidence',
    'odhs-state-health-law',
    'oregon-legal-research',
    'the-Quarterback',
]


def run_gh(args, timeout=30):
    """Run a gh CLI command."""
    cmd = ['gh'] + args
    try:
        result = subprocess.run(cmd, capture_output=True, text=True,
                                encoding='utf-8', errors='replace', timeout=timeout)
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except subprocess.TimeoutExpired:
        return '', 'Command timed out', 1


def search_code(query, repo=None, limit=20):
    """Search using gh search code (better rate limits)."""
    args = ['search', 'code', query, '--owner', ORG, '--limit', str(limit),
            '--json', 'repository,path,textMatches']
    if repo:
        # Override with repo-specific search
        args = ['search', 'code', query, '--repo', f'{ORG}/{repo}',
                '--limit', str(limit), '--json', 'repository,path,textMatches']

    stdout, stderr, rc = run_gh(args)
    if rc != 0:
        if 'rate limit' in stderr.lower() or '403' in stderr:
            return None, 'Rate limited -- wait a moment and try again'
        return None, stderr
    try:
        return json.loads(stdout), None
    except json.JSONDecodeError:
        return None, f'Could not parse: {stdout[:200]}'


def list_repos():
    """List all ValorInvestigator repos."""
    stdout, stderr, rc = run_gh(['repo', 'list', ORG, '--limit', '50',
                                  '--json', 'name,description,isPrivate,pushedAt'])
    if rc != 0:
        print(f'Error: {stderr}')
        return []
    return json.loads(stdout)


def display_results(results, query, json_mode=False):
    """Display search results."""
    if json_mode:
        output = {
            'query': query,
            'total_matches': len(results),
            'results': []
        }
        for item in results:
            repo_name = item.get('repository', {}).get('nameWithOwner', '?')
            path = item.get('path', '?')
            matches = item.get('textMatches', [])
            fragments = []
            for m in matches:
                frag = m.get('fragment', '')
                if frag:
                    fragments.append(frag[:300])
            output['results'].append({
                'repo': repo_name,
                'path': path,
                'fragments': fragments
            })
        print(json.dumps(output, indent=2, ensure_ascii=False))
        return

    print(f'\n{"=" * 60}')
    print(f'GITHUB SEARCH: "{query}"')
    print(f'Searched: {ORG} repos')
    print(f'{"=" * 60}')

    if not results:
        print('\nNo results found.')
        print('Note: GitHub search only indexes text files (.md, code, etc).')
        print('For PDF content, use Evidence Search (Mode 1) instead.')
        return

    # Group by repo
    by_repo = {}
    for item in results:
        repo_name = item.get('repository', {}).get('name', '?')
        if repo_name not in by_repo:
            by_repo[repo_name] = []
        by_repo[repo_name].append(item)

    total = len(results)
    print(f'\n{total} matches across {len(by_repo)} repos\n')

    for repo_name, items in by_repo.items():
        print(f'  [{repo_name}] ({len(items)} files)')
        print(f'  {"-" * 50}')
        for item in items:
            path = item.get('path', '?')
            print(f'    {path}')
            matches = item.get('textMatches', [])
            for m in matches[:2]:
                frag = m.get('fragment', '')
                if frag:
                    lines = frag.strip().split('\n')
                    for line in lines[:3]:
                        clean = line.strip()[:100]
                        if clean:
                            print(f'      | {clean}')
        print()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Valor Investigations GitHub Search')
        print(f'Searches across {len(INVESTIGATION_REPOS)} investigation repos')
        print()
        print('Usage:')
        print('  python github_search.py "search term"')
        print('  python github_search.py "search term" --repo dhs-public-records-filing')
        print('  python github_search.py "search term" --json')
        print('  python github_search.py --list-repos')
        print()
        print('Investigation repos:')
        for r in INVESTIGATION_REPOS:
            print(f'  - {ORG}/{r}')
        print()
        print('Note: This searches text files only (.md, code).')
        print('For PDF content, use evidence_search.py instead.')
        sys.exit(1)

    # Parse args
    json_mode = '--json' in sys.argv
    list_only = '--list-repos' in sys.argv
    specific_repo = None
    query = None

    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if args:
        query = args[0]

    for i, arg in enumerate(sys.argv):
        if arg == '--repo' and i + 1 < len(sys.argv):
            specific_repo = sys.argv[i + 1]

    if list_only:
        repos = list_repos()
        if json_mode:
            print(json.dumps(repos, indent=2))
        else:
            print(f'\n{"=" * 60}')
            print(f'VALORINVESTIGATOR GITHUB REPOS')
            print(f'{"=" * 60}')
            for r in repos:
                name = r.get('name', '?')
                desc = r.get('description', '') or ''
                private = 'PRIVATE' if r.get('isPrivate') else 'PUBLIC'
                star = ' *' if name in INVESTIGATION_REPOS else ''
                print(f'  [{private:7s}] {name}{star}')
                if desc:
                    print(f'            {desc[:80]}')
            print(f'\n  * = investigation repo (searched by default)')
        sys.exit(0)

    if not query:
        print('Error: No search query provided.')
        sys.exit(1)

    if not json_mode:
        target = f'{ORG}/{specific_repo}' if specific_repo else f'{ORG} (all repos)'
        print(f'Searching {target} for: "{query}"')

    results, err = search_code(query, repo=specific_repo)
    if err:
        print(f'Error: {err}')
        sys.exit(1)

    display_results(results or [], query, json_mode)
