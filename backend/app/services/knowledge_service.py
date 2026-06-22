import os
import json
import logging
from app.config.settings import settings

logger = logging.getLogger(__name__)

class KnowledgeService:
    def __init__(self):
        self.filepath = settings.KNOWLEDGE_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump({}, f)

    def load_knowledge(self) -> dict:
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load knowledge: {e}")
            return {}

    def save_knowledge(self, data: dict):
        try:
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            logger.error(f"Failed to save knowledge: {e}")

    def update_asset(self, asset_id: str, updates: dict):
        data = self.load_knowledge()
        if asset_id not in data:
            data[asset_id] = {
                "status": "working",
                "operator": None,
                "phone": None,
                "failures": [],
                "maintenance_events": [],
                "documents": []
            }
        
        asset = data[asset_id]
        
        if "status" in updates and updates["status"]:
            asset["status"] = updates["status"]
        if "operator" in updates and updates["operator"]:
            asset["operator"] = updates["operator"]
        if "phone" in updates and updates["phone"]:
            asset["phone"] = updates["phone"]
            
        if "failures" in updates and isinstance(updates["failures"], list):
            for f in updates["failures"]:
                if f not in asset["failures"]:
                    asset["failures"].append(f)
                    
        if "maintenance_events" in updates and isinstance(updates["maintenance_events"], list):
            for m in updates["maintenance_events"]:
                if m not in asset["maintenance_events"]:
                    asset["maintenance_events"].append(m)
                    
        if "documents" in updates and isinstance(updates["documents"], list):
            for d in updates["documents"]:
                if d not in asset["documents"]:
                    asset["documents"].append(d)
                    
        self.save_knowledge(data)

    def get_asset(self, asset_id: str) -> dict:
        data = self.load_knowledge()
        return data.get(asset_id, {})

    def get_all_assets(self) -> dict:
        return self.load_knowledge()

knowledge_service = KnowledgeService()
