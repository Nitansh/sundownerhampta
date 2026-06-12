import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_ITEMS } from '../data';
import type { GalleryItem } from '../data';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const filters = [
    { value: 'all', label: 'All Photos' },
    { value: 'rooms', label: 'Rooms' },
    { value: 'views', label: 'Mountain Views' },
    { value: 'trekking', label: 'Trekking' },
    { value: 'activities', label: 'Activities' },
    { value: 'farm', label: 'Farm Life' },
    { value: 'bonfire', label: 'Bonfires & Stars' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = GALLERY_ITEMS.findIndex(g => g.id === item.id);
    setSelectedPhoto(item);
    setLightboxIndex(idx);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
    setLightboxIndex(-1);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (lightboxIndex + 1) % GALLERY_ITEMS.length;
    setLightboxIndex(nextIdx);
    setSelectedPhoto(GALLERY_ITEMS[nextIdx]);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setLightboxIndex(prevIdx);
    setSelectedPhoto(GALLERY_ITEMS[prevIdx]);
  };

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Visual Memories</span>
          <h2>Moments at Sundowner Hampta</h2>
        </div>

        {/* Filter Navigation */}
        <div className="gallery-filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Masonry Layout */}
        <motion.div layout className="gallery-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="gallery-item"
                onClick={() => handleOpenLightbox(item)}
              >
                <img src={item.image} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay-mask">
                  <div className="gallery-overlay-icon">
                    <ZoomIn size={24} />
                  </div>
                  <h4 className="gallery-overlay-title">{item.title}</h4>
                  <span className="gallery-overlay-cat">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="lightbox-backdrop" onClick={handleCloseLightbox}>
            <button className="lightbox-close" onClick={handleCloseLightbox} aria-label="Close Lightbox">
              <X size={28} />
            </button>

            {GALLERY_ITEMS.length > 1 && (
              <>
                <button className="lightbox-nav prev" onClick={handlePrevPhoto} aria-label="Previous photo">
                  <ChevronLeft size={32} />
                </button>
                <button className="lightbox-nav next" onClick={handleNextPhoto} aria-label="Next photo">
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <img src={selectedPhoto.image} alt={selectedPhoto.title} className="lightbox-img" />
              <div className="lightbox-footer">
                <h3>{selectedPhoto.title}</h3>
                <p>Category: {selectedPhoto.category.toUpperCase()}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-section {
          background-color: var(--beige-dark);
        }

        .gallery-filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background-color: transparent;
          border: 1px solid var(--forest-light);
          color: var(--forest-green);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.6rem 1.4rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .filter-btn:hover,
        .filter-btn.active {
          background-color: var(--forest-green);
          color: var(--snow-white);
          border-color: var(--forest-green);
          box-shadow: var(--shadow-soft);
        }

        .gallery-grid {
          column-count: 3;
          column-gap: 1.5rem;
          width: 100%;
        }

        @media (max-width: 992px) {
          .gallery-grid {
            column-count: 2;
          }
        }

        @media (max-width: 576px) {
          .gallery-grid {
            column-count: 1;
          }
        }

        .gallery-item {
          break-inside: avoid;
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 1.5rem;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
          background-color: var(--beige-dark);
          transition: var(--transition-smooth);
        }

        .gallery-img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .gallery-overlay-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(20, 42, 29, 0.85) 0%, rgba(20, 42, 29, 0.2) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: var(--transition-smooth);
        }

        .gallery-item:hover .gallery-overlay-mask {
          opacity: 1;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.05);
        }

        .gallery-overlay-icon {
          align-self: center;
          margin-bottom: auto;
          margin-top: 30%;
          color: var(--luxury-gold);
          background: rgba(255, 255, 255, 0.15);
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          transform: translateY(10px);
          transition: var(--transition-smooth);
        }

        .gallery-item:hover .gallery-overlay-icon {
          transform: translateY(0);
        }

        .gallery-overlay-title {
          font-size: 1.15rem;
          color: var(--snow-white);
          margin-bottom: 0.25rem;
        }

        .gallery-overlay-cat {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--luxury-gold);
        }

        /* Lightbox overlay styles */
        .lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(10, 20, 14, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1200;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
        }

        .lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: var(--snow-white);
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .lightbox-close:hover {
          background-color: var(--sunset-orange);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: var(--snow-white);
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .lightbox-nav:hover {
          background-color: var(--luxury-gold);
          color: var(--forest-green);
        }

        .lightbox-nav.prev { left: 2rem; }
        .lightbox-nav.next { right: 2rem; }

        @media (max-width: 768px) {
          .lightbox-nav {
            width: 44px;
            height: 44px;
          }
          .lightbox-nav.prev { left: 0.5rem; }
          .lightbox-nav.next { right: 0.5rem; }
        }

        .lightbox-content {
          max-width: 900px;
          max-height: 75vh;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-premium);
          background-color: var(--charcoal);
          position: relative;
        }

        .lightbox-img {
          display: block;
          width: 100%;
          max-height: 65vh;
          object-fit: contain;
        }

        .lightbox-footer {
          background-color: rgba(20, 42, 29, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
          color: var(--snow-white);
        }

        .lightbox-footer h3 {
          color: var(--luxury-gold);
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .lightbox-footer p {
          font-size: 0.8rem;
          color: var(--beige-dark);
        }
      `}</style>
    </section>
  );
};
