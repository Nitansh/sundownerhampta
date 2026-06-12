import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'dining', label: 'Dining' },
    { id: 'attractions', label: 'Attractions' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active link calculation based on scroll positions
      const scrollPosition = window.scrollY + 100;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const offsetPosition = target.offsetTop - 80; // offset header
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <>
      <header className={`navbar-header ${isScrolled ? 'scrolled shadow-md' : ''}`}>
        <div className="navbar-container container">
          <a href="#home" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
            <span className="logo-main">Sundowner</span>
            <span className="logo-sub">Hampta</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="navbar-cta">
            <a 
              href="#booking" 
              onClick={(e) => handleNavClick(e, 'booking')} 
              className="btn btn-gold btn-book-now"
            >
              <span>Book Your Stay</span>
              <ArrowUpRight size={16} />
            </a>
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-links">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`mobile-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="#booking" 
                onClick={(e) => handleNavClick(e, 'booking')}
                className="btn btn-gold w-full mt-4"
              >
                Book Your Stay
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS Styles specific to Navbar layout (embedded/defined in index.css as well, or loaded natively) */}
      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--header-height);
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: var(--transition-smooth);
          background: rgba(250, 248, 245, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(20, 42, 29, 0.05);
        }
        .navbar-header.scrolled {
          background: rgba(20, 42, 29, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          height: 70px;
        }
        .navbar-header.scrolled .logo-main {
          color: var(--snow-white);
        }
        .navbar-header.scrolled .logo-sub {
          color: var(--luxury-gold);
        }
        .navbar-header.scrolled .nav-link {
          color: var(--beige-dark);
        }
        .navbar-header.scrolled .nav-link.active,
        .navbar-header.scrolled .nav-link:hover {
          color: var(--luxury-gold);
        }
        .navbar-header.scrolled .mobile-menu-toggle {
          color: var(--snow-white);
        }
        
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .logo {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        
        .logo-main {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--forest-green);
          transition: var(--transition-smooth);
        }
        
        .logo-sub {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--luxury-gold-dark);
          transition: var(--transition-smooth);
        }
        
        .desktop-nav {
          display: flex;
          gap: 2rem;
        }
        
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
        }
        
        .nav-link {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--forest-green);
          position: relative;
          padding: 0.5rem 0;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: currentColor;
          transition: var(--transition-smooth);
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .navbar-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .btn-book-now {
          padding: 0.6rem 1.4rem;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
        }
        
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--forest-green);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: block;
          }
          .btn-book-now {
            display: none;
          }
        }
        
        .mobile-nav-panel {
          position: fixed;
          top: var(--header-height);
          left: 0;
          width: 100%;
          background: var(--forest-green);
          z-index: 999;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border-bottom: 2px solid var(--luxury-gold);
        }
        
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .mobile-link {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--beige-dark);
          padding-bottom: 0.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .mobile-link.active {
          color: var(--luxury-gold);
          border-bottom-color: var(--luxury-gold);
        }
      `}</style>
    </>
  );
};
