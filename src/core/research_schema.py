from pydantic import BaseModel, Field
from typing import List, Optional

class MarketOverview(BaseModel):
    sector_description: str = Field(description="General description of the Costa Rican dairy and artisanal cheese sector")
    market_size_and_growth: Optional[str] = Field(None, description="Estimates or trends on market size and growth")
    key_characteristics: List[str] = Field(description="Key characteristics of the artisanal cheese market in Costa Rica")

class Competitor(BaseModel):
    name: str = Field(description="Name of the competitor")
    type: str = Field(description="'Direct' (e.g., artisanal producers, farmers markets) or 'Indirect' (e.g., industrial brands like Dos Pinos, supermarket lines)")
    strengths: List[str] = Field(description="Key strengths of the competitor")
    weaknesses: List[str] = Field(description="Key weaknesses of the competitor")

class CompetitorAnalysis(BaseModel):
    direct_competitors: List[Competitor] = Field(description="List of direct artisanal competitors")
    indirect_competitors: List[Competitor] = Field(description="List of indirect industrial competitors")

class ProductPricing(BaseModel):
    product_type: str = Field(description="Type of cheese, e.g., 'Turrialba', 'Semiduro', 'Maduro'")
    artisanal_price_range: str = Field(description="Estimated price range for artisanal products (in Colones/USD)")
    industrial_price_range: str = Field(description="Estimated price range for industrial products (in Colones/USD)")

class PricingBenchmark(BaseModel):
    products: List[ProductPricing] = Field(description="Pricing comparison for key cheese types")
    general_observations: str = Field(description="General observations on pricing dynamics in the market")

class ConsumerTrends(BaseModel):
    purchasing_channels: List[str] = Field(description="Differences in behavior across Feria vs. Delivery vs. Gourmet stores")
    key_drivers: List[str] = Field(description="What drives consumer purchasing decisions (e.g., quality, tradition, convenience)")
    emerging_behaviors: List[str] = Field(description="New or emerging trends in cheese consumption")

class StrategicOpportunities(BaseModel):
    differentiation_angles: List[str] = Field(description="How the brand can stand out against competitors")
    growth_opportunities: List[str] = Field(description="Potential areas for market expansion or new product lines")
    potential_threats: List[str] = Field(description="Risks to watch out for in the market")

class ResearchDocument(BaseModel):
    market_overview: MarketOverview
    competitor_analysis: CompetitorAnalysis
    pricing_benchmark: PricingBenchmark
    consumer_trends: ConsumerTrends
    strategic_opportunities: StrategicOpportunities
