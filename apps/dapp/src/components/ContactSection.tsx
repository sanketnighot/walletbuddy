import React from 'react';
import { motion, useInView } from 'framer-motion';

export const ContactSection: React.FC = () => {
	const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      id="contact" 
      className="text-center mb-16 py-20 mx-4"
    >
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Join Our Community</h2>
      <p className="text-xl text-text-dark mb-4">Have questions or want to contribute? Check out our GitHub or contact us!</p>
      <a href="https://github.com/sanketnighot/walletbuddy" target="_blank" className="text-primary hover:text-primary-light transition-colors duration-300 block mb-2">
        GitHub: Wallet Buddy
      </a>
      <a href="mailto:sanketnighot25@gmail.com" target="_blank" className="text-primary hover:text-primary-light transition-colors duration-300">
        sanketnighot25@gmail.com
      </a>
    </motion.section>
  );
};