class AudioModel {
  constructor() {
    this.mediaRecorder = null;
    this.socket = null;
    this.stream = null;
    this.deepgramApiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
  }

  async startRecording(onTranscript, onError) {
    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      // Connect to Deepgram with correct format
      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true`,
        ['token', this.deepgramApiKey]
      );

      this.socket = ws;

      ws.onopen = () => {
        console.log('Deepgram connected');
        
        // Start MediaRecorder AFTER connection
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: 'audio/webm;codecs=opus'
        });

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        });

        this.mediaRecorder.start(250);
      };

      ws.onmessage = (message) => {
        const received = JSON.parse(message.data);
        console.log('Deepgram message:', received);
        
        const transcript_text = received.channel?.alternatives[0]?.transcript;
        
        console.log('Transcript text:', transcript_text);
        
        if (transcript_text && transcript_text.trim() !== '') {
          const is_final = received.is_final;
          
          console.log('Adding to transcript:', transcript_text, 'Final:', is_final);
          
          // Only send final transcripts
          if (is_final && transcript_text.length > 5) {
            onTranscript(transcript_text);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError(error);
      };

    } catch (error) {
      console.error('Error starting recording:', error);
      onError(error);
    }
  }

  stopRecording() {
    // Stop media recorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    // Close Deepgram connection
    if (this.socket) {
      this.socket.close();
    }

    // Stop microphone stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}

export default AudioModel;