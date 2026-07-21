// 本地存储工具

export interface ProgressData {
  completedWords: string[];       // 已完成的单词 ID 列表
  failCounts: Record<string, number>; // 每个条目的连续失败次数（单词 + 短句共用）
  reviewWords: string[];          // 重点复习单词 ID 列表
  reviewSentences: string[];      // 重点复习短句 ID 列表
  correctCount: number;
  totalAttempts: number;
}

const STORAGE_KEY = 'english-learning-progress';

function getDefaultProgress(): ProgressData {
  return {
    completedWords: [],
    failCounts: {},
    reviewWords: [],
    reviewSentences: [],
    correctCount: 0,
    totalAttempts: 0,
  };
}

export function loadProgress(): ProgressData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // 兼容旧数据，如果没有 reviewSentences 则初始化
      if (!parsed.reviewSentences) {
        parsed.reviewSentences = [];
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return getDefaultProgress();
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// === 单词相关 ===

export function markWordCorrect(wordId: string): ProgressData {
  const progress = loadProgress();
  if (!progress.completedWords.includes(wordId)) {
    progress.completedWords.push(wordId);
  }
  progress.failCounts[wordId] = 0;
  progress.correctCount++;
  progress.totalAttempts++;
  progress.reviewWords = progress.reviewWords.filter(id => id !== wordId);
  saveProgress(progress);
  return progress;
}

export function markWordFailed(wordId: string): { progress: ProgressData; addedToReview: boolean } {
  const progress = loadProgress();
  progress.failCounts[wordId] = (progress.failCounts[wordId] || 0) + 1;
  progress.totalAttempts++;

  let addedToReview = false;
  if (progress.failCounts[wordId] >= 3 && !progress.reviewWords.includes(wordId)) {
    progress.reviewWords.push(wordId);
    addedToReview = true;
  }

  saveProgress(progress);
  return { progress, addedToReview };
}

export function removeWordFromReview(wordId: string): ProgressData {
  const progress = loadProgress();
  progress.reviewWords = progress.reviewWords.filter(id => id !== wordId);
  progress.failCounts[wordId] = 0;
  saveProgress(progress);
  return progress;
}

// === 短句相关 ===

export function markSentenceCorrect(sentenceId: string): ProgressData {
  const progress = loadProgress();
  progress.failCounts[sentenceId] = 0;
  progress.correctCount++;
  progress.totalAttempts++;
  progress.reviewSentences = progress.reviewSentences.filter(id => id !== sentenceId);
  saveProgress(progress);
  return progress;
}

export function markSentenceFailed(sentenceId: string): { progress: ProgressData; addedToReview: boolean } {
  const progress = loadProgress();
  progress.failCounts[sentenceId] = (progress.failCounts[sentenceId] || 0) + 1;
  progress.totalAttempts++;

  let addedToReview = false;
  if (progress.failCounts[sentenceId] >= 3 && !progress.reviewSentences.includes(sentenceId)) {
    progress.reviewSentences.push(sentenceId);
    addedToReview = true;
  }

  saveProgress(progress);
  return { progress, addedToReview };
}

export function removeSentenceFromReview(sentenceId: string): ProgressData {
  const progress = loadProgress();
  progress.reviewSentences = progress.reviewSentences.filter(id => id !== sentenceId);
  progress.failCounts[sentenceId] = 0;
  saveProgress(progress);
  return progress;
}

// === 通用 ===

export function getFailCount(id: string): number {
  const progress = loadProgress();
  return progress.failCounts[id] || 0;
}

export function getWordFailCount(wordId: string): number {
  return getFailCount(wordId);
}

export function isWordCompleted(wordId: string): boolean {
  const progress = loadProgress();
  return progress.completedWords.includes(wordId);
}

export function getReviewWords(): string[] {
  return loadProgress().reviewWords;
}

export function getReviewSentences(): string[] {
  return loadProgress().reviewSentences;
}

export function resetAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
