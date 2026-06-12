import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOMS } from '../data';
import type { Room } from '../data';
import { Maximize2, Users, ShieldAlert, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface AccommodationProps {
  onSelectRoom: (roomId: string) => void;
}

export const Accommodation: React.FC<AccommodationProps> = ({ onSelectRoom }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleOpenModal = (room: Room) => {
    setSelectedRoom(room);
    setActiveImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleNextImage = () => {
    if (selectedRoom) {
      setActiveImageIndex((prev) => (prev + 1) % selectedRoom.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedRoom) {
      setActiveImageIndex((prev) => (prev - 1 + selectedRoom.images.length) % selectedRoom.images.length);
    }
  };

  const handleBookNow = (roomId: string) => {
    onSelectRoom(roomId);
    handleCloseModal();
    const target = document.getElementById('booking');
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="rooms" className="rooms-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Bespoke Accommodations</span>
          <h2>Rooms & Cabins</h2>
        </div>

        <div className="rooms-grid">
          {ROOMS.map((room) => (
            <motion.div 
              key={room.id}
              className="luxury-card room-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="room-image-wrapper">
                <img src={room.image} alt={room.name} className="room-card-image" />
                <div className="room-price-badge">
                  <span className="price-val">₹{room.price.toLocaleString('en-IN')}</span>
                  <span className="price-unit">/ night</span>
                </div>
              </div>

              <div className="room-card-content">
                <h3 className="room-card-title">{room.name}</h3>
                <p className="room-card-desc">{room.description}</p>

                <div className="room-meta">
                  <div className="meta-item">
                    <Maximize2 size={16} />
                    <span>{room.size}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{room.occupancy}</span>
                  </div>
                </div>

                <div className="room-amenities-pills">
                  {room.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="amenity-pill">{amenity}</span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="amenity-pill extra">+{room.amenities.length - 4} More</span>
                  )}
                </div>

                <div className="room-card-actions">
                  <button 
                    onClick={() => handleOpenModal(room)} 
                    className="btn btn-secondary w-full"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleBookNow(room.id)} 
                    className="btn btn-primary w-full"
                  >
                    Book This Room
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Modal Overlay */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div 
              className="modal-content glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close details">
                <X size={24} />
              </button>

              <div className="modal-inner-grid">
                {/* Images Carousel Column */}
                <div className="modal-gallery-col">
                  <div className="modal-main-image-container">
                    <img 
                      src={selectedRoom.images[activeImageIndex]} 
                      alt={`${selectedRoom.name} gallery ${activeImageIndex}`} 
                      className="modal-main-image"
                    />
                    
                    {selectedRoom.images.length > 1 && (
                      <>
                        <button className="nav-carousel-btn prev" onClick={handlePrevImage} aria-label="Previous image">
                          <ChevronLeft size={20} />
                        </button>
                        <button className="nav-carousel-btn next" onClick={handleNextImage} aria-label="Next image">
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="modal-thumbnails">
                    {selectedRoom.images.map((img, idx) => (
                      <button 
                        key={idx}
                        className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img src={img} alt="thumbnail" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Column */}
                <div className="modal-details-col">
                  <div className="modal-header">
                    <h2>{selectedRoom.name}</h2>
                    <div className="modal-pricing">
                      <span className="price">₹{selectedRoom.price.toLocaleString('en-IN')}</span>
                      <span className="unit"> / night</span>
                    </div>
                  </div>

                  <div className="modal-meta-row">
                    <span className="meta-pill"><Maximize2 size={14} /> Size: {selectedRoom.size}</span>
                    <span className="meta-pill"><Users size={14} /> Occupancy: {selectedRoom.occupancy}</span>
                  </div>

                  <p className="modal-description">{selectedRoom.description}</p>

                  <div className="modal-amenities-section">
                    <h3>Included Amenities</h3>
                    <div className="amenities-checklist-grid">
                      {selectedRoom.amenities.map((amenity, idx) => (
                        <div key={idx} className="checklist-item">
                          <div className="check-bullet"><Check size={14} /></div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-booking-notice">
                    <ShieldAlert size={18} className="notice-icon" />
                    <p>Free cancellation up to 7 days prior to check-in. Instant confirmation.</p>
                  </div>

                  <button 
                    onClick={() => handleBookNow(selectedRoom.id)} 
                    className="btn btn-gold w-full modal-booking-btn pulse-gold-effect"
                  >
                    Reserve This Room Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .rooms-section {
          background-color: var(--warm-beige);
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }

        @media (max-width: 450px) {
          .rooms-grid {
            grid-template-columns: 1fr;
          }
        }

        .room-card {
          height: 100%;
        }

        .room-image-wrapper {
          position: relative;
          height: 260px;
          overflow: hidden;
        }

        .room-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .room-card:hover .room-card-image {
          transform: scale(1.05);
        }

        .room-price-badge {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          background: rgba(20, 42, 29, 0.95);
          color: var(--snow-white);
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          border: 1px solid var(--luxury-gold);
          backdrop-filter: blur(4px);
        }

        .room-price-badge .price-val {
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--luxury-gold);
        }

        .room-price-badge .price-unit {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .room-card-content {
          padding: 2rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .room-card-title {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }

        .room-card-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .room-meta {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem 0;
          border-top: 1px solid var(--beige-dark);
          border-bottom: 1px solid var(--beige-dark);
          margin-bottom: 1.25rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--forest-green);
          font-weight: 500;
        }

        .room-amenities-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .amenity-pill {
          font-size: 0.75rem;
          background: var(--beige-dark);
          color: var(--forest-green);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        .amenity-pill.extra {
          background: var(--forest-light);
          color: var(--snow-white);
        }

        .room-card-actions {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 0.75rem;
          margin-top: auto;
        }

        .room-card-actions .btn {
          padding: 0.8rem 1rem;
          font-size: 0.85rem;
        }

        /* Modal Details */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(20, 42, 29, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          position: relative;
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          border-radius: var(--radius-md);
          overflow-y: auto;
          padding: 3rem;
          background: var(--warm-beige);
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem;
            max-height: 95vh;
          }
        }

        .modal-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: var(--beige-dark);
          color: var(--forest-green);
          border: none;
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

        .modal-close-btn:hover {
          background: var(--forest-green);
          color: var(--snow-white);
        }

        .modal-inner-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 900px) {
          .modal-inner-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .modal-main-image-container {
          position: relative;
          height: 350px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--charcoal);
        }

        @media (max-width: 480px) {
          .modal-main-image-container {
            height: 220px;
          }
        }

        .modal-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nav-carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(250, 248, 245, 0.9);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--forest-green);
          box-shadow: var(--shadow-soft);
          transition: var(--transition-fast);
        }

        .nav-carousel-btn:hover {
          background: var(--forest-green);
          color: var(--snow-white);
        }

        .nav-carousel-btn.prev { left: 1rem; }
        .nav-carousel-btn.next { right: 1rem; }

        .modal-thumbnails {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .thumb-btn {
          width: 80px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition-fast);
          flex-shrink: 0;
        }

        .thumb-btn.active {
          border-color: var(--luxury-gold);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Details side */
        .modal-details-col {
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .modal-header {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        .modal-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0;
        }

        .modal-pricing {
          text-align: right;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .modal-pricing {
            text-align: left;
          }
        }

        .modal-pricing .price {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.5rem;
          color: var(--luxury-gold-dark);
        }

        .modal-pricing .unit {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .modal-meta-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-meta-row .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          background: var(--beige-dark);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .modal-description {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .modal-amenities-section {
          margin-bottom: 2rem;
        }

        .modal-amenities-section h3 {
          font-size: 1.1rem;
          font-family: var(--font-sans);
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amenities-checklist-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        @media (max-width: 480px) {
          .amenities-checklist-grid {
            grid-template-columns: 1fr;
          }
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .check-bullet {
          width: 22px;
          height: 22px;
          background: rgba(20, 42, 29, 0.1);
          color: var(--forest-green);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-booking-notice {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: rgba(224, 122, 95, 0.08);
          border-left: 3px solid var(--sunset-orange);
          padding: 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
        }

        .notice-icon {
          color: var(--sunset-orange);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .modal-booking-notice p {
          font-size: 0.85rem;
          color: var(--text-main);
          font-weight: 400;
        }

        .modal-booking-btn {
          padding: 1.1rem;
        }
      `}</style>
    </section>
  );
};
