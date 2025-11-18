from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

from models.sentiment_model import SentimentModel
from schemas.sentiment_schema import TextInput, SentimentResponse

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Model
sentiment_model = SentimentModel()

@app.get("/")
async def root():
    return {"status": "Sentiment Aura Backend Running"}

@app.post("/process_text", response_model=SentimentResponse)
async def process_text(input: TextInput):
    """Controller: handles request and delegates to model"""
    try:
        print(f"Processing text: {input.text}")
        result = sentiment_model.analyze_text(input.text)
        print(f"Final result: {result}")
        return SentimentResponse(**result)
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)