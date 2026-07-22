import { useCallback, useRef, useState } from 'react';
import { speakWord } from '../utils/speech';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (word: string) => Promise<void>;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 始终支持（CosyVoice2 API 或浏览器降级）
  const isSupported = true;

  const speak = useCallback(async (word: string) => {
    setIsSpeaking(true);
    try {
      await speakWord(word);
    } catch (e) {
      console.error('TTS error:', e);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, isSupported, speak, stop };
}
