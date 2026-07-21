import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUnitById, getWordsByUnit } from '../data/words';
import { getSentencesByUnit } from '../data/sentences';
import UnitIllustration from '../components/UnitIllustration';

const UnitIntro: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const unit = getUnitById(Number(unitId));
  const unitWords = getWordsByUnit(Number(unitId));
  const unitSentences = getSentencesByUnit(Number(unitId));

  if (!unit) {
    return (
      <div className="page unit-intro">
        <div className="empty-state">
          <p>单元未找到</p>
          <Link to="/units" className="btn-primary">返回单元列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page unit-intro">
      <Link to="/units" className="btn-back">← 返回单元列表</Link>

      <motion.div
        className="intro-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 趣味插画 */}
        <div className="intro-illustration-wrap">
          <UnitIllustration type={unit.illustration} size={180} />
        </div>

        {/* 中英文双语标题 */}
        <motion.div
          className="intro-titles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="intro-title-en">{unit.name}</h1>
          <h2 className="intro-title-cn">{unit.nameCn}</h2>
        </motion.div>

        {/* 学习内容概览 */}
        <motion.div
          className="intro-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="intro-info-item">
            <span className="intro-info-icon">📝</span>
            <span>{unitWords.length} 个单词</span>
          </div>
          <div className="intro-info-item">
            <span className="intro-info-icon">💬</span>
            <span>{unitSentences.length} 个短句</span>
          </div>
        </motion.div>

        {/* 开始学习按钮 */}
        <motion.div
          className="intro-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            className="btn-primary btn-large intro-start-btn"
            onClick={() => navigate(`/learn/${unit.id}`)}
          >
            🚀 开始学习
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnitIntro;
