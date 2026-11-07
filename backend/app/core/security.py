import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request
from app.core.exceptions import RateLimitError

class SimpleRateLimiter:
    """In-memory sliding window rate limiter per client IP."""
    def __init__(self, max_requests: int = 20, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def check(self, ip: str) -> None:
        now = time.time()
        cutoff = now - self.window_seconds
        # Filter timestamps outside window
        self.requests[ip] = [ts for ts in self.requests[ip] if ts > cutoff]

        if len(self.requests[ip]) >= self.max_requests:
            raise RateLimitError()

        self.requests[ip].append(now)

rate_limiter = SimpleRateLimiter(max_requests=25, window_seconds=60)

def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

def sanitize_text(text: str) -> str:
    """Sanitizes user input by stripping edge whitespace and neutralising prompt injection artifacts."""
    if not text:
        return ""
    # Strip dangerous delimiters
    clean = text.replace("<VISITOR_PROFILE>", "").replace("</VISITOR_PROFILE>", "")
    clean = clean.replace("```json", "").replace("```", "")
    return clean.strip()
