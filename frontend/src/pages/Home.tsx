import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const Home: React.FC = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Function to translate text to English using backend service
  const translateText = async (text: string) => {
    try {
      const formData = new FormData();
      formData.append('prompt', `
        Translate the following text to English:
        ${text}
      `);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let description = response.data.description;

      // Clean up the response
      description = description.replace(/```json|```/g, '').trim();
      setTranslatedText(description);
    } catch (error) {
      console.error('Error translating text:', error);
      setError('Failed to translate text');
    }
  };

  useEffect(() => {
    if (transcript) {
      translateText(transcript);
    }
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'zh-CN' });
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Live Translation App</h1>

      <div className="mb-4">
        {listening ? (
          <p className="text-xl text-green-500">Listening...</p>
        ) : (
          <p className="text-xl text-red-500">Mic is off</p>
        )}
      </div>

      <div className="space-x-4">
        <button
          onClick={startListening}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={listening}
        >
          Start Mic
        </button>
        <button
          onClick={stopListening}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          disabled={!listening}
        >
          Stop Mic
        </button>
        <button
          onClick={resetTranscript}
          className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Reset
        </button>
      </div>

      <div className="mt-8 p-4 bg-white shadow-md rounded w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Live Translation:</h2>
        {error ? (
          <p className="text-lg text-red-500">{error}</p>
        ) : (
          <p className="text-lg">{translatedText}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
