import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { isMobileDevice, compareWords } from '../utils/speech';
import WordCard from '../components/WordCard';
import SentenceCard from '../components/SentenceCard';
import RecordButton from '../components/RecordButton';
import FeedbackAnimation from '../components/FeedbackAnimation';
import ProgressBar from '../components/ProgressBar';
import AiCharacter from '../components/AiCharacter';
import type { AiMood } from '../components/AiCharacter';

type FeedbackType = 'correct' | 'wrong' | 'review-added' | null;
type LearnMode = 'words' | 'sentences';

const STT_API_URL = 'https://english-stt.liuqiming168.workers.dev';

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
  // 移动端录音状态
  const [isMobileRecording, setIsMobileRecording] = useState(false);
  const [mobileRecordingFailed, setMobileRecordingFailed] = useState(false);

  const { isListening: isSpeechListening, isSupported: isSpeechSupported, checkWord: checkWordSpeech } = useSpeechRecognition();
  const { isSpeaking, speak, isWeChat } = useSpeechSynthesis();
  const { progress, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed } = useProgress();

  // 移动端录音相关 refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 判断是否使用移动端方案
  const isMobile = isMobileDevice();
  const useMobileMode = isMobile || !isSpeechSupported;

  // 当前内容
  const currentItems = mode === 'words' ? unitWords : unitSentences;
  const currentWord: Word | undefined = mode === 'words' ? unitWords[currentIndex] as Word : undefined;
  const currentSentence: Sentence | undefined = mode === 'sentences' ? unitSentences[currentIndex] as Sentence : undefined;

  const completedInUnit = unitWords.filter(w => progress.completedWords.includes(w.id)).length;

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
    setMobileRecordingFailed(false);
  }, [getCurrentId]);

  useEffect(() => {
    resetState();
  }, [currentIndex, mode, resetState]);

  // 朗读
  const handleSpeak = useCallback(() => {
    const text = getCurrentText();
    if (text) {
      setAiMood('think');
      setAiMessage('仔细听哦～👂');
      speak(text);
    }
  }, [getCurrentText, speak]);

  // 自动朗读
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

  // ========== 移动端：录音方案 ==========

  const startMobileRecording = useCallback(async () => {
    setMobileRecordingFailed(false);
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

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsMobileRecording(true);
      setAiMood('think');
      setAiMessage('正在听你说...松手结束录音 🎤');

      // 最长录音 8 秒
      recordingTimeoutRef.current = setTimeout(() => {
        stopMobileRecording();
      }, 8000);
    } catch {
      setMobileRecordingFailed(true);
      setAiMood('encourage');
      setAiMessage('无法访问麦克风，请检查权限设置');
    }
  }, []);

  const stopMobileRecording = useCallback(async () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setIsMobileRecording(false);
      return;
    }

    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        setIsMobileRecording(false);

        // 停止麦克风
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }

        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (audioBlob.size < 200) {
          setAiMood('encourage');
          setAiMessage('没有检测到语音，请大声读出来！');
          resolve();
          return;
        }

        // 发送到 Cloudflare Whisper API
        setAiMood('think');
        setAiMessage('正在识别中...');

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');

          const response = await fetch(STT_API_URL, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          const text = data.text || '';

          if (!text) {
            setAiMood('encourage');
            setAiMessage('没有识别到语音，请再试一次');
            resolve();
            return;
          }

          // 处理识别结果
          handleMobileResult(text);
          resolve();
        } catch {
          setAiMood('encourage');
          setAiMessage('网络错误，请重试');
          resolve();
        }
      };

      recorder.stop();
    });
  }, []);

  const handleMobileResult = useCallback((text: string) => {
    const targetText = getCurrentText();
    setRecognizedWord(text);

    if (compareWords(text, targetText)) {
      setFeedback('correct');
      setAiMood('happy');
      setAiMessage(undefined);
      if (mode === 'words' && currentWord) handleCorrect(currentWord.id);
      else if (mode === 'sentences' && currentSentence) handleSentenceCorrect(currentSentence.id);
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
  }, [getCurrentText, mode, currentWord, currentSentence, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed]);

  // 移动端：按住开始，松手停止
  const handleMobilePressStart = useCallback(() => {
    if (feedback) return;
    startMobileRecording();
  }, [feedback, startMobileRecording]);

  const handleMobilePressEnd = useCallback(() => {
    if (isMobileRecording) {
      stopMobileRecording();
    }
  }, [isMobileRecording, stopMobileRecording]);

  // ========== 桌面端：Web Speech API ==========

  const handleRecordDesktop = async () => {
    const text = getCurrentText();
    if (!text || isSpeechListening) return;

    setAiMood('think');
    setAiMessage('让我听听...');

    const result = await checkWordSpeech(text);
    setRecognizedWord(result.recognized);

    if (result.correct) {
      setFeedback('correct');
      setAiMood('happy');
      setAiMessage(undefined);
      if (mode === 'words' && currentWord) handleCorrect(currentWord.id);
      else if (mode === 'sentences' && currentSentence) handleSentenceCorrect(currentSentence.id);
      setLocalFailCount(0);
    } else {
      const isSystemError = result.recognized.includes('权限') || result.recognized.includes('不支持') || result.recognized.includes('浏览器');
      if (isSystemError) {
        setFeedback('wrong');
        setAiMood('encourage');
        setAiMessage(result.recognized);
        return;
      }
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

  // ========== 通用 ==========

  const handleCorrectDismiss = () => {
    if (currentIndex < currentItems.length - 1) setCurrentIndex(prev => prev + 1);
    else navigate('/units');
  };

  const handleWrongDismiss = () => setFeedback(null);

  const handleReviewDismiss = () => {
    if (currentIndex < currentItems.length - 1) setCurrentIndex(prev => prev + 1);
    else navigate('/units');
  };

  const handleNext = () => {
    if (currentIndex < currentItems.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // 清理录音资源
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

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
  const isListening = useMobileMode ? isMobileRecording : isSpeechListening;

  return (
    <div className="page learn-page">
      <div className="learn-header">
        <Link to={`/unit/${unit.id}/intro`} className="btn-back">← 返回</Link>
        <h2>{unit.nameCn}</h2>
      </div>

      <div className="learn-mode-tabs">
        <button className={`mode-tab ${mode === 'words' ? 'active' : ''}`} onClick={() => switchMode('words')} disabled={unitWords.length === 0}>
          📝 单词
        </button>
        <button className={`mode-tab ${mode === 'sentences' ? 'active' : ''}`} onClick={() => switchMode('sentences')} disabled={unitSentences.length === 0}>
          💬 短句
        </button>
      </div>

      <div className="learn-ai-area">
        <AiCharacter mood={aiMood} message={aiMessage} showBubble={true} size="small" />
      </div>

      {isWeChat && (
        <div className="wechat-tts-notice">
          <span>💡 </span>微信内发音功能可能受限。建议在系统浏览器中打开。
        </div>
      )}

      {mobileRecordingFailed && (
        <div className="wechat-tts-notice">
          <span>⚠️ </span>无法访问麦克风。请在浏览器设置中允许麦克风权限后刷新页面。
        </div>
      )}

      <ProgressBar current={mode === 'words' ? completedInUnit : currentIndex + 1} total={totalItems} label={progressLabel} />

      <div className="learn-word-counter">
        第 {currentIndex + 1} / {totalItems} {mode === 'words' ? '个单词' : '个短句'}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${mode}-${currentIndex}`} className="learn-word-area"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          {mode === 'words' && currentWord && <WordCard word={currentWord} isSpeaking={isSpeaking} onSpeak={handleSpeak} />}
          {mode === 'sentences' && currentSentence && <SentenceCard sentence={currentSentence} isSpeaking={isSpeaking} onSpeak={handleSpeak} />}
        </motion.div>
      </AnimatePresence>

      {/* Record Button */}
      <div className="learn-actions">
        {useMobileMode ? (
          <motion.button
            className={`btn-record mobile-record ${isMobileRecording ? 'listening' : ''}`}
            onMouseDown={handleMobilePressStart}
            onMouseUp={handleMobilePressEnd}
            onMouseLeave={handleMobilePressEnd}
            onTouchStart={(e) => { e.preventDefault(); handleMobilePressStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleMobilePressEnd(); }}
            onTouchCancel={handleMobilePressEnd}
            disabled={!!feedback}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileRecording ? (
              <>
                <motion.span className="mic-icon" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>🎤</motion.span>
                <span>松手结束录音</span>
              </>
            ) : (
              <>
                <span className="mic-icon">🎤</span>
                <span>按住跟读</span>
              </>
            )}
          </motion.button>
        ) : (
          <RecordButton isListening={isListening} isSupported={isSpeechSupported} onRecord={handleRecordDesktop} disabled={!!feedback} />
        )}
      </div>

      <div className="learn-nav">
        <button className="btn-nav" onClick={handlePrev} disabled={currentIndex === 0}>← 上一个</button>
        <button className="btn-nav" onClick={handleNext} disabled={currentIndex >= totalItems - 1}>下一个 →</button>
      </div>

      <FeedbackAnimation
        type={feedback}
        recognizedWord={recognizedWord}
        targetWord={getCurrentText()}
        onDismiss={feedback === 'correct' ? handleCorrectDismiss : feedback === 'review-added' ? handleReviewDismiss : feedback === 'wrong' ? handleWrongDismiss : undefined}
        failCount={localFailCount}
      />
    </div>
  );
};

export default LearnPage;
