# Brand Architecture & System

## 1. Brand Foundation
**Purpose:** {{ foundation.purpose }}
**Mission:** {{ foundation.mission }}
**Vision:** {{ foundation.vision }}

**Core Values:**
{% for value in foundation.core_values %}
- {{ value }}
{% endfor %}

## 2. Brand Personality
**Archetype:** {{ personality.archetype }}

**Key Traits:**
{% for trait in personality.traits %}
- {{ trait }}
{% endfor %}

## 3. Brand Positioning
**Positioning Statement:** {{ positioning.positioning_statement }}
**Tagline Concept:** "{{ positioning.tagline_concept }}"

## 4. Tone of Voice
**Overview:** {{ tone_of_voice.description }}

**Messaging Pillars:**
{% for pillar in tone_of_voice.messaging_pillars %}
- {{ pillar }}
{% endfor %}

**Dos and Don'ts:**
{% for rule in tone_of_voice.do_and_donts %}
- {{ rule }}
{% endfor %}

## 5. Visual System Guidelines
**Color Philosophy:** {{ visual_system.color_philosophy }}
**Typography Direction:** {{ visual_system.typography_direction }}

**Packaging Rules:**
{% for rule in visual_system.packaging_rules %}
- {{ rule }}
{% endfor %}
