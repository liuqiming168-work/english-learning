import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { words } from '../data/words';
import { sentences } from '../data/sentences';
import { loadProgress, removeWordFromReview, removeSentenceFromReview } from '../utils/storage';
import type { ProgressData } from '../utils/storage';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import WordCard from '../components/WordCard';
import SentenceCard from '../components/SentenceCard';
import RecordButton from '../components/RecordButton';
import FeedbackAnimation from '../components/FeedbackAnimation';
import AiCharacter from '../components/AiCharacter';
import type { AiMood } from '../components/AiCharacter';

type FeedbackType = 'correct' | 'wrong' | null;
type ReviewMode = 'words' | 'sentences';

const ReviewPage: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [mode, setMode] = useState<ReviewMode>('words');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [recognizedWord, setRecognizedWord] = useState('');
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [aiMood, setAiMood] = useState<AiMood>('idle');
  const [aiMessage, setAiMessage] = useState<string>();

  const { isListening, isSupported, checkWord } = useSpeechRecognition();
  const { isSpeaking, speak } = useSpeechSynthesis();

  // 复习单词列表
  const reviewWordIds = progress.reviewWords.filter(id => !removedIds.includes(id));
  const reviewWordsList = reviewWordIds
    .map(id => words.find(w => w.id === id))
    .filter(Boolean) as typeof words;

  // 复习短句列表
  const reviewSentenceIds = progress.reviewSentences.filter(id => !removedIds.includes(id));
  const reviewSentencesList = reviewSentenceIds
    .map(id => sentences.find(s => s.id === id))
    .filter(Boolean) as typeof sentences;

  // 当前复习内容
  const currentWord = mode === 'words' ? reviewWordsList[currentIndex] : undefined;
  const currentSentence = mode === 'sentences' ? reviewSentencesList[currentIndex] : undefined;
  const currentList = mode === 'words' ? reviewWordsList : reviewSentencesList;

  const getCurrentText = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.word;
    if (mode === 'sentences' && currentSentence) return currentSentence.english;
    return '';
  }, [mode, currentWord, currentSentence]);

  const handleSpeak = useCallback(() => {
    const text = getCurrentText();
    if (text) speak(text);
  }, [getCurrentText, speak]);

  const handleRecord = async () => {
    const text = getCurrentText();
    if (!text || isListening) return;

    setAiMood('think');
    setAiMessage('让我听听...');

    const result = await checkWord(text);
    setRecognizedWord(result.recognized);

    if (result.correct) {
      setFeedback('correct');
      setAiMood('happy');
      setAiMessage(undefined);
    } else {
      setFeedback('wrong');
      setAiMood('encourage');
      setAiMessage(undefined);
    }
  };

  const handleCorrectDismiss = () => {
    const current = mode === 'words' ? currentWord : currentSentence;
    if (current) {
      if (mode === 'words') {
        removeWordFromReview(current.id);
      } else {
        removeSentenceFromReview(current.id);
      }
      setRemovedIds(prev => [...prev, current.id]);
      setProgress(loadProgress());
    }
    setFeedback(null);
  };

  const handleWrongDismiss = () => {
    setFeedback(null);
  };

  const switchMode = (newMode: ReviewMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setFeedback(null);
    setAiMood('idle');
    setAiMessage(undefined);
  };

  const handleNext = () => {
    if (currentIndex < currentList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 单词 + 短句总数
  const totalReviewItems = reviewWordsList.length + reviewSentencesList.length;

  if (totalReviewItems === 0) {
    return (
      <div className="page review-page">
        <motion.div
          className="empty-state review-empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-emoji">🎉</div>
          <h2>太厉害了！</h2>
          <p>所有重点内容都已掌握！</p>
          <p className="empty-hint">继续保持，去学习新内容吧～</p>
          <Link to="/units" className="btn-primary">去学习</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page review-page">
      <div className="learn-header">
        <h2>📝 重点复习</h2>
        <p className="review-desc">这些内容需要多加练习哦！</p>
      </div>

      {/* Mode Tabs */}
      <div className="learn-mode-tabs">
        <button
          className={`mode-tab ${mode === 'words' ? 'active' : ''}`}
          onClick={() => switchMode('words')}
          disabled={reviewWordsList.length === 0}
        >
          📝 单词 ({reviewWordsList.length})
        </button>
        <button
          className={`mode-tab ${mode === 'sentences' ? 'active' : ''}`}
          onClick={() => switchMode('sentences')}
          disabled={reviewSentencesList.length === 0}
        >
          💬 短句 ({reviewSentencesList.length})
        </button>
      </div>

      {/* AI 人物 */}
      <div className="learn-ai-area">
        <AiCharacter
          mood={aiMood}
          message={aiMessage}
          showBubble={true}
          size="small"
        />
      </div>

      {currentList.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <p>这部分没有需要复习的内容 🎉</p>
        </div>
      ) : (
        <>
          <div className="learn-word-counter">
            第 {currentIndex + 1} / {currentList.length} {mode === 'words' ? '个单词' : '个短句'}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`review-${mode}-${currentIndex}`}
              className="learn-word-area"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {mode === 'words' && currentWord && (
                <WordCard
                  word={currentWord}
                  isSpeaking={isSpeaking}
                  onSpeak={handleSpeak}
                />
              )}
              {mode === 'sentences' && currentSentence && (
                <SentenceCard
                  sentence={currentSentence}
                  isSpeaking={isSpeaking}
                  onSpeak={handleSpeak}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="learn-actions">
            <RecordButton
              isListening={isListening}
              isSupported={isSupported}
              onRecord={handleRecord}
              disabled={!!feedback}
            />
          </div>

          <div className="learn-nav">
            <button
              className="btn-nav"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← 上一个
            </button>
            <button
              className="btn-nav"
              onClick={handleNext}
              disabled={currentIndex >= currentList.length - 1}
            >
              下一个 →
            </button>
          </div>
        </>
      )}

      <FeedbackAnimation
        type={feedback}
        recognizedWord={recognizedWord}
        targetWord={getCurrentText()}
        onDismiss={feedback === 'correct' ? handleCorrectDismiss : handleWrongDismiss}
        failCount={0}
      />
    </div>
  );
};

export default ReviewPage;
