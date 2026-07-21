import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { units, words } from '../data/words';
import { loadProgress } from '../utils/storage';
import UnitIllustration from '../components/UnitIllustration';

const UnitSelect: React.FC = () => {
  const [semester, setSemester] = useState<'上' | '下'>('上');
  const progress = loadProgress();

  const filteredUnits = units.filter(u => u.semester === semester);

  const getUnitProgress = (unitId: number) => {
    const unitWords = words.filter(w => w.unit === unitId);
    const completed = unitWords.filter(w => progress.completedWords.includes(w.id)).length;
    return { completed, total: unitWords.length };
  };

  return (
    <div className="page unit-select">
      <h2>选择学习单元</h2>

      <div className="semester-tabs">
        <button
          className={`semester-tab ${semester === '上' ? 'active' : ''}`}
          onClick={() => setSemester('上')}
        >
          📘 三年级上册
        </button>
        <button
          className={`semester-tab ${semester === '下' ? 'active' : ''}`}
          onClick={() => setSemester('下')}
        >
          📗 三年级下册
        </button>
      </div>

      <div className="unit-grid">
        {filteredUnits.map((unit, index) => {
          const { completed, total } = getUnitProgress(unit.id);
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/unit/${unit.id}/intro`} className="unit-card">
                <div className="unit-card-illustration">
                  <UnitIllustration type={unit.illustration} size={72} />
                </div>
                <div className="unit-card-content">
                  <div className="unit-card-header">
                    <span className="unit-number">
                      {semester === '上' ? `Unit ${unit.id}` : `Unit ${unit.id - 6}`}
                    </span>
                    <span className={`unit-badge ${percentage === 100 ? 'completed' : percentage > 0 ? 'in-progress' : ''}`}>
                      {percentage === 100 ? '✅ 已完成' : percentage > 0 ? `⏳ ${percentage}%` : '📖 未开始'}
                    </span>
                  </div>
                  <h3 className="unit-name">{unit.name}</h3>
                  <p className="unit-name-cn">{unit.nameCn}</p>
                  <div className="unit-progress-mini">
                    <div className="mini-bar">
                      <div
                        className="mini-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="mini-text">{completed}/{total}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UnitSelect;
