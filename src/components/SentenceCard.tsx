import React from 'react';
import { motion } from 'framer-motion';
import type { Sentence } from '../data/sentences';

interface SentenceCardProps {
  sentence: Sentence;
  isSpeaking: boolean;
  onSpeak: () => void;
  flashState?: 'correct' | 'wrong' | null;
}

const SentenceCard: React.FC<SentenceCardProps> = ({ sentence, isSpeaking, onSpeak, flashState }) => {
  return (
    <motion.div
      className={`sentence-card ${flashState === 'correct' ? 'correct-flash' : ''} ${flashState === 'wrong' ? 'wrong-flash' : ''}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="sentence-card-badge">💬 短句跟读</div>
      <div className="sentence-english">{sentence.english}</div>
      <div className="sentence-chinese">{sentence.chinese}</div>
      <button className={`btn-speak ${isSpeaking ? 'speaking' : ''}`} onClick={onSpeak}>
        🔊 听发音
      </button>
    </motion.div>
  );
};

export default SentenceCard;
