from pydantic import BaseModel, Field
from typing import List

class FlywheelMechanics(BaseModel):
    description: str = Field(description="How high-margin sales fund capacity and unlock new nodes")
    key_steps: List[str] = Field(description="The steps of the flywheel loop")

class ExpansionTrigger(BaseModel):
    milestone: str = Field(description="The sales or operational milestone (e.g., X kg sold/month)")
    capacity_upgrade: str = Field(description="What capacity upgrade this milestone unlocks (e.g., cold-chain upgrade, new hire)")

class NodePlaybook(BaseModel):
    node_name: str = Field(description="Name of the expansion node (e.g., Satellite Stand, Route-Optimized B2B, Subscription Club)")
    strategy: str = Field(description="Core strategy to execute this node")
    tactics: List[str] = Field(description="Actionable tactics for this node")

class GovernanceRisk(BaseModel):
    risk_area: str = Field(description="The specific risk (e.g., inventory bloat, 'fiados')")
    guardrail: str = Field(description="The rule or policy to prevent this risk")

class ExpansionDocument(BaseModel):
    flywheel: FlywheelMechanics
    triggers: List[ExpansionTrigger]
    node_playbooks: List[NodePlaybook]
    governance: List[GovernanceRisk]
