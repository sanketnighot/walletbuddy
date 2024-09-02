import React from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { RoadmapSection } from './RoadmapSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';

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

export default LandingPage;