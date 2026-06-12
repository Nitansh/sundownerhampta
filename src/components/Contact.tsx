import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 4000);
  };

  const mapIframeUrl = "https://www.openstreetmap.org/export/embed.html?bbox=77.24%2C32.21%2C77.29%2C32.24&layer=mapnik&marker=32.2285%2C77.2662";

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">Location & Inquiries</span>
          <h2>Get In Touch With Us</h2>
        </div>

        <div className="contact-grid">
          {/* Details & Map Column */}
          <div className="contact-info-col">
            <div className="contact-detail-cards">
              <div className="info-card glass-panel">
                <div className="info-icon"><MapPin size={22} /></div>
                <div className="info-body">
                  <h4>Our Location</h4>
                  <p>Hampta Valley, Sethan Ridge, near Hampta Pass, Himachal Pradesh 175143, India</p>
                  <a 
                    href="https://maps.google.com/?q=Hampta+Valley+Himachal+Pradesh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="directions-link"
                  >
                    Get Directions on Google Maps &rarr;
                  </a>
                </div>
              </div>

              <div className="info-card glass-panel">
                <div className="info-icon"><Phone size={22} /></div>
                <div className="info-body">
                  <h4>Reservations & Support</h4>
                  <p>Phone: +91 98765 43210</p>
                  <p>WhatsApp: +91 98765 43210 (Available 9 AM - 9 PM)</p>
                  <div className="quick-chat-btns">
                    <a href="tel:+919876543210" className="btn btn-secondary contact-action-btn">Call Now</a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-primary contact-action-btn">WhatsApp Chat</a>
                  </div>
                </div>
              </div>

              <div className="info-card glass-panel">
                <div className="info-icon"><Mail size={22} /></div>
                <div className="info-body">
                  <h4>Email Inquiries</h4>
                  <p>stay@sundownerhampta.com</p>
                  <p>For corporate retreats or long stays: booking@sundownerhampta.com</p>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="map-container-wrapper glass-panel">
              <iframe
                title="Sundowner Hampta Location Map"
                src={mapIframeUrl}
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: 'var(--radius-sm)' }}
                allowFullScreen
              />
              <div className="map-footer-label">
                <span>Coordinates: 32.2285° N, 77.2662° E &bull; Hampta Valley Sanctuary</span>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="contact-form-col glass-panel">
            <h3>Send An Inquiry Message</h3>
            <p className="form-intro">Have questions about weather, road conditions, trekking routes, or customized meals? Shoot us a message directly.</p>

            <form onSubmit={handleSubmitContact} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Your Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-msg">Your Message</label>
                <textarea
                  id="contact-msg"
                  rows={5}
                  placeholder="Write your questions or special requirements here..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full send-message-btn">
                <Send size={16} />
                Send Inquiry Message
              </button>

              <AnimatePresence>
                {formSuccess && (
                  <motion.div 
                    className="toast-success-notification"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check size={18} className="toast-icon" />
                    <div>
                      <h5>Message Sent Successfully!</h5>
                      <p>Thank you. Our valley staff will reply to you via email within 4 hours.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          background-color: var(--bg-dark);
          border-bottom: 1px solid var(--border-gold);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-top: 2rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .contact-info-col {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-detail-cards {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-card {
          display: flex;
          gap: 1.25rem;
          padding: 2rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold);
          align-items: flex-start;
          background: var(--bg-card);
        }

        .info-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-deep);
          color: var(--accent-gold);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-soft);
        }

        .info-body h4 {
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
          color: var(--accent-gold-bright);
        }

        .info-body p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .directions-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--sunset-orange);
          text-decoration: underline;
          font-family: var(--font-serif);
        }

        .directions-link:hover {
          color: var(--sunset-dark);
        }

        .quick-chat-btns {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .contact-action-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        /* Map Styles */
        .map-container-wrapper {
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold);
          overflow: hidden;
          padding: 0.5rem;
          background: var(--bg-card);
        }

        .map-footer-label {
          padding: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          border-top: 1px solid var(--border-gold);
          margin-top: 0.5rem;
        }

        /* Form Side */
        .contact-form-col {
          border-radius: var(--radius-sm);
          padding: 3rem;
          border: 1px solid var(--border-gold);
          background-color: var(--bg-card);
        }

        @media (max-width: 576px) {
          .contact-form-col {
            padding: 1.5rem;
          }
        }

        .contact-form-col h3 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: var(--accent-gold-bright);
        }

        .form-intro {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .contact-form {
          position: relative;
        }

        .send-message-btn {
          padding: 1rem;
          font-size: 0.95rem;
        }

        .toast-success-notification {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background-color: rgba(197, 168, 128, 0.08);
          color: var(--text-main);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          margin-top: 1.5rem;
          box-shadow: var(--shadow-medium);
          border-left: 4px solid var(--accent-gold);
          border-top: 1px solid var(--border-gold);
          border-right: 1px solid var(--border-gold);
          border-bottom: 1px solid var(--border-gold);
        }

        .toast-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .toast-success-notification h5 {
          color: var(--accent-gold-bright);
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 0.95rem;
          margin-bottom: 0.15rem;
        }

        .toast-success-notification p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0;
          line-height: 1.35;
        }
      `}</style>
    </section>
  );
};
