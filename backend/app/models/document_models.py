from pydantic import BaseModel
from typing import List, Optional

class DocumentResponse(BaseModel):
    filename: str
    message: str

class TextChunk(BaseModel):
    text: str
    metadata: dict
