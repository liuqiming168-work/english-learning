import React from 'react';
import type { Word } from '../data/words';

interface WordCardProps {
  word: Word;
  isSpeaking: boolean;
  onSpeak: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, isSpeaking, onSpeak }) => {
  return (
    <div className="word-card">
      <div className="word-card-unit">
        {word.semester}册 · {word.unitName}
      </div>
      <div className="word-card-main">
        <span className="word-card-english">{word.word}</span>
      </div>
      <div className="word-card-phonetic">{word.phonetic}</div>
      <div className="word-card-meaning">{word.meaning}</div>
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

export default WordCard;
