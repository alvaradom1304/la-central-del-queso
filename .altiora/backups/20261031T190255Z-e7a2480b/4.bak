#!/usr/bin/env python3
"""Metadata-only local retrieval. No model calls, package installs or code evaluation."""
import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path


def normalize(value):
    return ''.join(c for c in unicodedata.normalize('NFKD', value.casefold())
                   if not unicodedata.combining(c))


def field(header, key):
    match = re.search(r'^' + re.escape(key) + r':\s*(.*?)(?=^\S|\Z)', header,
                      re.MULTILINE | re.DOTALL)
    if not match:
        return ''
    value = ' '.join(match.group(1).strip().split())
    if value.startswith(('>-', '|-', '>', '|')):
        value = value.lstrip('>|- ').strip()
    if len(value) > 1 and value[0] == value[-1] and value[0] in "\"'":
        value = value[1:-1]
    return value


def skill_metadata(path):
    # Only the header is needed, never the procedural body or credentials.
    with path.open(encoding='utf-8-sig') as stream:
        if stream.readline().strip() != '---':
            return None
        header = ''
        for line in stream:
            if line.strip() == '---':
                break
            header += line
            if len(header) > 16384:
                return None
        else:
            return None
    name, description = field(header, 'name'), field(header, 'description')
    if not name or not description:
        return None
    return {'kind': 'skill', 'name': name, 'description': description,
            'path': str(path.resolve())}


def build(roots):
    entries, seen = [], set()
    for root in roots:
        root = Path(root)
        if not root.is_dir():
            raise ValueError('Root not found: ' + str(root))
        for folder, dirs, files in os.walk(root, followlinks=False):
            dirs[:] = sorted(d for d in dirs if d not in {
                '.git', 'node_modules', 'references', 'assets', '__pycache__'
            } and not (Path(folder) / d).is_symlink()
              and not getattr(Path(folder) / d, 'is_junction', lambda: False)())
            for name in sorted(files):
                path = Path(folder) / name
                if path.is_symlink() or str(path.resolve()) in seen:
                    continue
                item = None
                if name == 'SKILL.md':
                    item = skill_metadata(path)
                elif path.suffix == '.md' and path.parent.name == 'agents':
                    item = skill_metadata(path)
                    if item:
                        item['kind'] = 'agent-definition'
                elif path.suffix == '.toml':
                    # tomllib never executes instructions; Python 3.11+ for agent files.
                    try:
                        import tomllib
                        data = tomllib.loads(path.read_text(encoding='utf-8-sig'))
                    except (ImportError, ValueError):
                        continue
                    if isinstance(data.get('name'), str) and isinstance(data.get('description'), str):
                        item = {'kind': 'agent-definition', 'name': data['name'],
                                'description': data['description'], 'path': str(path.resolve())}
                if item:
                    entries.append(item)
                    seen.add(str(path.resolve()))
    return {'schema_version': 1, 'scope': 'local_metadata_snapshot_not_runtime_capabilities',
            'entries': sorted(entries, key=lambda e: (e['kind'], e['name'], e['path']))}


ALIASES = {
    'ahorrar': 'coste costo contexto tokens economy',
    'barato': 'coste costo economy',
    'bibliotecario': 'seleccionar skills enrutar capacidades',
    'after': 'adobe after effects mcp integration',
    'seguridad': 'security seguridad',
    'excel': 'spreadsheet spreadsheets excel',
    'diapositivas': 'presentations slides',
    'animacion': 'motion animation gsap',
    'investigar': 'research investigacion',
    'web': 'web frontend nextjs',
    'redactar': 'copywriting',
}

# Function words are not evidence of a pertinent capability. Without filtering,
# a generic request such as "quiero que me ayudes con esto" ranks unrelated
# descriptions merely because they contain "que" or "para".
STOP_WORDS = set('''a al algo ante como con de del el ella ello en entre es esa ese
esto esta este favor hay la las lo los me mi mis no o para pero por porque que
quiero se sin solo su sus te tengo tu un una unas uno unos y ayudes ayuda
the a an and are as at be by can could for from have help i in is it me my of
on or please that the their this to use want we with you your'''.split())


def indexed_terms(value):
    identifiers = set(re.findall(r'[\w-]+', normalize(value)))
    return identifiers | {part for token in identifiers
                          for part in re.split(r'[-_]+', token) if part}


def find(catalog, query, limit=5):
    query_identifiers = set(re.findall(r'[\w-]+', normalize(query)))
    words = query_identifiers - STOP_WORDS
    expanded = set(words)
    for word in words:
        expanded.update(ALIASES.get(word, '').split())
    ranked = []
    for entry in catalog['entries']:
        name = normalize(entry['name'])
        name_terms = indexed_terms(entry['name'])
        description_terms = indexed_terms(entry['description'])
        score = sum((4 if word in name_terms else 1 if word in description_terms else 0)
                    for word in expanded if len(word) > 2)
        if name in query_identifiers:
            score += 20
        if score:
            ranked.append((score, entry))
    return [dict(entry, retrieval_score=score) for score, entry in
            sorted(ranked, key=lambda x: (-x[0], x[1]['name'], x[1]['path']))[:limit]]


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    create = sub.add_parser('build')
    create.add_argument('--root', action='append', required=True)
    create.add_argument('--output', required=True)
    for name in ('find', 'check'):
        cmd = sub.add_parser(name)
        cmd.add_argument('--catalog', required=True)
        if name == 'find':
            cmd.add_argument('query')
            cmd.add_argument('--limit', type=int, default=5, choices=range(1, 11))
    args = parser.parse_args()
    if args.command == 'build':
        catalog = build(args.root)
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        result = {'status': 'BUILT', 'entries': len(catalog['entries']), 'output': str(output.resolve())}
    else:
        catalog = json.loads(Path(args.catalog).read_text(encoding='utf-8'))
        if args.command == 'find':
            result = {'status': 'CANDIDATES_ONLY', 'candidates': find(catalog, args.query, args.limit)}
        else:
            missing = [e['path'] for e in catalog['entries'] if not Path(e['path']).is_file()]
            result = {'status': 'STALE' if missing else 'PATHS_EXIST',
                      'entries': len(catalog['entries']), 'missing': missing}
            if missing:
                sys.exit(json.dumps(result, ensure_ascii=False))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
