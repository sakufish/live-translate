declare module 'react-speech-recognition' {
    export function startListening(options?: { continuous?: boolean; language?: string }): void;
    export function stopListening(): void;
    export function abortListening(): void;
    export function resetTranscript(): void;
  
    export interface UseSpeechRecognitionOptions {
      transcript?: string;
      interimTranscript?: string;
      finalTranscript?: string;
      listening?: boolean;
      resetTranscript: () => void;
      browserSupportsSpeechRecognition?: boolean;
    }
  
    export function useSpeechRecognition(): UseSpeechRecognitionOptions;
  
    export default SpeechRecognition;
  }
  