import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackType = 'correct' | 'wrong' | 'review-added' | null;

interface FeedbackAnimationProps {
  type: FeedbackType;
  recognizedWord?: string;
  targetWord?: string;
  onDismiss?: () => void;
  failCount?: number;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  recognizedWord,
  targetWord,
  onDismiss,
  failCount = 0,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (type) {
      setShow(true);
      if (type === 'correct') {
        const timer = setTimeout(() => {
          setShow(false);
          onDismiss?.();
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [type, onDismiss]);

  // 撒花粒子
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#6C5CE7', '#A8E6CF'][i % 6],
    size: 8 + Math.random() * 12,
    delay: Math.random() * 0.5,
  }));

  return (
    <AnimatePresence>
      {show && type === 'correct' && (
        <motion.div
          className="feedback-overlay feedback-correct"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 撒花粒子 */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: [1, 1, 0],
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: p.delay,
                ease: 'easeIn',
              }}
            />
          ))}
          {/* 中心反馈 */}
          <motion.div
            className="feedback-content"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="feedback-emoji"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🌟
            </motion.div>
            <h2 className="feedback-title correct-title">太棒了！</h2>
            <p className="feedback-subtitle">发音非常标准！</p>
          </motion.div>
        </motion.div>
      )}

      {show && type === 'wrong' && (
        <motion.div
          className="feedback-overlay feedback-wrong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="feedback-content"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="feedback-emoji"
              animate={{ x: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              💪
            </motion.div>
            <h2 className="feedback-title wrong-title">再试一次！</h2>
            {recognizedWord && (
              <p className="feedback-recognized">
                你读的是：<span className="recognized-text">"{recognizedWord}"</span>
              </p>
            )}
            <p className="feedback-subtitle">
              目标单词：<strong>{targetWord}</strong>
            </p>
            {failCount > 0 && (
              <p className="feedback-fail-count">
                已尝试 <strong>{failCount}</strong> 次
                {failCount >= 2 && '，再错一次将加入重点复习！'}
              </p>
            )}
            <motion.button
              className="btn-retry"
              onClick={() => {
                setShow(false);
                onDismiss?.();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              继续跟读 💪
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {show && type === 'review-added' && (
        <motion.div
          className="feedback-overlay feedback-review"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="feedback-content"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="feedback-emoji">📝</div>
            <h2 className="feedback-title review-title">已加入重点复习</h2>
            <p className="feedback-subtitle">
              连续 3 次未通过，<strong>{targetWord}</strong> 已加入重点复习列表
            </p>
            <motion.button
              className="btn-retry btn-review"
              onClick={() => {
                setShow(false);
                onDismiss?.();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              知道了，继续学习
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackAnimation;
