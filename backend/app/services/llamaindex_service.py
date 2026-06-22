from llama_index.core import Document as LlamaDocument

class LlamaIndexService:
    def create_document(self, text: str, metadata: dict = None) -> LlamaDocument:
        metadata = metadata or {}
        return LlamaDocument(text=text, metadata=metadata)

llamaindex_service = LlamaIndexService()
