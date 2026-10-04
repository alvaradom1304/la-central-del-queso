from pydantic import BaseModel, Field
from typing import List, Optional

class FactVsHypothesis(BaseModel):
    statement: str = Field(description="The statement from the interview")
    is_fact: bool = Field(description="True if verified fact, False if founder hypothesis")
    evidence: Optional[str] = Field(None, description="Supporting evidence if available")

class CompanyOverview(BaseModel):
    name: str = Field(description="Name of the company")
    founder_name: str = Field(description="Name of the founder(s)")
    industry: str = Field(description="Industry the company operates in")
    mission: Optional[str] = Field(None, description="Company mission or vision")

class BusinessModel(BaseModel):
    revenue_streams: List[str] = Field(description="List of revenue streams")
    cost_structure: List[str] = Field(description="List of major costs")
    margins: Optional[str] = Field(None, description="Information on profit margins")
    pricing_strategy: Optional[str] = Field(None, description="Pricing strategy details")

class Operations(BaseModel):
    core_workflows: List[str] = Field(description="Key operational workflows")
    key_resources: List[str] = Field(description="Key resources required for operations")

class ValueProposition(BaseModel):
    customer_segments: List[str] = Field(description="Target customer segments")
    core_value_proposition: str = Field(description="Core value proposition of the business")

class PainPoints(BaseModel):
    critical_pain_points: List[str] = Field(description="Critical pain points the business faces")
    operational_bottlenecks: List[str] = Field(description="Bottlenecks in current operations")

class DiscoveryDocument(BaseModel):
    company_overview: CompanyOverview
    business_model: BusinessModel
    operations: Operations
    value_proposition: ValueProposition
    pain_points: PainPoints
    fact_vs_hypothesis: List[FactVsHypothesis]
    information_gaps: List[str] = Field(description="Identified knowledge gaps to address in future")
