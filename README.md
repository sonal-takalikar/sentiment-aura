# Sentiment Aura

A full-stack AI-powered application that visualizes emotions in real-time through generative art using Perlin noise fields.

## 🎯 Features

- **Real-time Transcription**: Live audio transcription using Deepgram WebSocket API
- **AI Sentiment Analysis**: Emotion detection using Groq's LLM (6 emotions: joy, sadness, anger, fear, surprise, calm)
- **Generative Visualization**: Dynamic Perlin noise particle system that responds to emotions
- **Intelligent Keywords**: Automatic extraction of meaningful keywords with stop-word filtering
- **Smooth Animations**: Word-by-word fade-in, graceful keyword appearance, smooth scrolling transcript

## 🏗️ Architecture

**MVC Design Pattern:**
- **Frontend**: React + p5.js for visualization
- **Backend**: FastAPI (Python) as API proxy
- **External APIs**: Deepgram (transcription) + Groq (sentiment analysis)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- Deepgram API key
- Groq API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_key_here" > .env

# Run backend
python main.py
```

Backend runs on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_DEEPGRAM_API_KEY=your_deepgram_key_here" > .env
echo "REACT_APP_BACKEND_URL=http://localhost:8000" >> .env

# Run frontend
npm start
```

Frontend runs on `http://localhost:3000`

## 🎨 Emotion Visual Mapping

| Emotion | Color | Speed | Particle Type |
|---------|-------|-------|---------------|
| Joy | Yellow/Orange | 4.0 (Fast) | Stars |
| Sadness | Blue/Purple | 0.4 (Very Slow) | Clouds |
| Anger | Red | 5.0 (Chaotic) | Triangles |
| Fear | Dark Purple | 2.5 (Jittery) | Erratic |
| Surprise | Bright/Vibrant | 5.0 (Explosive) | Stars |
| Calm | Soft Blue/Green | 0.8 (Gentle) | Waves |

## 🛠️ Technologies Used

**Frontend:**
- React
- p5.js (react-p5)
- Axios
- WebSocket API

**Backend:**
- FastAPI
- Groq API (LLM)
- Python 3.8+

**External Services:**
- Deepgram (Real-time transcription)
- Groq (Sentiment analysis)

## 📝 License

MIT License

## 👤 Author

Sonal Takalikar

---

Built for Memory Machines Co-Op Application