"""Create or verify a SHA-256 manifest and a portable ZIP; no network access."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def files():
    return sorted(p for p in ROOT.rglob("*") if p.is_file() and "__pycache__" not in p.parts
                  and p.name != "manifest.json" and p.suffix not in [".pyc", ".zip"])


def manifest():
    return {"name": "altiora-agent-system", "version": "1.1.0", "release_date": "2026-10-31",
            "distribution": "portable-project-kit", "native_marketplace_plugin": False,
            "maturity": "EXPERIMENTAL", "python": ">=3.11", "external_dependencies": [],
            "files": {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in files()}}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--verify", action="store_true")
    a = p.parse_args()
    path = ROOT / "manifest.json"
    current = manifest()
    if a.verify:
        saved = json.loads(path.read_text(encoding="utf-8"))
        if saved != current:
            raise SystemExit("FAILED: manifiesto no coincide con los archivos actuales")
        print(json.dumps({"status": "PASSED", "files": len(current["files"])}))
        return
    path.write_text(json.dumps(current, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    destination = ROOT.parent / f"altiora-agent-system-{current['version']}.zip"
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for source in files() + [path]:
            archive.write(source, ROOT.name + "/" + source.relative_to(ROOT).as_posix())
    checksum = hashlib.sha256(destination.read_bytes()).hexdigest()
    destination.with_suffix(".zip.sha256").write_text(checksum + "  " + destination.name + "\n", encoding="ascii")
    print(json.dumps({"status": "PACKAGED", "files": len(current["files"]), "zip": str(destination), "sha256": checksum}))


if __name__ == "__main__":
    main()
