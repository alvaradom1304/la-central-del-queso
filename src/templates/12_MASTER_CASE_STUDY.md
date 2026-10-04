# EXECUTIVE CASE STUDY: La Central del Queso

## 1. Executive Summary
{{ executive_summary }}

## 2. Transformation Matrix
| Area | Before AEM OS | After AEM OS |
|---|---|---|
{% for item in transformation_matrix %}
| **{{ item.category }}** | {{ item.before }} | {{ item.after }} |
{% endfor %}

## 3. Core Strategic Pillars
{% for pillar in strategic_pillars %}
- {{ pillar }}
{% endfor %}

## 4. AI & Automation Impact
{{ ai_impact }}

## 5. Growth Projections & Unit Economics
{% for projection in growth_projections %}
- {{ projection }}
{% endfor %}

## 6. Key Methodological Lessons Learned
{% for lesson in lessons_learned %}
- {{ lesson }}
{% endfor %}
