import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundGlows: React.FC = () => {
  return (
    <div className="background-glows-container">
      <motion.div
        className="glow-blob glow-teal"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="glow-blob glow-rose"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -80, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="glow-blob glow-indigo"
        animate={{
          x: [0, 80, -50, 0],
          y: [0, 50, 70, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      <style>{`
        .background-glows-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .glow-blob {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.09;
          will-change: transform;
        }
        .glow-teal {
          background: #2dd4bf;
          top: -200px;
          left: -200px;
        }
        .glow-rose {
          background: #fb7185;
          bottom: -250px;
          right: -100px;
        }
        .glow-indigo {
          background: #6366f1;
          top: 35%;
          left: 45%;
        }
        @media (max-width: 768px) {
          .glow-blob {
            width: 300px;
            height: 300px;
            filter: blur(80px);
            opacity: 0.07;
          }
        }
      `}</style>
    </div>
  );
};
