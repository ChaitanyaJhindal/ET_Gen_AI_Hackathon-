import logging
from app.services.llm_service import llm_service

logger = logging.getLogger(__name__)

class EntityService:
    def analyze_document(self, text: str) -> dict:
        system_prompt = """You are an Industrial Knowledge Intelligence assistant.
Analyze the document and extract information into the following strict JSON format:
{
  "summary": "...",
  "document_type": "...",
  "equipment_ids": [],
  "people": [],
  "technicians": [],
  "operators": [],
  "phone_numbers": [],
  "failures": [],
  "maintenance_events": [],
  "dates": [],
  "locations": []
}
Output STRICT JSON. Do not include markdown or explanations."""
        
        prompt = f"DOCUMENT TEXT:\n{text}"
        return llm_service.generate_json(prompt, system_prompt)

    def extract_entities_for_chunk(self, chunk: str) -> dict:
        system_prompt = """You are an Industrial Knowledge Intelligence assistant.
Extract entities from the text into the following strict JSON format:
{
  "equipment_ids": [],
  "technicians": [],
  "operators": [],
  "phone_numbers": [],
  "dates": [],
  "failures": [],
  "maintenance_events": [],
  "locations": []
}
Output STRICT JSON. Do not include markdown or explanations."""
        
        prompt = f"CHUNK TEXT:\n{chunk}"
        return llm_service.generate_json(prompt, system_prompt)

entity_service = EntityService()
