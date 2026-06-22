import logging
import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.config.settings import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.llm = ChatGroq(
            model=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            temperature=0,
            max_tokens=2048,
        )

    def generate_json(self, prompt: str, system_prompt: str = "You are a helpful AI assistant. Output ONLY valid JSON.") -> dict:
        try:
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=prompt)
            ]
            response = self.llm.invoke(messages)
            
            # Clean up the output in case it contains markdown formatting
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            return json.loads(content.strip())
        except Exception as e:
            logger.error(f"LLM JSON generation failed: {e}")
            return {}
            
    def generate_text(self, prompt: str, system_prompt: str) -> str:
        try:
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=prompt)
            ]
            response = self.llm.invoke(messages)
            return response.content.strip()
        except Exception as e:
            logger.error(f"LLM Text generation failed: {e}")
            return "Error generating response."

llm_service = LLMService()
