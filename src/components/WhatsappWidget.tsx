import React from 'react';
import { MessageSquareCode } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatsappWidget: React.FC = () => {
  const whatsappUrl = 'https://wa.me/919876543210?text=Hi%20Sundowner%20Hampta!%20I%20would%20like%20to%20inquire%20about%20booking%20a%20stay.';

  return (
    <motion.div 
      className="whatsapp-widget"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <div className="whatsapp-tooltip">Chat with us on WhatsApp</div>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-btn"
        aria-label="Contact us on WhatsApp"
      >
        <MessageSquareCode size={28} />
      </a>
    </motion.div>
  );
};
