import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    CHROMA_PATH: str = os.getenv("CHROMA_PATH", "./chroma_db")
    CHROMA_USE_CLOUD: bool = os.getenv("CHROMA_USE_CLOUD", "false").lower() == "true"
    CHROMA_TENANT: str = os.getenv("CHROMA_TENANT", "default_tenant")
    CHROMA_DATABASE: str = os.getenv("CHROMA_DATABASE", "default_database")
    CHROMA_API_KEY: str = os.getenv("CHROMA_API_KEY", "")
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "./app/storage/uploads")
    PROCESSED_FOLDER: str = os.getenv("PROCESSED_FOLDER", "./app/storage/processed")
    KNOWLEDGE_FILE: str = os.getenv("KNOWLEDGE_FILE", "./app/storage/knowledge/knowledge.json")
    
    # Text Chunking Settings
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 100

settings = Settings()
