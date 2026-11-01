#!/usr/bin/env python3
"""
The Council — Multi-Agent Debate Runner
Calls the Anthropic API 5 times per round (different system prompts) + 1 judge call.
The moderator is a plain Python class with no LLM involvement.
"""

import sys
import json
import os
import subprocess
import datetime

MODEL = "claude-sonnet-4-6"

# Two backends:
#   1. Anthropic SDK direct (fast, parallel-friendly) — used when ANTHROPIC_API_KEY is set
#   2. `claude -p` CLI (portable, works with provider-managed auth from Claude Desktop/Code)
# Auto-detected at startup.
try:
    import anthropic
    _HAS_SDK = True
except ImportError:
    _HAS_SDK = False

AGENT_PROMPTS = {
    "Visionary": (
        "You are The Visionary. You are optimistic, bold, creative, and future focused. "
        "You argue for what could become possible if the idea succeeds. "
        "You care about innovation, ambition, scale, and second order opportunities. "
        "Do not ignore risks, but focus more on upside and potential. "
        "Keep arguments clear, specific, and persuasive."
    ),
    "Skeptic": (
        "You are The Skeptic. You are sharp, critical, and difficult to convince. "
        "Your job is to find weak assumptions, hidden risks, vague claims, and overconfidence. "
        "You should challenge every major claim with logic and evidence. "
        "Do not be rude, but be intellectually aggressive. "
        "Keep arguments concise and specific."
    ),
    "Engineer": (
        "You are The Engineer. You care about whether the idea can actually be built. "
        "You focus on implementation, architecture, technical constraints, speed, reliability, and edge cases. "
        "You should turn abstract ideas into concrete systems. "
        "If an idea sounds good but is hard to build, explain exactly why. "
        "Prefer practical solutions over hype."
    ),
    "Economist": (
        "You are The Economist. You analyze incentives, costs, markets, adoption, and tradeoffs. "
        "You care about who benefits, who pays, what scales, and what fails economically. "
        "You should think in terms of opportunity cost, pricing, competition, and resource allocation. "
        "Avoid vague business language. Be precise."
    ),
    "Ethicist": (
        "You are The Ethicist. You care about human impact, fairness, safety, trust, and long term consequences. "
        "You should ask who might be harmed, who is excluded, and what misuse could happen. "
        "You are not anti technology, but you require responsible design. "
        "Make your arguments practical, not just moral."
    ),
}

AGENT_EMOJI = {
    "Visionary": "🔭",
    "Skeptic":   "🔍",
    "Engineer":  "⚙️",
    "Economist": "📊",
    "Ethicist":  "⚖️",
}

OPENING_ORDER   = ["Visionary", "Skeptic", "Engineer", "Economist", "Ethicist"]
CROSSFIRE_PAIRS = [
    ("Skeptic",   "Visionary"),
    ("Engineer",  "Skeptic"),
    ("Economist", "Engineer"),
    ("Ethicist",  "Economist"),
    ("Visionary", "Ethicist"),
]
FINAL_ORDER = OPENING_ORDER


def transcript_text(transcript: dict, up_to_round: int) -> str:
    """Format completed rounds into readable text for agent context."""
    lines = []
    for i, round_ in enumerate(transcript["rounds"]):
        if i >= up_to_round:
            break
        lines.append(f"\n=== {round_['name']} ===")
        for turn in round_["turns"]:
            emoji = AGENT_EMOJI.get(turn["agent"], "•")
            lines.append(f"\n{emoji} {turn['agent']}:\n{turn['argument']}")
    return "\n".join(lines)


class Client:
    """Unified client that talks to either the Anthropic SDK or the `claude -p` CLI."""

    def __init__(self):
        api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
        if api_key and _HAS_SDK:
            self.mode = "sdk"
            self._sdk = anthropic.Anthropic(api_key=api_key)
        else:
            # Verify the CLI is available
            try:
                subprocess.run(["claude", "--version"], capture_output=True, check=True, timeout=5)
            except (FileNotFoundError, subprocess.CalledProcessError, subprocess.TimeoutExpired):
                raise RuntimeError(
                    "Neither ANTHROPIC_API_KEY nor the `claude` CLI is available. "
                    "Set ANTHROPIC_API_KEY or install Claude Code."
                )
            self.mode = "cli"

    def call(self, system: str, user_prompt: str, max_tokens: int = 600) -> str:
        if self.mode == "sdk":
            response = self._sdk.messages.create(
                model=MODEL,
                max_tokens=max_tokens,
                system=system,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return response.content[0].text.strip()
        # CLI mode — uses the auth Claude Code is already using
        result = subprocess.run(
            ["claude", "-p", user_prompt, "--system-prompt", system, "--model", MODEL],
            capture_output=True,
            text=True,
            timeout=180,
        )
        if result.returncode != 0:
            raise RuntimeError(f"claude CLI failed: {result.stderr.strip()}")
        return result.stdout.strip()


def call_agent(client: Client, agent: str, user_prompt: str) -> str:
    return client.call(AGENT_PROMPTS[agent], user_prompt, max_tokens=600)


def call_judge(client: Client, topic: str, full_transcript: str) -> str:
    system = (
        "You are the Council Synthesizer. Five expert advisors have just debated a request, "
        "and your job is to produce the final deliverable they collectively earned — not "
        "commentary about the debate, but the actual thing the user asked for. "
        "If they asked for a decision, give them the decision. "
        "If they asked for a design, output the design. "
        "If they asked you to solve a problem, output the solution. "
        "If they asked for a plan, output the plan. "
        "Be concrete, specific, and complete enough that the user could act on it tomorrow. "
        "Do not hedge. Do not say 'it depends' without telling them what to do anyway. "
        "Cite specific arguments from the debate that shaped your output."
    )
    user_prompt = (
        f"Original request: {topic}\n\n"
        f"Full debate transcript:\n{full_transcript}\n\n"
        "Produce the final output in this exact format:\n\n"
        "## Debate Digest\n"
        "- 🔭 Visionary's strongest point: [one line]\n"
        "- 🔍 Skeptic's strongest point: [one line]\n"
        "- ⚙️ Engineer's strongest point: [one line]\n"
        "- 📊 Economist's strongest point: [one line]\n"
        "- ⚖️ Ethicist's strongest point: [one line]\n"
        "- **Central tension:** [the one disagreement that mattered most]\n\n"
        "## The Solution\n"
        "[The actual deliverable the user asked for. This is the part they came for, so make "
        "it substantive and specific. Use whatever sub-structure best fits the request:\n"
        " - For a *decision*: state the choice with branched logic and stopping rules\n"
        " - For a *design request*: output the design — components, flow, structure, key choices\n"
        " - For a *problem to solve*: give the solution as ordered, executable steps\n"
        " - For a *strategy*: list the strategy as concrete moves with sequencing\n"
        " - For an *idea evaluation*: output the refined idea, sharpened by the debate\n"
        "Make this section long and detailed enough to be actually usable. Bullets, tables, "
        "ordered steps, pseudo-code, specs — whatever fits.]\n\n"
        "## Why This Survives the Debate\n"
        "[2-4 sentences explaining how this solution answers the strongest objections raised. "
        "Name the agents whose concerns it addresses and how.]\n\n"
        "## Risks This Doesn't Eliminate\n"
        "[2-3 specific risks the debate surfaced that the solution can't fully neutralize. "
        "Be honest — don't pretend it's bulletproof.]\n\n"
        "## Next Concrete Action\n"
        "[One specific thing the user should do in the next 24-48 hours to move forward.]"
    )
    return client.call(system, user_prompt, max_tokens=4000)


class Moderator:
    """Silent orchestrator. No LLM. Controls turn order and transcript state."""

    def __init__(self, topic: str):
        self.topic = topic
        self.transcript: dict = {"topic": topic, "rounds": []}

    def run_opening(self, client: Client):
        print("\n## ROUND 1 — Opening Arguments\n")
        round_ = {"name": "Opening Arguments", "turns": []}
        for agent in OPENING_ORDER:
            prompt = (
                f"The debate topic is: {self.topic}\n\n"
                "Give your opening argument. Be specific and direct. 3-5 sentences."
            )
            print(f"### {AGENT_EMOJI[agent]} The {agent}")
            argument = call_agent(client, agent, prompt)
            print(argument + "\n")
            round_["turns"].append({"agent": agent, "argument": argument})
        self.transcript["rounds"].append(round_)

    def run_crossfire(self, client: Client):
        print("\n---\n\n## ROUND 2 — Crossfire\n")
        round_ = {"name": "Crossfire", "turns": []}
        context = transcript_text(self.transcript, up_to_round=1)
        for speaker, target in CROSSFIRE_PAIRS:
            target_arg = next(
                t["argument"] for t in self.transcript["rounds"][0]["turns"]
                if t["agent"] == target
            )
            prompt = (
                f"The debate topic is: {self.topic}\n\n"
                f"Here are the opening arguments:\n{context}\n\n"
                f"You are now responding directly to The {target}'s argument:\n\"{target_arg}\"\n\n"
                "Challenge, probe, or build on their specific claims. Be direct. 3-5 sentences."
            )
            label = f"The {speaker} → responding to The {target}"
            print(f"### {AGENT_EMOJI[speaker]} {label}")
            argument = call_agent(client, speaker, prompt)
            print(argument + "\n")
            round_["turns"].append({"agent": speaker, "argument": argument, "responding_to": target})
        self.transcript["rounds"].append(round_)

    def run_final(self, client: Client):
        print("\n---\n\n## ROUND 3 — Final Positions\n")
        round_ = {"name": "Final Positions", "turns": []}
        context = transcript_text(self.transcript, up_to_round=2)
        for agent in FINAL_ORDER:
            prompt = (
                f"The debate topic is: {self.topic}\n\n"
                f"Here is the full debate so far:\n{context}\n\n"
                "Give your final, strongest position. You've heard everyone — integrate what you've "
                "learned and state your clearest conclusion. 3-5 sentences."
            )
            print(f"### {AGENT_EMOJI[agent]} The {agent}")
            argument = call_agent(client, agent, prompt)
            print(argument + "\n")
            round_["turns"].append({"agent": agent, "argument": argument})
        self.transcript["rounds"].append(round_)

    def run_judge(self, client: Client):
        print("\n---\n\n# 🏛️ COUNCIL VERDICT\n")
        full_context = transcript_text(self.transcript, up_to_round=3)
        summary = call_judge(client, self.topic, full_context)
        print(summary)
        self.transcript["summary"] = summary

    def save(self):
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        path = f"/tmp/debate_{ts}.json"
        with open(path, "w") as f:
            json.dump(self.transcript, f, indent=2)
        print(f"\n\n---\n_Transcript saved to `{path}`_")


def main():
    if len(sys.argv) < 2:
        print("Usage: run_debate.py \"<topic>\"")
        sys.exit(1)

    topic = " ".join(sys.argv[1:])

    try:
        client = Client()
    except RuntimeError as e:
        print(f"Error: {e}")
        sys.exit(1)

    divider = "━" * 52
    print(f"\n{divider}")
    print("THE COUNCIL — Debate Session")
    print(f"Topic: {topic}")
    print(f"Backend: {client.mode}")
    print(divider)

    moderator = Moderator(topic)
    moderator.run_opening(client)
    moderator.run_crossfire(client)
    moderator.run_final(client)
    moderator.run_judge(client)
    moderator.save()


if __name__ == "__main__":
    main()
