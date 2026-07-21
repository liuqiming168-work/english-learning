import React from 'react';
import { motion } from 'framer-motion';

interface UnitIllustrationProps {
  type: string;
  size?: number;
}

const UnitIllustration: React.FC<UnitIllustrationProps> = ({ type, size = 200 }) => {
  const s = size;

  const illustrations: Record<string, React.ReactNode> = {
    // Unit 1: 问候
    greetings: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 太阳 */}
        <motion.circle cx="160" cy="40" r="28" fill="#FDCB6E" initial={{ scale: 0.8 }} animate={{ scale: [0.9, 1.05, 0.9] }} transition={{ repeat: Infinity, duration: 3 }} />
        {/* 人物1 */}
        <circle cx="70" cy="100" r="22" fill="#74B9FF" />
        <rect x="52" y="125" width="36" height="45" rx="12" fill="#0984E3" />
        <circle cx="63" cy="96" r="3" fill="white" />
        <circle cx="77" cy="96" r="3" fill="white" />
        <path d="M65 107 Q70 113 75 107" stroke="white" strokeWidth="2" fill="none" />
        {/* 挥手的手 */}
        <motion.g animate={{ rotate: [0, -15, 10, -15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <circle cx="95" cy="95" r="8" fill="#FFEAA7" />
        </motion.g>
        {/* 人物2 */}
        <circle cx="130" cy="100" r="22" fill="#FF6B6B" />
        <rect x="112" y="125" width="36" height="45" rx="12" fill="#E74C3C" />
        <circle cx="123" cy="96" r="3" fill="white" />
        <circle cx="137" cy="96" r="3" fill="white" />
        <path d="M125 107 Q130 110 135 107" stroke="white" strokeWidth="2" fill="none" />
        {/* 对话气泡 */}
        <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <rect x="80" y="55" width="60" height="28" rx="14" fill="white" stroke="#6C5CE7" strokeWidth="1.5" />
          <text x="110" y="74" textAnchor="middle" fontSize="14" fill="#6C5CE7" fontWeight="bold">Hello!</text>
        </motion.g>
      </svg>
    ),

    // Unit 2: 学校
    school: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 学校建筑 */}
        <rect x="40" y="70" width="120" height="90" rx="4" fill="#F8C291" />
        <rect x="40" y="60" width="120" height="18" rx="4" fill="#E17055" />
        {/* 窗户 */}
        <rect x="55" y="85" width="22" height="22" rx="2" fill="#81ECEC" stroke="#6C5CE7" strokeWidth="1" />
        <rect x="90" y="85" width="22" height="22" rx="2" fill="#81ECEC" stroke="#6C5CE7" strokeWidth="1" />
        <rect x="125" y="85" width="22" height="22" rx="2" fill="#81ECEC" stroke="#6C5CE7" strokeWidth="1" />
        <rect x="55" y="120" width="22" height="22" rx="2" fill="#81ECEC" stroke="#6C5CE7" strokeWidth="1" />
        <rect x="90" y="120" width="22" height="22" rx="2" fill="#81ECEC" stroke="#6C5CE7" strokeWidth="1" />
        {/* 门 */}
        <rect x="125" y="115" width="22" height="45" rx="4" fill="#D63031" />
        {/* 旗杆 */}
        <line x1="170" y1="30" x2="170" y2="60" stroke="#636E72" strokeWidth="2" />
        <motion.rect x="170" y="30" width="18" height="13" rx="1" fill="#6C5CE7" animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 4 }} />
        {/* 操场 */}
        <rect x="40" y="155" width="120" height="6" rx="3" fill="#55EFC4" />
        {/* 小人 */}
        <circle cx="65" cy="168" r="7" fill="#6C5CE7" />
        <circle cx="135" cy="168" r="7" fill="#FF6B6B" />
        {/* 云 */}
        <g fill="white" opacity="0.8">
          <circle cx="30" cy="25" r="10" /><circle cx="40" cy="20" r="12" /><circle cx="50" cy="25" r="9" />
        </g>
      </svg>
    ),

    // Unit 3: 颜色
    colours: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 调色板 */}
        <ellipse cx="100" cy="110" rx="55" ry="40" fill="#DFE6E9" />
        {/* 颜色点 */}
        <motion.circle cx="70" cy="95" r="14" fill="#FF6B6B" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} />
        <motion.circle cx="100" cy="80" r="14" fill="#FDCB6E" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
        <motion.circle cx="130" cy="95" r="14" fill="#74B9FF" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} />
        <motion.circle cx="85" cy="120" r="14" fill="#55EFC4" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} />
        <motion.circle cx="115" cy="120" r="14" fill="#F8A5C2" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
        <motion.circle cx="100" cy="140" r="14" fill="#A29BFE" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} />
        {/* 画笔 */}
        <motion.rect x="155" y="30" width="8" height="70" rx="4" fill="#8B4513" animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} />
        <rect x="153" y="22" width="12" height="14" rx="3" fill="#6C5CE7" />
        {/* 彩虹 */}
        <g opacity="0.4">
          <path d="M30 100 Q100 10 170 100" fill="none" stroke="#FF6B6B" strokeWidth="4" />
          <path d="M34 105 Q100 18 166 105" fill="none" stroke="#FDCB6E" strokeWidth="4" />
          <path d="M38 110 Q100 26 162 110" fill="none" stroke="#55EFC4" strokeWidth="4" />
        </g>
      </svg>
    ),

    // Unit 4: 朋友
    friends: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 三个小朋友手拉手 */}
        <circle cx="60" cy="90" r="20" fill="#FF6B6B" />
        <circle cx="100" cy="80" r="22" fill="#6C5CE7" />
        <circle cx="140" cy="90" r="20" fill="#74B9FF" />
        {/* 笑脸 */}
        <circle cx="55" cy="88" r="2.5" fill="white" /><circle cx="65" cy="88" r="2.5" fill="white" />
        <path d="M54 96 Q60 101 66 96" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="94" cy="78" r="2.5" fill="white" /><circle cx="106" cy="78" r="2.5" fill="white" />
        <path d="M93 86 Q100 92 107 86" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="135" cy="88" r="2.5" fill="white" /><circle cx="145" cy="88" r="2.5" fill="white" />
        <path d="M134 96 Q140 101 146 96" stroke="white" strokeWidth="2" fill="none" />
        {/* 身体 */}
        <rect x="44" y="112" width="32" height="40" rx="10" fill="#E74C3C" />
        <rect x="82" y="104" width="36" height="48" rx="10" fill="#5541D7" />
        <rect x="124" y="112" width="32" height="40" rx="10" fill="#0984E3" />
        {/* 手拉手 */}
        <line x1="76" y1="125" x2="82" y2="118" stroke="#FFEAA7" strokeWidth="3" strokeLinecap="round" />
        <line x1="118" y1="118" x2="124" y2="125" stroke="#FFEAA7" strokeWidth="3" strokeLinecap="round" />
        {/* 爱心 */}
        <motion.text x="100" y="175" textAnchor="middle" fontSize="24" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>❤️</motion.text>
      </svg>
    ),

    // Unit 5: 身体
    body: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 可爱小人 */}
        <circle cx="100" cy="55" r="28" fill="#FFEAA7" />
        {/* 眼睛 */}
        <circle cx="90" cy="50" r="5" fill="#2D3436" />
        <circle cx="110" cy="50" r="5" fill="#2D3436" />
        <circle cx="92" cy="48" r="1.5" fill="white" />
        <circle cx="112" cy="48" r="1.5" fill="white" />
        {/* 微笑 */}
        <path d="M92 64 Q100 72 108 64" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* 身体 */}
        <rect x="75" y="85" width="50" height="55" rx="14" fill="#6C5CE7" />
        {/* 手臂 */}
        <motion.g animate={{ rotate: [0, -8, 0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: '75px 95px' }}>
          <rect x="55" y="95" width="22" height="12" rx="6" fill="#FFEAA7" />
        </motion.g>
        <motion.g animate={{ rotate: [0, 8, 0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: '125px 95px' }}>
          <rect x="123" y="95" width="22" height="12" rx="6" fill="#FFEAA7" />
        </motion.g>
        {/* 腿 */}
        <rect x="80" y="142" width="18" height="30" rx="9" fill="#0984E3" />
        <rect x="102" y="142" width="18" height="30" rx="9" fill="#0984E3" />
        {/* 脚 */}
        <ellipse cx="89" cy="175" rx="14" ry="7" fill="#FF6B6B" />
        <ellipse cx="111" cy="175" rx="14" ry="7" fill="#FF6B6B" />
        {/* 标签线 */}
        <line x1="145" y1="50" x2="170" y2="35" stroke="#B2BEC3" strokeWidth="1" />
        <text x="170" y="30" fontSize="10" fill="#636E72">head</text>
        <line x1="145" y1="95" x2="175" y2="85" stroke="#B2BEC3" strokeWidth="1" />
        <text x="160" y="80" fontSize="10" fill="#636E72">arm</text>
      </svg>
    ),

    // Unit 6: 家庭
    family: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 房子 */}
        <polygon points="100,30 30,80 170,80" fill="#E17055" />
        <rect x="40" y="80" width="120" height="90" fill="#FDCB6E" />
        {/* 窗户 */}
        <rect x="55" y="100" width="25" height="25" rx="3" fill="#81ECEC" />
        <rect x="120" y="100" width="25" height="25" rx="3" fill="#81ECEC" />
        {/* 门 */}
        <rect x="85" y="125" width="30" height="45" rx="4" fill="#D63031" />
        <circle cx="110" cy="150" r="2" fill="#FDCB6E" />
        {/* 家人 */}
        <g transform="translate(25, 155)">
          <circle cx="12" cy="5" r="10" fill="#74B9FF" />
          <rect x="2" y="16" width="20" height="25" rx="6" fill="#0984E3" />
          <text x="12" y="14" fontSize="8" fill="white" textAnchor="middle">爸</text>
        </g>
        <g transform="translate(62, 155)">
          <circle cx="12" cy="5" r="10" fill="#FF6B6B" />
          <rect x="2" y="16" width="20" height="25" rx="6" fill="#E74C3C" />
          <text x="12" y="14" fontSize="8" fill="white" textAnchor="middle">妈</text>
        </g>
        <g transform="translate(100, 158)">
          <circle cx="10" cy="2" r="8" fill="#FFEAA7" />
          <rect x="2" y="11" width="16" height="20" rx="6" fill="#55EFC4" />
          <text x="10" y="10" fontSize="7" fill="white" textAnchor="middle">我</text>
        </g>
        {/* 爱心 */}
        <motion.text x="100" y="200" textAnchor="middle" fontSize="18" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>💕</motion.text>
      </svg>
    ),

    // Unit 7 (下1): 食物
    food: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 盘子 */}
        <ellipse cx="100" cy="150" rx="70" ry="20" fill="#DFE6E9" />
        <ellipse cx="100" cy="145" rx="65" ry="17" fill="white" />
        {/* 苹果 */}
        <circle cx="65" cy="110" r="22" fill="#FF6B6B" />
        <line x1="65" y1="88" x2="68" y2="78" stroke="#8B4513" strokeWidth="2" />
        <ellipse cx="58" cy="100" rx="8" ry="4" fill="#55EFC4" transform="rotate(-20 58 100)" />
        {/* 香蕉 */}
        <motion.path d="M120 130 Q140 90 130 70 Q125 65 118 72 Q110 90 118 128" fill="#FDCB6E" animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        {/* 面包 */}
        <ellipse cx="145" cy="115" rx="22" ry="15" fill="#F8C291" />
        <ellipse cx="145" cy="108" rx="18" ry="8" fill="#E17055" />
        {/* 牛奶 */}
        <rect x="80" y="105" width="18" height="28" rx="3" fill="white" stroke="#B2BEC3" strokeWidth="1" />
        <text x="89" y="124" textAnchor="middle" fontSize="8" fill="#6C5CE7">🥛</text>
        {/* 葡萄 */}
        <circle cx="45" cy="120" r="6" fill="#A29BFE" /><circle cx="55" cy="123" r="6" fill="#6C5CE7" />
        <circle cx="50" cy="130" r="6" fill="#A29BFE" />
      </svg>
    ),

    // Unit 8 (下2): 一天
    day: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 时钟 */}
        <circle cx="100" cy="100" r="55" fill="white" stroke="#6C5CE7" strokeWidth="3" />
        <circle cx="100" cy="100" r="3" fill="#2D3436" />
        {/* 时针 */}
        <motion.line x1="100" y1="100" x2="100" y2="65" stroke="#2D3436" strokeWidth="4" strokeLinecap="round" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 60 }} style={{ transformOrigin: '100px 100px' }} />
        {/* 分针 */}
        <motion.line x1="100" y1="100" x2="130" y2="100" stroke="#636E72" strokeWidth="3" strokeLinecap="round" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 10 }} style={{ transformOrigin: '100px 100px' }} />
        {/* 时间标签 */}
        <text x="100" y="38" textAnchor="middle" fontSize="11" fill="#6C5CE7" fontWeight="bold">12</text>
        <text x="147" y="104" textAnchor="middle" fontSize="11" fill="#636E72">3</text>
        <text x="100" y="175" textAnchor="middle" fontSize="11" fill="#636E72">6</text>
        <text x="53" y="104" textAnchor="middle" fontSize="11" fill="#636E72">9</text>
        {/* 太阳和月亮 */}
        <circle cx="30" cy="35" r="16" fill="#FDCB6E" opacity="0.6" />
        <circle cx="170" cy="165" r="12" fill="#DFE6E9" opacity="0.5" />
        {/* 早餐图标 */}
        <text x="145" y="55" fontSize="18">🍳</text>
      </svg>
    ),

    // Unit 9 (下3): 房间
    room: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 房间 */}
        <rect x="20" y="50" width="160" height="130" rx="6" fill="#FFF3E0" stroke="#DFE6E9" strokeWidth="1.5" />
        {/* 床 */}
        <rect x="35" y="110" width="60" height="40" rx="6" fill="#74B9FF" />
        <rect x="32" y="105" width="66" height="12" rx="4" fill="white" />
        <ellipse cx="50" cy="108" rx="10" ry="6" fill="#A29BFE" />
        {/* 书桌 */}
        <rect x="120" y="120" width="45" height="6" rx="2" fill="#8B4513" />
        <rect x="135" y="126" width="4" height="25" fill="#8B4513" />
        <rect x="160" y="126" width="4" height="25" fill="#8B4513" />
        {/* 书包 */}
        <rect x="128" y="100" width="22" height="22" rx="5" fill="#6C5CE7" />
        <rect x="132" y="95" width="14" height="8" rx="3" fill="#A29BFE" />
        {/* 窗户 */}
        <rect x="80" y="55" width="30" height="30" rx="2" fill="#81ECEC" stroke="#B2BEC3" strokeWidth="1" />
        <line x1="95" y1="55" x2="95" y2="85" stroke="#B2BEC3" strokeWidth="0.5" />
        <line x1="80" y1="70" x2="110" y2="70" stroke="#B2BEC3" strokeWidth="0.5" />
        {/* 袜子 */}
        <ellipse cx="50" cy="165" rx="8" ry="4" fill="#FF6B6B" />
        <ellipse cx="70" cy="165" rx="8" ry="4" fill="#74B9FF" />
      </svg>
    ),

    // Unit 10 (下4): 农场
    farm: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 天空 */}
        <rect x="0" y="0" width="200" height="80" fill="#81ECEC" opacity="0.3" />
        {/* 太阳 */}
        <circle cx="170" cy="35" r="20" fill="#FDCB6E" />
        {/* 谷仓 */}
        <rect x="60" y="75" width="70" height="55" rx="3" fill="#E17055" />
        <polygon points="55,75 95,45 135,75" fill="#D63031" />
        <rect x="85" y="95" width="20" height="35" rx="3" fill="#FDCB6E" />
        {/* 栅栏 */}
        <rect x="25" y="130" width="3" height="30" fill="#8B4513" />
        <rect x="40" y="130" width="3" height="30" fill="#8B4513" />
        <rect x="55" y="130" width="3" height="30" fill="#8B4513" />
        <rect x="22" y="135" width="39" height="3" fill="#8B4513" />
        <rect x="22" y="150" width="39" height="3" fill="#8B4513" />
        {/* 动物 */}
        <circle cx="140" cy="145" r="12" fill="white" /> {/* 羊 */}
        <circle cx="140" cy="145" r="6" fill="#DFE6E9" />
        <circle cx="145" cy="142" r="2" fill="#2D3436" />
        <circle cx="155" cy="160" r="10" fill="#F8C291" /> {/* 猪 */}
        <ellipse cx="155" cy="164" rx="4" ry="3" fill="#E17055" />
        <circle cx="157" cy="158" r="1.5" fill="#2D3436" />
        {/* 草地 */}
        <rect x="0" y="170" width="200" height="30" rx="10" fill="#55EFC4" opacity="0.5" />
      </svg>
    ),

    // Unit 11 (下5): 动物
    animals: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 狮子 */}
        <circle cx="70" cy="80" r="20" fill="#F8C291" />
        <circle cx="70" cy="80" r="14" fill="#FDCB6E" />
        <circle cx="64" cy="76" r="3" fill="#2D3436" />
        <circle cx="76" cy="76" r="3" fill="#2D3436" />
        <ellipse cx="70" cy="85" rx="4" ry="3" fill="#E17055" />
        <path d="M70 86 Q70 92 70 86" stroke="#2D3436" strokeWidth="1.5" />
        {/* 大象 */}
        <circle cx="140" cy="85" r="22" fill="#B2BEC3" />
        <circle cx="133" cy="81" r="3" fill="#2D3436" />
        <circle cx="147" cy="81" r="3" fill="#2D3436" />
        <ellipse cx="140" cy="90" rx="12" ry="3" fill="#636E72" />
        <rect x="125" y="90" width="30" height="4" rx="2" fill="#636E72" />
        {/* 猴子 */}
        <circle cx="105" cy="125" r="14" fill="#E17055" />
        <circle cx="105" cy="125" r="10" fill="#F8C291" />
        <circle cx="100" cy="122" r="2.5" fill="#2D3436" />
        <circle cx="110" cy="122" r="2.5" fill="#2D3436" />
        <ellipse cx="105" cy="129" rx="3" ry="2" fill="#D63031" />
        <motion.g animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: '119px 125px' }}>
          <path d="M119 120 Q135 110 130 125" stroke="#E17055" strokeWidth="2" fill="none" />
        </motion.g>
        {/* 小鸟 */}
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ellipse cx="45" cy="45" rx="8" ry="6" fill="#74B9FF" />
          <polygon points="52,45 60,42 60,48" fill="#FDCB6E" />
          <circle cx="42" cy="43" r="1.5" fill="#2D3436" />
        </motion.g>
        {/* 草 */}
        <rect x="0" y="160" width="200" height="40" rx="15" fill="#55EFC4" opacity="0.4" />
      </svg>
    ),

    // Unit 12 (下6): 玩耍
    play: (
      <svg viewBox="0 0 200 200" width={s} height={s}>
        {/* 球 */}
        <motion.circle cx="100" cy="110" r="28" fill="#FF6B6B" animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }} />
        <path d="M80 95 Q100 85 120 95" stroke="white" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M85 105 Q100 95 115 105" stroke="white" strokeWidth="2.5" fill="none" opacity="0.6" />
        {/* 跳跃的小孩 */}
        <g transform="translate(50, 120)">
          <motion.g animate={{ y: [-20, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}>
            <circle cx="0" cy="0" r="12" fill="#FFEAA7" />
            <circle cx="-4" cy="-3" r="2" fill="#2D3436" />
            <circle cx="4" cy="-3" r="2" fill="#2D3436" />
            <path d="M-3 3 Q0 7 3 3" stroke="#2D3436" strokeWidth="1.5" fill="none" />
            <rect x="-8" y="13" width="16" height="20" rx="6" fill="#6C5CE7" />
          </motion.g>
        </g>
        {/* 跳舞的小孩 */}
        <g transform="translate(150, 120)">
          <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.6 }}>
            <circle cx="0" cy="0" r="12" fill="#FFEAA7" />
            <circle cx="-4" cy="-3" r="2" fill="#2D3436" />
            <circle cx="4" cy="-3" r="2" fill="#2D3436" />
            <path d="M-3 3 Q0 7 3 3" stroke="#2D3436" strokeWidth="1.5" fill="none" />
            <rect x="-8" y="13" width="16" height="20" rx="6" fill="#FF6B6B" />
          </motion.g>
        </g>
        {/* 音符 */}
        <motion.text x="30" y="50" fontSize="16" animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>🎵</motion.text>
        <motion.text x="160" y="60" fontSize="14" animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.2 }}>🎶</motion.text>
        {/* 星星 */}
        <text x="120" y="35" fontSize="14">⭐</text>
        <text x="75" y="30" fontSize="12">✨</text>
      </svg>
    ),
  };

  return (
    <motion.div
      className="unit-illustration"
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {illustrations[type] || illustrations.greetings}
    </motion.div>
  );
};

export default UnitIllustration;
