import logging
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config.settings import settings
from app.utils.file_utils import save_upload_file
from app.services.document_service import document_service
from app.services.chunk_service import chunk_service
from app.services.entity_service import entity_service
from app.services.knowledge_service import knowledge_service
from app.services.vector_service import vector_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("")
async def upload_document(file: UploadFile = File(...)):
    try:
        # 1. Save File
        file_path = save_upload_file(file, settings.UPLOAD_FOLDER)
        
        # 2. Extract Text
        text = document_service.extract_text(file_path)
        if not text:
            raise HTTPException(status_code=400, detail="Failed to extract text from document.")
            
        # 3. Understand Document (Entities at doc level)
        doc_entities = entity_service.analyze_document(text)
        
        # Update knowledge store with document level entities
        equipment_ids = doc_entities.get("equipment_ids", [])
        for eq_id in equipment_ids:
            knowledge_service.update_asset(eq_id, {
                "failures": doc_entities.get("failures", []),
                "maintenance_events": doc_entities.get("maintenance_events", []),
                "documents": [file.filename]
            })
            
        # 4. Chunk Text
        chunks = chunk_service.chunk_text(text)
        
        # 5. Store in ChromaDB
        metadatas = []
        ids = []
        for i, chunk in enumerate(chunks):
            metadatas.append({
                "filename": file.filename,
                "equipment_ids": ",".join(str(e) for e in equipment_ids) if equipment_ids else "None"
            })
            ids.append(str(uuid.uuid4()))
            
        vector_service.insert_chunks(chunks, metadatas, ids)
        
        return {"filename": file.filename, "message": "Document processed and ingested successfully."}
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
