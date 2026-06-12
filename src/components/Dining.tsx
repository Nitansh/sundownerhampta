import React from 'react';
import { motion } from 'framer-motion';
import { DINING_MENU } from '../data';
import { Utensils, Wheat, Flame, Salad } from 'lucide-react';

export const Dining: React.FC = () => {
  const icons = [
    <Wheat size={24} className="feature-icon-svg" />,
    <Salad size={24} className="feature-icon-svg" />,
    <Flame size={24} className="feature-icon-svg" />,
    <Utensils size={24} className="feature-icon-svg" />
  ];

  return (
    <section id="dining" className="dining-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Himachali Gastronomy</span>
          <h2>Organic Farm-to-Table Dining</h2>
        </div>

        <div className="dining-grid">
          {/* Left Column: Visual Showcase */}
          <motion.div
            className="dining-visuals"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="main-dining-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80" 
                alt="Organic freshly cooked Himachali plate" 
                className="main-dining-image"
              />
              <div className="dining-tag-badge">
                <span>100% Organic Ingredients</span>
              </div>
            </div>

            <div className="dining-thumbnails-grid">
              {DINING_MENU.gallery.map((imgUrl, index) => (
                <div key={index} className="dining-thumb-card">
                  <img src={imgUrl} alt={`dining-gallery-${index}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Culinary Details */}
          <motion.div
            className="dining-details"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="dining-title">A Feast of Mountain Flavors</h3>
            <p className="dining-intro-text">{DINING_MENU.description}</p>

            <div className="dining-features-list">
              {DINING_MENU.features.map((item, index) => (
                <div key={index} className="dining-feature-card glass-panel">
                  <div className="dining-feature-icon">
                    {icons[index % icons.length]}
                  </div>
                  <div className="dining-feature-body">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="dining-cta">
              <p className="dining-note">*All room bookings include complimentary breakfast. Traditional community dinners can be reserved upon check-in.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .dining-section {
          background-color: var(--warm-beige);
        }

        .dining-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 992px) {
          .dining-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .dining-visuals {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main-dining-image-wrapper {
          position: relative;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-medium);
        }

        @media (max-width: 480px) {
          .main-dining-image-wrapper {
            height: 240px;
          }
        }

        .main-dining-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .main-dining-image-wrapper:hover .main-dining-image {
          transform: scale(1.03);
        }

        .dining-tag-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          background: rgba(20, 42, 29, 0.95);
          color: var(--luxury-gold);
          border: 1px solid var(--luxury-gold);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .dining-thumbnails-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .dining-thumb-card {
          height: 110px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }

        .dining-thumb-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-fast);
        }

        .dining-thumb-card img:hover {
          transform: scale(1.08);
        }

        .dining-title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .dining-intro-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .dining-features-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .dining-feature-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--beige-border);
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.5);
          transition: var(--transition-smooth);
        }

        .dining-feature-card:hover {
          background-color: var(--snow-white);
          border-color: var(--luxury-gold);
          transform: translateY(-2px);
          box-shadow: var(--shadow-soft);
        }

        .dining-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background-color: var(--forest-green);
          color: var(--luxury-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
        }

        .dining-feature-body h4 {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--forest-green);
        }

        .dining-feature-body p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .dining-cta {
          margin-top: 2rem;
          border-top: 1px solid var(--beige-dark);
          padding-top: 1.5rem;
        }

        .dining-note {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </section>
  );
};
