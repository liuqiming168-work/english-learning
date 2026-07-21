import React from 'react';
import { motion } from 'framer-motion';

interface RecordButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onRecord: () => void;
  disabled?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isListening,
  isSupported,
  onRecord,
  disabled = false,
}) => {
  if (!isSupported) {
    return (
      <div className="record-unsupported">
        <p>⚠️ 您的浏览器不支持语音识别</p>
        <p className="hint">请使用 <strong>Chrome 浏览器</strong> 打开此应用</p>
      </div>
    );
  }

  return (
    <motion.button
      className={`btn-record ${isListening ? 'listening' : ''}`}
      onClick={onRecord}
      disabled={disabled || isListening}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      {isListening ? (
        <>
          <motion.span
            className="mic-icon"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            🎤
          </motion.span>
          <span>正在听你说...</span>
        </>
      ) : (
        <>
          <span className="mic-icon">🎤</span>
          <span>点击跟读</span>
        </>
      )}
    </motion.button>
  );
};

export default RecordButton;
