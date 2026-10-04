from pydantic import BaseModel, Field
from typing import List

class DigitalTouchpoint(BaseModel):
    name: str = Field(description="Name of the touchpoint (e.g., Website, WhatsApp, Google Maps)")
    role: str = Field(description="The primary business role of this touchpoint")

class EcosystemOverview(BaseModel):
    touchpoints: List[DigitalTouchpoint] = Field(description="List of primary digital touchpoints and their roles")
    core_objective: str = Field(description="The overarching goal of the digital ecosystem")

class SitemapSection(BaseModel):
    title: str = Field(description="Section title")
    content_focus: str = Field(description="What content this section features")
    call_to_action: str = Field(description="The primary CTA for this section")

class InformationArchitecture(BaseModel):
    sections: List[SitemapSection] = Field(description="Sections of the website sitemap")

class UserFlow(BaseModel):
    scenario: str = Field(description="The user scenario (e.g., Feria customer ordering repeat vs. First-time buyer)")
    steps: List[str] = Field(description="Steps the user takes in this flow")

class ConversionMechanisms(BaseModel):
    primary_mechanisms: List[str] = Field(description="Key mechanisms driving conversion (e.g., pre-filled WhatsApp carts)")
    secondary_ctas: List[str] = Field(description="Secondary calls to action (e.g., Feria locator)")

class TechStack(BaseModel):
    frontend: str = Field(description="Frontend architecture (e.g., Next.js, Tailwind, Zustand)")
    scalability_rationale: str = Field(description="Why this stack supports future growth")

class DigitalEcosystemDocument(BaseModel):
    ecosystem_overview: EcosystemOverview
    information_architecture: InformationArchitecture
    user_flows: List[UserFlow]
    conversion_mechanisms: ConversionMechanisms
    tech_stack: TechStack
