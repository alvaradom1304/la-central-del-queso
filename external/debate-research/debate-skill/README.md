# 🏛️ Debate — a Claude Code Skill

> Five expert personas debate your request, then produce the actual solution you came for —
> a decision, a design spec, a strategy, or a plan. Not commentary about your problem. The
> answer itself.

`/debate` turns Claude Code into a council of five distinct expert personas — **The Visionary**,
**The Skeptic**, **The Engineer**, **The Economist**, **The Ethicist** — who debate any
request across 3 structured rounds. A silent moderator (a plain Python function, no LLM)
controls turn order and transcript state. Then a **Council Synthesizer** converts the full
debate into the actual deliverable the user asked for:

- Ask for a **decision** → get the decision with branched logic and stopping rules
- Ask for a **design** → get an actual design spec (screens, components, copy, constraints)
- Ask to **solve a problem** → get ordered, executable steps
- Ask for a **strategy** → get concrete moves with sequencing
- Ask to **evaluate an idea** → get the refined idea, sharpened by the debate

This isn't "ask Claude for multiple perspectives." It's an actual debate where each agent
reads what the others said and rebuts them directly, and what emerges is a substantive,
specific, actionable deliverable — the kind you'd pay a consultant for.

---

## Why this beats one-shot Claude

A single Claude response to a complex decision tends toward balanced-but-bland: "here are the
pros, here are the cons, it depends on your situation." That's not what you want when you have
a real decision to make.

In our benchmark on 3 hard prompts:

| | With this skill | Plain Claude |
|---|---|---|
| Structural quality assertions passed | **16/16 (100%)** | 1/16 (7%) |
| Mean output length | ~22k chars | ~5k chars |
| Concrete recommendation | Yes, with branching logic | Often hedged |

Real example output: when asked *"Should I take a $300k Google job or do YC with 6 months of
savings?"* — the council's answer was **"Call Google tomorrow and ask for a 6-month deferral
first. If yes → take YC with safety net. If no → take YC anyway, raise aggressively in first
30 days."** No baseline Claude response we tested gave that level of dissolved-binary,
branched-logic specificity. ([Full transcript](./examples/02-google-vs-yc.md))

---

## Install

### Option A: Install the `.skill` package (recommended)

1. Download [`debate.skill`](./debate.skill) from this repo
2. In Claude Code, drag the `.skill` file into your conversation, or place it at
   `~/.claude/skills/` and Claude Code will pick it up

### Option B: Install from source

```bash
git clone https://github.com/LeSingh1/debate-skill.git
cp -r debate-skill/debate ~/.claude/skills/
```

The `debate/` directory must end up at `~/.claude/skills/debate/`.

---

## Use

In any Claude Code session:

```
/debate Should I learn Rust in 2026?
```

Or just say it naturally — the skill triggers on phrases like "debate this for me",
"argue all sides of...", "what would different experts think about...", or any decision
question where you'd benefit from a council of perspectives.

After ~4 minutes (16 sequential API calls), you'll get:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE COUNCIL — Debate Session
Topic: <your topic>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ROUND 1 — Opening Arguments
   🔭 The Visionary
   🔍 The Skeptic
   ⚙️ The Engineer
   📊 The Economist
   ⚖️ The Ethicist

## ROUND 2 — Crossfire
   (each agent responds to a specific other agent's opening)

## ROUND 3 — Final Positions
   (each agent integrates the debate and gives final stance)

# 🏛️ COUNCIL VERDICT
   ## Debate Digest          (one-line strongest point per agent + central tension)
   ## The Solution           (the actual deliverable — decision / design / plan / strategy)
   ## Why This Survives the Debate
   ## Risks This Doesn't Eliminate
   ## Next Concrete Action   (one specific thing to do in 24-48h)
```

The full transcript is also saved to `/tmp/debate_<timestamp>.json` for later reference.

---

## The 5 Agents

| Agent | What they care about |
|---|---|
| 🔭 **The Visionary** | Upside, ambition, scale, what becomes possible if it succeeds |
| 🔍 **The Skeptic** | Weak assumptions, hidden risks, vague claims, overconfidence |
| ⚙️ **The Engineer** | Implementation, technical constraints, edge cases, real systems |
| 📊 **The Economist** | Incentives, costs, markets, adoption, tradeoffs |
| ⚖️ **The Ethicist** | Human impact, fairness, safety, long-term consequences |

Each is the same Claude model (`claude-sonnet-4-6`) with a different `system` prompt — no
fine-tuning, no special API. The persona differences come entirely from carefully written
character prompts (see [`debate/SKILL.md`](./debate/SKILL.md)).

---

## Debate Flow

```text
User gives topic
       ↓
ROUND 1 — Opening Arguments
   All 5 agents argue independently (each sees only the topic)
       ↓
ROUND 2 — Crossfire
   Skeptic   → responds to Visionary
   Engineer  → responds to Skeptic
   Economist → responds to Engineer
   Ethicist  → responds to Economist
   Visionary → responds to Ethicist
   (each sees Round 1 transcript)
       ↓
ROUND 3 — Final Positions
   Each agent integrates the full debate and states their strongest position
   (each sees Rounds 1 & 2 transcript)
       ↓
JUDGE SUMMARY
   Neutral synthesizer: best arguments, biggest disagreement,
   consensus, winner, and a concrete recommendation
```

---

## Architecture

```
debate/
├── SKILL.md                  # Triggers + agent prompts + flow spec (Claude reads this)
├── scripts/
│   └── run_debate.py         # Moderator + agent + judge orchestration
└── evals/
    └── evals.json            # 3 test prompts used for benchmarking
```

**The moderator is not an LLM.** It's a plain Python class
([`Moderator` in run_debate.py](./debate/scripts/run_debate.py)) that:
- Owns the turn order for each round
- Accumulates a shared transcript JSON `{topic, rounds: [{name, turns: [{agent, argument}]}]}`
- Decides when each round ends (after all 5 agents have spoken)
- Builds the prompt for each agent call (topic + transcript-so-far + role-specific instruction)
- Triggers the judge after Round 3

**Each agent is one `messages.create` call** with the same model but a different `system`
prompt. No streaming yet — calls are sequential within a round so each agent sees prior
arguments. (Could be parallelized later within a round at the cost of agents not seeing each
other's same-round positions.)

**The judge is a 6th Claude call** with a neutral "debate judge" system prompt. It receives
the full transcript and is instructed to *"not be diplomatic — pick an actual winner and make a
concrete recommendation."* Removing that line makes the output hedge; keeping it is what makes
the recommendations actionable.

---

## Auth — Two Backends, Auto-Detected

The script handles both common Claude Code auth setups:

| If you have... | The script uses... | Speed |
|---|---|---|
| `ANTHROPIC_API_KEY` env var | The Anthropic Python SDK directly | ~4 min |
| Provider-managed auth (Vertex / Bedrock / Claude Desktop) | The `claude -p` CLI | ~13 min |

You don't configure anything — it auto-detects at startup. The CLI fallback exists because
many Claude Code users authenticate through Claude Desktop and don't have `ANTHROPIC_API_KEY`
set in their shell.

To install the SDK if you want the fast path:

```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## Example Transcripts

Real outputs from this skill, included in this repo as proof:

1. **[Decision — Six polished projects/year vs. one deep startup](./examples/01-six-projects-vs-one-deep.md)** —
   Output: branched decision logic. Ship 2 cheap experiments, measure 3 signals (return,
   payment, organic share), only commit to depth if signals clear.

2. **[Decision — Google $300k/yr vs. YC startup](./examples/02-google-vs-yc.md)** — Output:
   dissolved-binary recommendation. Ask Google for a 6-month deferral first; their answer
   determines which branch to take.

3. **[Design — Gen Z personal finance app onboarding flow](./examples/03-finance-app-onboarding-design.md)** —
   Output: an actual 6-screen design spec with copy, components, telemetry thresholds,
   technical constraints, and post-onboarding follow-up. Concrete enough to hand to a
   designer and engineer tomorrow.

All three are unedited stdout from `run_debate.py`.

---

## Benchmark Methodology

We tested 3 prompts × 2 configurations (with-skill vs. baseline plain Claude). For each run we
graded against 5–6 structural assertions specific to the prompt. See
[`debate/evals/evals.json`](./debate/evals/evals.json) for the exact prompts and assertions.

```
Config              Pass rate    Mean tokens    Mean time
─────────────────   ─────────    ───────────    ─────────
With skill          16/16 100%   ~39k           ~509s
Without skill        1/16   7%   ~15k            ~49s
```

The cost is real: the skill is ~10× slower and ~2.6× more tokens than a single Claude
response. That's inherent to running 16 sequential API calls. In exchange you get a fully
structured debate with a defensible recommendation instead of a balanced essay.

---

## When to Use This (and When Not To)

**Use it for:**
- Career and life decisions where multiple perspectives matter
- Startup idea validation / pivot decisions
- Ethics and policy questions
- Product strategy debates (build X or Y, monolith vs microservices, etc.)
- Investment decisions
- Pre-mortems before major commitments

**Don't use it for:**
- Pure technical questions where one expert > five generalists
  (e.g., "which database for my use case" — just ask Claude directly)
- Simple factual lookups
- Anything where you need an answer in under 4 minutes

---

## Customizing

All five persona prompts live in two places:
- `debate/SKILL.md` (so Claude knows what they are)
- `debate/scripts/run_debate.py` (in the `AGENT_PROMPTS` dict at the top)

To add a 6th agent (e.g., **The Historian**), add an entry to both files plus an emoji in
`AGENT_EMOJI`, and add them to `OPENING_ORDER`, `CROSSFIRE_PAIRS`, and `FINAL_ORDER`. The
moderator handles arbitrary roster sizes; no other code changes needed.

To change the model, edit `MODEL = "claude-sonnet-4-6"` at the top of `run_debate.py`.

---

## License

MIT
