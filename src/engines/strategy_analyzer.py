import os
from src.core.strategy_schema import StrategyDocument
from pydantic import ValidationError

class StrategyAnalyzer:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        
        self.client = None
        self.provider = None
        
        if self.gemini_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.gemini_key)
                self.provider = "gemini"
            except ImportError:
                raise ValueError("google-genai package is not installed. Please install it to use Gemini.")
        else:
            raise ValueError("GEMINI_API_KEY not found in environment.")
        
    def analyze(self, text: str) -> StrategyDocument:
        """
        Synthesize strategy from discovery and research inputs.
        """
        if not self.provider or not self.client:
            raise ValueError(
                "No API key found. Please set GEMINI_API_KEY in your environment (.env)."
            )
            
        try:
            from google.genai import types
            response = self.client.models.generate_content(
                model="gemini-3.5-flash",
                contents=f"Synthesize the strategic direction using the following discovery and research context. Generate a cohesive strategy:\n\n{text}",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=StrategyDocument,
                    temperature=0.1
                )
            )
            if response.parsed:
                return response.parsed
            
            import json
            return StrategyDocument.model_validate(json.loads(response.text))

        except ValidationError as ve:
            raise ValueError(f"Schema validation failed during extraction: {ve}")
        except Exception as e:
            raise RuntimeError(f"An error occurred during LLM synthesis: {e}")
