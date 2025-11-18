import React from 'react';
import './Controls.css';

function Controls({ isRecording, onStart, onStop }) {
  return (
    <div className="controls">
      <button 
        className={isRecording ? 'recording' : ''}
        onClick={isRecording ? onStop : onStart}
      >
        {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
      </button>
    </div>
  );
}

export default Controls;