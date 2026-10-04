# Research & Competitive Intelligence Report

## 1. Market Overview (Costa Rica Dairy & Artisanal Cheese Sector)
**Sector Description:** {{ market_overview.sector_description }}

**Market Size & Growth:** {{ market_overview.market_size_and_growth }}

**Key Characteristics:**
{% for char in market_overview.key_characteristics %}
- {{ char }}
{% endfor %}

## 2. Competitor Analysis

### Direct Competitors (Artisanal / Farmers Markets)
{% for comp in competitor_analysis.direct_competitors %}
- **{{ comp.name }}**
  - *Strengths:* {{ comp.strengths | join(', ') }}
  - *Weaknesses:* {{ comp.weaknesses | join(', ') }}
{% endfor %}

### Indirect Competitors (Industrial / Supermarkets)
{% for comp in competitor_analysis.indirect_competitors %}
- **{{ comp.name }}**
  - *Strengths:* {{ comp.strengths | join(', ') }}
  - *Weaknesses:* {{ comp.weaknesses | join(', ') }}
{% endfor %}

## 3. Pricing Benchmark

**General Observations:** {{ pricing_benchmark.general_observations }}

| Product Type | Artisanal Price Range | Industrial Price Range |
|---|---|---|
{% for product in pricing_benchmark.products %}
| **{{ product.product_type }}** | {{ product.artisanal_price_range }} | {{ product.industrial_price_range }} |
{% endfor %}

## 4. Consumer Trends & Purchasing Behavior

**Purchasing Channels (Feria vs. Delivery vs. Gourmet):**
{% for channel in consumer_trends.purchasing_channels %}
- {{ channel }}
{% endfor %}

**Key Drivers of Purchase:**
{% for driver in consumer_trends.key_drivers %}
- {{ driver }}
{% endfor %}

**Emerging Behaviors:**
{% for behavior in consumer_trends.emerging_behaviors %}
- {{ behavior }}
{% endfor %}

## 5. Strategic Opportunities & Differentiation

**Differentiation Angles:**
{% for angle in strategic_opportunities.differentiation_angles %}
- {{ angle }}
{% endfor %}

**Growth Opportunities:**
{% for opp in strategic_opportunities.growth_opportunities %}
- {{ opp }}
{% endfor %}

**Potential Threats:**
{% for threat in strategic_opportunities.potential_threats %}
- {{ threat }}
{% endfor %}
