from pydantic import BaseModel, Field
from typing import List

class GrowthFunnel(BaseModel):
    awareness: str = Field(description="How the customer discovers the brand (e.g., Feria)")
    acquisition: str = Field(description="The first conversion/tasting")
    onboarding: str = Field(description="How they are brought into the digital/WhatsApp ecosystem")
    retention: str = Field(description="The bi-weekly repeat purchase loop")
    referral: str = Field(description="Word-of-mouth incentives")

class ProductBundle(BaseModel):
    name: str = Field(description="Name of the combo/bundle")
    components: List[str] = Field(description="What is included in the bundle")
    margin_rationale: str = Field(description="Why this bundle helps increase Average Order Value (AOV) and margin")

class BundleMatrix(BaseModel):
    bundles: List[ProductBundle] = Field(description="List of strategic product bundles")

class B2BAcquisition(BaseModel):
    outreach_script_concept: str = Field(description="Core concept for the B2B outreach script")
    tasting_pack_strategy: str = Field(description="What to include in the free B2B tasting pack")
    credit_risk_policy: str = Field(description="Policy for handling 'fiados' with new B2B clients")

class UnitEconomics(BaseModel):
    ltv_formula: str = Field(description="Definition/formula for Customer Lifetime Value")
    cac_formula: str = Field(description="Definition/formula for Customer Acquisition Cost")
    repeat_rate_goal: str = Field(description="Goal for the repeat purchase rate")
    aov_goal: str = Field(description="Goal for the Average Order Value")

class GrowthDocument(BaseModel):
    growth_funnel: GrowthFunnel
    bundle_matrix: BundleMatrix
    b2b_acquisition: B2BAcquisition
    unit_economics: UnitEconomics
