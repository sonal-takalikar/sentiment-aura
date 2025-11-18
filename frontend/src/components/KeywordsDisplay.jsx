import React, { useState, useEffect } from 'react';
import './KeywordsDisplay.css';

function KeywordsDisplay({ keywords, emotion, sentiment }) {
  const [displayedKeywords, setDisplayedKeywords] = useState([]);

  useEffect(() => {
    // Animate keywords appearing one by one
    if (keywords.length > displayedKeywords.length) {
      const timer = setTimeout(() => {
        setDisplayedKeywords(keywords.slice(0, displayedKeywords.length + 1));
      }, 300); // Delay between each keyword

      return () => clearTimeout(timer);
    } else if (keywords.length < displayedKeywords.length) {
      // Reset when keywords change
      setDisplayedKeywords([]);
    }
  }, [keywords, displayedKeywords]);

  return (
    <div className="keywords-display">
      <div className="emotion-badge">
        <span className="label">Emotion:</span>
        <span className={`value ${emotion}`}>{emotion}</span>
      </div>
      
      <div className="sentiment-meter">
        <span className="label">Sentiment:</span>
        <div className="meter">
          <div 
            className="fill" 
            style={{ 
              width: `${((sentiment + 1) / 2) * 100}%`,
              background: sentiment > 0 ? '#4ade80' : '#f87171'
            }}
          />
        </div>
        <span className="value">{sentiment.toFixed(2)}</span>
      </div>

      {displayedKeywords.length > 0 && (
        <div className="keywords-list">
          <span className="label">Keywords:</span>
          <div className="tags">
            {displayedKeywords.map((word, i) => (
              <span key={i} className="tag fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KeywordsDisplay;