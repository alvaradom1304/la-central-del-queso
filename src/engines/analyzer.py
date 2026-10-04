import os
import instructor
from src.core.schema import DiscoveryDocument
from pydantic import ValidationError

class DiscoveryAnalyzer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        
        self.client = None
        self.provider = None
        
        if self.gemini_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.gemini_key)
                self.provider = "gemini"
            except ImportError:
                raise ValueError("google-genai package is not installed. Please install it to use Gemini.")
        elif self.anthropic_key:
            try:
                from anthropic import Anthropic
                self.client = instructor.from_anthropic(Anthropic(api_key=self.anthropic_key))
                self.provider = "anthropic"
            except ImportError:
                raise ValueError("anthropic package is not installed. Please install it to use Anthropic.")
        
    def analyze(self, text: str) -> DiscoveryDocument:
        """
        Real extraction logic using native google.genai or instructor for anthropic.
        """
        if not self.provider or not self.client:
            raise ValueError(
                "No API key found. Please set GEMINI_API_KEY or ANTHROPIC_API_KEY in your environment (.env)."
            )
            
        try:
            if self.provider == "gemini":
                from google.genai import types
                response = self.client.models.generate_content(
                    model="gemini-3.5-flash",
                    contents=f"Extract the business discovery details from this interview text:\n\n{text}",
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=DiscoveryDocument,
                        temperature=0.1
                    )
                )
                if response.parsed:
                    return response.parsed
                # Fallback if parsed is None for some reason
                import json
                return DiscoveryDocument.model_validate(json.loads(response.text))
            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-latest",
                    max_tokens=4096,
                    response_model=DiscoveryDocument,
                    messages=[
                        {"role": "user", "content": f"Extract the business discovery details from this interview text:\n\n{text}"}
                    ]
                )
                return response

        except ValidationError as ve:
            raise ValueError(f"Schema validation failed during extraction: {ve}")
        except Exception as e:
            raise RuntimeError(f"An error occurred during LLM extraction: {e}")

    def analyze_mock(self, text: str) -> DiscoveryDocument:
        """
        Mock extraction for CLI demonstration purposes.
        """
        return DiscoveryDocument(
            company_overview={
                "name": "Acme Corp",
                "founder_name": "Jane Doe",
                "industry": "SaaS",
                "mission": "Revolutionize the widget industry"
            },
            business_model={
                "revenue_streams": ["SaaS subscriptions", "Enterprise support"],
                "cost_structure": ["Cloud hosting", "R&D", "Sales"],
                "margins": "80% Gross Margin",
                "pricing_strategy": "Freemium with Enterprise tiers"
            },
            operations={
                "core_workflows": ["User onboarding", "Monthly billing", "Customer support triage"],
                "key_resources": ["Proprietary matching algorithm", "Engineering team"]
            },
            value_proposition={
                "customer_segments": ["Mid-market B2B", "Enterprise"],
                "core_value_proposition": "Automating manual widget processes to save 20 hours/week"
            },
            pain_points={
                "critical_pain_points": ["High customer acquisition cost", "Churn in mid-market segment"],
                "operational_bottlenecks": ["Manual onboarding for enterprise clients", "Slow feature delivery"]
            },
            fact_vs_hypothesis=[
                {
                    "statement": "Customers churn because of missing feature X",
                    "is_fact": False,
                    "evidence": "Founder stated this, but no analytics support it yet."
                },
                {
                    "statement": "Server costs account for 40% of COGS",
                    "is_fact": True,
                    "evidence": "Verified via AWS billing dashboard."
                }
            ],
            information_gaps=[
                "Need accurate Customer Acquisition Cost (CAC) by segment",
                "Missing details on the enterprise sales cycle length"
            ]
        )
