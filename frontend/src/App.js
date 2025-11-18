import React, { useState, useRef } from 'react';
import AuraView from './views/AuraView';
import Controls from './components/Controls';
import TranscriptDisplay from './components/TranscriptDisplay';
import KeywordsDisplay from './components/KeywordsDisplay';
import AudioModel from './models/AudioModel';
import SentimentController from './controllers/SentimentController';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [sentiment, setSentiment] = useState(0);
  const [emotion, setEmotion] = useState('calm');
  const [keywords, setKeywords] = useState([]);
  const [transcript, setTranscript] = useState(''); // Changed to single string

  const audioModelRef = useRef(new AudioModel());
  const sentimentControllerRef = useRef(new SentimentController());

  const handleTranscript = async (text) => {
    console.log('Transcript text:', text);
    
    // Accumulate transcript
    setTranscript(prev => prev ? `${prev} ${text}` : text);
    
    const result = await sentimentControllerRef.current.analyzeSentiment(text);
    if (result) {
      setSentiment(result.sentiment);
      setEmotion(result.emotion);
      setKeywords(result.keywords);
    }
  };

  const startRecording = () => {
    setTranscript(''); // Clear transcript on start
    audioModelRef.current.startRecording(handleTranscript, console.error);
    setIsRecording(true);
  };

  const stopRecording = () => {
    audioModelRef.current.stopRecording();
    setIsRecording(false);
  };

  return (
    <div className="App">
      <AuraView 
        sentiment={sentiment}
        emotion={emotion}
        keywords={keywords}
      />
      
      <TranscriptDisplay transcript={transcript} />
      
      <KeywordsDisplay 
        keywords={keywords}
        emotion={emotion}
        sentiment={sentiment}
      />
      
      <Controls 
        isRecording={isRecording}
        onStart={startRecording}
        onStop={stopRecording}
      />
    </div>
  );
}

export default App;