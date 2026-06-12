import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Compass } from 'lucide-react';

const STORY_TIMELINE = [
  {
    year: '2018',
    title: 'The Vision',
    desc: 'Founders fell in love with a hidden ridge in Hampta Valley, deciding to build an eco-friendly stone sanctuary that respects local architectural heritage.'
  },
  {
    year: '2020',
    title: 'Handcrafting the Stays',
    desc: 'Using locally sourced cedar wood, river stones, and traditional Himachali masonry, the homestay cottages were built by village artisans.'
  },
  {
    year: '2022',
    title: 'Cultivating the Orchard',
    desc: 'Introduced organic plum, apricot, and apple orchards surrounding the site, creating a farm-to-table system for visiting guests.'
  },
  {
    year: '2025',
    title: 'Boutique Adventure Base',
    desc: 'Ranked as the premium boutique stay in Hampta, offering certified mountain expeditions, remote workspaces, and stargazing sessions.'
  }
];

export const About: React.FC = () => {
  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <div className="section-title">
          <span className="subtitle">The Story of Sundowner Hampta</span>
          <h2>A Sanctuary in the Clouds</h2>
        </div>

        <div className="about-grid">
          {/* Text Content Block */}
          <motion.div 
            className="about-text-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <h3>Where Luxury Meets Mountain Wilderness</h3>
            <p>
              Perched at a majestic altitude of 9,200 feet in the heart of Hampta Valley, Sundowner Hampta is more than just a place to sleep—it is an authentic portal into Himalayan life. 
            </p>
            <p>
              Surrounded by whispering cedar trees, organic orchards, and cold glacial streams, our luxury boutique homestay is designed for travelers who seek both the comfort of fine living and the raw thrill of mountain adventures. 
            </p>
            <p>
              Our mission is simple: to offer deep relaxation through sustainable Himachali hospitality while acting as a launchpad for alpine trekking, stargazing, and organic farm experiences.
            </p>

            <div className="features-icon-grid">
              <div className="feature-icon-item">
                <div className="icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Hampta Valley, India</h4>
                  <p>Located on a private ridge away from tourist crowds.</p>
                </div>
              </div>

              <div className="feature-icon-item">
                <div className="icon-wrapper">
                  <Leaf size={20} />
                </div>
                <div>
                  <h4>100% Eco-Sustainable</h4>
                  <p>Built with natural stone and wood, organic farm-to-table dining.</p>
                </div>
              </div>

              <div className="feature-icon-item">
                <div className="icon-wrapper">
                  <Compass size={20} />
                </div>
                <div>
                  <h4>Trekking Base Camp</h4>
                  <p>Certified guides for Hampta Pass and Sethan dome summits.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image & Timeline Grid */}
          <motion.div 
            className="about-timeline-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3>Our Journey</h3>
            <div className="timeline-trail">
              {STORY_TIMELINE.map((item, index) => (
                <div key={index} className="timeline-node">
                  <div className="node-badge">{item.year}</div>
                  <div className="node-details">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Story Images Gallery */}
        <div className="about-visuals-grid">
          <motion.div 
            className="about-image-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80" alt="Mountain ridges" />
            <div className="image-caption">Glacial Ridges</div>
          </motion.div>

          <motion.div 
            className="about-image-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" alt="Luxury Homestay Exterior" />
            <div className="image-caption">Homestay Exterior</div>
          </motion.div>

          <motion.div 
            className="about-image-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80" alt="Sunset and Bonfire" />
            <div className="image-caption">Evening Solitude</div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .about-section {
          background-color: var(--bg-dark);
          color: var(--text-main);
          border-bottom: 1px solid var(--border-gold);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }

        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .about-text-content h3,
        .about-timeline-content h3 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-gold);
          padding-bottom: 0.75rem;
          color: var(--accent-gold);
        }

        .about-text-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--text-muted);
        }

        .features-icon-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .feature-icon-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .icon-wrapper {
          background-color: var(--bg-card);
          color: var(--accent-gold);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--border-gold);
          box-shadow: var(--shadow-soft);
        }

        .feature-icon-item h4 {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: var(--text-main);
        }

        .feature-icon-item p {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        /* Timeline Trail */
        .timeline-trail {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
          padding-left: 1.5rem;
          border-left: 1px solid var(--border-gold);
        }

        .timeline-node {
          position: relative;
        }

        .node-badge {
          position: absolute;
          left: calc(-1.5rem - 18px);
          top: 0;
          background: var(--accent-gold);
          color: var(--bg-deep);
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-gold);
        }

        .node-details h4 {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: var(--accent-gold-bright);
        }

        .node-details p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* About Visuals Grid */
        .about-visuals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .about-visuals-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .about-image-card {
          position: relative;
          height: 300px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-medium);
          cursor: pointer;
          border: 1px solid var(--border-gold);
        }

        .about-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .about-image-card:hover img {
          transform: scale(1.04);
        }

        .image-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, rgba(8, 11, 9, 0.95), transparent);
          color: var(--text-main);
          padding: 1.5rem 1rem 1rem;
          font-family: var(--font-serif);
          font-size: 1.1rem;
          text-align: center;
          letter-spacing: 0.05em;
          border-top: 1px solid rgba(197, 168, 128, 0.1);
        }
      `}</style>
    </section>
  );
};
