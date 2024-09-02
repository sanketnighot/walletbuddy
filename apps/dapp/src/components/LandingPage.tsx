import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { RoadmapSection } from './RoadmapSection';
import { ContactSection } from './ContactSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background text-text">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RoadmapSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

const Header: React.FC = () => (
  <header className="bg-background-light bg-opacity-80 backdrop-filter backdrop-blur-lg py-4 fixed w-full z-10">
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex justify-between items-center px-4"
    >
      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wallet Buddy</div>
      <nav>
        {['features', 'roadmap', 'contact'].map((item) => (
          <a key={item} href={`#${item}`} className="mx-2 hover:text-primary transition-colors duration-300 capitalize">
            {item}
          </a>
        ))}
      </nav>
    </motion.div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-background-light py-4 text-center">
    <p>&copy; {new Date().getFullYear()} Wallet Buddy. All rights reserved.</p>
  </footer>
);

export default LandingPage;