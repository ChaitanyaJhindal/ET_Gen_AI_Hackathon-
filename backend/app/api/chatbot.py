import logging
from fastapi import APIRouter, HTTPException
from app.models.asset_models import ChatRequest, ChatResponse
from app.services.chatbot_service import chatbot_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        answer, sources = chatbot_service.chat(request.question)
        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
