import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getWordsByUnit, getUnitById } from '../data/words';
import type { Word } from '../data/words';
import { getSentencesByUnit } from '../data/sentences';
import type { Sentence } from '../data/sentences';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useProgress } from '../hooks/useProgress';
import { getFailCount } from '../utils/storage';
import { compareWords } from '../utils/speech';
import WordCard from '../components/WordCard';
import SentenceCard from '../components/SentenceCard';
import RecordButton from '../components/RecordButton';
import FeedbackAnimation from '../components/FeedbackAnimation';
import ProgressBar from '../components/ProgressBar';
import AiCharacter from '../components/AiCharacter';
import type { AiMood } from '../components/AiCharacter';

type FeedbackType = 'correct' | 'wrong' | 'review-added' | null;
type LearnMode = 'words' | 'sentences';

const STT_API = 'https://english-stt.liuqiming168.workers.dev';

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
  const [isListening, setIsListening] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const { isSpeaking, speak } = useSpeechSynthesis();
  const { progress, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed } = useProgress();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentItems = mode === 'words' ? unitWords : unitSentences;
  const currentWord = mode === 'words' ? unitWords[currentIndex] as Word : undefined;
  const currentSentence = mode === 'sentences' ? unitSentences[currentIndex] as Sentence : undefined;
  const completedInUnit = unitWords.filter(w => progress.completedWords.includes(w.id)).length;

  const getCurrentId = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.id;
    if (mode === 'sentences' && currentSentence) return currentSentence.id;
    return '';
  }, [mode, currentWord, currentSentence]);

  const getCurrentText = useCallback(() => {
    if (mode === 'words' && currentWord) return currentWord.word;
    if (mode === 'sentences' && currentSentence) return currentSentence.english;
    return '';
  }, [mode, currentWord, currentSentence]);

  const switchMode = useCallback((newMode: LearnMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setFeedback(null);
    setAiMood('idle');
    setAiMessage(undefined);
  }, []);

  const resetState = useCallback(() => {
    setFeedback(null);
    setRecognizedWord('');
    setLocalFailCount(getFailCount(getCurrentId()));
    setAiMood('idle');
    setAiMessage(['来，跟我一起读吧！', '大胆说出来！', '准备好了吗？', '你能行的！'][Math.floor(Math.random() * 4)]);
  }, [getCurrentId]);

  useEffect(() => { resetState(); }, [currentIndex, mode, resetState]);

  const handleSpeak = useCallback(() => {
    const text = getCurrentText();
    if (text) { setAiMood('think'); setAiMessage('仔细听哦��👂'); speak(text); }
  }, [getCurrentText, speak]);

  useEffect(() => {
    const text = getCurrentText();
    if (text && !isSpeaking && !feedback) {
      const t = setTimeout(() => { setAiMood('idle'); speak(text); }, 600);
      return () => clearTimeout(t);
    }
  }, [currentIndex, mode]);

  // ===== 清理录音 =====
  const cleanupRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setRecordingTime(0);
  }, []);

  useEffect(() => () => cleanupRecording(), [cleanupRecording]);

  // ===== 核心：点击跟读 → 录音 → Whisper API → 判断 =====
  const handleRecord = useCallback(async () => {
    const text = getCurrentText();
    if (!text || isListening) return;

    // 1. 开始录音
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true }
      });
      streamRef.current = stream;
      chunksRef.current = [];

      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
      else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      recorder.start();
      setIsListening(true);
      setAiMood('think');
      setAiMessage('正在听... 🎤');
      setRecordingTime(3);

      // 倒计时 3 秒
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev <= 1) {
            // 时间到，停止录音
            if (timerRef.current) clearInterval(timerRef.current);
            recorder.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. 等待录音完成
      const audioBlob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          setIsListening(false);
          if (timerRef.current) clearInterval(timerRef.current);
          if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          resolve(blob);
        };
      });

      if (audioBlob.size < 200) {
        setAiMood('encourage');
        setAiMessage('没有检测到语音，请大声读出来！');
        return;
      }

      // 3. 发送到 Whisper API
      setAiMood('think');
      setAiMessage('识别中...');

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const response = await fetch(STT_API, { method: 'POST', body: formData });
      const data = await response.json();
      const recognized = (data.text || '').trim();

      setRecognizedWord(recognized);

      if (!recognized) {
        setAiMood('encourage');
        setAiMessage('没有识别到语音，请再试一次');
        return;
      }

      // 4. 判断结果
      if (compareWords(recognized, text)) {
        setFeedback('correct');
        setAiMood('happy');
        setAiMessage(undefined);
        if (mode === 'words' && currentWord) handleCorrect(currentWord.id);
        else if (mode === 'sentences' && currentSentence) handleSentenceCorrect(currentSentence.id);
        setLocalFailCount(0);
      } else {
        if (mode === 'words' && currentWord) {
          const added = handleFailed(currentWord.id);
          setLocalFailCount(getFailCount(currentWord.id));
          if (added) { setFeedback('review-added'); setAiMood('encourage'); setAiMessage('这个词已加入重点复习，别灰心！💪'); }
          else { setFeedback('wrong'); setAiMood('encourage'); setAiMessage(undefined); }
        } else if (mode === 'sentences' && currentSentence) {
          const added = handleSentenceFailed(currentSentence.id);
          setLocalFailCount(getFailCount(currentSentence.id));
          if (added) { setFeedback('review-added'); setAiMood('encourage'); setAiMessage('这个短句已加入重点复习，别灰心！💪'); }
          else { setFeedback('wrong'); setAiMood('encourage'); setAiMessage(undefined); }
        }
      }
    } catch (e) {
      setIsListening(false);
      cleanupRecording();
      setAiMood('encourage');
      setAiMessage('无法访问麦克风，请检查权限设置');
    }
  }, [getCurrentText, isListening, mode, currentWord, currentSentence, handleCorrect, handleFailed, handleSentenceCorrect, handleSentenceFailed, cleanupRecording]);

  // ===== 导航 =====
  const handleCorrectDismiss = () => currentIndex < currentItems.length - 1 ? setCurrentIndex(p => p + 1) : navigate('/units');
  const handleWrongDismiss = () => setFeedback(null);
  const handleReviewDismiss = () => currentIndex < currentItems.length - 1 ? setCurrentIndex(p => p + 1) : navigate('/units');
  const handleNext = () => { if (currentIndex < currentItems.length - 1) setCurrentIndex(p => p + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(p => p - 1); };

  if (!unit || (unitWords.length === 0 && unitSentences.length === 0)) {
    return <div className="page learn-page"><div className="empty-state"><p>该单元暂无内容</p><Link to="/units" className="btn-primary">返回单元列表</Link></div></div>;
  }

  const totalItems = currentItems.length;

  return (
    <div className="page learn-page">
      <div className="learn-header">
        <Link to={`/unit/${unit.id}/intro`} className="btn-back">← 返回</Link>
        <h2>{unit.nameCn}</h2>
      </div>

      <div className="learn-mode-tabs">
        <button className={`mode-tab ${mode === 'words' ? 'active' : ''}`} onClick={() => switchMode('words')} disabled={unitWords.length === 0}>📝 单词</button>
        <button className={`mode-tab ${mode === 'sentences' ? 'active' : ''}`} onClick={() => switchMode('sentences')} disabled={unitSentences.length === 0}>💬 短句</button>
      </div>

      <div className="learn-ai-area">
        <AiCharacter mood={aiMood} message={aiMessage} showBubble={true} size="small" />
      </div>

      <ProgressBar current={mode === 'words' ? completedInUnit : currentIndex + 1} total={totalItems} label={mode === 'words' ? '单词进度' : '短句进度'} />

      <div className="learn-word-counter">第 {currentIndex + 1} / {totalItems} {mode === 'words' ? '个单词' : '个短句'}</div>

      <AnimatePresence mode="wait">
        <motion.div key={`${mode}-${currentIndex}`} className="learn-word-area"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          {mode === 'words' && currentWord && <WordCard word={currentWord} isSpeaking={isSpeaking} onSpeak={handleSpeak} />}
          {mode === 'sentences' && currentSentence && <SentenceCard sentence={currentSentence} isSpeaking={isSpeaking} onSpeak={handleSpeak} />}
        </motion.div>
      </AnimatePresence>

      <div className="learn-actions">
        <RecordButton isListening={isListening} isSupported={true} onRecord={handleRecord} disabled={!!feedback} />
        {isListening && <div className="recording-countdown">录音中... {recordingTime}s</div>}
      </div>

      <div className="learn-nav">
        <button className="btn-nav" onClick={handlePrev} disabled={currentIndex === 0}>← 上一个</button>
        <button className="btn-nav" onClick={handleNext} disabled={currentIndex >= totalItems - 1}>下一个 →</button>
      </div>

      <FeedbackAnimation type={feedback} recognizedWord={recognizedWord} targetWord={getCurrentText()}
        onDismiss={feedback === 'correct' ? handleCorrectDismiss : feedback === 'review-added' ? handleReviewDismiss : feedback === 'wrong' ? handleWrongDismiss : undefined}
        failCount={localFailCount} />
    </div>
  );
};

export default LearnPage;
