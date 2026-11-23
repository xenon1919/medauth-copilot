import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MedAuth AI"
    VERSION: str = "0.1.0"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_FLASH_MODEL: str = os.getenv("GEMINI_FLASH_MODEL", "gemini-3.8-flash")
    GEMINI_PRO_MODEL: str = os.getenv("GEMINI_PRO_MODEL", "gemini-3.8-pro")

settings = Settings()
