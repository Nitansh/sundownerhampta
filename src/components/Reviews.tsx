import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REVIEWS } from '../data';
import { Star, Quote, ArrowLeft, ArrowRight, Play, X } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }).map((_, idx) => (
      <Star key={idx} size={16} fill="var(--luxury-gold)" color="var(--luxury-gold)" />
    ));
  };

  const openVideo = (url: string) => {
    setActiveVideoUrl(url);
  };

  const closeVideo = () => {
    setActiveVideoUrl(null);
  };

  return (
    <section id="reviews" className="reviews-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Verified Guest Feedbacks</span>
          <h2>Google Reviews & Testimonials</h2>
        </div>

        <div className="reviews-layout-grid">
          {/* Left Block: Google Reviews Badge and Reviews Carousel */}
          <div className="carousel-block glass-panel">
            <div className="google-badge-header">
              <div className="google-logo-wrapper">
                <svg className="google-svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="badge-text">Google Reviews</span>
              </div>
              <div className="stars-meta">
                <span className="rating-num">4.9</span>
                <div className="google-stars">
                  {renderStars(5)}
                </div>
                <span className="reviews-count">(142 verified reviews)</span>
              </div>
            </div>

            <div className="review-carousel-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="carousel-slide"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Quote className="quote-icon" size={48} />
                  
                  <div className="rating-row">
                    {renderStars(REVIEWS[currentIndex].rating)}
                  </div>
                  
                  <p className="review-comment">"{REVIEWS[currentIndex].comment}"</p>
                  
                  <div className="reviewer-info">
                    <img 
                      src={REVIEWS[currentIndex].avatar} 
                      alt={REVIEWS[currentIndex].name} 
                      className="reviewer-avatar" 
                    />
                    <div>
                      <h4 className="reviewer-name">{REVIEWS[currentIndex].name}</h4>
                      <span className="review-details">
                        {REVIEWS[currentIndex].tripType} &bull; {REVIEWS[currentIndex].date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="carousel-controls">
              <button className="carousel-control-btn" onClick={handlePrev} aria-label="Previous review">
                <ArrowLeft size={18} />
              </button>
              <button className="carousel-control-btn" onClick={handleNext} aria-label="Next review">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Block: Video Testimonials */}
          <div className="video-testimonials-block">
            <h3>Video Testimonials</h3>
            <p className="block-intro">Hear directly from our guests about their experiences climbing peaks and gathering around the bonfire.</p>

            <div className="videos-list-layout">
              <div className="video-card" onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ')}>
                <div className="video-thumbnail-wrapper">
                  <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80" alt="Video thumbnail 1" />
                  <div className="play-button-overlay">
                    <Play size={20} fill="var(--snow-white)" />
                  </div>
                </div>
                <div className="video-card-body">
                  <h4>Conquering Hampta Pass</h4>
                  <p>Aditya shares his guided trek summit memories.</p>
                </div>
              </div>

              <div className="video-card" onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ')}>
                <div className="video-thumbnail-wrapper">
                  <img src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80" alt="Video thumbnail 2" />
                  <div className="play-button-overlay">
                    <Play size={20} fill="var(--snow-white)" />
                  </div>
                </div>
                <div className="video-card-body">
                  <h4>Starry Evenings & Farm Life</h4>
                  <p>The Jenkins family explains why kids loved the apple orchard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="video-modal-backdrop" onClick={closeVideo}>
            <div className="video-modal-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="video-modal-close" onClick={closeVideo} aria-label="Close video player">
                <X size={24} />
              </button>
              <div className="video-responsive-iframe">
                <iframe
                  title="Guest Video Testimonial"
                  src={activeVideoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .reviews-section {
          background-color: var(--warm-beige);
        }

        .reviews-layout-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          margin-top: 2rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .reviews-layout-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .carousel-block {
          padding: 3rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--beige-border);
          position: relative;
        }

        @media (max-width: 576px) {
          .carousel-block {
            padding: 1.5rem;
          }
        }

        .google-badge-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--beige-border);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .google-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .google-svg {
          width: 24px;
          height: 24px;
        }

        .badge-text {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--forest-green);
        }

        .stars-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .rating-num {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--forest-green);
        }

        .google-stars {
          display: flex;
          gap: 0.15rem;
        }

        .reviews-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .carousel-slide {
          min-height: 220px;
          display: flex;
          flex-direction: column;
        }

        .quote-icon {
          color: rgba(197, 168, 128, 0.2);
          margin-bottom: 1rem;
        }

        .rating-row {
          display: flex;
          gap: 0.2rem;
          margin-bottom: 1rem;
        }

        .review-comment {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-main);
          font-style: italic;
          margin-bottom: 2rem;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
        }

        .reviewer-avatar {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid var(--luxury-gold);
        }

        .reviewer-name {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--forest-green);
        }

        .review-details {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .carousel-controls {
          display: flex;
          gap: 0.75rem;
          position: absolute;
          bottom: 3rem;
          right: 3rem;
        }

        @media (max-width: 576px) {
          .carousel-controls {
            position: static;
            margin-top: 1.5rem;
            justify-content: flex-end;
          }
        }

        .carousel-control-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          border: 1px solid var(--forest-light);
          background-color: transparent;
          color: var(--forest-green);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .carousel-control-btn:hover {
          background-color: var(--forest-green);
          color: var(--snow-white);
          border-color: var(--forest-green);
        }

        /* Video Testimonials side */
        .video-testimonials-block h3 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
        }

        .block-intro {
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .videos-list-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .video-card {
          display: flex;
          gap: 1.25rem;
          background-color: var(--snow-white);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--beige-dark);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-medium);
          border-color: var(--luxury-gold);
        }

        .video-thumbnail-wrapper {
          position: relative;
          width: 140px;
          height: 100px;
          flex-shrink: 0;
          background-color: var(--charcoal);
        }

        .video-thumbnail-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-button-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background-color: rgba(224, 122, 95, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-bounce);
        }

        .video-card:hover .play-button-overlay {
          transform: translate(-50%, -50%) scale(1.15);
          background-color: var(--sunset-dark);
        }

        .video-card-body {
          padding: 1rem 1rem 1rem 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .video-card-body h4 {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
        }

        .video-card-body p {
          font-size: 0.85rem;
          line-height: 1.4;
          color: var(--text-muted);
        }

        /* Video Modal */
        .video-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 20, 14, 0.9);
          z-index: 1300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .video-modal-wrapper {
          position: relative;
          width: 100%;
          max-width: 800px;
          background: #000;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-premium);
        }

        .video-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: var(--snow-white);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          z-index: 10;
        }

        .video-modal-close:hover {
          background: var(--sunset-orange);
        }

        .video-responsive-iframe {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
        }

        .video-responsive-iframe iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
};
