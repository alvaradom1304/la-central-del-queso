import os
from src.core.automation_schema import AutomationDocument
from pydantic import ValidationError

class AutomationAnalyzer:
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
        
    def analyze(self, text: str) -> AutomationDocument:
        """
        Synthesize AI & automation architecture.
        """
        if not self.provider or not self.client:
            raise ValueError(
                "No API key found. Please set GEMINI_API_KEY in your environment (.env)."
            )
            
        try:
            from google.genai import types
            response = self.client.models.generate_content(
                model="gemini-3.5-flash",
                contents=f"Formulate the AI & Automation Systems Architecture based on the discovery insights and digital ecosystem constraints provided here:\n\n{text}",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AutomationDocument,
                    temperature=0.1
                )
            )
            if response.parsed:
                return response.parsed
            
            import json
            return AutomationDocument.model_validate(json.loads(response.text))

        except ValidationError as ve:
            raise ValueError(f"Schema validation failed during extraction: {ve}")
        except Exception as e:
            raise RuntimeError(f"An error occurred during LLM synthesis: {e}")
