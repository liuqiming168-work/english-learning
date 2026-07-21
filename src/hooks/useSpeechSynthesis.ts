import { useCallback, useEffect, useRef, useState } from 'react';
import { isSpeechSynthesisSupported, speakWord, isWeChatBrowser, checkTtsActuallyWorks } from '../utils/speech';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  isWeChat: boolean;
  ttsWorks: boolean | null; // null = 检测中, true/false = 结果
  speak: (word: string) => Promise<void>;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsWorks, setTtsWorks] = useState<boolean | null>(null);
  const isSupported = isSpeechSynthesisSupported();
  const isWeChat = isWeChatBrowser();
  const ttsChecked = useRef(false);

  // 启动时检测 TTS 是否真正可用
  useEffect(() => {
    if (isSupported && !ttsChecked.current) {
      ttsChecked.current = true;
      checkTtsActuallyWorks().then(setTtsWorks);
    }
  }, [isSupported]);

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

  return { isSpeaking, isSupported, isWeChat, ttsWorks, speak, stop };
}
