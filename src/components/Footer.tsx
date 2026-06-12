import { useState } from 'react';
import { Mail, Send, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsEmail('');
    }, 4500);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offset = target.offsetTop - 80;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer-area">
      <div className="container footer-grid">
        {/* Brand Block */}
        <div className="footer-brand-col">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="footer-logo">
            <span className="logo-main">Sundowner</span>
            <span className="logo-sub">Hampta</span>
          </a>
          <p className="brand-text-desc">
            Experience the mountains, live the adventure. Discover boutique luxury wood cabins, organic apple orchards, and guided expeditions at 9,200 feet in Hampta Valley.
          </p>
          <div className="social-links-row">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Follow us on Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Follow us on Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Subscribe to our YouTube channel">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links-col">
          <h3>Sitemap</h3>
          <ul className="footer-links-list">
            <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About Story</a></li>
            <li><a href="#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms & Suites</a></li>
            <li><a href="#experiences" onClick={(e) => handleNavClick(e, 'experiences')}>Experiences</a></li>
            <li><a href="#dining" onClick={(e) => handleNavClick(e, 'dining')}>Organic Dining</a></li>
            <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Photo Gallery</a></li>
            <li><a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact Details</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-newsletter-col">
          <h3>Join The Newsletter</h3>
          <p className="newsletter-desc">Subscribe to receive seasonal weather reports, booking discounts, and Hampta Pass trekking schedules.</p>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-input-group">
              <Mail className="news-mail-icon" size={16} />
              <input
                type="email"
                placeholder="Enter email address"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                <Send size={14} />
              </button>
            </div>
            {subscribed && (
              <p className="newsletter-success-msg">
                ✓ Successfully subscribed! Check your inbox for local travel discounts.
              </p>
            )}
          </form>

          <div className="footer-credits-badges">
            <span>GST Active &bull; Licensed Homestay by HPTDC</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar container">
        <div className="bottom-bar-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Sundowner Hampta. All rights reserved. Developed with luxury nature ethics in Himachal Pradesh, India.
          </p>
          <button onClick={handleScrollToTop} className="scroll-top-btn" aria-label="Scroll to top of page">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-area {
          background-color: var(--forest-green);
          color: var(--snow-white);
          padding: 6rem 0 2rem;
          border-top: 3px solid var(--luxury-gold);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr;
          gap: 4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 4rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1.2fr 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .footer-logo {
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .footer-logo .logo-main {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.8rem;
          color: var(--snow-white);
        }

        .footer-logo .logo-sub {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--luxury-gold);
        }

        .brand-text-desc {
          font-size: 0.95rem;
          color: var(--beige-dark);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .social-links-row {
          display: flex;
          gap: 0.75rem;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--beige-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          border: 1px solid transparent;
        }

        .social-icon:hover {
          background-color: var(--luxury-gold);
          color: var(--forest-green);
          border-color: var(--luxury-gold);
          transform: translateY(-2px);
        }

        .footer-links-col h3,
        .footer-newsletter-col h3 {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--luxury-gold);
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .footer-links-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem 1.5rem;
        }

        @media (max-width: 480px) {
          .footer-links-list {
            grid-template-columns: 1fr;
          }
        }

        .footer-links-list a {
          font-size: 0.95rem;
          color: var(--beige-dark);
          transition: var(--transition-fast);
        }

        .footer-links-list a:hover {
          color: var(--luxury-gold);
          padding-left: 4px;
        }

        .newsletter-desc {
          font-size: 0.95rem;
          color: var(--beige-dark);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .newsletter-form {
          margin-bottom: 1.5rem;
        }

        .newsletter-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .newsletter-input-group input {
          background-color: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--snow-white);
          padding-left: 2.75rem;
          padding-right: 3.5rem;
          border-radius: var(--radius-sm);
        }

        .newsletter-input-group input:focus {
          border-color: var(--luxury-gold);
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.2);
        }

        .news-mail-icon {
          position: absolute;
          left: 1rem;
          color: var(--beige-dark);
        }

        .newsletter-submit-btn {
          position: absolute;
          right: 0.5rem;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: none;
          background-color: var(--luxury-gold);
          color: var(--forest-green);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .newsletter-submit-btn:hover {
          background-color: var(--snow-white);
        }

        .newsletter-success-msg {
          font-size: 0.8rem;
          color: var(--luxury-gold);
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .footer-credits-badges {
          font-size: 0.8rem;
          color: var(--beige-dark);
          opacity: 0.8;
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
          margin-top: 2rem;
        }

        .bottom-bar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .bottom-bar-inner {
            flex-direction: column;
            text-align: center;
          }
        }

        .copyright-text {
          font-size: 0.85rem;
          color: var(--beige-dark);
          opacity: 0.8;
        }

        .scroll-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--beige-dark);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .scroll-top-btn:hover {
          border-color: var(--luxury-gold);
          color: var(--luxury-gold);
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};
