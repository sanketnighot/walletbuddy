import React from 'react';
import { motion } from 'framer-motion';

export const ContactSection: React.FC = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    id="contact" 
    className="text-center mb-16"
  >
    <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
    <p className="text-xl text-text-dark mb-4">Have questions or want to contribute? Check out our GitHub or contact us!</p>
    <a href="https://github.com/sanketnighot/walletbuddy" className="text-primary hover:text-primary-light transition-colors duration-300 block mb-2">
      GitHub: Wallet Buddy
    </a>
    <a href="mailto:sanketnighot25@gmail.com" className="text-primary hover:text-primary-light transition-colors duration-300">
      sanketnighot25@gmail.com
    </a>
  </motion.section>
);