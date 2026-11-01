import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills" / "altiora-runtime-bridge" / "scripts" / "check_runtimes.py"


def skill(root, name, description="Usar para una tarea concreta.", folder=None, extra=""):
    d = root / (folder or name)
    d.mkdir(parents=True, exist_ok=True)
    (d / "SKILL.md").write_bytes(f"---\nname: {name}\ndescription: {description}\n---\n\n# {name}\n{extra}".encode("utf-8"))
    return d


class RuntimeCheckTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.project = base / "proyecto"
        self.home = base / "home"
        for p in [".claude/skills", ".agents/skills"]:
            (self.project / p).mkdir(parents=True)
        for p in [".claude/skills", ".codex/skills"]:
            (self.home / p).mkdir(parents=True)

    def tearDown(self):
        self.tmp.cleanup()

    def run_check(self, *extra):
        r = subprocess.run([sys.executable, str(SCRIPT), "--target", str(self.project), "--home", str(self.home), "--json", *extra],
                           capture_output=True, text=True, encoding="utf-8")
        return r.returncode, json.loads(r.stdout)

    def codes(self, report):
        return {(f["code"], f.get("skill")) for f in report["findings"]}

    def test_clean_project_passes(self):
        skill(self.project / ".claude/skills", "uno")
        skill(self.project / ".agents/skills", "uno")
        code, report = self.run_check()
        self.assertEqual(code, 0)
        self.assertEqual(report["status"], "PASS")

    def test_same_name_different_content_in_one_runtime_warns(self):
        skill(self.project / ".agents/skills", "director", "Version del proyecto.")
        skill(self.home / ".codex/skills", "director", "Version personal distinta.")
        code, report = self.run_check()
        self.assertEqual(code, 0)
        self.assertIn(("DUPLICATE_NAME", "director"), self.codes(report))
        dup = [f for f in report["findings"] if f["code"] == "DUPLICATE_NAME"][0]
        self.assertEqual(dup["runtime"], "codex")
        code, _ = self.run_check("--strict")
        self.assertEqual(code, 1)

    def test_identical_copies_are_not_duplicates(self):
        skill(self.project / ".agents/skills", "igual", "Misma version.")
        skill(self.home / ".codex/skills", "igual", "Misma version.")
        _, report = self.run_check()
        self.assertNotIn(("DUPLICATE_NAME", "igual"), self.codes(report))

    def test_instruction_reference_not_discoverable(self):
        skill(self.home / ".codex/skills", "meta-ads-growth")
        (self.project / "CLAUDE.md").write_text("Usar `meta-ads-growth` para anuncios.\n", encoding="utf-8")
        _, report = self.run_check()
        f = [f for f in report["findings"] if f["code"] == "REFERENCED_NOT_DISCOVERABLE"]
        self.assertEqual([(x["runtime"], x["skill"]) for x in f], [("claude", "meta-ads-growth")])
        skill(self.project / ".claude/skills", "meta-ads-growth")
        _, report = self.run_check()
        self.assertNotIn(("REFERENCED_NOT_DISCOVERABLE", "meta-ads-growth"), self.codes(report))

    def test_bad_frontmatter_is_an_error(self):
        skill(self.project / ".claude/skills", "otro-nombre", folder="carpeta")
        skill(self.project / ".claude/skills", "larga", "x" * 1025)
        (self.project / ".claude/skills/vacia").mkdir()
        (self.project / ".claude/skills/vacia/SKILL.md").write_text("# sin frontmatter\n", encoding="utf-8")
        code, report = self.run_check()
        self.assertEqual(code, 1)
        found = self.codes(report)
        self.assertIn(("NAME_MISMATCH", "otro-nombre"), found)
        self.assertIn(("DESCRIPTION_TOO_LONG", "larga"), found)
        self.assertIn(("NO_FRONTMATTER", "vacia"), found)

    def test_mixed_line_endings_warn(self):
        d = skill(self.project / ".claude/skills", "mixta")
        (d / "notas.md").write_bytes(b"linea uno\r\nlinea dos\nlinea tres\r\n")
        _, report = self.run_check()
        self.assertIn(("MIXED_LINE_ENDINGS", "mixta"), self.codes(report))

    def test_missing_roots_are_reported_not_fatal(self):
        empty = Path(self.tmp.name) / "vacio"
        empty.mkdir()
        r = subprocess.run([sys.executable, str(SCRIPT), "--target", str(empty), "--home", str(empty), "--json"],
                           capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(json.loads(r.stdout)["skills_by_runtime"], {"claude": 0, "codex": 0, "antigravity": 0})


if __name__ == "__main__":
    unittest.main(verbosity=2)
