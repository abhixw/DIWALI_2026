from app.schemas.story import StoryRequest
from app.core.security import sanitize_text

def prepare_context(data: StoryRequest) -> StoryRequest:
    """Cleans and prepares the visitor request, ensuring age-appropriateness and sanitized inputs."""
    cleaned_name = sanitize_text(data.name) if data.name else None
    cleaned_occupation = sanitize_text(data.occupation)
    cleaned_chapter = sanitize_text(data.current_chapter)
    cleaned_feeling = sanitize_text(data.year_feeling)
    cleaned_proud = sanitize_text(data.proud_of) if data.proud_of else None
    cleaned_gratitude = [sanitize_text(g) for g in data.gratitude if g.strip()]
    cleaned_wish = sanitize_text(data.heart_wish)
    cleaned_leave = sanitize_text(data.leave_behind) if data.leave_behind else None

    # Adapt for younger users if needed
    is_young = data.age_group in ["Under 13", "13–17"]
    if is_young and not cleaned_occupation:
        cleaned_occupation = "Student"

    return StoryRequest(
        name=cleaned_name,
        age_group=data.age_group,
        occupation=cleaned_occupation,
        current_chapter=cleaned_chapter,
        year_feeling=cleaned_feeling,
        proud_of=cleaned_proud,
        gratitude=cleaned_gratitude,
        heart_wish=cleaned_wish,
        leave_behind=cleaned_leave,
        tone=data.tone or "heartfelt"
    )
