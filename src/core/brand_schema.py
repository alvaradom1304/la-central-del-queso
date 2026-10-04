from pydantic import BaseModel, Field
from typing import List

class BrandFoundation(BaseModel):
    purpose: str = Field(description="The underlying purpose or 'Why' of the brand")
    mission: str = Field(description="The brand's mission")
    vision: str = Field(description="The brand's long-term vision")
    core_values: List[str] = Field(description="Core values (e.g., honesty, craft, community)")

class BrandPersonality(BaseModel):
    archetype: str = Field(description="The primary brand archetype (e.g., Caregiver, Creator)")
    traits: List[str] = Field(description="Key personality traits")

class BrandPositioning(BaseModel):
    positioning_statement: str = Field(description="Internal positioning statement")
    tagline_concept: str = Field(description="Concept or direction for the brand tagline")

class ToneOfVoice(BaseModel):
    description: str = Field(description="Overall description of how the brand speaks")
    messaging_pillars: List[str] = Field(description="Key topics or themes the brand talks about")
    do_and_donts: List[str] = Field(description="Examples of what to say and what not to say")

class VisualSystemGuidelines(BaseModel):
    color_philosophy: str = Field(description="Direction for the color palette")
    typography_direction: str = Field(description="Direction for fonts and typography")
    packaging_rules: List[str] = Field(description="Rules for craft packaging and unboxing experience")

class BrandDocument(BaseModel):
    foundation: BrandFoundation
    personality: BrandPersonality
    positioning: BrandPositioning
    tone_of_voice: ToneOfVoice
    visual_system: VisualSystemGuidelines
