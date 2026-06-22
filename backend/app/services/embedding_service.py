import logging
from langchain_community.embeddings import HuggingFaceEmbeddings

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        try:
            self.embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        except Exception as e:
            logger.error(f"Failed to initialize HuggingFace embeddings: {e}")

    def get_embeddings(self):
        return self.embeddings

embedding_service = EmbeddingService()
