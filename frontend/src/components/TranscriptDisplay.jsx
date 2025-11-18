import React, { useEffect, useRef, useState } from 'react';
import './TranscriptDisplay.css';

function TranscriptDisplay({ transcript }) {
  const [lines, setLines] = useState(['', '']);
  const [animateKey, setAnimateKey] = useState(0);
  const previousTranscriptRef = useRef('');

  useEffect(() => {
    if (transcript && transcript !== previousTranscriptRef.current) {
      const words = transcript.split(' ').filter(w => w.trim());
      
      // Build lines dynamically (approximately 50 chars per line)
      let currentLines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + ' ' + word).length > 50) {
          currentLines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      });
      
      if (currentLine) {
        currentLines.push(currentLine.trim());
      }
      
      // Show only last 2 lines
      const displayLines = currentLines.length >= 2 
        ? currentLines.slice(-2) 
        : [...Array(2 - currentLines.length).fill(''), ...currentLines];
      
      setLines(displayLines);
      setAnimateKey(prev => prev + 1); // Trigger animation
      previousTranscriptRef.current = transcript;
    }
  }, [transcript]);

  return (
    <div className="transcript-display">
      <div className="transcript-header">
        <h3>Live Transcript</h3>
        <div className="pulse-indicator" />
      </div>
      <div className="transcript-content">
        {lines[0] || lines[1] ? (
          <div className="lines-container" key={animateKey}>
            <div className="transcript-line">
              {lines[0] || '\u00A0'}
            </div>
            <div className="transcript-line">
              {lines[1] || 'Waiting for speech...'}
            </div>
          </div>
        ) : (
          <div className="waiting">Waiting for speech...</div>
        )}
      </div>
    </div>
  );
}

export default TranscriptDisplay;