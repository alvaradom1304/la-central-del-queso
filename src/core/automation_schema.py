from pydantic import BaseModel, Field
from typing import List

class AutomationTask(BaseModel):
    task_name: str = Field(description="Name of the task")
    reasoning: str = Field(description="Why it fits this category")

class AutomationMatrix(BaseModel):
    automate_fully: List[AutomationTask] = Field(description="Tasks to automate fully without human intervention")
    augment_with_ai: List[AutomationTask] = Field(description="Tasks to augment with AI, keeping human in the loop")
    keep_human: List[AutomationTask] = Field(description="Tasks to keep 100% human to preserve artisanal warmth")

class Workflow(BaseModel):
    workflow_name: str = Field(description="Name of the workflow")
    input_trigger: str = Field(description="What triggers the workflow")
    process_steps: List[str] = Field(description="The automated process steps")
    decision_logic: str = Field(description="Logic or AI used to make decisions in the flow")
    output_action: str = Field(description="The final output or action")

class AutomationStack(BaseModel):
    tools: List[str] = Field(description="Specific tools recommended (e.g., n8n, Airtable, Supabase, Gemini)")
    integration_rationale: str = Field(description="Why this stack works together for the specific needs")

class AutomationDocument(BaseModel):
    automation_matrix: AutomationMatrix
    core_workflows: List[Workflow]
    recommended_stack: AutomationStack
    estimated_roi: str = Field(description="Estimated operational ROI and hours saved per week")
