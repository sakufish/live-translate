import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const Home: React.FC = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentSentence, setCurrentSentence] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isChineseToEnglish, setIsChineseToEnglish] = useState<boolean>(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateText = async (text: string, source: string, target: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text,
        source,
        target
      });
      setCurrentSentence(text);
      setTranslatedText(response.data.translation);
    } catch (error) {
      console.error('Error translating text:', error);
      setError('Failed to translate text');
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playTranslatedText = () => {
    const speechLang = isChineseToEnglish ? 'en-US' : 'zh-CN';
    speakText(translatedText, speechLang);
  };

  useEffect(() => {
    if (transcript) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        const sentences = transcript.split(/(?<=[.!?])\s+/);
        const lastSentence = sentences[sentences.length - 1];
        if (lastSentence) {
          const sourceLang = isChineseToEnglish ? 'zh' : 'en';
          const targetLang = isChineseToEnglish ? 'en' : 'zh';
          if (lastSentence !== currentSentence) {
            await translateText(lastSentence, sourceLang, targetLang);
          }
        }
        resetTranscript();
      }, 500);
    }
  }, [transcript, isChineseToEnglish]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: isChineseToEnglish ? 'zh-CN' : 'en-US' });
    }
  };

  const handleToggle = () => {
    setIsChineseToEnglish(!isChineseToEnglish);
    resetTranscript();
    if (listening) {
      toggleListening();
      setTimeout(() => toggleListening(), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="border-4 border-blue-500 rounded-xl p-10 max-w-xl w-full bg-gray-100 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Live Translation App</h1>

        <div className="mb-6 flex items-center space-x-4">
          <div className="w-1/3 flex justify-center">
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

          <div className="w-2/3 flex justify-center">
            <span className="text-lg font-semibold text-gray-800">
              {listening ? 'Listening...' : 'Not Listening'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center w-full bg-white p-6 rounded-lg shadow-lg mb-6">
          <button
            onClick={handleToggle}
            className="mb-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            {isChineseToEnglish ? 'Switch to English to Chinese' : 'Switch to Chinese to English'}
          </button>

          <div className="flex flex-row justify-between items-start mb-6">
            <div className="w-1/2 px-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                {isChineseToEnglish ? 'Chinese' : 'English'}
              </p>
              <p className="text-lg font-medium text-gray-800">{currentSentence}</p>
            </div>
            <div className="w-1/2 px-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                {isChineseToEnglish ? 'English' : 'Chinese'}
              </p>
              <p className="text-lg font-medium text-gray-800">{translatedText}</p>
            </div>
          </div>

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <button
            onClick={playTranslatedText}
            className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600"
          >
            Play Translated Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
