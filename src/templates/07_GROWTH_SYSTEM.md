# Growth Systems & Playbook

## 1. Physical-to-Digital Growth Funnel
- **1. Awareness:** {{ growth_funnel.awareness }}
- **2. Acquisition (Tasting):** {{ growth_funnel.acquisition }}
- **3. Digital Onboarding:** {{ growth_funnel.onboarding }}
- **4. Retention Loop:** {{ growth_funnel.retention }}
- **5. Referral System:** {{ growth_funnel.referral }}

## 2. Margin-Controlled Bundle Matrix
{% for bundle in bundle_matrix.bundles %}
### {{ bundle.name }}
- **Components:** {{ bundle.components | join(', ') }}
- **Margin & AOV Rationale:** {{ bundle.margin_rationale }}
{% endfor %}

## 3. B2B Acquisition Strategy
- **Outreach Concept:** {{ b2b_acquisition.outreach_script_concept }}
- **Tasting Sample Pack:** {{ b2b_acquisition.tasting_pack_strategy }}
- **Credit Risk Policy (Fiados):** {{ b2b_acquisition.credit_risk_policy }}

## 4. Unit Economics & Key Growth Metrics
- **Lifetime Value (LTV):** {{ unit_economics.ltv_formula }}
- **Customer Acquisition Cost (CAC):** {{ unit_economics.cac_formula }}
- **Repeat Purchase Rate Goal:** {{ unit_economics.repeat_rate_goal }}
- **Average Order Value (AOV) Goal:** {{ unit_economics.aov_goal }}
