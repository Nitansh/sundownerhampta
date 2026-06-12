import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPERIENCES } from '../data';
import type { Experience } from '../data';
import { Mountain, Flame, Shrub, Trees, CheckCircle } from 'lucide-react';

export const Experiences: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trekking' | 'adventure' | 'farm' | 'nature'>('trekking');

  const tabIcons = {
    trekking: <Mountain size={18} />,
    adventure: <Flame size={18} />,
    farm: <Shrub size={18} />,
    nature: <Trees size={18} />
  };

  const activeExperience = EXPERIENCES.find((exp) => exp.category === activeTab) as Experience;

  return (
    <section id="experiences" className="experiences-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Curated Himalayan Journeys</span>
          <h2>Experiences & Activities</h2>
        </div>

        {/* Tab Selection */}
        <div className="experiences-tabs">
          {(['trekking', 'adventure', 'farm', 'nature'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
            >
              <span className="tab-icon">{tabIcons[cat]}</span>
              <span className="tab-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              {activeTab === cat && (
                <motion.div 
                  layoutId="activeTabUnderline" 
                  className="tab-underline"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="experience-panel-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="experience-panel glass-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="panel-grid">
                {/* Visual Block */}
                <div className="panel-image-container">
                  <img src={activeExperience.image} alt={activeExperience.title} className="panel-image" />
                  <div className="panel-badge">
                    <span>Explore Now</span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="panel-details">
                  <h3 className="panel-title">{activeExperience.title}</h3>
                  <p className="panel-desc">{activeExperience.description}</p>

                  <div className="panel-checklist">
                    {activeExperience.items.map((item, idx) => {
                      const [title, desc] = item.split(': ');
                      return (
                        <div key={idx} className="checklist-card">
                          <CheckCircle className="check-icon" size={20} />
                          <div>
                            <span className="check-title">{title}</span>
                            {desc && <span className="check-desc"> – {desc}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .experiences-section {
          background-color: var(--bg-dark);
          border-bottom: 1px solid var(--border-gold);
        }

        .experiences-tabs {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          position: relative;
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-family: var(--font-serif);
          font-size: 1rem;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--accent-gold-bright);
        }

        .tab-btn.active {
          color: var(--accent-gold);
          font-weight: 500;
        }

        .tab-underline {
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--accent-gold);
        }

        .experience-panel-wrapper {
          position: relative;
        }

        .experience-panel {
          border-radius: var(--radius-sm);
          padding: 3rem;
          border: 1px solid var(--border-gold);
          background: var(--bg-card);
        }

        @media (max-width: 768px) {
          .experience-panel {
            padding: 1.5rem;
          }
        }

        .panel-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3.5rem;
          align-items: center;
        }

        @media (max-width: 992px) {
          .panel-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .panel-image-container {
          position: relative;
          height: 420px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-medium);
          border: 1px solid var(--border-gold);
        }

        @media (max-width: 480px) {
          .panel-image-container {
            height: 260px;
          }
        }

        .panel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .experience-panel:hover .panel-image {
          transform: scale(1.02);
        }

        .panel-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: var(--accent-gold);
          color: var(--bg-deep);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-serif);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .panel-details {
          display: flex;
          flex-direction: column;
        }

        .panel-title {
          font-size: 2rem;
          margin-bottom: 1.25rem;
          color: var(--accent-gold-bright);
        }

        .panel-desc {
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          color: var(--text-muted);
        }

        .panel-checklist {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .checklist-card {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.01);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold);
          transition: var(--transition-smooth);
        }

        .checklist-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--accent-gold);
          transform: translateX(4px);
        }

        .check-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .check-title {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          color: var(--accent-gold-bright);
        }

        .check-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
};
