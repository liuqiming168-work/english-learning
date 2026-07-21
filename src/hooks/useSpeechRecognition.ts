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

      let resolved = false;
      let retried = false;

      const safeResolve = (correct: boolean, text: string) => {
        if (resolved) return;
        resolved = true;
        setIsListening(false);
        resolve({ correct, recognized: text });
      };

      const tryRecognize = () => {
        const recognition = createSpeechRecognition();
        if (!recognition) {
          safeResolve(false, '无法创建语音识别');
          return;
        }

        recognitionRef.current = recognition;
        setIsListening(true);
        setError(null);
        setResult('');

        let hasResult = false;

        recognition.onresult = (event) => {
          hasResult = true;
          const transcript = event.results[0][0].transcript;
          setResult(transcript);
          const correct = compareWords(transcript, targetWord);
          safeResolve(correct, transcript);
        };

        recognition.onerror = (event) => {
          // no-speech / aborted：还没说话就被中断，重试一次
          if ((event.error === 'no-speech' || event.error === 'aborted') && !retried && !hasResult) {
            retried = true;
            // 稍等后重试
            setTimeout(() => {
              if (!resolved) tryRecognize();
            }, 200);
            return;
          }
          setError(`识别出错: ${event.error}`);
          safeResolve(false, event.error === 'no-speech' ? '没有检测到语音，请大声读出来！' : `错误: ${event.error}`);
        };

        recognition.onend = () => {
          // 如果还没有结果且没重试过 → 重试
          if (!hasResult && !retried && !resolved) {
            retried = true;
            setTimeout(() => {
              if (!resolved) tryRecognize();
            }, 200);
            return;
          }
          if (!resolved) {
            setIsListening(false);
          }
        };

        try {
          recognition.start();
        } catch (e) {
          safeResolve(false, '启动失败');
        }
      };

      tryRecognize();
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
