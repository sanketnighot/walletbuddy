import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => (
	<header className="bg-background-light bg-opacity-80 backdrop-filter backdrop-blur-lg py-4 fixed w-full z-10">
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex justify-between items-center px-4"
    >
      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wallet Buddy</div>
      <nav>
        {[{'title': 'Features', 'href': '#features'}, {'title': 'Roadmap', 'href': '#roadmap'}, {'title': 'Contact', 'href': '#contact'}].map((item) => (
          <a key={item.title} href={item.href} className="mx-2 hover:text-primary transition-colors duration-300 capitalize">
            {item.title}
          </a>
        ))}
      </nav>
    </motion.div>
  </header>
);