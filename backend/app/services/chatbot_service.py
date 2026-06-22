import logging
from app.services.llm_service import llm_service
from app.services.vector_service import vector_service
from app.services.knowledge_service import knowledge_service

logger = logging.getLogger(__name__)

class ChatbotService:
    def chat(self, question: str) -> tuple[str, list[str]]:
        # 1. Extract asset IDs from question
        extraction_prompt = f"Extract any asset or equipment IDs mentioned in the following question. Return a JSON array of strings: {question}"
        system_msg = "You extract asset IDs and return ONLY a JSON array, e.g., ['P-101']. If none, return []."
        asset_ids = llm_service.generate_json(extraction_prompt, system_msg)
        
        if not isinstance(asset_ids, list):
            asset_ids = []
            
        # 2. Load knowledge.json for these assets
        asset_knowledge_texts = []
        for asset_id in asset_ids:
            data = knowledge_service.get_asset(asset_id)
            if data:
                asset_info = f"ASSET INFORMATION\nEquipment: {asset_id}\nOperator: {data.get('operator')}\nStatus: {data.get('status')}\nPrevious Failures: {', '.join(data.get('failures', []))}"
                asset_knowledge_texts.append(asset_info)
                
        asset_context = "\n\n".join(asset_knowledge_texts)
        
        # 3. Retrieve related chunks from ChromaDB
        retrieved_chunks = vector_service.retrieve(question, n_results=5)
        doc_context = "DOCUMENT KNOWLEDGE\n" + "\n".join(retrieved_chunks) if retrieved_chunks else ""
        
        # 4. Assemble context
        context = f"{asset_context}\n\n{doc_context}\n\nQUESTION\n{question}"
        
        # 5. Send to LLM
        system_prompt = """You are an Industrial Knowledge Intelligence assistant.
Never answer immediately. Always:
1. understand the asset involved;
2. inspect historical knowledge;
3. inspect retrieved documents;
4. correlate information;
5. explain causes;
6. recommend actions;
7. cite sources.
Never hallucinate. Do not include citation markers like 【1†source】 in the output text. If information is missing, explicitly state it."""

        answer = llm_service.generate_text(context, system_prompt)
        
        import re
        answer = re.sub(r'【.*?】', '', answer)
        
        return answer, retrieved_chunks

chatbot_service = ChatbotService()
