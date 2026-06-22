import logging
import chromadb
from app.config.settings import settings

logger = logging.getLogger(__name__)

class VectorService:
    def __init__(self):
        try:
            if settings.CHROMA_USE_CLOUD:
                logger.info("Connecting to Chroma Cloud...")
                self.client = chromadb.CloudClient(
                    tenant=settings.CHROMA_TENANT,
                    database=settings.CHROMA_DATABASE,
                    api_key=settings.CHROMA_API_KEY
                )
            else:
                logger.info("Connecting to Local ChromaDB...")
                self.client = chromadb.PersistentClient(path=settings.CHROMA_PATH)
                
            self.collection = self.client.get_or_create_collection(name="industrial_knowledge")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")

    def insert_chunks(self, chunks: list[str], metadatas: list[dict], ids: list[str]):
        try:
            from app.services.embedding_service import embedding_service
            embeddings_model = embedding_service.get_embeddings()
            
            embeddings = embeddings_model.embed_documents(chunks)
            
            self.collection.add(
                documents=chunks,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"Inserted {len(chunks)} chunks into Vector DB.")
        except Exception as e:
            logger.error(f"Vector DB insertion failed: {e}")

    def retrieve(self, query: str, n_results: int = 5) -> list[str]:
        try:
            from app.services.embedding_service import embedding_service
            embeddings_model = embedding_service.get_embeddings()
            query_embedding = embeddings_model.embed_query(query)
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            if results and results['documents'] and len(results['documents']) > 0:
                return results['documents'][0]
            return []
        except Exception as e:
            logger.error(f"Vector retrieval failed: {e}")
            return []

vector_service = VectorService()
