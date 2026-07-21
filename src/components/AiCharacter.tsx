import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AiMood = 'idle' | 'happy' | 'encourage' | 'think';

interface AiCharacterProps {
  mood: AiMood;
  message?: string;
  showBubble?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AiCharacter: React.FC<AiCharacterProps> = ({
  mood = 'idle',
  message,
  showBubble = true,
  size = 'medium',
}) => {
  const sizeMap = { small: 80, medium: 120, large: 160 };
  const s = sizeMap[size];

  const bubbleMessages: Record<AiMood, string[]> = {
    idle: ['来，跟我一起读吧！', '准备好了吗？', '大胆说出来！', '你能行的！'],
    happy: ['太棒了！发音真标准！🌟', '非常好！你真厉害！👏', '完美！继续加油！🎉', '哇！读得太好了！💯', '你好聪明啊！⭐'],
    encourage: ['没关系，再试一次！💪', '差一点就对了，加油！', '注意听发音哦～👂', '慢慢来，你可以的！', '不要灰心，再试一次！😊'],
    think: ['让我想想……🤔', '这个单词有点难呢', '仔细听一遍再试试', '你离成功很近了！'],
  };

  const getRandomMessage = () => {
    const msgs = bubbleMessages[mood];
    return msgs[Math.floor(Math.random() * msgs.length)];
  };

  const displayMessage = message || getRandomMessage();

  return (
    <div className={`ai-character ai-size-${size}`}>
      {/* 对话气泡 */}
      <AnimatePresence>
        {showBubble && displayMessage && (
          <motion.div
            className={`ai-bubble ai-bubble-${mood}`}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            key={displayMessage}
          >
            <p className="ai-bubble-text">{displayMessage}</p>
            <div className="ai-bubble-arrow" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI 人物 SVG */}
      <motion.div
        className="ai-avatar"
        animate={mood === 'happy' ? {
          y: [0, -8, 0],
          rotate: [0, -5, 5, -5, 0],
        } : mood === 'encourage' ? {
          x: [0, -3, 3, -3, 0],
        } : mood === 'think' ? {
          rotate: [0, -3, 3, 0],
        } : {
          y: [0, -3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: mood === 'happy' ? 1.5 : mood === 'encourage' ? 1 : 2,
        }}
      >
        <svg viewBox="0 0 160 160" width={s} height={s}>
          {/* 身体 */}
          <motion.ellipse
            cx="80" cy="120" rx="38" ry="30"
            fill="#6C5CE7"
            animate={mood === 'happy' ? { fill: '#6C5CE7' } : mood === 'encourage' ? { fill: '#5B4CC4' } : { fill: '#6C5CE7' }}
          />

          {/* 头部 */}
          <motion.circle
            cx="80" cy="62" r="34"
            fill="#FFEAA7"
            animate={mood === 'happy' ? { fill: '#FFEAA7' } : mood === 'encourage' ? { fill: '#FFE0A0' } : { fill: '#FFEAA7' }}
          />

          {/* 眼睛 */}
          {mood === 'happy' ? (
            <>
              {/* 开心弯弯眼 */}
              <motion.path
                d="M65 56 Q70 50 75 56"
                stroke="#2D3436" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ d: ['M65 56 Q70 50 75 56', 'M65 56 Q70 48 75 56', 'M65 56 Q70 50 75 56'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.path
                d="M85 56 Q90 50 95 56"
                stroke="#2D3436" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ d: ['M85 56 Q90 50 95 56', 'M85 56 Q90 48 95 56', 'M85 56 Q90 50 95 56'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </>
          ) : mood === 'encourage' ? (
            <>
              {/* 鼓励圆眼 */}
              <circle cx="70" cy="56" r="6" fill="#2D3436" />
              <circle cx="90" cy="56" r="6" fill="#2D3436" />
              <circle cx="72" cy="54" r="2" fill="white" />
              <circle cx="92" cy="54" r="2" fill="white" />
            </>
          ) : mood === 'think' ? (
            <>
              {/* 思考眼 - 一高一低 */}
              <circle cx="70" cy="54" r="6" fill="#2D3436" />
              <circle cx="90" cy="58" r="6" fill="#2D3436" />
              <circle cx="72" cy="52" r="2" fill="white" />
              <circle cx="92" cy="56" r="2" fill="white" />
            </>
          ) : (
            <>
              {/* 默认圆眼 */}
              <circle cx="70" cy="56" r="5" fill="#2D3436" />
              <circle cx="90" cy="56" r="5" fill="#2D3436" />
              <circle cx="72" cy="54" r="2" fill="white" />
              <circle cx="92" cy="54" r="2" fill="white" />
            </>
          )}

          {/* 嘴巴 */}
          {mood === 'happy' ? (
            <motion.path
              d="M68 72 Q80 85 92 72"
              stroke="#2D3436" strokeWidth="2.5" fill="#FF6B6B" strokeLinecap="round"
            />
          ) : mood === 'encourage' ? (
            <motion.ellipse cx="80" cy="74" rx="6" ry="4" fill="#E17055" />
          ) : mood === 'think' ? (
            <motion.ellipse cx="88" cy="72" rx="5" ry="3" fill="#E17055" />
          ) : (
            <path d="M70 72 Q80 78 90 72" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* 腮红 */}
          <circle cx="56" cy="65" r="7" fill="#FF6B6B" opacity="0.2" />
          <circle cx="104" cy="65" r="7" fill="#FF6B6B" opacity="0.2" />

          {/* 手臂 */}
          {mood === 'happy' ? (
            <>
              <motion.g animate={{ rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ transformOrigin: '42px 105px' }}>
                <ellipse cx="35" cy="100" rx="10" ry="18" fill="#FFEAA7" transform="rotate(-20 35 100)" />
              </motion.g>
              <motion.g animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ transformOrigin: '118px 105px' }}>
                <ellipse cx="125" cy="100" rx="10" ry="18" fill="#FFEAA7" transform="rotate(20 125 100)" />
              </motion.g>
            </>
          ) : (
            <>
              <ellipse cx="38" cy="105" rx="10" ry="16" fill="#FFEAA7" transform="rotate(-10 38 105)" />
              <ellipse cx="122" cy="105" rx="10" ry="16" fill="#FFEAA7" transform="rotate(10 122 105)" />
            </>
          )}

          {/* 腿 */}
          <rect x="62" y="140" width="14" height="16" rx="7" fill="#0984E3" />
          <rect x="84" y="140" width="14" height="16" rx="7" fill="#0984E3" />

          {/* 脚 */}
          <ellipse cx="69" cy="158" rx="10" ry="5" fill="#FF6B6B" />
          <ellipse cx="91" cy="158" rx="10" ry="5" fill="#FF6B6B" />

          {/* 头顶装饰 */}
          <motion.g
            animate={mood === 'happy' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            {/* 小天线/呆毛 */}
            <path d="M80 28 Q82 18 88 14" stroke="#6C5CE7" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="88" cy="13" r="4" fill="#FF6B6B" />
          </motion.g>

          {/* 开心时的星星 */}
          {mood === 'happy' && (
            <>
              <motion.text x="20" y="40" fontSize="14" animate={{ y: [0, -8, 0], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>⭐</motion.text>
              <motion.text x="130" y="35" fontSize="12" animate={{ y: [0, -6, 0], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>✨</motion.text>
              <motion.text x="15" y="70" fontSize="10" animate={{ y: [0, -5, 0], opacity: [0.8, 0.3, 0.8] }} transition={{ repeat: Infinity, duration: 1.2 }}>💫</motion.text>
              <motion.text x="135" y="65" fontSize="11" animate={{ y: [0, -7, 0], opacity: [0.8, 0.3, 0.8] }} transition={{ repeat: Infinity, duration: 0.9 }}>🌟</motion.text>
            </>
          )}

          {/* 思考时的问号 */}
          {mood === 'think' && (
            <motion.text x="110" y="30" fontSize="16" animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>💭</motion.text>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

export default AiCharacter;
