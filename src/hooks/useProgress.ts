import { useCallback, useState } from 'react';
import { loadProgress, markWordCorrect, markWordFailed, markSentenceCorrect, markSentenceFailed } from '../utils/storage';
import type { ProgressData } from '../utils/storage';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  const handleCorrect = useCallback((wordId: string) => {
    const newProgress = markWordCorrect(wordId);
    setProgress(newProgress);
  }, []);

  const handleFailed = useCallback((wordId: string): boolean => {
    const { progress: newProgress, addedToReview } = markWordFailed(wordId);
    setProgress(newProgress);
    return addedToReview;
  }, []);

  const handleSentenceCorrect = useCallback((sentenceId: string) => {
    const newProgress = markSentenceCorrect(sentenceId);
    setProgress(newProgress);
  }, []);

  const handleSentenceFailed = useCallback((sentenceId: string): boolean => {
    const { progress: newProgress, addedToReview } = markSentenceFailed(sentenceId);
    setProgress(newProgress);
    return addedToReview;
  }, []);

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  return {
    progress,
    handleCorrect,
    handleFailed,
    handleSentenceCorrect,
    handleSentenceFailed,
    refreshProgress,
  };
}
