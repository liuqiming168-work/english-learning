import { useCallback, useState } from 'react';
import { isSpeechSynthesisSupported, speakWord } from '../utils/speech';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (word: string) => Promise<void>;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = isSpeechSynthesisSupported();

  const speak = useCallback(async (word: string) => {
    if (!isSupported) return;
    setIsSpeaking(true);
    try {
      await speakWord(word);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    } finally {
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { isSpeaking, isSupported, speak, stop };
}
