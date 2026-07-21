import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTotalWordCount } from '../data/words';
import { loadProgress } from '../utils/storage';
import ProgressBar from '../components/ProgressBar';
import type { ProgressData } from '../utils/storage';

const Dashboard: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const totalWords = getTotalWordCount();
  const completedWords = progress.completedWords.length;
  const reviewWords = progress.reviewWords.length;
  const reviewSentences = (progress as any).reviewSentences?.length || 0;
  const totalReview = reviewWords + reviewSentences;
  const accuracy = progress.totalAttempts > 0
    ? Math.round((progress.correctCount / progress.totalAttempts) * 100)
    : 0;

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
      </motion.div>

      <div className="dashboard-stats">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon">📚</div>
          <div className="stat-value">{completedWords}</div>
          <div className="stat-label">已掌握单词</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">正确率</div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon">📝</div>
          <div className="stat-value">{totalReview}</div>
          <div className="stat-label">待复习</div>
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
    </div>
  );
};

export default Dashboard;
