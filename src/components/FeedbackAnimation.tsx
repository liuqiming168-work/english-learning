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
  onDismiss,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (type) {
      setShow(true);
      if (type === 'correct') {
        const timer = setTimeout(() => {
          setShow(false);
          onDismiss?.();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [type, onDismiss]);

  return (
    <AnimatePresence>
      {/* Correct Toast */}
      {show && type === 'correct' && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="toast toast-success">
            🌟 太棒了！发音很标准！
          </div>
        </motion.div>
      )}

      {/* Wrong Toast */}
      {show && type === 'wrong' && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="toast toast-wrong">
            💪 再试一次吧！
          </div>
        </motion.div>
      )}

      {/* Review Added Toast */}
      {show && type === 'review-added' && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="toast toast-review">
            📝 已加入重点复习
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackAnimation;
