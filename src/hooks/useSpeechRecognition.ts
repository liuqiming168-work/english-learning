import { useCallback, useRef, useState } from 'react';
import { createSpeechRecognition, compareWords, shouldUseWebSpeech, isSpeechRecognitionSupported } from '../utils/speech';
import { startRecording, transcribeAudio, isMediaRecorderSupported } from '../utils/cloudflare-stt';

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

  // 桌面端且浏览器支持 → Web Speech API
  // 移动端 → Cloudflare Whisper（Android Chrome Web Speech 有 bug）
  const useWebSpeech = shouldUseWebSpeech();
  const webSpeechAvailable = isSpeechRecognitionSupported();
  const cloudflareAvailable = isMediaRecorderSupported();

  // 至少有一种方式可用
  const isSupported = useWebSpeech ? webSpeechAvailable : cloudflareAvailable;

  const startListening = useCallback(() => {
    if (!webSpeechAvailable) {
      setError('请使用 Chrome 浏览器');
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
  }, [webSpeechAvailable]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // === 使用 Cloudflare Whisper API 进行语音识别 ===
  const checkWithCloudflare = useCallback(async (targetWord: string): Promise<{ correct: boolean; recognized: string }> => {
    setIsListening(true);
    setError(null);
    setResult('');

    try {
      console.log('[跟读] 开始录音...');
      const recorder = await startRecording();
      console.log('[跟读] 录音中，mimeType:', recorder.mimeType);

      // 录制 3 秒
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const audioBlob = await recorder.stop();
      console.log('[跟读] 录音结束，大小:', audioBlob.size, 'bytes');
      setIsListening(false);

      if (audioBlob.size < 100) {
        console.warn('[跟读] 音频太小，可能麦克风未工作');
        return { correct: false, recognized: '没有检测到语音，请检查麦克风权限后重试' };
      }

      console.log('[跟读] 发送到 Whisper API...');
      const response = await transcribeAudio(audioBlob);

      if (!response.success) {
        console.error('[跟读] Whisper 识别失败:', response.error);
        return { correct: false, recognized: response.error || '识别失败，请重试' };
      }

      const recognizedText = response.text.trim();
      setResult(recognizedText);
      console.log('[跟读] 识别文本:', recognizedText);

      if (!recognizedText) {
        return { correct: false, recognized: '没有识别到语音，请再试一次' };
      }

      const correct = compareWords(recognizedText, targetWord);
      console.log('[跟读] 对比结果:', { recognizedText, targetWord, correct });
      return { correct, recognized: recognizedText };

    } catch (err) {
      console.error('[跟读] 异常:', err);
      setIsListening(false);
      const message = err instanceof Error ? err.message : '录音失败';
      // 检查是否是权限问题
      if (message.includes('Permission') || message.includes('NotAllowed') || message.includes('NotAllowedError')) {
        return { correct: false, recognized: '请允许麦克风权限后重试' };
      }
      if (message.includes('NotFound') || message.includes('devices')) {
        return { correct: false, recognized: '未找到麦克风设备' };
      }
      return { correct: false, recognized: `录音失败: ${message}` };
    }
  }, []);

  // === 使用 Web Speech API 进行语音识别（桌面端） ===
  const checkWithWebSpeech = useCallback((targetWord: string): Promise<{ correct: boolean; recognized: string }> => {
    return new Promise((resolve) => {
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
          if ((event.error === 'no-speech' || event.error === 'aborted') && !retried && !hasResult) {
            retried = true;
            setTimeout(() => {
              if (!resolved) tryRecognize();
            }, 200);
            return;
          }
          setError(`识别出错: ${event.error}`);
          safeResolve(false, event.error === 'no-speech' ? '没有检测到语音，请大声读出来！' : `错误: ${event.error}`);
        };

        recognition.onend = () => {
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
  }, []);

  // 自动选择：桌面端用 Web Speech API，移动端用 Cloudflare Whisper
  const checkWord = useCallback(async (targetWord: string): Promise<{ correct: boolean; recognized: string }> => {
    if (!isSupported) {
      return { correct: false, recognized: '您的浏览器不支持语音识别，请使用 Chrome 浏览器' };
    }

    // 桌面端 → Web Speech API
    if (useWebSpeech) {
      return checkWithWebSpeech(targetWord);
    }

    // 移动端 → Cloudflare Whisper
    return checkWithCloudflare(targetWord);
  }, [isSupported, useWebSpeech, checkWithWebSpeech, checkWithCloudflare]);

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
