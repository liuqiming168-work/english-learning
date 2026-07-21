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
      let retryCount = 0;
      const MAX_RETRIES = 2;
      // 超时时间：短句给更长时间
      const wordCount = targetWord.split(/\s+/).length;
      const SPEECH_TIMEOUT = Math.max(5000, wordCount * 2000); // 至少5秒，每词加2秒
      
      // 存储所有中间结果，用于取最佳匹配
      const allInterimResults: string[] = [];

      const safeResolve = (correct: boolean, recognized: string) => {
        if (resolved) return;
        resolved = true;
        setIsListening(false);
        resolve({ correct, recognized });
      };

      const startRecognition = () => {
        const recognition = createSpeechRecognition();
        if (!recognition) {
          safeResolve(false, '无法创建语音识别');
          return;
        }

        recognitionRef.current = recognition;
        setIsListening(true);
        setError(null);
        setResult('');
        allInterimResults.length = 0;

        let speechDetected = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        // 超时处理：如果超时但有中间结果，用中间结果判断
        timeoutId = setTimeout(() => {
          try { recognition.stop(); } catch {}
          
          if (allInterimResults.length > 0) {
            // 用收集到的所有中间结果逐一比对
            for (const text of allInterimResults) {
              if (compareWords(text, targetWord)) {
                setResult(text);
                safeResolve(true, text);
                return;
              }
            }
            // 都不匹配，用最后一个结果
            const lastResult = allInterimResults[allInterimResults.length - 1];
            setResult(lastResult);
            safeResolve(false, lastResult);
          } else if (!speechDetected) {
            // 超时且没有检测到任何语音
            safeResolve(false, '没有检测到语音，请再试一次');
          } else {
            safeResolve(false, '识别超时，请重试');
          }
        }, SPEECH_TIMEOUT);

        recognition.onresult = (event) => {
          speechDetected = true;
          // 收集所有结果
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              const transcript = result[0].transcript;
              allInterimResults.push(transcript);
              setResult(transcript);
              
              // 最终结果到达，检查是否正确
              clearTimeout(timeoutId);
              const correct = compareWords(transcript, targetWord);
              
              // 如果正确，立即返回
              if (correct) {
                try { recognition.stop(); } catch {}
                safeResolve(true, transcript);
                return;
              }
              // 如果不正确，也等 recognition 自然结束（可能还有其他 alternative）
            } else {
              // 中间结果
              const transcript = result[0].transcript;
              if (transcript) {
                allInterimResults.push(transcript);
              }
            }
          }
        };

        recognition.onerror = (event) => {
          clearTimeout(timeoutId);
          
          // no-speech 和 aborted：静默重试
          if ((event.error === 'no-speech' || event.error === 'aborted') && retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`语音识别重试 ${retryCount}/${MAX_RETRIES} (${event.error})`);
            // 短暂延迟后重试
            setTimeout(() => {
              if (!resolved) startRecognition();
            }, 300);
            return;
          }

          // 如果是 aborted 但已经有中间结果
          if (event.error === 'aborted' && allInterimResults.length > 0) {
            for (const text of allInterimResults) {
              if (compareWords(text, targetWord)) {
                setResult(text);
                safeResolve(true, text);
                return;
              }
            }
            const lastResult = allInterimResults[allInterimResults.length - 1];
            setResult(lastResult);
            safeResolve(false, lastResult);
            return;
          }

          // 其他错误
          const errorMessages: Record<string, string> = {
            'no-speech': '没有检测到语音，请大声读出来！',
            'aborted': '识别被中断，请重试',
            'audio-capture': '无法访问麦克风，请检查权限',
            'network': '网络连接异常，请检查网络',
            'not-allowed': '麦克风权限被拒绝，请在浏览器设置中允许',
            'service-not-allowed': '语音服务不可用',
            'bad-grammar': '识别语法错误',
            'language-not-supported': '不支持英语识别',
          };
          const message = errorMessages[event.error] || `识别出错: ${event.error}`;
          setError(message);
          safeResolve(false, message);
        };

        recognition.onend = () => {
          // 如果已经 resolved 就不处理
          // recognition 自然结束后，如果有中间结果但没触发 onresult 的 final
          // 清除超时，用中间结果判断
          if (!resolved && allInterimResults.length > 0) {
            clearTimeout(timeoutId);
            for (const text of allInterimResults) {
              if (compareWords(text, targetWord)) {
                setResult(text);
                safeResolve(true, text);
                return;
              }
            }
            const lastResult = allInterimResults[allInterimResults.length - 1];
            setResult(lastResult);
            safeResolve(false, lastResult);
          }
        };

        try {
          recognition.start();
        } catch (e) {
          clearTimeout(timeoutId);
          safeResolve(false, '启动语音识别失败，请重试');
        }
      };

      startRecognition();
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
