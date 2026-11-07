import json
import logging
import re
import time
from typing import Optional, Dict, Any
from groq import Groq, GroqError
from app.config import settings
from app.schemas.story import StoryResponse, DiwaliIdentity, StoryRequest
from app.prompts.diwali_story import SYSTEM_PROMPT, build_user_prompt, build_refine_prompt

logger = logging.getLogger("diwali.ai")

class GroqAIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self._client: Optional[Groq] = None

        if self.api_key:
            try:
                self._client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.warning("Could not initialize Groq client: %s", str(e))
                self._client = None

    @property
    def is_configured(self) -> bool:
        return bool(
            self._client 
            and self.api_key 
            and not self.api_key.startswith("your_")
            and len(self.api_key.strip()) > 10
        )

    def _call_groq_with_retries(self, messages: list, max_retries: int = 2) -> Optional[str]:
        if not self.is_configured:
            return None

        delay = 1.0
        for attempt in range(max_retries + 1):
            try:
                logger.info("Calling Groq model: %s (attempt %d/%d)", self.model, attempt + 1, max_retries + 1)
                chat_completion = self._client.chat.completions.create(
                    messages=messages,
                    model=self.model,
                    temperature=0.3,
                    max_completion_tokens=2200,
                    response_format={"type": "json_object"},
                    timeout=30.0
                )
                content = chat_completion.choices[0].message.content
                if content:
                    return content
            except GroqError as ge:
                logger.error("Groq API error on attempt %d: %s", attempt + 1, str(ge))
                # Do not retry on 401 Unauthorized or 400 Bad Request
                err_str = str(ge).lower()
                if "401" in err_str or "auth" in err_str or "unauthorized" in err_str or "invalid_api_key" in err_str:
                    break
                if attempt == max_retries:
                    break
                time.sleep(delay)
                delay *= 2
            except Exception as ex:
                logger.error("Unexpected error during Groq call: %s", str(ex))
                if attempt == max_retries:
                    break
                time.sleep(delay)
                delay *= 2

        return None

    def generate_story(self, request_data: StoryRequest) -> Optional[StoryResponse]:
        if not self.is_configured:
            return None

        user_content = build_user_prompt(request_data)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ]

        raw_output = self._call_groq_with_retries(messages)
        if not raw_output:
            return None

        return self._parse_and_validate(raw_output, request_data.tone)

    def refine_story(self, original_req: StoryRequest, current_letter: str, new_tone: str) -> Optional[StoryResponse]:
        if not self.is_configured:
            return None

        user_content = build_refine_prompt(original_req, current_letter, new_tone)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ]

        raw_output = self._call_groq_with_retries(messages)
        if not raw_output:
            return None

        return self._parse_and_validate(raw_output, new_tone)

    def _parse_and_validate(self, raw_json: str, tone: Optional[str]) -> Optional[StoryResponse]:
        try:
            cleaned = raw_json.strip()
            # Clean possible think/reasoning blocks from reasoning models like gpt-oss-120b
            cleaned = re.sub(r'<think>.*?</think>', '', cleaned, flags=re.DOTALL).strip()
            # Clean possible markdown wrapping if returned despite json_object
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            parsed = json.loads(cleaned)
            identity_data = parsed.get("identity", {})
            identity = DiwaliIdentity(
                title=identity_data.get("title", "The Resilient Flame"),
                description=identity_data.get("description", "A gentle reminder that your light shines uniquely through life's unfolding moments.")
            )

            letter = (
                parsed.get("diwali_letter")
                or parsed.get("personal_letter")
                or parsed.get("letter")
                or parsed.get("diwali_message")
                or parsed.get("message")
                or ""
            ).strip()

            if not letter:
                logger.warning("AI output JSON had missing/empty diwali_letter, falling back to contextual generator")
                return None

            future_let = (
                parsed.get("future_letter")
                or parsed.get("future_self_letter")
                or parsed.get("letter_to_future_self")
                or parsed.get("future_self")
                or ""
            ).strip()

            bless = (
                parsed.get("blessing")
                or parsed.get("diwali_blessing")
                or parsed.get("card_blessing")
                or parsed.get("greeting")
                or ""
            ).strip()

            promise = (
                parsed.get("personal_promise")
                or parsed.get("promise")
                or ""
            ).strip()

            return StoryResponse(
                identity=identity,
                diwali_letter=letter,
                future_letter=future_let,
                blessing=bless,
                personal_promise=promise,
                tone=tone or "heartfelt",
                model_used=self.model,
                is_fallback=False
            )
        except Exception as e:
            logger.error("Failed to parse and validate AI response JSON: %s", str(e))
            return None

ai_service = GroqAIService()
