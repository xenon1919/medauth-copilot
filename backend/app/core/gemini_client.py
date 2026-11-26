import os
from typing import Optional, Any
from app.core.config import settings

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

class GeminiService:
    """
    Wrapper for Google GenAI SDK supporting Gemini 3.8 Flash and Gemini 3.8 Pro.
    Gracefully handles missing API keys by enabling offline deterministic simulation mode.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.client: Optional[Any] = None
        
        if self.api_key and GENAI_AVAILABLE:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiService] Warning: Could not initialize Gemini client: {e}")
                self.client = None

    @property
    def is_live(self) -> bool:
        return self.client is not None

    async def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_schema: Any,
        model_name: Optional[str] = None
    ) -> Any:
        model = model_name or settings.GEMINI_FLASH_MODEL

        if not self.is_live:
            return None

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=response_schema
            )
            response = self.client.models.generate_content(
                model=model,
                contents=prompt,
                config=config
            )
            return response.parsed if hasattr(response, 'parsed') and response.parsed else response.text
        except Exception as e:
            print(f"[GeminiService] Generation failed: {e}")
            return None

gemini_service = GeminiService()
