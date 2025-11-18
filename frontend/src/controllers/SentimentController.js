import axios from 'axios';

class SentimentController {
  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  }

  async analyzeSentiment(text) {
    try {
      const response = await axios.post(`${this.backendUrl}/process_text`, {
        text: text
      });
      
      if (response.data) {
        return response.data;
      }
      
      return null;
      
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return null;
    }
  }
}

export default SentimentController;
