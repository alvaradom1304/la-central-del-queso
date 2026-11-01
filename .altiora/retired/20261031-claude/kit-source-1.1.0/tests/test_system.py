import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("manage", ROOT / "scripts/manage.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class SystemTests(unittest.TestCase):
    def setUp(self):
        # Keep fixtures inside the workspace: Windows sandbox temp can forbid writes.
        self.test_root = (Path.cwd() / "work/altiora-system-tests").resolve()
        self.test_root.mkdir(parents=True, exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(prefix="altiora test ", dir=self.test_root)
        self.project = Path(self.temp.name)

    def tearDown(self):
        self.assertTrue(self.project.resolve().is_relative_to(self.test_root))
        self.temp.cleanup()

    def install(self):
        changes, reused = m.plan_install(self.project)
        return m.apply(self.project, changes), reused

    def hook(self, runtime, payload, event="PreToolUse"):
        result = subprocess.run([sys.executable, str(ROOT / "scripts/guard.py"), "--runtime", runtime,
                                 "--project", str(self.project), "--event", event], input=json.dumps(payload),
                                text=True, encoding="utf-8", capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout)

    def test_preview_does_not_write(self):
        changes, _ = m.plan_install(self.project)
        self.assertGreater(len(changes), 20)
        self.assertEqual(list(self.project.iterdir()), [])

    def test_skill_frontmatter_and_discriminating_descriptions(self):
        import re
        for skill in (ROOT / "skills").iterdir():
            text = (skill / "SKILL.md").read_text(encoding="utf-8")
            header = text.split("---", 2)[1]
            fields = dict(line.split(": ", 1) for line in header.strip().splitlines())
            self.assertEqual(set(fields), {"name", "description"})
            self.assertEqual(fields["name"], skill.name)
            self.assertTrue(re.fullmatch(r"[a-z0-9-]{1,64}", fields["name"]))
            self.assertLess(len(fields["description"]), 500)
            self.assertNotIn(": ", fields["description"])
            self.assertNotIn("TODO", text)

    def test_install_doctor_and_idempotence(self):
        self.install()
        self.assertEqual(m.doctor(self.project)["status"], "PASSED")
        changes, _ = m.plan_install(self.project)
        self.assertEqual(changes, {})

    def test_existing_rules_settings_and_skills_preserved(self):
        (self.project / "AGENTS.md").write_text("Regla propia: conservar.\n", encoding="utf-8")
        skill = self.project / ".claude/skills/altiora-session-handoff/SKILL.md"
        skill.parent.mkdir(parents=True)
        skill.write_text("Mi variante local", encoding="utf-8")
        settings = self.project / ".claude/settings.json"
        original = {"permissions": {"deny": ["Bash(git push *)"]}, "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo own"}]}]}}
        settings.write_text(json.dumps(original), encoding="utf-8")
        _, reused = self.install()
        self.assertIn(".claude/skills/altiora-session-handoff", reused)
        self.assertEqual(skill.read_text(encoding="utf-8"), "Mi variante local")
        self.assertTrue((self.project / "AGENTS.md").read_text(encoding="utf-8").startswith("Regla propia: conservar."))
        installed = m.load(settings)
        self.assertEqual(installed["permissions"], original["permissions"])
        self.assertEqual(installed["hooks"]["Stop"], original["hooks"]["Stop"])

    def test_invalid_config_stops_before_any_write(self):
        settings = self.project / ".claude/settings.json"
        settings.parent.mkdir()
        settings.write_text("not json")
        with self.assertRaises(ValueError):
            self.install()
        self.assertFalse((self.project / "AGENTS.md").exists())

    def test_rollback_restores_original_rules_and_removes_new_files(self):
        original = b"Original\r\nwith bytes\r\n"
        (self.project / "CLAUDE.md").write_bytes(original)
        tx, _ = self.install()
        m.rollback(self.project, tx, True)
        self.assertEqual((self.project / "CLAUDE.md").read_bytes(), original)
        self.assertFalse((self.project / "AGENTS.md").exists())
        self.assertFalse((self.project / ".codex/hooks.json").exists())

    def test_rollback_refuses_to_overwrite_new_user_work(self):
        tx, _ = self.install()
        (self.project / "AGENTS.md").write_text("Trabajo posterior")
        with self.assertRaises(ValueError):
            m.rollback(self.project, tx, True)
        self.assertEqual((self.project / "AGENTS.md").read_text(), "Trabajo posterior")
        self.assertTrue((self.project / ".codex/hooks.json").exists())

    def test_modified_managed_payload_refused(self):
        self.install()
        path = self.project / ".altiora/system/core/constitution.md"
        path.write_text("custom local")
        with self.assertRaises(ValueError):
            m.plan_install(self.project)
        self.assertEqual(m.doctor(self.project)["status"], "FAILED")

    def test_direct_sensitive_writes_denied_for_all_protocols(self):
        self.install()
        for runtime in ["codex", "claude"]:
            value = self.hook(runtime, {"tool_name": "Write", "tool_input": {"file_path": ".env"}})
            self.assertEqual(value["hookSpecificOutput"]["permissionDecision"], "deny")
        value = self.hook("antigravity", {"toolCall": {"name": "replace_file_content", "args": {"TargetFile": "config/private.pem"}}})
        self.assertEqual(value["decision"], "deny")

    def test_normal_edits_do_not_grant_extra_permissions(self):
        self.install()
        for path in ["src/app.py", ".env.example"]:
            value = self.hook("claude", {"tool_name": "Write", "tool_input": {"file_path": path}})
            self.assertEqual(value, {})
        value = self.hook("antigravity", {"toolCall": {"name": "view_file", "args": {"AbsolutePath": ".env"}}})
        self.assertEqual(value, {"decision": "allow"})

    def test_patch_move_delete_and_windows_paths(self):
        self.install()
        for patch in ["*** Update File: .env\n", "*** Delete File: cert.pem\n", "*** Update File: x.txt\n*** Move to: .env\n", "*** Add File: C:\\project\\.env.local\n"]:
            value = self.hook("codex", {"tool_name": "apply_patch", "tool_input": {"command": patch}})
            self.assertEqual(value["hookSpecificOutput"]["permissionDecision"], "deny")

    def test_shell_is_explicitly_outside_guard_coverage(self):
        self.install()
        self.assertEqual(self.hook("codex", {"tool_name": "Bash", "tool_input": {"command": "echo x > .env"}}), {})

    def test_session_context_contracts(self):
        self.install()
        for runtime in ["codex", "claude", "antigravity"]:
            value = self.hook(runtime, {}, "SessionStart")
            self.assertIn(".altiora/handoff.json", json.dumps(value))
            self.assertIn("injectSteps" if runtime == "antigravity" else "hookSpecificOutput", value)

    def test_generated_hook_command_runs_with_spaces_in_project_path(self):
        self.install()
        for runtime in ["codex", "claude", "antigravity"]:
            result = subprocess.run(m.command(self.project, runtime, "SessionStart"), shell=True,
                                    input="{}", text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(".altiora/handoff.json", result.stdout)

    def test_malformed_hook_input_denies_without_echoing_secrets(self):
        self.install()
        policy = self.project / ".altiora/policy.json"
        policy.write_text("invalid")
        value = self.hook("codex", {"tool_input": {"secret": "SECRET_FIXTURE_123"}})
        self.assertEqual(value["hookSpecificOutput"]["permissionDecision"], "deny")
        self.assertNotIn("SECRET_FIXTURE_123", json.dumps(value))
        policy.write_text('{"protected_names":".env","allowed_names":[]}')
        value = self.hook("antigravity", {"toolCall": {"name": "write_to_file", "args": {"TargetFile": ".env"}}})
        self.assertEqual(value["decision"], "deny")

    def test_path_traversal_rejected(self):
        with self.assertRaises(ValueError):
            m.safe(self.project, "../outside.txt")

    def test_role_toml_parses(self):
        import tomllib
        self.install()
        for path in (self.project / ".codex/agents").glob("*.toml"):
            role = tomllib.loads(path.read_text())
            self.assertTrue(role["developer_instructions"])
            self.assertNotIn("model", role)

    def test_role_front_matter_sets_full_description_and_tools(self):
        self.install()
        for role in (ROOT / "roles").glob("*.md"):
            desc, tools, text = m.role_metadata(role)
            agent = (self.project / ".claude/agents" / (role.stem + ".md")).read_text(encoding="utf-8")
            self.assertIn("description: " + json.dumps(desc, ensure_ascii=False), agent)
            self.assertFalse(text.startswith("---"))
            if tools == "inherit":
                self.assertNotIn("\ntools:", agent)
            else:
                self.assertIn("tools: " + tools, agent)

    def test_role_without_front_matter_keeps_legacy_tools_and_whole_words(self):
        role = self.project / "altiora-review.md"
        role.write_text("# Revisión\n" + "palabra " * 300 + "\n", encoding="utf-8")
        desc, tools, _ = m.role_metadata(role)
        self.assertEqual(tools, "Read, Glob, Grep")
        self.assertLessEqual(len(desc), 1024)
        self.assertTrue(desc.endswith("palabra"))

    def test_unchanged_payload_is_recorded_in_receipt(self):
        self.install()
        receipt_path = self.project / ".altiora/installation.json"
        receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
        receipt["managed"].pop(".claude/agents/altiora-review.md")
        receipt_path.write_bytes(m.encoded(receipt))
        changes, _ = m.plan_install(self.project)
        self.assertEqual(list(changes), [".altiora/installation.json"])
        m.apply(self.project, changes)
        self.assertIn(".claude/agents/altiora-review.md", json.loads(receipt_path.read_text(encoding="utf-8"))["managed"])

    def test_adopt_records_reviewed_edit_and_rolls_back(self):
        self.install()
        path = self.project / ".claude/agents/altiora-review.md"
        path.write_text(path.read_text(encoding="utf-8") + "\nNota local revisada.\n", encoding="utf-8")
        self.assertEqual(m.doctor(self.project)["status"], "FAILED")
        changes, adopted = m.plan_adopt(self.project, [".claude/agents/altiora-review.md"])
        self.assertEqual(list(adopted), [".claude/agents/altiora-review.md"])
        tx = m.apply(self.project, changes)
        self.assertEqual(m.doctor(self.project)["status"], "PASSED")
        m.rollback(self.project, tx, True)
        self.assertEqual(m.doctor(self.project)["status"], "FAILED")
        with self.assertRaises(ValueError):
            m.plan_adopt(self.project, ["notes/unmanaged.md"])

    def test_selected_library_import_preserves_supporting_files(self):
        lib = self.project / "library"
        skill = lib / "own-skill"
        (skill / "references").mkdir(parents=True)
        (skill / "SKILL.md").write_text("---\nname: own-skill\ndescription: Specific task\n---\nUse references/data.json")
        (skill / "references/data.json").write_text('{"x":1}')
        changes, _ = m.plan_install(self.project, lib, ["own-skill"])
        m.apply(self.project, changes)
        for root in [".claude", ".agents"]:
            self.assertTrue((self.project / root / "skills/own-skill/references/data.json").exists())
        with self.assertRaises(ValueError):
            m.plan_install(self.project, lib, ["../invalid"])

    def handoff(self):
        value = {"schema_version": "1.0.0", "task_id": "demo", "objective": "Continue task",
                 "updated_at": "2026-10-18T15:00:00-06:00", "source_runtime": "codex", "status": "in_progress",
                 "authorized_scope": ["local edits"], "git_revision": None, "decisions": [],
                 "changed_files": ["src/app.py"], "tests": [], "pending": ["test behavior"],
                 "next_action": "Run the agreed test", "limitations": []}
        return value

    def save_handoff(self, value):
        path = self.project / ".altiora/handoff.json"
        path.parent.mkdir(exist_ok=True)
        path.write_bytes(m.encoded(value))

    def test_valid_handoff_and_missing_input(self):
        self.save_handoff(self.handoff())
        self.assertEqual(m.handoff_check(self.project), [])
        value = self.handoff()
        del value["authorized_scope"]
        self.save_handoff(value)
        self.assertTrue(m.handoff_check(self.project))

    def test_handoff_fake_test_evidence_and_complete_pending(self):
        value = self.handoff()
        value["tests"] = [{"command": "pytest", "status": "passed", "evidence": "", "executed_at": None}]
        value["status"] = "complete"
        self.save_handoff(value)
        self.assertGreaterEqual(len(m.handoff_check(self.project)), 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
