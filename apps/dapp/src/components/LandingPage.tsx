import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen text-text">
      <header className="bg-background-light py-4 fixed w-full z-10">
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto flex justify-between items-center px-4"
        >
          <div className="text-2xl font-bold text-primary">Wallet Buddy</div>
          <nav>
            <a href="#features" className="mx-2 hover:text-primary transition-colors duration-300">Features</a>
            <a href="#roadmap" className="mx-2 hover:text-primary transition-colors duration-300">Roadmap</a>
            <a href="#contact" className="mx-2 hover:text-primary transition-colors duration-300">Contact</a>
          </nav>
        </motion.div>
      </header>

      <main className="container mx-auto px-4">
        <HeroSection />
        <FeaturesSection />
        <RoadmapSection />
        <ContactSection />
      </main>

      <footer className="bg-background-light py-4 text-center">
        <p>&copy; 2023 Wallet Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

const HeroSection: React.FC = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="text-center mb-16 py-20"
  >
    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome to Wallet Buddy</h1>
    <p className="text-xl text-text-dark mb-8">Your comprehensive solution for secure and efficient crypto asset management</p>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
    >
      Get Started
    </motion.button>
  </motion.section>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: "Multi-Chain Support", description: "Manage assets across various blockchain networks", icon: "🌐" },
        { title: "Secure Key Management", description: "Advanced encryption for your private keys", icon: "🔐" },
        { title: "DApp Integration", description: "Seamless interaction with decentralized applications", icon: "🔗" },
        { title: "Transaction History", description: "Comprehensive record of all your crypto transactions", icon: "📊" },
        { title: "Portfolio Tracking", description: "Real-time updates on your crypto holdings", icon: "📈" },
        { title: "NFT Support", description: "View and manage your NFT collections", icon: "🖼️" },
      ].map((feature, index) => (
        <FeatureCard key={index} {...feature} index={index} />
      ))}
    </div>
  </section>
);

const FeatureCard: React.FC<{ title: string; description: string; icon: string; index: number }> = ({ title, description, icon, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-background-light p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-text-dark">{description}</p>
  </motion.div>
);

const RoadmapSection: React.FC = () => (
  <section id="roadmap" className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Development Roadmap</h2>
    <div className="space-y-4">
      {[
        { phase: "Phase 1", description: "Core wallet functionality and major cryptocurrency support" },
        { phase: "Phase 2", description: "Enhanced security features and multi-chain integration" },
        { phase: "Phase 3", description: "DApp browser and NFT management capabilities" },
        { phase: "Phase 4", description: "Advanced portfolio analytics and cross-chain operations" },
        { phase: "Phase 5", description: "Mobile app launch and hardware wallet compatibility" },
      ].map((item, index) => (
        <RoadmapItem key={index} {...item} index={index} />
      ))}
    </div>
  </section>
);

const RoadmapItem: React.FC<{ phase: string; description: string; index: number }> = ({ phase, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex items-center"
  >
    <div className="bg-secondary text-white font-bold rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md">
      {phase}
    </div>
    <p className="text-text-dark bg-background-light p-4 rounded-lg shadow-md flex-1">{description}</p>
  </motion.div>
);

const ContactSection: React.FC = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    id="contact" 
    className="text-center mb-16"
  >
    <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
    <p className="text-xl text-text-dark mb-4">Have questions or want to contribute? We'd love to hear from you!</p>
    <a href="mailto:contact@walletbuddy.com" className="text-primary hover:text-primary-light transition-colors duration-300">
      contact@walletbuddy.com
    </a>
  </motion.section>
);

export default LandingPage;