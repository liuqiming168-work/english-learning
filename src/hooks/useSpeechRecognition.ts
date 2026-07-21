import { useCallback, useRef, useState } from 'react';
import { createSpeechRecognition, compareWords, isSpeechRecognitionSupported } from '../utils/speech';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  result: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  checkWord: (targetWord: string) => Promise<{ correct: boolean; recognized: string }>;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('您的浏览器不支持语音识别，请使用 Chrome 浏览器');
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setError(null);
    setResult('');
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setResult(transcript);
    };

    recognition.onerror = (event) => {
      setError(`识别出错: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setError('启动语音识别失败，请重试');
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const checkWord = useCallback((targetWord: string): Promise<{ correct: boolean; recognized: string }> => {
    return new Promise((resolve) => {
      if (!isSupported) {
        resolve({ correct: false, recognized: '浏览器不支持语音识别' });
        return;
      }

      const recognition = createSpeechRecognition();
      if (!recognition) {
        resolve({ correct: false, recognized: '无法创建语音识别' });
        return;
      }

      setIsListening(true);
      setError(null);
      setResult('');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setResult(transcript);
        const correct = compareWords(transcript, targetWord);
        setIsListening(false);
        resolve({ correct, recognized: transcript });
      };

      recognition.onerror = (event) => {
        setError(`识别出错: ${event.error}`);
        setIsListening(false);
        resolve({ correct: false, recognized: `错误: ${event.error}` });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (e) {
        setIsListening(false);
        resolve({ correct: false, recognized: '启动失败' });
      }
    });
  }, [isSupported]);

  return {
    isListening,
    isSupported,
    result,
    error,
    startListening,
    stopListening,
    checkWord,
  };
}
