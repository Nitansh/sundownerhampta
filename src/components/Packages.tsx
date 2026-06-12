import { motion } from 'framer-motion';
import { PACKAGES } from '../data';
import type { Package } from '../data';
import { Sparkles, CalendarRange, CheckCircle2 } from 'lucide-react';

interface PackagesProps {
  onSelectPackage: (pkg: Package) => void;
}

export const Packages: React.FC<PackagesProps> = ({ onSelectPackage }) => {
  const handleSelectPackage = (pkg: Package) => {
    onSelectPackage(pkg);
    const bookingSec = document.getElementById('booking');
    if (bookingSec) {
      window.scrollTo({
        top: bookingSec.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="packages" className="packages-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">All-Inclusive Mountain Retreats</span>
          <h2>Exclusive Curated Packages</h2>
        </div>

        <div className="packages-grid">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className="luxury-card package-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="package-image-wrapper">
                <img src={pkg.image} alt={pkg.name} className="package-image" />
                <div className="package-type-badge">
                  <Sparkles size={12} />
                  <span>{pkg.type.toUpperCase()}</span>
                </div>
              </div>

              <div className="package-content">
                <div className="package-header">
                  <span className="package-duration">
                    <CalendarRange size={14} /> {pkg.duration}
                  </span>
                  <h3 className="package-title">{pkg.name}</h3>
                  <p className="package-tagline">"{pkg.tagline}"</p>
                </div>

                <p className="package-desc">{pkg.description}</p>

                <div className="package-inclusions">
                  <h4>Package Inclusions:</h4>
                  <ul>
                    {pkg.includes.slice(0, 3).map((inc, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="inc-icon" />
                        <span>{inc}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 3 && (
                      <li className="inc-more">And more customizable experiences...</li>
                    )}
                  </ul>
                </div>

                <div className="package-footer">
                  <div className="package-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-val">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className="btn btn-gold package-book-btn pulse-gold-effect"
                  >
                    Select Package
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .packages-section {
          background-color: var(--bg-dark);
          border-bottom: 1px solid var(--border-gold);
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .package-card {
          background-color: var(--bg-card);
          height: 100%;
        }

        .package-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-bottom: 1px solid var(--border-gold);
        }

        .package-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .package-card:hover .package-image {
          transform: scale(1.03);
        }

        .package-type-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(8, 11, 9, 0.95);
          color: var(--accent-gold);
          border: 1px solid var(--border-gold);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-family: var(--font-serif);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
        }

        .package-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .package-header {
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 1rem;
        }

        .package-duration {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
        }

        .package-title {
          font-size: 1.35rem;
          margin-bottom: 0.25rem;
          color: var(--accent-gold-bright);
        }

        .package-tagline {
          font-size: 0.85rem;
          font-style: italic;
          color: var(--text-muted);
        }

        .package-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .package-inclusions {
          margin-bottom: 2rem;
        }

        .package-inclusions h4 {
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-gold);
          margin-bottom: 0.75rem;
        }

        .package-inclusions ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .package-inclusions li {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .inc-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .inc-more {
          font-size: 0.8rem !important;
          font-style: italic;
          color: var(--text-muted) !important;
          padding-left: 1.5rem;
        }

        .package-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-gold);
          padding-top: 1.25rem;
        }

        .package-price {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-serif);
        }

        .price-val {
          font-family: var(--font-serif);
          font-weight: 500;
          font-size: 1.4rem;
          color: var(--accent-gold-bright);
        }

        .package-book-btn {
          padding: 0.75rem 1.25rem;
          font-size: 0.85rem;
        }
      `}</style>
    </section>
  );
};
