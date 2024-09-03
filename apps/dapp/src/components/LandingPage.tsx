import React from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { RoadmapSection } from './RoadmapSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-text min-h-screen"
    >
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RoadmapSection />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
};

export default LandingPage;