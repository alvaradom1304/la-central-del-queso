from pydantic import BaseModel, Field
from typing import List

class PositioningStatement(BaseModel):
    statement: str = Field(description="Core positioning statement differentiating from industrial dairy")
    core_pillars: List[str] = Field(description="Key pillars supporting the positioning")

class TargetCustomer(BaseModel):
    profile_name: str = Field(description="Name of the customer profile (e.g., Traditional Shoppers, Emerging Foodies)")
    description: str = Field(description="Description of the customer profile and needs")
    acquisition_channel: str = Field(description="Primary channel to acquire this customer")

class ProductStrategy(BaseModel):
    flagship_product: str = Field(description="The primary hero product")
    flagship_rationale: str = Field(description="Why this product is the flagship")
    heritage_product: str = Field(description="The heritage product to protect")
    portfolio_actions: List[str] = Field(description="Actions to take regarding the broader product portfolio")

class ChannelArchitecture(BaseModel):
    physical_channels: List[str] = Field(description="Physical channels (e.g., Feria) and their role")
    digital_channels: List[str] = Field(description="Digital channels (e.g., Delivery/WhatsApp) and their role")
    integration_strategy: str = Field(description="How to connect physical and digital channels (e.g., bridging tasting with repeat orders)")

class RoadmapAction(BaseModel):
    timeframe: str = Field(description="'Short-term' or 'Mid-term'")
    action: str = Field(description="The specific action to take")
    expected_outcome: str = Field(description="The expected result of this action")

class StrategicKPI(BaseModel):
    metric_name: str = Field(description="Name of the metric")
    target: str = Field(description="The goal or target for this metric")

class StrategyDocument(BaseModel):
    positioning: PositioningStatement
    target_customers: List[TargetCustomer]
    product_strategy: ProductStrategy
    channel_architecture: ChannelArchitecture
    roadmap: List[RoadmapAction]
    kpis: List[StrategicKPI]
