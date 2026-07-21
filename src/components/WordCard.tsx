import React from 'react';
import { motion } from 'framer-motion';
import type { Word } from '../data/words';

// 简单 emoji 映射（基于单词含义关键词）
const WORD_EMOJI_MAP: Record<string, string> = {
  hello: '👋', hi: '👋', goodbye: '👋', bye: '👋',
  name: '📛', morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙',
  school: '🏫', classroom: '🏫', teacher: '👩‍🏫', student: '🧑‍🎓',
  book: '📚', pen: '🖊️', pencil: '✏️', desk: '🪑', chair: '🪑',
  red: '🔴', blue: '🔵', green: '🟢', yellow: '🟡', white: '⚪', black: '⚫',
  orange: '🍊', purple: '🟣', pink: '🩷', brown: '🟤',
  friend: '🤝', boy: '👦', girl: '👧', man: '👨', woman: '👩',
  body: '🧍', head: '🗣️', eye: '👁️', ear: '👂', nose: '👃', mouth: '👄',
  hand: '✋', arm: '💪', leg: '🦵', foot: '🦶',
  family: '👨‍👩‍👧‍👦', mother: '👩', father: '👨', brother: '👦', sister: '👧',
  baby: '👶', grandpa: '👴', grandma: '👵',
  food: '🍽️', rice: '🍚', bread: '🍞', milk: '🥛', egg: '🥚',
  apple: '🍎', banana: '🍌', cake: '🎂', water: '💧',
  time: '⏰', day: '📅', week: '📅', today: '📌', tomorrow: '🔜',
  room: '🏠', bed: '🛏️', door: '🚪', window: '🪟',
  farm: '🌾', animal: '🐾', cat: '🐱', dog: '🐕', bird: '🐦',
  fish: '🐟', horse: '🐴', cow: '🐄', pig: '🐷', duck: '🦆',
  play: '🎮', game: '🎯', toy: '🧸', ball: '⚽', run: '🏃',
  jump: '🦘', sing: '🎵', dance: '💃', draw: '🎨',
  one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣', five: '5️⃣',
  six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟',
};

function getEmoji(word: string): string {
  const lower = word.toLowerCase().trim();
  if (WORD_EMOJI_MAP[lower]) return WORD_EMOJI_MAP[lower];
  // 部分匹配
  for (const [key, emoji] of Object.entries(WORD_EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return '📝';
}

interface WordCardProps {
  word: Word;
  isSpeaking: boolean;
  onSpeak: () => void;
  flashState?: 'correct' | 'wrong' | null;
}

const WordCard: React.FC<WordCardProps> = ({ word, isSpeaking, onSpeak, flashState }) => {
  const emoji = getEmoji(word.word);

  return (
    <motion.div
      className={`word-card ${flashState === 'correct' ? 'correct-flash' : ''} ${flashState === 'wrong' ? 'wrong-flash' : ''}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="word-card-emoji">{emoji}</div>
      <div className="word-card-english">{word.word}</div>
      {word.phonetic && <div className="word-card-phonetic">{word.phonetic}</div>}
      <div className="word-card-meaning">{word.meaning}</div>
      <button className={`btn-speak ${isSpeaking ? 'speaking' : ''}`} onClick={onSpeak}>
        🔊 听发音
      </button>
    </motion.div>
  );
};

export default WordCard;
