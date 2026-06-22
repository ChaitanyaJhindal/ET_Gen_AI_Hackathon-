from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config.settings import settings

class ChunkService:
    def __init__(self):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )

    def chunk_text(self, text: str) -> list[str]:
        return self.splitter.split_text(text)

chunk_service = ChunkService()
