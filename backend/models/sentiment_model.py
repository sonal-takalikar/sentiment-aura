from groq import Groq
import os
import re

class SentimentModel:
    def __init__(self):
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        # Common stop words to filter
        self.stop_words = {
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 
            'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself', 'she', 
            'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
            'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 
            'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 
            'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
            'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 
            'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 
            'against', 'between', 'into', 'through', 'during', 'before', 'after', 
            'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 
            'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 
            'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 
            'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
            'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 
            'don', 'should', 'now', 'would', 'could', 'also', 'get', 'got', 'like'
        }
    
    def extract_keywords_from_text(self, text):
        """Extract meaningful keywords directly from the transcript"""
        # Remove punctuation and convert to lowercase
        words = re.findall(r'\b[a-z]+\b', text.lower())
        
        # Filter out stop words and short words
        keywords = []
        for word in words:
            if word not in self.stop_words and len(word) > 3:
                if word not in keywords:  # Avoid duplicates
                    keywords.append(word)
        
        return keywords[:5]  # Return max 5 keywords
    
    def analyze_text(self, text: str) -> dict:
        """Analyze sentiment using Groq API"""
        try:
            # Get emotion and sentiment from Groq
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{
                    "role": "user",
                    "content": f"""Analyze the emotion in this text. Respond in EXACTLY this format:
EMOTION: [one word: joy, sadness, anger, fear, surprise, or calm]
SENTIMENT: [number between -1 and 1]

Text: {text}"""
                }],
                temperature=0.3,
                max_tokens=50
            )
            
            result_text = response.choices[0].message.content.strip()
            print(f"Groq response: {result_text}")
            
            # Parse response
            emotion = "calm"
            sentiment = 0.0
            
            for line in result_text.split('\n'):
                if 'EMOTION:' in line:
                    emotion = line.split('EMOTION:')[1].strip().lower()
                elif 'SENTIMENT:' in line:
                    try:
                        sentiment = float(line.split('SENTIMENT:')[1].strip())
                        sentiment = max(-1, min(1, sentiment))
                    except:
                        pass
            
            # Extract keywords from the actual transcript
            keywords = self.extract_keywords_from_text(text)
            
            print(f"Extracted keywords from transcript: {keywords}")
            
            return {
                "sentiment": sentiment,
                "keywords": keywords,
                "emotion": emotion
            }
            
        except Exception as e:
            print(f"Model error: {str(e)}")
            raise