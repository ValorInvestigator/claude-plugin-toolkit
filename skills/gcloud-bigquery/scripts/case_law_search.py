#!/usr/bin/env python3
"""
Valor Investigations Case Law Search
Searches the local case law analysis database (5 markdown files, ~1200 lines)
for citations, holdings, quotable language, and strategic arguments.

Usage:
  python case_law_search.py "search terms"              # search all case law files
  python case_law_search.py "search terms" --context 5   # show 5 lines of context (default: 3)
  python case_law_search.py "search terms" --json         # JSON output
  python case_law_search.py --list                        # list all available files
  python case_law_search.py --cases                       # list all cases with citations

The case law database consists of:
  - CASE_LAW_STRATEGIC_REVIEW.md  (master synthesis with 7 pillars, tier rankings, recommendations)
  - case_law_analysis_batch1.md   (Chaimov v. State -- COA 2021 + SC 2022)
  - case_law_analysis_batch2.md   (PETA v. OHSU, In Defense of Animals, Kessler, Merrick)
  - case_law_analysis_batch3.md   (Bialostosky, Sause v. Hummel, Upham v. Forster)
  - case_law_analysis_batch4.md   (Pamplin Media, Pride Disposal, LOC Handbook Ch. 14)

These files contain full case analysis from 13 Oregon appellate decisions plus
the League of Oregon Cities Public Records Handbook. Each case includes:
  - Full citation
  - Key facts
  - Holdings and legal standards
  - Quotable language with page references
  - Application to Bakke v. ODHS
  - Procedural details
"""
import sys, io, os, re, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Case law analysis files
BASE_DIR = r'D:\Bingaman Master Files Old\Home Base Claude'
CASE_LAW_FILES = [
    ('CASE_LAW_STRATEGIC_REVIEW.md', 'Master strategic review -- 7 pillars, case tiers, recommendations'),
    ('case_law_analysis_batch1.md', 'Chaimov v. State (COA 2021 + SC 2022) -- burden of proof, disclosure policy'),
    ('case_law_analysis_batch2.md', 'PETA v. OHSU, In Defense of Animals, Kessler, Merrick -- fees, denial vs delay, stonewalling'),
    ('case_law_analysis_batch3.md', 'Bialostosky, Sause v. Hummel, Upham v. Forster -- exemptions, adequate search, suspicious destruction'),
    ('case_law_analysis_batch4.md', 'Pamplin Media, Pride Disposal, LOC Handbook -- burden of proof, blanket denial, procedures'),
]

# Known cases for the --cases flag
KNOWN_CASES = [
    ('Chaimov v. State (COA)', '314 Or. App. 253, 498 P.3d 830 (2021)', 'Burden of proof, disclosure policy, ORS 192.431(1)'),
    ('Chaimov v. State (SC)', '370 Or. 382, 520 P.3d 406 (2022)', '"Strong and pervasive" disclosure policy, exemptions narrowly construed'),
    ('PETA v. OHSU', '346 Or. App. 38 (2025)', 'CRITICAL: delay vs denial distinction; fees only for denial (ORS 192.431)'),
    ('In Defense of Animals v. OHSU', '199 Or. App. 160, 112 P.3d 336 (2005)', 'Burden on agency, fee waiver, watchdog framing'),
    ('Kessler v. City of Portland', '340 Or. App. 185, 571 P.3d 146 (2025)', '$57,900 fee award affirmed; violation of AG/DA order'),
    ('Merrick v. City of Portland', '313 Or. App. 647, 496 P.3d 1085 (2021)', 'MOST IMPORTANT: stonewalling = denial, partial prevailing = fees'),
    ('Bialostosky v. Cummings', '319 Or. App. 352, 511 P.3d 31 (2022)', 'Exemptions must be explicit, broad definitions'),
    ('Sause v. Hummel', '318 Or. App. 869, 507 P.3d 1292 (2022)', 'Adequate search standard NOT YET adopted in Oregon'),
    ('Upham v. Forster', '316 Or. App. 357, 504 P.3d 654 (2021)', 'Federal FOIA applies; suspicious destruction; stonewalling'),
    ('Pamplin Media v. City of Salem', '293 Or. App. 755, 429 P.3d 1019 (2018)', 'Burden on agency; bare assertions fail; blanket denial improper'),
    ('Pride Disposal v. Valet Waste', '298 Or. App. 751, 448 P.3d 680 (2019)', 'Narrow construction principle (marginal utility)'),
    ('LOC Handbook Ch. 14', '(secondary source, 2021)', 'Full procedural framework ODHS violated'),
]

# Frequently cited foundational cases (from the strategic review)
FOUNDATIONAL_CASES = [
    ('Guard Publishing v. Lane County SD', '310 Or. 32, 791 P.2d 854 (1990)', 'Disclosure is the norm; exclusion must be justified'),
    ('City of Portland v. Rice', '308 Or. 118, 775 P.2d 1371 (1989)', '"Strong and pervasive" disclosure policy'),
    ('Jordan v. MVD', '308 Or. 433, 781 P.2d 1203 (1989)', '"Strong and enduring" policy favoring openness'),
    ('ILWU v. Port of Portland', '285 Or. App. 222 (2017)', 'Stonewalling and obstruction = improper withholding'),
    ('Gray v. Salem-Keizer SD', '139 Or. App. 556, 912 P.2d 938 (1996)', 'Good faith irrelevant to mandatory fees after AG order defiance'),
    ('ACLU v. City of Eugene', '360 Or. 269 (2016)', 'Interest of citizen in knowing what government does'),
    ('Colby v. Gunson', '224 Or. App. 666 (2008)', 'Exemptions must be explicitly stated, not implied'),
    ('Jensen v. Schiffman', '24 Or. App. 11 (1976)', 'Federal FOIA law is persuasive authority for Oregon'),
]


def load_files():
    """Load all case law analysis files."""
    files = {}
    for fname, desc in CASE_LAW_FILES:
        fpath = os.path.join(BASE_DIR, fname)
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
                files[fname] = {
                    'description': desc,
                    'path': fpath,
                    'lines': f.readlines(),
                }
    return files


def search_files(query, files, context_lines=3):
    """Search all files for the query terms. Returns matches with context."""
    terms = query.lower().split()
    results = []

    for fname, data in files.items():
        lines = data['lines']
        for i, line in enumerate(lines):
            line_lower = line.lower()
            # Check if ALL terms appear in this line or surrounding context
            window_start = max(0, i - context_lines)
            window_end = min(len(lines), i + context_lines + 1)
            window_text = ''.join(lines[window_start:window_end]).lower()

            if all(t in line_lower for t in terms):
                # All terms in this single line -- strong match
                context_before = lines[max(0, i - context_lines):i]
                context_after = lines[i + 1:min(len(lines), i + context_lines + 1)]
                results.append({
                    'file': fname,
                    'line_num': i + 1,
                    'match_line': line.rstrip(),
                    'context_before': [l.rstrip() for l in context_before],
                    'context_after': [l.rstrip() for l in context_after],
                    'match_type': 'exact',
                    'description': data['description'],
                })
            elif len(terms) > 1 and all(t in window_text for t in terms):
                # Terms spread across the context window -- weaker match
                context_before = lines[max(0, i - context_lines):i]
                context_after = lines[i + 1:min(len(lines), i + context_lines + 1)]
                results.append({
                    'file': fname,
                    'line_num': i + 1,
                    'match_line': line.rstrip(),
                    'context_before': [l.rstrip() for l in context_before],
                    'context_after': [l.rstrip() for l in context_after],
                    'match_type': 'context',
                    'description': data['description'],
                })

    # Deduplicate overlapping matches (keep the one with the highest line number match)
    seen = set()
    deduped = []
    for r in results:
        key = (r['file'], r['line_num'] // (context_lines + 1))
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    # Sort: exact matches first, then by file order
    deduped.sort(key=lambda x: (0 if x['match_type'] == 'exact' else 1, x['file'], x['line_num']))
    return deduped


def display_results(results, query, json_mode=False):
    """Display search results."""
    if json_mode:
        output = {
            'query': query,
            'total_matches': len(results),
            'results': results,
        }
        print(json.dumps(output, indent=2, ensure_ascii=False))
        return

    print(f'\n{"=" * 60}')
    print(f'CASE LAW SEARCH: "{query}"')
    print(f'Searched: {len(CASE_LAW_FILES)} analysis files (13 cases + handbook)')
    print(f'{"=" * 60}')

    if not results:
        print('\nNo matches found.')
        print('Try broader terms, or use --cases to see all available cases.')
        print('For case law in PDFs (not yet analyzed), use Evidence Search (Mode 1).')
        return

    # Separate exact and context matches
    exact = [r for r in results if r['match_type'] == 'exact']
    context = [r for r in results if r['match_type'] == 'context']

    print(f'\n{len(exact)} direct matches, {len(context)} context matches\n')

    shown = 0
    for r in results[:25]:  # Cap at 25 results
        shown += 1
        tag = 'EXACT' if r['match_type'] == 'exact' else 'CONTEXT'
        print(f'  [{tag}] {r["file"]}:{r["line_num"]}')
        print(f'  Source: {r["description"]}')
        print(f'  {"-" * 50}')
        for line in r['context_before']:
            print(f'    {line}')
        print(f'  > {r["match_line"]}')
        for line in r['context_after']:
            print(f'    {line}')
        print()

    if len(results) > 25:
        print(f'  ... and {len(results) - 25} more matches (showing first 25)')


def list_files():
    """List all case law analysis files."""
    print(f'\n{"=" * 60}')
    print('CASE LAW ANALYSIS DATABASE')
    print(f'{"=" * 60}')
    print(f'\nBase directory: {BASE_DIR}\n')
    for fname, desc in CASE_LAW_FILES:
        fpath = os.path.join(BASE_DIR, fname)
        exists = 'OK' if os.path.exists(fpath) else 'MISSING'
        size = ''
        if os.path.exists(fpath):
            lines = sum(1 for _ in open(fpath, 'r', encoding='utf-8', errors='replace'))
            size = f'({lines} lines)'
        print(f'  [{exists}] {fname} {size}')
        print(f'         {desc}')
    print()


def list_cases():
    """List all cases with citations."""
    print(f'\n{"=" * 60}')
    print('CASE LAW DATABASE -- ALL CASES')
    print(f'{"=" * 60}')

    print('\n  PRIMARY CASES (analyzed from PDFs):')
    print(f'  {"-" * 55}')
    for name, cite, relevance in KNOWN_CASES:
        print(f'  {name}')
        print(f'    Citation: {cite}')
        print(f'    Use for:  {relevance}')
        print()

    print('  FOUNDATIONAL CASES (cited within primary cases):')
    print(f'  {"-" * 55}')
    for name, cite, relevance in FOUNDATIONAL_CASES:
        print(f'  {name}')
        print(f'    Citation: {cite}')
        print(f'    Use for:  {relevance}')
        print()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Valor Investigations Case Law Search')
        print(f'Searches {len(CASE_LAW_FILES)} analysis files (13 Oregon cases + handbook)')
        print()
        print('Usage:')
        print('  python case_law_search.py "search terms"')
        print('  python case_law_search.py "search terms" --context 5')
        print('  python case_law_search.py "search terms" --json')
        print('  python case_law_search.py --list')
        print('  python case_law_search.py --cases')
        print()
        print('Examples:')
        print('  python case_law_search.py "attorney fees"')
        print('  python case_law_search.py "stonewalling"')
        print('  python case_law_search.py "burden of proof"')
        print('  python case_law_search.py "email servers"')
        print('  python case_law_search.py "ORS 192.431"')
        print('  python case_law_search.py "Merrick"')
        sys.exit(1)

    # Parse args
    json_mode = '--json' in sys.argv
    list_only = '--list' in sys.argv
    cases_only = '--cases' in sys.argv
    context_lines = 3

    for i, arg in enumerate(sys.argv):
        if arg == '--context' and i + 1 < len(sys.argv):
            try:
                context_lines = int(sys.argv[i + 1])
            except ValueError:
                pass

    if list_only:
        list_files()
        sys.exit(0)

    if cases_only:
        list_cases()
        sys.exit(0)

    # Get the query (first non-flag argument)
    query = None
    skip_next = False
    for i, arg in enumerate(sys.argv[1:], 1):
        if skip_next:
            skip_next = False
            continue
        if arg == '--context':
            skip_next = True
            continue
        if arg.startswith('--'):
            continue
        query = arg
        break

    if not query:
        print('Error: No search query provided.')
        sys.exit(1)

    files = load_files()
    if not files:
        print(f'Error: No case law files found in {BASE_DIR}')
        print('Expected files: CASE_LAW_STRATEGIC_REVIEW.md, case_law_analysis_batch[1-4].md')
        sys.exit(1)

    results = search_files(query, files, context_lines)
    display_results(results, query, json_mode)
