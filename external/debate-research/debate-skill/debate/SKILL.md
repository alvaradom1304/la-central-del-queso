---
name: debate
description: >
  Run a structured 5-agent council debate that produces a concrete, actionable solution to a
  decision, design request, problem, or strategy question. Use this skill whenever the user
  invokes /debate, asks to "debate" something, wants multiple perspectives on a hard decision,
  asks "design X", "how should I solve Y", "help me figure out Z", "stress-test this idea",
  "what's the best approach to...", or asks for a council/roundtable analysis. Trigger on
  startup ideas, moral dilemmas, product decisions, technical architecture problems, system
  designs, UX flows, policy debates, personal decisions, and strategy questions. The five
  agents (Visionary, Skeptic, Engineer, Economist, Ethicist) debate across 3 rounds, then a
  Council Synthesizer produces the actual deliverable — a decision with branched logic, a
  design spec, an implementation plan, or a refined idea — not just commentary. Always
  outputs something the user can act on tomorrow.
---

# The Council — Multi-Agent Debate Skill

When the user invokes `/debate <topic>` (or otherwise triggers this skill), run a structured
3-round debate among 5 distinct expert personas, then generate a judge summary.

---

## Quick Start

1. Get the topic from the user (from the `/debate` argument, or ask if missing).
2. Run `~/.claude/skills/debate/scripts/run_debate.py` with the topic.
3. Stream the output to the user as it arrives.

```bash
python ~/.claude/skills/debate/scripts/run_debate.py "<topic>"
```

The script auto-detects which backend to use:
- If `ANTHROPIC_API_KEY` is set in the environment, it uses the Anthropic Python SDK (faster).
- Otherwise, it falls back to the `claude -p` CLI, which uses whatever auth Claude Code is
  already using (works with provider-managed auth via Claude Desktop, Vertex, Bedrock, etc.).

No setup is required for most Claude Code users — the CLI fallback just works.

---

## Debate Structure

The moderator (a plain Python function — no LLM) controls flow. It:
- Defines the agent roster and turn order
- Builds the running transcript dict (`{topic, rounds: [{name, turns: [{agent, argument}]}]}`)
- Passes each agent the transcript-so-far as context
- Triggers the judge after round 3 ends

### Round 1 — Opening Arguments
All 5 agents give their initial position on the topic. Order: Visionary → Skeptic → Engineer →
Economist → Ethicist. Each agent receives only the topic.

### Round 2 — Crossfire
Each agent directly responds to one other agent's opening argument:
- Skeptic responds to Visionary
- Engineer responds to Skeptic
- Economist responds to Engineer
- Ethicist responds to Economist
- Visionary responds to Ethicist

Each agent receives the topic + the full Round 1 transcript.

### Round 3 — Final Position
Each agent integrates everything they've heard and gives their strongest final statement.
Order: Visionary → Skeptic → Engineer → Economist → Ethicist.
Each agent receives the topic + full Rounds 1 & 2 transcript.

### Council Verdict (Round 4 — not an agent round)
A single Claude call with a *Council Synthesizer* system prompt converts the debate into the
**actual deliverable the user asked for**. It is told: if they asked for a decision, give the
decision; if they asked for a design, output the design; if they asked you to solve a problem,
output the solution. The output is structured as:

1. **Debate Digest** — one-line strongest point per agent + the central tension
2. **The Solution** — the actual deliverable (decision / design / plan / strategy / refined
   idea), specific enough to act on tomorrow. This is the largest section and uses whatever
   sub-structure fits: ordered steps, bullets, tables, specs, pseudo-code
3. **Why This Survives the Debate** — how the solution answers the strongest objections raised
4. **Risks This Doesn't Eliminate** — 2-3 specific concerns the debate surfaced that remain
5. **Next Concrete Action** — one specific thing to do in the next 24-48 hours

The synthesizer is instructed to never hedge: "Do not say 'it depends' without telling them
what to do anyway."

---

## Agent System Prompts

These are passed verbatim as the `system` parameter in each API call.

**The Visionary**
```
You are The Visionary. You are optimistic, bold, creative, and future focused.
You argue for what could become possible if the idea succeeds.
You care about innovation, ambition, scale, and second order opportunities.
Do not ignore risks, but focus more on upside and potential.
Keep arguments clear, specific, and persuasive.
```

**The Skeptic**
```
You are The Skeptic. You are sharp, critical, and difficult to convince.
Your job is to find weak assumptions, hidden risks, vague claims, and overconfidence.
You should challenge every major claim with logic and evidence.
Do not be rude, but be intellectually aggressive.
Keep arguments concise and specific.
```

**The Engineer**
```
You are The Engineer. You care about whether the idea can actually be built.
You focus on implementation, architecture, technical constraints, speed, reliability, and edge cases.
You should turn abstract ideas into concrete systems.
If an idea sounds good but is hard to build, explain exactly why.
Prefer practical solutions over hype.
```

**The Economist**
```
You are The Economist. You analyze incentives, costs, markets, adoption, and tradeoffs.
You care about who benefits, who pays, what scales, and what fails economically.
You should think in terms of opportunity cost, pricing, competition, and resource allocation.
Avoid vague business language. Be precise.
```

**The Ethicist**
```
You are The Ethicist. You care about human impact, fairness, safety, trust, and long term consequences.
You should ask who might be harmed, who is excluded, and what misuse could happen.
You are not anti technology, but you require responsible design.
Make your arguments practical, not just moral.
```

---

## Agent Call Format

Each agent call is a standard Anthropic SDK messages.create call:

```python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=600,
    system=AGENT_SYSTEM_PROMPTS[agent_name],
    messages=[{"role": "user", "content": user_prompt}]
)
```

The `user_prompt` for each call is built by the moderator and contains:
- The debate topic
- Which round this is
- (From round 2 onward) The full transcript so far, formatted as readable text
- The specific instruction for this agent in this round (e.g., "You are responding to The Visionary's argument above")

---

## Output Format

Print each argument to stdout as it arrives. Use this structure:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE COUNCIL — Debate Session
Topic: <topic>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ROUND 1 — Opening Arguments

### 🔭 The Visionary
<argument>

### 🔍 The Skeptic
<argument>

### ⚙️ The Engineer
<argument>

### 📊 The Economist
<argument>

### ⚖️ The Ethicist
<argument>

---

## ROUND 2 — Crossfire

### 🔍 The Skeptic → responding to The Visionary
<argument>

... (same pattern)

---

## ROUND 3 — Final Positions

... (same pattern)

---

## JUDGE'S SUMMARY

**Best arguments:**
- Visionary: ...
- Skeptic: ...
- Engineer: ...
- Economist: ...
- Ethicist: ...

**Biggest disagreement:** ...

**Final consensus:** ...

**Winning agent:** The [Name] — because ...

**What you should do:** ...
```

---

## Implementation Notes

- Run agents **sequentially within each round** for simplicity and to avoid rate limits. The
  script can be upgraded to `asyncio.gather` later for speed.
- Each agent only sees arguments from *completed* rounds, not other agents in the same round.
  This keeps crossfire responses honest.
- The judge system prompt is: *"You are a neutral debate judge. Analyze the full transcript
  below and produce a structured summary. Be specific and direct. Name real arguments and quote
  them briefly. Do not be diplomatic — pick an actual winner and make a concrete recommendation."*
- `max_tokens=600` per agent argument, `max_tokens=1000` for the judge summary.
- The transcript JSON is saved to `/tmp/debate_<timestamp>.json` after each run so the user
  can inspect it.
- If `ANTHROPIC_API_KEY` is not set, print a clear error and exit.

---

## Debate Modes (optional, for display)

When printing the header, you can let the user pick a mode or auto-detect from the topic:

| Mode | Example trigger |
|---|---|
| Startup idea review | "debate my startup idea: ..." |
| Moral dilemma | "debate: is it ethical to..." |
| Product decision | "debate: should we build X or Y" |
| Technical architecture | "debate: monolith vs microservices" |
| Personal decision | "debate: should I take this job" |
| Investment decision | "debate: is X a good investment" |

All modes use the same 5 agents and 3-round structure.
