import logging
import pdfplumber
import pandas as pd
from docx import Document as DocxDocument
from pathlib import Path

from app.services.ocr_service import ocr_service

logger = logging.getLogger(__name__)

class DocumentService:
    def extract_text(self, file_path: str) -> str:
        ext = Path(file_path).suffix.lower()
        try:
            if ext == '.pdf':
                return self._extract_pdf(file_path)
            elif ext == '.docx':
                return self._extract_docx(file_path)
            elif ext == '.txt':
                return self._extract_txt(file_path)
            elif ext in ['.csv', '.xlsx']:
                return self._extract_spreadsheet(file_path, ext)
            elif ext in ['.png', '.jpg', '.jpeg']:
                return ocr_service.extract_text(file_path)
            else:
                logger.warning(f"Unsupported file extension: {ext}")
                return ""
        except Exception as e:
            logger.error(f"Failed to extract text from {file_path}: {e}")
            return ""

    def _extract_pdf(self, file_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.error(f"pdfplumber failed for {file_path}: {e}")
            
        if not text.strip():
            logger.info(f"PDF extraction yielded no text, falling back to OCR for {file_path}")
            # Simplified fallback for Hackathon MVP
            pass
        return text.strip()

    def _extract_docx(self, file_path: str) -> str:
        try:
            doc = DocxDocument(file_path)
            return "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            logger.error(f"docx extraction failed for {file_path}: {e}")
            return ""

    def _extract_txt(self, file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"txt extraction failed for {file_path}: {e}")
            return ""

    def _extract_spreadsheet(self, file_path: str, ext: str) -> str:
        try:
            if ext == '.csv':
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
                
            # Convert rows to natural language
            text_lines = []
            for _, row in df.iterrows():
                row_text = ", ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                text_lines.append(row_text)
            return "\n".join(text_lines)
        except Exception as e:
            logger.error(f"Spreadsheet extraction failed for {file_path}: {e}")
            return ""

document_service = DocumentService()
