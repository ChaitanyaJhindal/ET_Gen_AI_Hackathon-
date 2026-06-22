from pydantic import BaseModel
from typing import List, Optional

class Asset(BaseModel):
    equipment: str
    status: str = "working" # working, under-maintenance, not-working
    operator: Optional[str] = None
    phone: Optional[str] = None
    failures: List[str] = []
    maintenance_events: List[str] = []
    documents: List[str] = []

class AssetInfo(Asset):
    pass

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []

class RCARequest(BaseModel):
    asset_id: str

class RCAResponse(BaseModel):
    root_cause: str
    recommendation: str
    mermaid_chart: Optional[str] = None
    severity: Optional[str] = None
    confidence: Optional[int] = None
