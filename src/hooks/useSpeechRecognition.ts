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

/**
 * 语音识别 Hook
 * 
 * 安卓兼容策略（关键！）：
 * - continuous: false — 安卓上 continuous:true 有 Chromium bug
 *   (crbug.com/41297427)，麦克风会在语音暂停时过早关闭
 * - 在 onend 中自动重启（最多 5 次），模拟持续监听
 * - 收集所有中间 + 最终结果，超时后取最佳匹配
 * - no-speech / aborted / audio-capture 错误静默处理
 */
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
      setResult(event.results[0][0].transcript);
    };
    recognition.onerror = (event) => {
      setError(`识别出错: ${event.error}`);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    try { recognition.start(); } catch { /* ignore */ }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const checkWord = useCallback((targetWord: string): Promise<{ correct: boolean; recognized: string }> => {
    return new Promise((resolve) => {
      if (!isSupported) {
        resolve({ correct: false, recognized: '浏览器不支持语音识别' });
        return;
      }

      let resolved = false;
      const allResults: string[] = [];
      let speechDetected = false;
      let restartCount = 0;
      const MAX_RESTARTS = 5;

      const wordCount = targetWord.split(/\s+/).length;
      const TOTAL_TIMEOUT = Math.max(10000, wordCount * 3000);

      let globalTimeoutId: ReturnType<typeof setTimeout> | null = null;

      const safeResolve = (correct: boolean, recognized: string) => {
        if (resolved) return;
        resolved = true;
        if (globalTimeoutId) clearTimeout(globalTimeoutId);
        setIsListening(false);
        resolve({ correct, recognized });
      };

      const findBestMatch = (): { correct: boolean; recognized: string } => {
        for (let i = allResults.length - 1; i >= 0; i--) {
          if (compareWords(allResults[i], targetWord)) {
            return { correct: true, recognized: allResults[i] };
          }
        }
        const last = allResults.length > 0 ? allResults[allResults.length - 1] : '';
        return { correct: false, recognized: last || '未识别到语音' };
      };

      const startRecognition = () => {
        if (resolved) return;

        const recognition = createSpeechRecognition();
        if (!recognition) {
          safeResolve(false, '无法创建语音识别');
          return;
        }
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          speechDetected = true;
          for (let i = 0; i < event.results.length; i++) {
            const r = event.results[i];
            for (let j = 0; j < r.length; j++) {
              const t = r[j].transcript.trim();
              if (t && !allResults.includes(t)) allResults.push(t);
            }
            if (r.isFinal) {
              const finalText = r[0].transcript.trim();
              setResult(finalText);
              if (compareWords(finalText, targetWord)) {
                safeResolve(true, finalText);
                return;
              }
            }
          }
        };

        recognition.onerror = (event) => {
          // 静默处理的错误类型（安卓上频繁出现）
          if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'audio-capture') {
            return; // 交给 onend 处理重启
          }
          // 真正的错误
          const map: Record<string, string> = {
            'not-allowed': '麦克风权限被拒绝。请在浏览器设置中允许麦克风访问',
            'network': '网络连接异常，请重试',
            'service-not-allowed': '语音服务不可用，请重试',
            'language-not-supported': '浏览器不支持英语语音识别',
          };
          safeResolve(false, map[event.error] || `识别出错: ${event.error}`);
        };

        recognition.onend = () => {
          if (resolved) return;

          // 有语音结果 → 直接判断，不重启
          if (speechDetected && allResults.length > 0) {
            const best = findBestMatch();
            setResult(best.recognized);
            safeResolve(best.correct, best.recognized);
            return;
          }

          // 没检测到语音 + 还有重启次数 → 自动重启
          if (!speechDetected && restartCount < MAX_RESTARTS) {
            restartCount++;
            setTimeout(() => { if (!resolved) startRecognition(); }, 150);
            return;
          }

          // 超时/耗尽重试
          safeResolve(false, !speechDetected
            ? '没有检测到语音，请大声读出来！\n提示：请确保已允许麦克风权限'
            : '识别超时，请重试');
        };

        try {
          recognition.start();
        } catch {
          if (restartCount < MAX_RESTARTS) {
            restartCount++;
            setTimeout(() => { if (!resolved) startRecognition(); }, 200);
          } else {
            safeResolve(false, '启动语音识别失败，请重试');
          }
        }
      };

      // 全局超时
      globalTimeoutId = setTimeout(() => {
        if (resolved) return;
        try { recognitionRef.current?.abort(); } catch {}
        if (allResults.length > 0) {
          const best = findBestMatch();
          setResult(best.recognized);
          safeResolve(best.correct, best.recognized);
        } else {
          safeResolve(false, '没有检测到语音，请重试');
        }
      }, TOTAL_TIMEOUT);

      setIsListening(true);
      setError(null);
      setResult('');
      startRecognition();
    });
  }, [isSupported]);

  return { isListening, isSupported, result, error, startListening, stopListening, checkWord };
}
