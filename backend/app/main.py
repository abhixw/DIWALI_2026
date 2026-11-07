import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.story import router as story_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("diwali.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for The Diwali Within — AI-Powered Personalized Diwali Experience."
)

# CORS configuration
origins = settings.get_cors_origins()
logger.info("Configured CORS origins: %s", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story_router)

@app.get("/")
def root():
    return {
        "message": "The Diwali Within API is glowing warmly.",
        "tagline": "Every Light Has a Story.",
        "philosophy": "Remember. Release. Rise.",
        "health_endpoint": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
