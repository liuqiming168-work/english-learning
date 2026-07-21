import React from 'react';
import type { Sentence } from '../data/sentences';

interface SentenceCardProps {
  sentence: Sentence;
  isSpeaking: boolean;
  onSpeak: () => void;
}

const SentenceCard: React.FC<SentenceCardProps> = ({ sentence, isSpeaking, onSpeak }) => {
  return (
    <div className="sentence-card">
      <div className="sentence-card-badge">💬 短句跟读</div>
      <div className="sentence-card-main">
        <span className="sentence-english">{sentence.english}</span>
      </div>
      <div className="sentence-chinese">{sentence.chinese}</div>
      <button
        className={`btn-speak ${isSpeaking ? 'speaking' : ''}`}
        onClick={onSpeak}
        disabled={isSpeaking}
      >
        {isSpeaking ? '🔊 朗读中...' : '🔊 听发音'}
      </button>
    </div>
  );
};

export default SentenceCard;
