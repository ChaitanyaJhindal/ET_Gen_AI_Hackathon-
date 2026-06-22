import logging
from fastapi import APIRouter, HTTPException
from app.services.knowledge_service import knowledge_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("")
async def get_all_assets():
    try:
        return knowledge_service.get_all_assets()
    except Exception as e:
        logger.error(f"Failed to get assets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{asset_id}")
async def get_asset(asset_id: str):
    try:
        asset = knowledge_service.get_asset(asset_id)
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        asset["equipment"] = asset_id
        return asset
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get asset {asset_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
