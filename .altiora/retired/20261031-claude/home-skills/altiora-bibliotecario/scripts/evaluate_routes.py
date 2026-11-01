#!/usr/bin/env python3
"""Bounded offline evaluation of metadata retrieval, never a runtime/tool claim."""
import argparse
import json
from pathlib import Path
import sys

import library

SKILL_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = SKILL_ROOT.parents[1]
DEFAULT_CASES = SKILL_ROOT / 'references' / 'routing-evals.json'


def evaluate(catalog, suite):
    if suite.get('schema_version') != 1:
        raise ValueError('Unsupported evaluation schema')
    top_k = suite.get('top_k')
    if type(top_k) is not int or not 1 <= top_k <= 10:
        raise ValueError('top_k must be an integer from 1 to 10')
    cases = suite.get('cases')
    if not isinstance(cases, list) or not cases or len(cases) > 100:
        raise ValueError('Expected 1..100 bounded cases')
    seen, results = set(), []
    for case in cases:
        case_id, query = case.get('id'), case.get('query')
        expected, forbidden = case.get('expected_any'), case.get('forbidden')
        if (not isinstance(case_id, str) or not case_id or case_id in seen
                or not isinstance(query, str) or not query.strip()
                or not isinstance(expected, list) or not isinstance(forbidden, list)
                or not all(isinstance(x, str) and x for x in expected + forbidden)
                or not isinstance(case.get('constraint'), str) or not case['constraint']):
            raise ValueError('Invalid or duplicate case')
        if set(expected) & set(forbidden):
            raise ValueError('Expected and forbidden candidates overlap')
        seen.add(case_id)
        candidates = library.find(catalog, query, top_k)
        names = [row['name'] for row in candidates]
        hit = next((i + 1 for i, name in enumerate(names) if name in expected), None)
        passed = ((hit is not None) if expected else not names) and not set(names).intersection(forbidden)
        results.append({'id': case_id, 'passed': passed, 'candidate_names': names,
                        'first_expected_rank': hit, 'expected_any': expected,
                        'constraint_not_executed': case['constraint']})
    positive = [r for r in results if r['expected_any']]
    negative = [r for r in results if not r['expected_any']]
    return {'schema_version': 1, 'status': 'PASS' if all(r['passed'] for r in results) else 'FAIL',
            'scope': 'offline_metadata_retrieval_not_runtime_routing', 'top_k': top_k,
            'entries': len(catalog['entries']), 'cases': len(results),
            'passed': sum(r['passed'] for r in results),
            'expected_candidate_hits': sum(r['first_expected_rank'] is not None for r in positive),
            'positive_cases': len(positive), 'abstentions_correct': sum(r['passed'] for r in negative),
            'negative_cases': len(negative), 'token_savings': 'NOT_MEASURED',
            'limits': ['Authored fixtures; not an independent benchmark or live-user sample',
                       'Constraints are review reminders, not executed permission or quality checks',
                       'No model calls, account settings, services, personal library, or skill bodies loaded'],
            'results': results}


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cases', type=Path, default=DEFAULT_CASES)
    parser.add_argument('--json', action='store_true')
    parser.add_argument('--root', type=Path, default=REPO_ROOT,
                        help='Checkout root containing skills/ and .claude/agents/')
    args = parser.parse_args()
    # Explicit portable sources: no personal directories or generated duplicate wrappers.
    catalog = library.build([args.root / 'skills', args.root / '.claude' / 'agents'])
    report = evaluate(catalog, json.loads(args.cases.read_text(encoding='utf-8-sig')))
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"{report['status']}: {report['passed']}/{report['cases']} offline retrieval cases; "
              f"top-{report['top_k']}; token savings NOT_MEASURED")
        for row in report['results']:
            if not row['passed']:
                print(f"FAIL {row['id']}: {', '.join(row['candidate_names']) or '(abstained)'}")
    return 0 if report['status'] == 'PASS' else 1


if __name__ == '__main__':
    sys.exit(main())
