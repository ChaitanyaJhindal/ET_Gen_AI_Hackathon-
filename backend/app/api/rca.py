import logging
from fastapi import APIRouter, HTTPException
from app.models.asset_models import RCARequest, RCAResponse
from app.services.rca_service import rca_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/rca", tags=["RCA"])

@router.post("", response_model=RCAResponse)
async def perform_rca(request: RCARequest):
    try:
        result = rca_service.generate_rca(request.asset_id)
        return RCAResponse(
            root_cause=result.get("root_cause", ""),
            recommendation=result.get("recommendation", ""),
            mermaid_chart=result.get("mermaid_chart", ""),
            severity=result.get("severity", "High"),
            confidence=result.get("confidence", 85)
        )
    except Exception as e:
        logger.error(f"RCA failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
