import { useState } from 'react';
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
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
              transition={{ duration: 0.4 }}
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
          background-color: var(--beige-dark);
        }

        .experiences-tabs {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid var(--beige-border);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          position: relative;
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--forest-green);
        }

        .tab-btn.active {
          color: var(--forest-green);
          font-weight: 600;
        }

        .tab-underline {
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--luxury-gold);
        }

        .experience-panel-wrapper {
          position: relative;
        }

        .experience-panel {
          border-radius: var(--radius-lg);
          padding: 3rem;
          border: 1px solid var(--beige-border);
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
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-medium);
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
          transform: scale(1.03);
        }

        .panel-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: var(--luxury-gold);
          color: var(--forest-green);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .panel-details {
          display: flex;
          flex-direction: column;
        }

        .panel-title {
          font-size: 2.2rem;
          margin-bottom: 1.25rem;
          color: var(--forest-green);
        }

        .panel-desc {
          font-size: 1.1rem;
          line-height: 1.6;
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
          padding: 1rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: var(--transition-smooth);
        }

        .checklist-card:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: var(--luxury-gold);
          transform: translateX(5px);
        }

        .check-icon {
          color: var(--luxury-gold-dark);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .check-title {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--forest-green);
        }

        .check-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
};
