"""Native hook adapter. No network, transcript access, shell execution or logging."""
import argparse
import fnmatch
import json
import re
import sys
from pathlib import Path


def write_paths(runtime, payload):
    """Only parse known file-write protocols; shell strings are deliberately excluded."""
    if runtime == "antigravity":
        call = payload.get("toolCall", {})
        name, args = call.get("name"), call.get("args", {})
        if name in {"write_to_file", "replace_file_content", "multi_replace_file_content"}:
            return [args.get("TargetFile", "")]
        return []
    name, args = payload.get("tool_name"), payload.get("tool_input", {})
    if name in {"Write", "Edit", "MultiEdit", "NotebookEdit"}:
        return [args.get("file_path", args.get("notebook_path", ""))]
    if name == "apply_patch":
        patch = args if isinstance(args, str) else args.get("command", args.get("patch", ""))
        return re.findall(r"^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$", patch, re.M)
    return []


def protected(path, project, policy):
    if not isinstance(path, str) or not path:
        return False
    # Match basenames, including Windows paths when fixtures run on another OS.
    candidate = Path(path.replace("\\", "/"))
    if not candidate.is_absolute():
        candidate = project / candidate
    name = candidate.resolve().name.lower()
    allowed = any(fnmatch.fnmatchcase(name, p.lower()) for p in policy["allowed_names"])
    return not allowed and any(fnmatch.fnmatchcase(name, p.lower()) for p in policy["protected_names"])


def response(runtime, event, reason=None):
    if event == "SessionStart":
        context = ("Altiora Agent System: leer .altiora/system/core/constitution.md y el contexto "
                   ".altiora/project.json cuando corresponda. Si existe .altiora/handoff.json, "
                   "contrastar su estado con el encargo actual. Seleccionar skills bajo demanda.")
        if runtime == "antigravity":
            return {"injectSteps": [{"systemMessage": {"systemMessage": context}}]}
        return {"hookSpecificOutput": {"hookEventName": event, "additionalContext": context}}
    if runtime == "antigravity":
        return {"decision": "deny", "reason": reason} if reason else {"decision": "allow"}
    if reason:
        return {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny",
                                       "permissionDecisionReason": reason}}
    return {}  # No approval grant: normal host permissions still apply.


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--runtime", choices=["codex", "claude", "antigravity"], required=True)
    p.add_argument("--project", type=Path, required=True)
    p.add_argument("--event", choices=["SessionStart", "PreToolUse"], required=True)
    a = p.parse_args()
    try:
        payload = json.load(sys.stdin)
        if not isinstance(payload, dict):
            raise ValueError("Hook payload must be an object")
        policy = json.loads((a.project / ".altiora/policy.json").read_text(encoding="utf-8-sig"))
        for field in ["protected_names", "allowed_names"]:
            if not isinstance(policy.get(field), list) or not all(isinstance(x, str) and x for x in policy[field]):
                raise ValueError("Policy patterns must be lists of nonempty strings")
        paths = write_paths(a.runtime, payload) if a.event == "PreToolUse" else []
        denied = any(protected(path, a.project, policy) for path in paths)
        reason = "Escritura directa a archivo sensible protegida por .altiora/policy.json." if denied else None
        print(json.dumps(response(a.runtime, a.event, reason), ensure_ascii=True))
        return 0
    except (ValueError, TypeError, KeyError, AttributeError, OSError) as exc:
        # Never echo the input payload: it may contain credentials.
        message = "Altiora: entrada o politica de hook invalida; revisar configuracion."
        if a.event == "PreToolUse":
            print(json.dumps(response(a.runtime, a.event, message)))
            return 0
        print(message, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
