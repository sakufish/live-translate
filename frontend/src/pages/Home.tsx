import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const Home: React.FC = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateText = async (text: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text,
        source: 'zh',
        target: 'en'
      });
      const translation = response.data.translation;
      setTranslatedText(translation);
      speakText(translation);
    } catch (error) {
      console.error('Error translating text:', error);
      setError('Failed to translate text');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Set the language for the speech synthesis
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (transcript) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const sentences = transcript.split(/(?<=[.!?])\s+/);
        const lastSentence = sentences[sentences.length - 1];
        setCurrentSentence(lastSentence);
        translateText(lastSentence);
        resetTranscript();
      }, 1000);
    }
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'zh-CN' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Live Translation App</h1>

      <div className="mb-6">
        <button
          onClick={toggleListening}
          className={`w-16 h-16 ${listening ? 'bg-red-600' : 'bg-blue-600'} text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300`}
          aria-label={listening ? 'Stop Recording' : 'Start Recording'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {listening ? (
              <circle cx="12" cy="12" r="10" fill="currentColor" />
            ) : (
              <circle cx="12" cy="12" r="10" stroke="currentColor" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="w-1/2 px-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Chinese</p>
            <p className="text-lg font-medium text-gray-800">{currentSentence}</p>
          </div>
          <div className="w-1/2 px-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">English</p>
            <p className="text-lg font-medium text-gray-800">{translatedText}</p>
          </div>
        </div>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Home;
