"""Crea y verifica manifiestos SHA-256 de una entrega de Altiora.

Sirve para comprobar que lo probado es lo entregado. Usa el mismo formato que
docs/altiora-business/PILOT-SOURCE-MANIFEST.json (root + files) y solo la
biblioteca estándar. Nunca escribe dentro del proyecto verificado.

  crear     --root R --salida M.json RUTA...   (archivos o carpetas relativas a R)
  verificar --manifiesto M.json [--root R]     (exit 0 = PASS, 1 = FAIL)
"""
import argparse
import datetime
import hashlib
import json
import sys
from pathlib import Path

IGNORADOS = {'.git', 'node_modules', '.next', '__pycache__', '.venv', 'dist', 'build', '.turbo'}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for bloque in iter(lambda: f.read(1 << 20), b''):
            h.update(bloque)
    return h.hexdigest()


def recorrer(root, rutas):
    for ruta in rutas:
        p = (root / ruta).resolve()
        if root not in p.parents and p != root:
            raise SystemExit(f'ERROR: {ruta} queda fuera de --root')
        if p.is_file():
            yield p
        elif p.is_dir():
            for f in sorted(p.rglob('*')):
                if f.is_file() and not IGNORADOS.intersection(f.relative_to(root).parts):
                    yield f
        else:
            raise SystemExit(f'ERROR: no existe {ruta}')


def crear(args):
    root = Path(args.root).resolve()
    salida = Path(args.salida).resolve()
    if root == salida or root in salida.parents:
        raise SystemExit('ERROR: --salida no puede estar dentro del proyecto verificado')
    files = {f.relative_to(root).as_posix(): sha256(f) for f in recorrer(root, args.rutas)}
    manifiesto = {
        'schema_version': 1,
        'observed_on': datetime.date.today().isoformat(),
        'root': root.as_posix(),
        'method': 'SHA-256 de archivos; no acredita ejecución, despliegue ni derechos',
        'files': files,
    }
    salida.write_text(json.dumps(manifiesto, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': 'CREATED', 'files': len(files), 'output': salida.as_posix()}, ensure_ascii=False))
    return 0


def verificar(args):
    manifiesto = json.loads(Path(args.manifiesto).read_text(encoding='utf-8'))
    root = Path(args.root or manifiesto['root'])
    diferencias = []
    for rel, esperado in manifiesto['files'].items():
        p = root / rel
        if not p.is_file():
            diferencias.append({'file': rel, 'issue': 'MISSING'})
        elif sha256(p) != esperado:
            diferencias.append({'file': rel, 'issue': 'CHANGED'})
    status = 'PASS' if not diferencias else 'FAIL'
    print(json.dumps({'status': status, 'checked': len(manifiesto['files']), 'differences': diferencias,
                      'root': root.as_posix(), 'verified_on': datetime.date.today().isoformat()},
                     ensure_ascii=False, indent=2))
    return 0 if status == 'PASS' else 1


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='command', required=True)
    c = sub.add_parser('crear')
    c.add_argument('--root', required=True)
    c.add_argument('--salida', required=True)
    c.add_argument('rutas', nargs='+')
    v = sub.add_parser('verificar')
    v.add_argument('--manifiesto', required=True)
    v.add_argument('--root')
    args = parser.parse_args()
    return crear(args) if args.command == 'crear' else verificar(args)


if __name__ == '__main__':
    sys.exit(main())
