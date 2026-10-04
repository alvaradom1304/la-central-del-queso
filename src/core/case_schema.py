from pydantic import BaseModel, Field
from typing import List

class BeforeAfter(BaseModel):
    category: str = Field(description="Category (e.g., Operations, Brand, Digital, Finance)")
    before: str = Field(description="The state before the AEM OS intervention")
    after: str = Field(description="The state after the AEM OS intervention")

class CaseStudyDocument(BaseModel):
    executive_summary: str = Field(description="High-level summary of the transformation from traditional vendor to modernized artisanal brand")
    transformation_matrix: List[BeforeAfter] = Field(description="Before vs. After Transformation Matrix")
    strategic_pillars: List[str] = Field(description="Core strategic pillars like Feria moat + WhatsApp repeat engine")
    ai_impact: str = Field(description="The impact of AI and Automation on hours saved and operational chaos")
    growth_projections: List[str] = Field(description="Growth projections and unit economics targets")
    lessons_learned: List[str] = Field(description="Key methodological lessons learned (Evidence before opinion)")
