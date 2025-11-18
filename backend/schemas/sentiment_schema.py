from pydantic import BaseModel

class TextInput(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: float
    keywords: list[str]
    emotion: str