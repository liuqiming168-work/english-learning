import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import ProgressBar from '../components/ProgressBar';
import AiCharacter from '../components/AiCharacter';
import type { AiMood } from '../components/AiCharacter';

type FeedbackType = 'correct' | 'wrong' | 'review-added' | null;
type LearnMode = 'words' | 'sentences';

const LearnPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
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

  const { isListening, isSupported, checkWord } = useSpeechRecognition();
  const { isSpeaking, speak, isWeChat } = useSpeechSynthesis();
  const { progress, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed } = useProgress();

  // 当前内容
  const currentItems = mode === 'words' ? unitWords : unitSentences;
  const currentWord: Word | undefined = mode === 'words' ? unitWords[currentIndex] as Word : undefined;
  const currentSentence: Sentence | undefined = mode === 'sentences' ? unitSentences[currentIndex] as Sentence : undefined;

  const completedInUnit = unitWords.filter(w => progress.completedWords.includes(w.id)).length;

  // 当前条目的 ID（单词或短句）
  const getCurrentId = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.id;
    if (mode === 'sentences' && currentSentence) return currentSentence.id;
    return '';
  }, [mode, currentWord, currentSentence]);

  // 切换模式时重置索引
  const switchMode = useCallback((newMode: LearnMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setFeedback(null);
    setAiMood('idle');
    setAiMessage(undefined);
  }, []);

  // 获取当前要读的文本
  const getCurrentText = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.word;
    if (mode === 'sentences' && currentSentence) return currentSentence.english;
    return '';
  }, [mode, currentWord, currentSentence]);

  // 重置状态
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
    resetState();
  }, [currentIndex, mode, resetState]);

  // 朗读当前文本
  const handleSpeak = useCallback(() => {
    const text = getCurrentText();
    if (text) {
      setAiMood('think');
      setAiMessage('仔细听哦～👂');
      speak(text);
    }
  }, [getCurrentText, speak]);

  // 自动朗读一次
  useEffect(() => {
    const text = getCurrentText();
    if (text && !isSpeaking && !feedback) {
      const timer = setTimeout(() => {
        setAiMood('idle');
        speak(text);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode]);

  // 处理跟读
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

  // 正确后自动下一个
  const handleCorrectDismiss = () => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate('/units');
    }
  };

  // 错误后继续
  const handleWrongDismiss = () => {
    setFeedback(null);
  };

  // 加入复习列表后继续
  const handleReviewDismiss = () => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate('/units');
    }
  };

  // 导航
  const handleNext = () => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
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

  const totalItems = currentItems.length;
  const progressLabel = mode === 'words' ? '单词进度' : '短句进度';

  return (
    <div className="page learn-page">
      {/* Header */}
      <div className="learn-header">
        <Link to={`/unit/${unit.id}/intro`} className="btn-back">← 返回</Link>
        <h2>{unit.nameCn}</h2>
      </div>

      {/* Mode Tabs */}
      <div className="learn-mode-tabs">
        <button
          className={`mode-tab ${mode === 'words' ? 'active' : ''}`}
          onClick={() => switchMode('words')}
          disabled={unitWords.length === 0}
        >
          📝 单词
        </button>
        <button
          className={`mode-tab ${mode === 'sentences' ? 'active' : ''}`}
          onClick={() => switchMode('sentences')}
          disabled={unitSentences.length === 0}
        >
          💬 短句
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

      {/* 微信浏览器 TTS 警告 */}
      {isWeChat && (
        <div className="wechat-tts-notice">
          <span>💡 </span>
          微信内可能无法播放发音。建议点击右上角「在浏览器中打开」获得完整体验。
        </div>
      )}

      {/* Progress */}
      <ProgressBar
        current={mode === 'words' ? completedInUnit : currentIndex + 1}
        total={totalItems}
        label={progressLabel}
      />

      {/* Counter */}
      <div className="learn-word-counter">
        第 {currentIndex + 1} / {totalItems} {mode === 'words' ? '个单词' : '个短句'}
      </div>

      {/* Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${currentIndex}`}
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

      {/* Record Button */}
      <div className="learn-actions">
        <RecordButton
          isListening={isListening}
          isSupported={isSupported}
          onRecord={handleRecord}
          disabled={!!feedback}
        />
      </div>

      {/* Navigation */}
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
          disabled={currentIndex >= totalItems - 1}
        >
          下一个 →
        </button>
      </div>

      {/* Feedback Overlay */}
      <FeedbackAnimation
        type={feedback}
        recognizedWord={recognizedWord}
        targetWord={getCurrentText()}
        onDismiss={
          feedback === 'correct' ? handleCorrectDismiss :
          feedback === 'review-added' ? handleReviewDismiss :
          feedback === 'wrong' ? handleWrongDismiss : undefined
        }
        failCount={localFailCount}
      />
    </div>
  );
};

export default LearnPage;
