import logging
import pytesseract
from PIL import Image
import os

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        try:
            from paddleocr import PaddleOCR
            self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang='en')
            self.paddle_available = True
        except ImportError:
            logger.warning("PaddleOCR not installed, using pytesseract only.")
            self.paddle_available = False
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            self.paddle_available = False

    def extract_text(self, image_path: str) -> str:
        try:
            if self.paddle_available:
                logger.info(f"Using PaddleOCR for {image_path}")
                result = self.paddle_ocr.ocr(image_path, cls=True)
                extracted_text = ""
                if result:
                    for line in result:
                        if line:
                            for word_info in line:
                                extracted_text += word_info[1][0] + "\n"
                if extracted_text.strip():
                    return extracted_text.strip()
            
            logger.info(f"Fallback to pytesseract for {image_path}")
            return self._fallback_ocr(image_path)
            
        except Exception as e:
            logger.error(f"OCR failed for {image_path}: {e}")
            return self._fallback_ocr(image_path)

    def _fallback_ocr(self, image_path: str) -> str:
        try:
            img = Image.open(image_path)
            text = pytesseract.image_to_string(img)
            return text.strip()
        except Exception as e:
            logger.error(f"Fallback OCR failed for {image_path}: {e}")
            return ""

ocr_service = OCRService()
