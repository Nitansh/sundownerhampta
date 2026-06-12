import React from 'react';
import { motion } from 'framer-motion';
import { ATTRACTIONS } from '../data';
import { MapPin, Clock, CalendarDays, Compass } from 'lucide-react';

export const LocalAttractions: React.FC = () => {
  return (
    <section id="attractions" className="attractions-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Discover Hampta Valley & Beyond</span>
          <h2>Nearby Local Attractions</h2>
        </div>

        <div className="attractions-grid">
          {ATTRACTIONS.map((item, index) => (
            <motion.div
              key={index}
              className="luxury-card attraction-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="attraction-img-container">
                <img src={item.image} alt={item.name} className="attraction-image" />
                <div className="attraction-distance-badge">
                  <MapPin size={14} />
                  <span>{item.distance}</span>
                </div>
              </div>

              <div className="attraction-body">
                <h3 className="attraction-name">{item.name}</h3>
                <p className="attraction-desc">{item.description}</p>

                <div className="attraction-specs">
                  <div className="spec-item">
                    <Clock size={16} className="spec-icon" />
                    <div>
                      <span className="spec-label">Travel Time</span>
                      <span className="spec-value">{item.time}</span>
                    </div>
                  </div>

                  <div className="spec-item">
                    <CalendarDays size={16} className="spec-icon" />
                    <div>
                      <span className="spec-label">Best Season</span>
                      <span className="spec-value">{item.season}</span>
                    </div>
                  </div>
                </div>

                <div className="attraction-activities">
                  <span className="activities-title"><Compass size={14} /> Activities Available:</span>
                  <div className="activities-list">
                    {item.activities.map((act, idx) => (
                      <span key={idx} className="activity-badge">{act}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .attractions-section {
          background-color: var(--warm-beige);
        }

        .attractions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .attraction-card {
          height: 100%;
        }

        .attraction-img-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .attraction-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .attraction-card:hover .attraction-image {
          transform: scale(1.06);
        }

        .attraction-distance-badge {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          background: rgba(20, 42, 29, 0.9);
          color: var(--luxury-gold);
          border: 1px solid var(--luxury-gold);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          backdrop-filter: blur(4px);
        }

        .attraction-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .attraction-name {
          font-size: 1.35rem;
          margin-bottom: 0.75rem;
          color: var(--forest-green);
        }

        .attraction-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .attraction-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          border-top: 1px solid var(--beige-dark);
          border-bottom: 1px solid var(--beige-dark);
          padding: 1rem 0;
          margin-bottom: 1.5rem;
        }

        .spec-item {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .spec-icon {
          color: var(--luxury-gold-dark);
          margin-top: 0.15rem;
        }

        .spec-label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 500;
        }

        .spec-value {
          display: block;
          font-size: 0.85rem;
          color: var(--forest-green);
          font-weight: 600;
          line-height: 1.2;
        }

        .attraction-activities {
          margin-top: auto;
        }

        .activities-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--forest-green);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .activities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .activity-badge {
          font-size: 0.75rem;
          background-color: var(--beige-dark);
          color: var(--text-main);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </section>
  );
};
