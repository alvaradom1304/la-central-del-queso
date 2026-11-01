"""Verifica el inventario de skills que ve cada runtime (Claude Code, Codex, Antigravity).

Solo lee archivos y nunca modifica nada. Detecta:
  NO_FRONTMATTER / NO_NAME / NO_DESCRIPTION / NAME_MISMATCH / DESCRIPTION_TOO_LONG  (error)
  DUPLICATE_NAME: mismo nombre con contenido distinto en un mismo runtime           (aviso)
  REFERENCED_NOT_DISCOVERABLE: skill citada en las instrucciones del runtime
      (CLAUDE.md, AGENTS.md, GEMINI.md) que ese runtime no descubre               (aviso)
  MIXED_LINE_ENDINGS: archivo de texto con CRLF y LF mezclados                     (aviso)

Exit 0 si no hay errores (o sin avisos con --strict); 1 en otro caso.
Un PASS estructural no prueba que el cliente cargue la skill: eso se verifica en una sesión.
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

MAX_DESCRIPTION = 1024
TEXT_SUFFIXES = {".md", ".py", ".json", ".toml", ".yaml", ".yml", ".txt", ".js", ".ts", ".sh"}
INSTRUCTION_FILES = {"claude": "CLAUDE.md", "codex": "AGENTS.md", "antigravity": "GEMINI.md"}


def roots(target, home):
    return {
        "claude": [target / ".claude/skills", home / ".claude/skills"],
        "codex": [target / ".agents/skills", home / ".codex/skills"],
        "antigravity": [target / ".agents/skills"],
    }


def frontmatter(text):
    m = re.match(r"---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
    if not m:
        return None
    fields = {}
    for key in ("name", "description"):
        f = re.search(rf"^{key}:\s*(.*?)\s*$", m.group(1), re.M)
        if f:
            value = f.group(1)
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            fields[key] = value
    return fields


def scan_root(root, findings):
    skills = {}
    if not root.is_dir():
        return skills
    for skill_md in sorted(root.glob("*/SKILL.md")):
        folder = skill_md.parent
        text = skill_md.read_bytes().decode("utf-8", errors="replace")
        meta = frontmatter(text)
        where = {"path": skill_md.as_posix()}
        if meta is None:
            findings.append({"level": "error", "code": "NO_FRONTMATTER", "skill": folder.name, **where})
            continue
        name = meta.get("name")
        if not name:
            findings.append({"level": "error", "code": "NO_NAME", "skill": folder.name, **where})
            continue
        if name != folder.name:
            findings.append({"level": "error", "code": "NAME_MISMATCH", "skill": name, "folder": folder.name, **where})
        desc = meta.get("description", "")
        if not desc:
            findings.append({"level": "error", "code": "NO_DESCRIPTION", "skill": name, **where})
        elif len(desc) > MAX_DESCRIPTION:
            findings.append({"level": "error", "code": "DESCRIPTION_TOO_LONG", "skill": name, "length": len(desc), **where})
        for f in sorted(folder.rglob("*")):
            if f.is_file() and f.suffix.lower() in TEXT_SUFFIXES and "__pycache__" not in f.parts:
                data = f.read_bytes()
                crlf = data.count(b"\r\n")
                if crlf and data.count(b"\n") > crlf:
                    findings.append({"level": "warning", "code": "MIXED_LINE_ENDINGS", "skill": name, "path": f.as_posix()})
        skills[name] = {"path": skill_md.as_posix(), "sha256": hashlib.sha256(text.replace("\r\n", "\n").encode("utf-8")).hexdigest()}
    return skills


def check(target, home):
    findings = []
    per_root = {}
    by_runtime = {}
    for runtime, paths in roots(target, home).items():
        seen = {}
        for root in paths:
            key = root.as_posix()
            if key not in per_root:
                per_root[key] = scan_root(root, findings)
            for name, info in per_root[key].items():
                seen.setdefault(name, []).append(info)
        by_runtime[runtime] = seen
        for name, copies in seen.items():
            if len({c["sha256"] for c in copies}) > 1:
                findings.append({"level": "warning", "code": "DUPLICATE_NAME", "runtime": runtime, "skill": name,
                                 "paths": [c["path"] for c in copies]})

    known = set().union(*[set(s) for s in per_root.values()]) if per_root else set()
    for runtime, filename in INSTRUCTION_FILES.items():
        path = target / filename
        if not path.is_file():
            continue
        referenced = set(re.findall(r"`([a-z0-9][a-z0-9-]*[a-z0-9])`", path.read_text(encoding="utf-8", errors="replace")))
        for name in sorted(referenced & known):
            if name not in by_runtime[runtime]:
                findings.append({"level": "warning", "code": "REFERENCED_NOT_DISCOVERABLE", "runtime": runtime,
                                 "skill": name, "instructions": path.as_posix()})

    # Una misma raíz compartida por dos runtimes produce el mismo hallazgo de archivo dos veces.
    unique, seen_keys = [], set()
    for f in findings:
        key = json.dumps(f, sort_keys=True)
        if key not in seen_keys:
            seen_keys.add(key)
            unique.append(f)
    errors = sum(f["level"] == "error" for f in unique)
    warnings = sum(f["level"] == "warning" for f in unique)
    return {
        "status": "FAIL" if errors else ("WARN" if warnings else "PASS"),
        "errors": errors,
        "warnings": warnings,
        "skills_by_runtime": {r: len(s) for r, s in by_runtime.items()},
        "findings": unique,
        "limitation": "Comprobación estructural; el descubrimiento real se verifica abriendo una sesión del cliente.",
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--target", default=".", help="Raíz del proyecto")
    parser.add_argument("--home", default=str(Path.home()), help="Carpeta personal (skills de usuario)")
    parser.add_argument("--json", action="store_true", help="Salida JSON completa")
    parser.add_argument("--strict", action="store_true", help="Los avisos también fallan")
    args = parser.parse_args()
    report = check(Path(args.target).resolve(), Path(args.home).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"{report['status']}: {report['errors']} errores, {report['warnings']} avisos · skills {report['skills_by_runtime']}")
        for f in report["findings"]:
            extra = f.get("runtime", "")
            print(f"  [{f['level']}] {f['code']} {f.get('skill', '')} {extra} {f.get('path', f.get('paths', f.get('instructions', '')))}")
    failed = report["errors"] or (args.strict and report["warnings"])
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
