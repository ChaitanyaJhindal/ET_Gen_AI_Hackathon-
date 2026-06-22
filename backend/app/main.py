import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, assets, chatbot, rca

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Industrial Knowledge Intelligence Platform",
    description="Backend MVP for Hackathon",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router)
app.include_router(assets.router)
app.include_router(chatbot.router)
app.include_router(rca.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Industrial Knowledge Intelligence Platform API"}
