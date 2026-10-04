# Continuous Sales-Driven Expansion Engine

## 1. Sales-Driven Growth Flywheel
**Overview:** {{ flywheel.description }}

**Flywheel Loop:**
{% for step in flywheel.key_steps %}
- {{ step }}
{% endfor %}

## 2. Capacity & Reinvestment Triggers
| Milestone | Capacity Upgrade Unlocked |
|---|---|
{% for trigger in triggers %}
| **{{ trigger.milestone }}** | {{ trigger.capacity_upgrade }} |
{% endfor %}

## 3. Expansion Node Playbooks
{% for node in node_playbooks %}
### {{ node.node_name }}
- **Strategy:** {{ node.strategy }}
- **Tactics:**
{% for tactic in node.tactics %}
  - {{ tactic }}
{% endfor %}
{% endfor %}

## 4. Expansion Governance & Risk Controls
| Risk Area | Guardrail / Policy |
|---|---|
{% for risk in governance %}
| **{{ risk.risk_area }}** | {{ risk.guardrail }} |
{% endfor %}
