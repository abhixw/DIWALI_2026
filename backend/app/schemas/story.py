from typing import List, Optional
from pydantic import BaseModel, Field

class StoryRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=50, description="Visitor's name or nickname (optional)")
    age_group: str = Field(..., description="Age group: Under 13, 13–17, 18–22, 23–30, 31–45, 46–60, Above 60")
    occupation: str = Field(..., max_length=100, description="Occupation or custom occupation")
    current_chapter: str = Field(..., max_length=200, description="Description of their current life chapter")
    year_feeling: str = Field(..., max_length=250, description="The feeling that defines their year")
    proud_of: Optional[str] = Field(None, max_length=300, description="Something they are proud of this year")
    gratitude: List[str] = Field(default_factory=list, description="Things they are grateful for")
    heart_wish: str = Field(..., max_length=300, description="One thing their heart truly wishes for")
    leave_behind: Optional[str] = Field(None, max_length=200, description="Thing to leave behind this Diwali")
    tone: Optional[str] = Field("heartfelt", description="Tone for generation: heartfelt, emotional, motivational, poetic, simple")

class DiwaliIdentity(BaseModel):
    title: str = Field(..., description="The Diwali Identity title, e.g., 'The Dream Builder'")
    description: str = Field(..., description="A short, meaningful explanation of why this identity fits")

class StoryResponse(BaseModel):
    identity: DiwaliIdentity
    diwali_letter: str = Field(..., description="Personalized Diwali letter acknowledging their journey (~150-220 words)")
    future_letter: str = Field(..., description="Short letter addressed to future self for next Diwali (~80-120 words)")
    blessing: str = Field(..., description="Concise personalized greeting for the card (~25-45 words)")
    personal_promise: str = Field(..., description="Meaningful commitment based on their stated ambition")
    tone: Optional[str] = "heartfelt"
    model_used: Optional[str] = None
    is_fallback: bool = False

class RefineRequest(BaseModel):
    original_request: StoryRequest
    current_story: StoryResponse
    tone: str = Field(..., description="Refined tone: emotional, motivational, poetic, simple and heartfelt")

class HealthResponse(BaseModel):
    status: str
    version: str
    groq_configured: bool
    model: str
