import logging
from fastapi import APIRouter, Request, Depends, HTTPException, status
from app.config import settings
from app.schemas.story import StoryRequest, StoryResponse, RefineRequest, HealthResponse
from app.services.story_generator import create_diwali_story, refine_diwali_story
from app.services.ai_service import ai_service
from app.core.security import rate_limiter, get_client_ip

logger = logging.getLogger("diwali.routes")
router = APIRouter(prefix="/api", tags=["Diwali Story"])

def check_rate_limit(request: Request):
    ip = get_client_ip(request)
    rate_limiter.check(ip)

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint providing status and AI model readiness."""
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        groq_configured=ai_service.is_configured,
        model=settings.GROQ_MODEL
    )

@router.post("/story/generate", response_model=StoryResponse)
async def generate_story_endpoint(
    story_req: StoryRequest,
    request: Request,
    _: None = Depends(check_rate_limit)
):
    """
    Generates a personalized Diwali story, identity, letters, blessing and promise
    based on the visitor's reflections.
    """
    try:
        # Note: Do NOT log sensitive user inputs to maintain privacy
        logger.info("Received story generation request for age_group=%s, occupation=%s",
                    story_req.age_group, story_req.occupation)
        result = create_diwali_story(story_req)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Unhandled exception during story generation: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't finish writing your story. Please try again."
        )

@router.post("/story/refine", response_model=StoryResponse)
async def refine_story_endpoint(
    refine_req: RefineRequest,
    request: Request,
    _: None = Depends(check_rate_limit)
):
    """
    Refines the emotional tone of an already generated story.
    Supported tones: emotional, motivational, poetic, simple and heartfelt.
    """
    try:
        logger.info("Received story refinement request with tone=%s", refine_req.tone)
        result = refine_diwali_story(
            refine_req.original_request,
            refine_req.current_story,
            refine_req.tone
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Unhandled exception during story refinement: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not refine the story tone. Please try again."
        )
