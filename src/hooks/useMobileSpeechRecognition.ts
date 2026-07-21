// 移动端语音识别 Hook
// 使用 MediaRecorder 录音 → 发送到 Cloudflare Whisper API → 返回识别文本

import { useCallback, useRef, useState } from 'react';
import { compareWords, isSpeechRecognitionSupported, isMobileDevice } from '../utils/speech';

const STT_API_URL = 'https://english-stt.liuqiming168.workers.dev';

interface MobileSpeechResult {
  correct: boolean;
  recognized: string;
}

export function useMobileSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const isSpeechApiSupported = isSpeechRecognitionSupported();
  const isMobile = isMobileDevice();

  // 移动端：当 Web Speech API 不可用或不稳定时使用此方案
  const shouldUseMobileFallback = isMobile || !isSpeechApiSupported;

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;
      chunksRef.current = [];

      // 尝试不同格式，优先 webm（Whisper 支持）
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // 让浏览器选默认格式
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsListening(true);
      return true;
    } catch (e) {
      console.error('Failed to start recording:', e);
      return false;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsListening(false);
        resolve('');
        return;
      }

      recorder.onstop = async () => {
        setIsListening(false);

        // 停止麦克风
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }

        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (audioBlob.size < 100) {
          resolve('');
          return;
        }

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');

          const response = await fetch(STT_API_URL, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          resolve(data.text || '');
        } catch (e) {
          console.error('STT API error:', e);
          resolve('');
        }
      };

      recorder.stop();
    });
  }, []);

  const cancelRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null; // 阻止回调
      recorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  }, []);

  const checkWord = useCallback(async (targetWord: string): Promise<MobileSpeechResult> => {
    const started = await startRecording();
    if (!started) {
      return { correct: false, recognized: '无法访问麦克风，请检查权限设置' };
    }

    // 等待录音完成（外部通过 stopAndCheck 来控制）
    // 这里返回一个 pending 状态，实际判断在 stopAndCheck 中
    return new Promise((resolve) => {
      // 存储 resolve 函数，在 stopRecording 回调中调用
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        resolve({ correct: false, recognized: '录音启动失败' });
        return;
      }

      // 设置超时（最长 8 秒）
      const timeout = setTimeout(async () => {
        const text = await stopRecording();
        if (text) {
          const correct = compareWords(text, targetWord);
          resolve({ correct, recognized: text });
        } else {
          resolve({ correct: false, recognized: '没有检测到语音' });
        }
      }, 8000);

      // 覆盖 onstop 来拦截停止事件
      const origOnstop = recorder.onstop;
      recorder.onstop = async (e) => {
        clearTimeout(timeout);
        // 恢复原来的 onstop
        recorder.onstop = origOnstop;
        // 先调用原来的 onstop（如果存在）
        if (origOnstop) origOnstop.call(recorder, e);
        // 然后处理识别
        const text = await stopRecordingFromChunks();
        if (text) {
          const correct = compareWords(text, targetWord);
          resolve({ correct, recognized: text });
        } else {
          resolve({ correct: false, recognized: '没有检测到语音' });
        }
      };
    });
  }, [startRecording]);

  // 从已录制的 chunks 中提取文本
  const stopRecordingFromChunks = useCallback(async (): Promise<string> => {
    setIsListening(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    const audioBlob = new Blob(chunksRef.current, { type: recorder?.mimeType || 'audio/webm' });
    if (audioBlob.size < 100) return '';

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch(STT_API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.text || '';
    } catch {
      return '';
    }
  }, []);

  // 手动停止录音并获取结果
  const stopAndCheck = useCallback(async (targetWord: string): Promise<MobileSpeechResult> => {
    const text = await stopRecording();
    if (!text) {
      return { correct: false, recognized: '没有检测到语音，请大声读出来！' };
    }
    const correct = compareWords(text, targetWord);
    return { correct, recognized: text };
  }, [stopRecording]);

  return {
    isListening,
    isSupported: true, // 移动端始终可用（只要有麦克风）
    shouldUseMobileFallback,
    startRecording,
    stopAndCheck,
    cancelRecording,
    checkWord,
  };
}
