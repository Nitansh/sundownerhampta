import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CalendarDays, ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80', // mountain sunrise
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1920&q=80', // wooden chalet
  'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1920&q=80', // trekking trail
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80', // bonfire night sky
];

export const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="hero-slide-image"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentImageIndex]})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="hero-overlay" />
      </div>

      <div className="hero-content container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hero-badge"
        >
          <span>Luxury Boutique Mountain Homestay</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hero-title"
        >
          Escape to <br />
          <span className="gold-text">Sundowner Hampta</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="hero-subtitle"
        >
          Experience breathtaking mountain views, thrilling adventures, local farm life, and authentic Himalayan hospitality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="hero-actions"
        >
          <button 
            onClick={() => handleScrollTo('booking')} 
            className="btn btn-gold pulse-gold-effect"
          >
            <CalendarDays size={18} />
            Book Your Stay
          </button>
          <button 
            onClick={() => handleScrollTo('experiences')} 
            className="btn btn-secondary hero-btn-secondary"
          >
            <Compass size={18} />
            Explore Experiences
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="scroll-indicator"
        onClick={() => handleScrollTo('about')}
      >
        <span>Discover More</span>
        <ChevronDown size={20} className="arrow-down" />
      </motion.div>

      <style>{`
        .hero-section {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          overflow: hidden;
          background-color: var(--bg-deep);
        }

        .hero-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-slide-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          will-change: transform, opacity;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(8, 11, 9, 0.45) 0%,
            rgba(8, 11, 9, 0.65) 50%,
            rgba(8, 11, 9, 0.95) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: var(--header-height);
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(197, 168, 128, 0.08);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
          backdrop-filter: blur(4px);
        }

        .hero-badge span {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent-gold);
        }

        .hero-title {
          font-family: var(--font-serif);
          font-weight: 500;
          color: var(--text-main);
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }

        .gold-text {
          color: var(--accent-gold);
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: var(--text-muted);
          max-width: 700px;
          margin-bottom: 3rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.6);
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            gap: 1rem;
          }
        }

        .hero-btn-secondary {
          border-color: var(--border-gold-bright);
          color: var(--text-main);
        }

        .hero-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.03);
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          opacity: 0.8;
          transition: var(--transition-fast);
        }

        .scroll-indicator:hover {
          opacity: 1;
          transform: translate(-50%, -3px);
        }

        .scroll-indicator span {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .arrow-down {
          color: var(--accent-gold);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
};
