import logging
from app.schemas.story import StoryRequest, StoryResponse, DiwaliIdentity
from app.services.ai_service import ai_service
from app.services.context_builder import prepare_context

logger = logging.getLogger("diwali.generator")

def generate_contextual_identity(data: StoryRequest) -> DiwaliIdentity:
    """Derives a rich, culturally resonant identity from their chapter and ambitions."""
    chapter = data.current_chapter.lower()
    feeling = data.year_feeling.lower()
    wish = data.heart_wish.lower()

    if "dream" in chapter or "startup" in chapter or "build" in wish or "business" in wish:
        title = "The Dream Builder"
        desc = "For the persistent soul who transforms quiet aspirations into steady realities, brick by brick."
    elif "career" in chapter or "engineer" in data.occupation.lower() or "grow" in feeling:
        title = "The Quiet Architect"
        desc = "Honoring the steady dedication and patient curiosity that shapes the foundation of your tomorrow."
    elif "family" in chapter or "homemaker" in data.occupation.lower() or "care" in data.occupation.lower():
        title = "The Heart of the Hearth"
        desc = "A reflection of the deep warmth, nurturing patience, and quiet grace you bring into the world around you."
    elif "student" in data.occupation.lower() or "exploring" in chapter or "learning" in chapter:
        title = "The Courageous Explorer"
        desc = "Celebrating the wonder, bravery, and honest curiosity of a heart stepping into its unfolding story."
    elif "peace" in chapter or "retired" in data.occupation.lower() or "grateful" in feeling:
        title = "The Keeper of Stillness"
        desc = "Honoring a life rich in perspective, where true joy is found in gratitude and quiet wisdom."
    elif "challenges" in feeling or "lost" in feeling:
        title = "The Resilient Flame"
        desc = "Like a clay diya that burns brightest in the cool evening wind, your strength is quiet, unyielding, and true."
    else:
        title = "The Silent Dreamer"
        desc = "For the traveler who carries a tender, unwritten light through every twist and turn of the road."

    return DiwaliIdentity(title=title, description=desc)

def generate_contextual_fallback(data: StoryRequest, tone: str = "heartfelt") -> StoryResponse:
    """High-quality empathetic generation based strictly on visitor inputs when AI provider is unavailable."""
    identity = generate_contextual_identity(data)
    name_display = f"{data.name.strip()}" if data.name and data.name.strip() else "Dear Traveler"

    # Personalized elements
    proud_clause = f" Looking back, holding onto the moment you felt proud of—{data.proud_of.strip()}—is a testament to your steady perseverance." if data.proud_of else ""
    gratitude_clause = f" Grounded in gratitude for {', '.join(data.gratitude)}," if data.gratitude else " Grounded in simple gratitude for what remains true,"
    leaving_clause = f" Leaving behind {data.leave_behind.strip()} allows you to step forward unburdened." if data.leave_behind else " Letting go of what no longer serves your spirit frees you to rise."

    if data.age_group in ["Under 13", "13–17"]:
        letter = (
            f"Dear {name_display},\n\n"
            f"Diwali is the festival of quiet wonders, and tonight, your story shines so brightly. "
            f"As a {data.occupation} currently {data.current_chapter.lower()}, you have walked through a year where '{data.year_feeling}'.{proud_clause}\n\n"
            f"Every single diya placed along a courtyard does not light up the entire city at once—it simply glows brightly right where it stands. "
            f"Your dream to {data.heart_wish.lower()} is a gentle flame that needs only your curiosity, your smile, and your belief to grow.{gratitude_clause} "
            f"May this festival bring you laughter, peace, and the courage to always be your wonderful self.\n\n"
            f"Happy Diwali to the light you are."
        )
        future_letter = (
            f"Dear Future {name_display},\n\n"
            f"When another Diwali arrives next year, remember the wishes you carried tonight—especially your hope to {data.heart_wish.lower()}. "
            f"I hope you look back at this chapter with a joyful smile, knowing that every small step you took was worth it. Keep shining brightly."
        )
    else:
        letter = (
            f"{name_display},\n\n"
            f"This evening, as thousands of clay lamps flicker into the quiet night, pause for a moment to witness your own journey. "
            f"In your work as a {data.occupation}, moving through a season of {data.current_chapter.lower()}, you carried a year that felt like '{data.year_feeling}'. "
            f"That alone speaks of quiet strength.{proud_clause}\n\n"
            f"The true meaning of Diwali was never about the absence of darkness, but about the sovereign choice to light a small earthen lamp regardless. "
            f"As your heart reaches toward {data.heart_wish.lower()},{leaving_clause}{gratitude_clause} may you honor how far you have journeyed without rushing where you need to be.\n\n"
            f"May the warmth of this festival remind you: every light has a story, and yours is worthy of reverence."
        )
        future_letter = (
            f"To My Future Self,\n\n"
            f"By the time the diyas are lit for the next Diwali, I hope you remember the earnest hope you held tonight: to {data.heart_wish.lower()}. "
            f"I hope you have treated yourself with tenderness throughout the seasons between, celebrated quiet milestones, and kept the flame of hope alive. "
            f"You were brave enough to begin; be proud of who you are becoming."
        )

    blessing = f"May this sacred Diwali kindle peace in your home, strength in your craft as a {data.occupation}, and gentle courage as you nurture {data.heart_wish.lower()}."
    promise = f"This Diwali, I promise myself to honor my journey, release doubt, and gently move toward {data.heart_wish.lower()}."

    return StoryResponse(
        identity=identity,
        diwali_letter=letter,
        future_letter=future_letter,
        blessing=blessing,
        personal_promise=promise,
        tone=tone,
        model_used="Contextual Emotional Story Engine",
        is_fallback=True
    )

def create_diwali_story(raw_data: StoryRequest) -> StoryResponse:
    """Orchestrates story generation via Groq AI with graceful contextual fallback."""
    clean_data = prepare_context(raw_data)

    if ai_service.is_configured:
        story = ai_service.generate_story(clean_data)
        if story:
            return story
        logger.warning("Groq AI generation returned empty or failed; invoking contextual story engine.")

    # Contextual high-empathy fallback
    return generate_contextual_fallback(clean_data, clean_data.tone or "heartfelt")

def refine_diwali_story(original_req: StoryRequest, current_story: StoryResponse, new_tone: str) -> StoryResponse:
    """Refines tone of the generated story."""
    clean_data = prepare_context(original_req)

    if ai_service.is_configured:
        refined = ai_service.refine_story(clean_data, current_story.diwali_letter, new_tone)
        if refined:
            return refined

    # Contextual tone-adapted fallback
    return generate_contextual_fallback(clean_data, tone=new_tone)
