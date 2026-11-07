from fastapi import HTTPException, status

class AIProviderError(HTTPException):
    def __init__(self, detail: str = "The AI storytelling engine encountered an unexpected delay. Please try again."):
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)

class RateLimitError(HTTPException):
    def __init__(self, detail: str = "Too many requests. Please pause for a moment before creating another story."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)

class InvalidRequestError(HTTPException):
    def __init__(self, detail: str = "Invalid story generation request."):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
