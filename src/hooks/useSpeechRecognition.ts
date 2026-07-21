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
      let recognition: SpeechRecognition | null = null;

      // 超时时间：根据内容长度动态调整
      const wordCount = targetWord.split(/\s+/).length;
      const SPEECH_TIMEOUT = Math.max(8000, wordCount * 3000); // 至少8秒

      // 收集所有识别结果（中间+最终）
      const allResults: string[] = [];
      let speechDetected = false;
      let finalResultReceived = false;

      const safeResolve = (correct: boolean, recognized: string) => {
        if (resolved) return;
        resolved = true;
        setIsListening(false);
        try { recognition?.stop(); } catch {}
        resolve({ correct, recognized });
      };

      // 从所有收集到的结果中找最佳匹配
      const findBestMatch = (): { correct: boolean; recognized: string } => {
        // 最新的结果排前面
        const reversed = [...allResults].reverse();
        for (const text of reversed) {
          if (compareWords(text, targetWord)) {
            return { correct: true, recognized: text };
          }
        }
        // 返回最后一个结果
        const last = allResults.length > 0 ? allResults[allResults.length - 1] : '';
        return { correct: false, recognized: last || '未识别到语音' };
      };

      const startRecognition = () => {
        recognition = createSpeechRecognition();
        if (!recognition) {
          safeResolve(false, '无法创建语音识别');
          return;
        }

        recognitionRef.current = recognition;
        setIsListening(true);
        setError(null);
        setResult('');
        allResults.length = 0;
        speechDetected = false;
        finalResultReceived = false;

        let timeoutId: ReturnType<typeof setTimeout>;

        // 超时处理
        timeoutId = setTimeout(() => {
          if (speechDetected && allResults.length > 0) {
            const best = findBestMatch();
            setResult(best.recognized);
            safeResolve(best.correct, best.recognized);
          } else {
            safeResolve(false, '没有检测到语音，请大声读出来！');
          }
        }, SPEECH_TIMEOUT);

        recognition.onresult = (event) => {
          speechDetected = true;

          // 收集所有结果
          for (let i = 0; i < event.results.length; i++) {
            const r = event.results[i];
            for (let j = 0; j < r.length; j++) {
              const transcript = r[j].transcript.trim();
              if (transcript && !allResults.includes(transcript)) {
                allResults.push(transcript);
              }
            }

            if (r.isFinal) {
              finalResultReceived = true;
              const finalTranscript = r[0].transcript.trim();
              setResult(finalTranscript);

              // 最终结果到达，检查是否正确
              if (compareWords(finalTranscript, targetWord)) {
                clearTimeout(timeoutId);
                safeResolve(true, finalTranscript);
                return;
              }
              // 不正确也不立即判错，等自然结束看有没有更好的 alternative
            }
          }
        };

        recognition.onerror = (event) => {
          // no-speech: 用户没有说话
          if (event.error === 'no-speech') {
            if (!speechDetected && !finalResultReceived) {
              // 确实没检测到语音，不要重试（避免卡死），直接给友好提示
              clearTimeout(timeoutId);
              safeResolve(false, '没有检测到语音，请大声读出来！');
              return;
            }
            // 已经有语音了，忽略这个错误
            return;
          }

          // aborted: 可能是用户手动停止或其他原因
          if (event.error === 'aborted') {
            if (allResults.length > 0) {
              clearTimeout(timeoutId);
              const best = findBestMatch();
              setResult(best.recognized);
              safeResolve(best.correct, best.recognized);
            }
            return;
          }

          // 其他真正的错误
          clearTimeout(timeoutId);
          const errorMessages: Record<string, string> = {
            'audio-capture': '无法访问麦克风，请检查浏览器权限设置',
            'network': '网络连接异常，请检查网络后重试',
            'not-allowed': '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问',
            'service-not-allowed': '语音识别服务不可用',
            'bad-grammar': '识别语法错误',
            'language-not-supported': '当前浏览器不支持英语语音识别',
          };
          const message = errorMessages[event.error] || `语音识别出错: ${event.error}`;
          setError(message);
          safeResolve(false, message);
        };

        recognition.onend = () => {
          // 识别自然结束（语音停顿后自动停止）
          if (!resolved) {
            clearTimeout(timeoutId);
            if (allResults.length > 0) {
              const best = findBestMatch();
              setResult(best.recognized);
              safeResolve(best.correct, best.recognized);
            } else if (!speechDetected) {
              safeResolve(false, '没有检测到语音，请大声读出来！');
            } else {
              safeResolve(false, '识别结束，请重试');
            }
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
