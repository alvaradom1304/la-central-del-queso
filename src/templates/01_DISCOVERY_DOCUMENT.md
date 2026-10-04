# Business Discovery Document

## 1. Company & Founder Overview
**Company:** {{ company_overview.name }}
**Founder:** {{ company_overview.founder_name }}
**Industry:** {{ company_overview.industry }}
**Mission:** {{ company_overview.mission }}

## 2. Business Model
**Revenue Streams:**
{% for stream in business_model.revenue_streams %}
- {{ stream }}
{% endfor %}

**Cost Structure:**
{% for cost in business_model.cost_structure %}
- {{ cost }}
{% endfor %}

**Margins:** {{ business_model.margins }}
**Pricing Strategy:** {{ business_model.pricing_strategy }}

## 3. Operations & Core Workflows
**Core Workflows:**
{% for workflow in operations.core_workflows %}
- {{ workflow }}
{% endfor %}

**Key Resources:**
{% for resource in operations.key_resources %}
- {{ resource }}
{% endfor %}

## 4. Customer Segments & Value Proposition
**Customer Segments:**
{% for segment in value_proposition.customer_segments %}
- {{ segment }}
{% endfor %}

**Core Value Proposition:**
{{ value_proposition.core_value_proposition }}

## 5. Critical Pain Points & Bottlenecks
**Critical Pain Points:**
{% for pain in pain_points.critical_pain_points %}
- {{ pain }}
{% endfor %}

**Operational Bottlenecks:**
{% for bottleneck in pain_points.operational_bottlenecks %}
- {{ bottleneck }}
{% endfor %}

## 6. Fact vs. Hypothesis Classification
| Statement | Is Fact? | Evidence |
|---|---|---|
{% for item in fact_vs_hypothesis %}
| {{ item.statement }} | {{ item.is_fact }} | {{ item.evidence }} |
{% endfor %}

## 7. Identified Information Gaps
{% for gap in information_gaps %}
- {{ gap }}
{% endfor %}
