import os
import shutil
from pathlib import Path
from fastapi import UploadFile

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    try:
        os.makedirs(destination, exist_ok=True)
        file_path = os.path.join(destination, upload_file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return file_path
    except Exception as e:
        import logging
        logging.error(f"Failed to save upload file {upload_file.filename}: {e}")
        raise
