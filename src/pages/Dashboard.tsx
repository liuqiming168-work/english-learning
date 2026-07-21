import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTotalWordCount } from '../data/words';
import { loadProgress } from '../utils/storage';
import { isWeChatBrowser } from '../utils/speech';
import ProgressBar from '../components/ProgressBar';
import type { ProgressData } from '../utils/storage';

const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [copied, setCopied] = useState(false);
  const isWeChat = isWeChatBrowser();
  const totalWords = getTotalWordCount();
  const completedWords = progress.completedWords.length;
  const reviewWords = progress.reviewWords.length;
  const reviewSentences = (progress as any).reviewSentences?.length || 0;
  const totalReview = reviewWords + reviewSentences;
  const accuracy = progress.totalAttempts > 0
    ? Math.round((progress.correctCount / progress.totalAttempts) * 100)
    : 0;

  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <div className="page dashboard">
      <motion.div
        className="dashboard-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-emoji">📖</div>
        <h2>欢迎来到英语学习天地！</h2>
        <p>每天坚持跟读，英语越来越棒！</p>
        {isWeChat && (
          <div className="wechat-tts-notice" style={{ marginTop: 12 }}>
            <span>💡 </span>
            微信内发音和跟读功能可能受限。建议点击右上角「在浏览器中打开」获得完整体验。
          </div>
        )}
      </motion.div>

      <div className="dashboard-stats">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{completedWords}</div>
            <div className="stat-label">已掌握单词</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">发音正确率</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-value">{totalReview}</div>
            <div className="stat-label">重点复习词</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="dashboard-progress"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>总体学习进度</h3>
        <ProgressBar current={completedWords} total={totalWords} label="已掌握 / 总单词" />
      </motion.div>

      <div className="dashboard-actions">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/units" className="btn-primary btn-large">
            🚀 开始学习
          </Link>
        </motion.div>
        {totalReview > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/review" className="btn-secondary btn-large">
              📝 重点复习 ({totalReview}个)
            </Link>
          </motion.div>
        )}
      </div>

      <motion.div
        className="share-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="share-label">🔗 分享链接给其他设备</p>
        <div className="share-input-group">
          <input
            className="share-input"
            value={shareUrl}
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            className={`share-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✅ 已复制' : '📋 复制'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
