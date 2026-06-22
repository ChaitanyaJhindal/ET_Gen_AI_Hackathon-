import sys
import os

# Add the backend directory to the Python path so imports work correctly
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_path)

# Import the FastAPI app
from app.main import app
