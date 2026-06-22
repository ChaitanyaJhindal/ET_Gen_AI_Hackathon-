import logging
from app.services.llm_service import llm_service
from app.services.vector_service import vector_service
from app.services.knowledge_service import knowledge_service

logger = logging.getLogger(__name__)

class RCAService:
    def generate_rca(self, asset_id: str) -> dict:
        # Load asset data
        data = knowledge_service.get_asset(asset_id)
        if not data:
            return {"root_cause": "Asset not found in knowledge base.", "recommendation": "Verify asset ID."}
            
        failures = ", ".join(data.get("failures", []))
        maintenance = ", ".join(data.get("maintenance_events", []))
        
        # Retrieve context
        query = f"Failures and maintenance for equipment {asset_id} {failures}"
        retrieved_chunks = vector_service.retrieve(query, n_results=5)
        doc_context = "\n".join(retrieved_chunks)
        
        prompt = f"""ASSET: {asset_id}
FAILURE HISTORY: {failures}
MAINTENANCE HISTORY: {maintenance}
RELATED DOCUMENTS: {doc_context}

Perform a Root Cause Analysis for {asset_id}.
Return STRICT JSON with two keys:
{{
  "root_cause": "Detailed explanation of the likely root cause",
  "recommendation": "Actionable recommendations"
}}"""

        system_prompt = "You are an Industrial RCA Expert. Output ONLY valid JSON."
        result = llm_service.generate_json(prompt, system_prompt)
        
        return {
            "root_cause": result.get("root_cause", "Analysis failed."),
            "recommendation": result.get("recommendation", "Analysis failed.")
        }

rca_service = RCAService()
