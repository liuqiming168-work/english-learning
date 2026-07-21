import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getWordsByUnit, getUnitById } from '../data/words';
import type { Word } from '../data/words';
import { getSentencesByUnit } from '../data/sentences';
import type { Sentence } from '../data/sentences';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useProgress } from '../hooks/useProgress';
import { getFailCount } from '../utils/storage';
import WordCard from '../components/WordCard';
import SentenceCard from '../components/SentenceCard';
import RecordButton from '../components/RecordButton';
import FeedbackAnimation from '../components/FeedbackAnimation';
import AiCharacter from '../components/AiCharacter';
import type { AiMood } from '../components/AiCharacter';

type FeedbackType = 'correct' | 'wrong' | 'review-added' | null;
type LearnMode = 'words' | 'sentences';
type PageState = 'learning' | 'complete';

const LearnPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const unit = getUnitById(Number(unitId));
  const unitWords = getWordsByUnit(Number(unitId));
  const unitSentences = getSentencesByUnit(Number(unitId));

  const [mode, setMode] = useState<LearnMode>('words');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [recognizedWord, setRecognizedWord] = useState('');
  const [localFailCount, setLocalFailCount] = useState(0);
  const [aiMood, setAiMood] = useState<AiMood>('idle');
  const [aiMessage, setAiMessage] = useState<string | undefined>();
  const [pageState, setPageState] = useState<PageState>('learning');
  // 当前 session 统计
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const { isListening, isSupported, checkWord } = useSpeechRecognition();
  const { isSpeaking, speak } = useSpeechSynthesis();
  const { progress, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed } = useProgress();

  const currentItems = mode === 'words' ? unitWords : unitSentences;
  const currentWord: Word | undefined = mode === 'words' ? unitWords[currentIndex] as Word : undefined;
  const currentSentence: Sentence | undefined = mode === 'sentences' ? unitSentences[currentIndex] as Sentence : undefined;
  const totalItems = currentItems.length;

  const getCurrentId = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.id;
    if (mode === 'sentences' && currentSentence) return currentSentence.id;
    return '';
  }, [mode, currentWord, currentSentence]);

  const switchMode = useCallback((newMode: LearnMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setFeedback(null);
    setAiMood('idle');
    setAiMessage(undefined);
    setPageState('learning');
    setSessionCorrect(0);
    setSessionTotal(0);
  }, []);

  const getCurrentText = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.word;
    if (mode === 'sentences' && currentSentence) return currentSentence.english;
    return '';
  }, [mode, currentWord, currentSentence]);

  const resetState = useCallback(() => {
    setFeedback(null);
    setRecognizedWord('');
    const id = getCurrentId();
    setLocalFailCount(getFailCount(id));
    setAiMood('idle');
    const messages = ['来，跟我一起读吧！', '大胆说出来！', '准备好了吗？', '你能行的！'];
    setAiMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [getCurrentId]);

  useEffect(() => {
    if (pageState === 'learning') {
      resetState();
    }
  }, [currentIndex, mode, resetState, pageState]);

  const handleSpeak = useCallback(() => {
    const text = getCurrentText();
    if (text) {
      setAiMood('think');
      setAiMessage('仔细听哦～👂');
      speak(text);
    }
  }, [getCurrentText, speak]);

  // 首次进入自动朗读
  useEffect(() => {
    const text = getCurrentText();
    if (text && !isSpeaking && !feedback && pageState === 'learning') {
      const timer = setTimeout(() => {
        setAiMood('idle');
        speak(text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode]);

  const advanceOrComplete = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 学完了，显示小结
      setPageState('complete');
    }
  };

  const handleRecord = async () => {
    const text = getCurrentText();
    if (!text || isListening) return;

    setAiMood('think');
    setAiMessage('让我听听...');

    const result = await checkWord(text);
    setRecognizedWord(result.recognized);
    setSessionTotal(prev => prev + 1);

    if (result.correct) {
      setFeedback('correct');
      setAiMood('happy');
      setAiMessage(undefined);
      setSessionCorrect(prev => prev + 1);

      if (mode === 'words' && currentWord) {
        handleCorrect(currentWord.id);
      } else if (mode === 'sentences' && currentSentence) {
        handleSentenceCorrect(currentSentence.id);
      }
      setLocalFailCount(0);
    } else {
      if (mode === 'words' && currentWord) {
        const addedToReview = handleFailed(currentWord.id);
        setLocalFailCount(getFailCount(currentWord.id));

        if (addedToReview) {
          setFeedback('review-added');
          setAiMood('encourage');
          setAiMessage('这个词已加入重点复习，别灰心！💪');
        } else {
          setFeedback('wrong');
          setAiMood('encourage');
          setAiMessage(undefined);
        }
      } else if (mode === 'sentences' && currentSentence) {
        const addedToReview = handleSentenceFailed(currentSentence.id);
        setLocalFailCount(getFailCount(currentSentence.id));

        if (addedToReview) {
          setFeedback('review-added');
          setAiMood('encourage');
          setAiMessage('这个短句已加入重点复习，别灰心！💪');
        } else {
          setFeedback('wrong');
          setAiMood('encourage');
          setAiMessage(undefined);
        }
      }
    }
  };

  const handleSkip = () => {
    if (mode === 'words' && currentWord) {
      handleCorrect(currentWord.id);
    } else if (mode === 'sentences' && currentSentence) {
      handleSentenceCorrect(currentSentence.id);
    }
    advanceOrComplete();
  };

  const handleCorrectDismiss = () => {
    advanceOrComplete();
  };

  const handleWrongDismiss = () => setFeedback(null);

  const handleReviewDismiss = () => {
    advanceOrComplete();
  };

  const handleNext = () => {
    if (currentIndex < totalItems - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (!unit || (unitWords.length === 0 && unitSentences.length === 0)) {
    return (
      <div className="page learn-page">
        <div className="empty-state">
          <p>该单元暂无内容</p>
          <Link to="/units" className="btn-primary">返回单元列表</Link>
        </div>
      </div>
    );
  }

  // === 完成小结页 ===
  if (pageState === 'complete') {
    const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    let stars: string;
    if (accuracy >= 90) stars = '⭐⭐⭐⭐⭐';
    else if (accuracy >= 70) stars = '⭐⭐⭐⭐';
    else if (accuracy >= 50) stars = '⭐⭐⭐';
    else if (accuracy > 0) stars = '⭐⭐';
    else stars = '⭐';

    return (
      <div className="page learn-page">
        <motion.div
          className="unit-complete"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="unit-complete-emoji">🎉</div>
          <h2>恭喜完成！</h2>
          <p className="unit-complete-desc">{unit.nameCn} 学习完毕</p>

          <div className="unit-complete-stars">{stars}</div>

          <div className="unit-complete-stats">
            <div className="unit-complete-stat">
              <div className="unit-complete-stat-value">{sessionTotal}</div>
              <div className="unit-complete-stat-label">跟读次数</div>
            </div>
            <div className="unit-complete-stat">
              <div className="unit-complete-stat-value">{sessionCorrect}</div>
              <div className="unit-complete-stat-label">正确次数</div>
            </div>
            <div className="unit-complete-stat">
              <div className="unit-complete-stat-value">{accuracy}%</div>
              <div className="unit-complete-stat-label">正确率</div>
            </div>
          </div>

          <div className="unit-complete-actions">
            <Link to="/units" className="btn-primary">📚 返回单元列表</Link>
            {progress.reviewWords.length + progress.reviewSentences.length > 0 && (
              <Link to="/review" className="btn-secondary">
                📝 复习薄弱词 ({progress.reviewWords.length + progress.reviewSentences.length}个)
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // === 学习页 ===
  return (
    <div className="page learn-page">
      {/* 顶部栏：返回 + 标题 + 跳过 */}
      <div className="learn-topbar">
        <Link to={`/unit/${unit.id}/intro`} className="btn-back">← 返回</Link>
        <h2>{unit.nameCn}</h2>
        <button className="btn-skip" onClick={handleSkip} title="已掌握，跳过">跳过 ✓</button>
      </div>

      {/* 模式切换 */}
      <div className="learn-mode-tabs">
        <button className={`mode-tab ${mode === 'words' ? 'active' : ''}`} onClick={() => switchMode('words')} disabled={unitWords.length === 0}>📝 单词</button>
        <button className={`mode-tab ${mode === 'sentences' ? 'active' : ''}`} onClick={() => switchMode('sentences')} disabled={unitSentences.length === 0}>💬 短句</button>
      </div>

      {/* 紧凑进度条：计数器 + 进度条一行 */}
      <div className="progress-bar-inline">
        <span className="progress-label">{currentIndex + 1}/{totalItems}</span>
        <div className="progress-bar-wrap">
          <motion.div
            className="progress-fill"
            animate={{ width: `${totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0}%` }}
          />
        </div>
        <span className="progress-text">{totalItems > 0 ? Math.round(((currentIndex + 1) / totalItems) * 100) : 0}%</span>
      </div>

      {/* AI 人物 */}
      <div className="learn-ai-area">
        <AiCharacter mood={aiMood} message={aiMessage} showBubble={true} size="small" />
      </div>

      {/* 单词/短句卡片 */}
      <AnimatePresence mode="wait">
        <motion.div key={`${mode}-${currentIndex}`} className="learn-word-area"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }}>
          {mode === 'words' && currentWord && (
            <WordCard word={currentWord} isSpeaking={isSpeaking} onSpeak={handleSpeak} flashState={feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : null} />
          )}
          {mode === 'sentences' && currentSentence && (
            <SentenceCard sentence={currentSentence} isSpeaking={isSpeaking} onSpeak={handleSpeak} flashState={feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : null} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 错误时显示对比 */}
      {feedback === 'wrong' && recognizedWord && (
        <motion.div className="error-compare" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="error-compare-label">你读的和目标对比：</p>
          <div className="error-compare-words">
            <span className="error-compare-you">"{recognizedWord}"</span>
            <span className="error-compare-arrow">→</span>
            <span className="error-compare-target">"{getCurrentText()}"</span>
          </div>
          {localFailCount > 0 && (
            <p className="review-added-tag" style={{ marginBottom: 8 }}>
              已尝试 {localFailCount} 次{localFailCount >= 2 && '，再错一次将加入重点复习！'}
            </p>
          )}
          <button className="btn-retry-inline" onClick={handleWrongDismiss}>再试一次 💪</button>
        </motion.div>
      )}

      {/* 加入复习时显示提示 */}
      {feedback === 'review-added' && (
        <motion.div className="error-compare" style={{ background: 'rgba(253,203,110,0.1)' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="review-added-tag">📝 "{getCurrentText()}" 已加入重点复习列表</p>
          <button className="btn-retry-inline" style={{ background: 'linear-gradient(135deg, #FDCB6E, #F39C12)', marginTop: 8 }} onClick={handleReviewDismiss}>
            知道了，继续 →
          </button>
        </motion.div>
      )}

      {/* 录音按钮 */}
      {feedback !== 'wrong' && feedback !== 'review-added' && (
        <div className="learn-actions">
          <RecordButton isListening={isListening} isSupported={isSupported} onRecord={handleRecord} disabled={!!feedback} />
        </div>
      )}

      {/* 导航按钮 */}
      <div className="learn-nav">
        <button className="btn-nav" onClick={handlePrev} disabled={currentIndex === 0}>← 上一个</button>
        <button className="btn-nav" onClick={handleNext} disabled={currentIndex >= totalItems - 1}>下一个 →</button>
      </div>

      {/* Toast 反馈 */}
      <FeedbackAnimation type={feedback} recognizedWord={recognizedWord} targetWord={getCurrentText()}
        onDismiss={feedback === 'correct' ? handleCorrectDismiss : feedback === 'review-added' ? handleReviewDismiss : feedback === 'wrong' ? handleWrongDismiss : undefined}
        failCount={localFailCount} />
    </div>
  );
};

export default LearnPage;
