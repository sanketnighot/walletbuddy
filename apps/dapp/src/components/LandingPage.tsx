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
        <p>&copy; 2024 Wallet Buddy. All rights reserved.</p>
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
    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome to Wallet Buddy V2</h1>
    <p className="text-xl text-text-dark mb-8">Your all-in-one Telegram super bot for Web3 activities</p>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
    >
      Try the Bot
    </motion.button>
  </motion.section>
);

const FeaturesSection: React.FC = () => (
  <section id="features" className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: "Wallet Management", description: "Create/Import wallets and manage seed phrases securely", icon: "🔐", implemented: true },
        { title: "SOL Transactions", description: "Transfer and receive SOL with ease", icon: "💸", implemented: true },
        { title: "SPL Token Management", description: "Create, transfer, and receive SPL tokens", icon: "🪙", implemented: true },
        { title: "Whale Alerts", description: "Get notified about large transactions", icon: "🐳", implemented: true },
        { title: "Transaction Alerts", description: "Monitor specific user addresses", icon: "🚨", implemented: true },
        { title: "Airdrop for Devnet", description: "Receive SOL on Devnet for testing", icon: "🚰", implemented: true },
        { title: "DApp Connection", description: "Connect your wallet to decentralized applications", icon: "🔗", implemented: true },
        { title: "Mini Games", description: "Enjoy Web3 mini-games within the bot", icon: "🎮", implemented: true },
        { title: "NFT Library", description: "View and manage your NFT collections", icon: "🖼️", implemented: true },
        { title: "DApp Transaction Signing", description: "Sign transactions sent by connected DApps", icon: "✍️", implemented: false },
        { title: "Web3 News", description: "Stay updated with the latest in Web3", icon: "📰", implemented: false },
        { title: "Learn Web3", description: "Educational resources to understand Web3 concepts", icon: "📚", implemented: false },
      ].map((feature, index) => (
        <FeatureCard key={index} {...feature} index={index} />
      ))}
    </div>
  </section>
);

// Update the FeatureCard component to include the implemented status
const FeatureCard: React.FC<{ title: string; description: string; icon: string; index: number; implemented: boolean }> = ({ title, description, icon, index, implemented }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`bg-background-light p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ${implemented ? 'border-green-500 border-2' : 'border-yellow-500 border-2'}`}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-text-dark">{description}</p>
    <p className={`mt-2 ${implemented ? 'text-green-500' : 'text-yellow-500'}`}>
      {implemented ? 'Implemented' : 'Coming Soon'}
    </p>
  </motion.div>
);

const RoadmapSection: React.FC = () => (
  <section id="roadmap" className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Development Roadmap</h2>
    <div className="space-y-8">
      {[
        {
          phase: "V1",
          description: "Initial release with core functionality",
          status: "Completed",
          details: [
            "Create Solana Account (KeyPair)",
            "Transfer SOL",
            "Airdrop for Devnet",
            "Create SPL Token",
            "Transfer SPL Token",
            "Get Token that user holds",
            "Whale transaction alerts",
            "User account transaction alerts",
            "Mini Games"
          ]
        },
        {
          phase: "V2",
          description: "Enhanced security, improved UX, and expanded features",
          status: "In Progress",
          details: [
            "Create/Import Wallets (Seed Phrase)",
            "SOL Transaction (Transfer/Receive)",
            "Manage SPL Tokens (Create/Transfer/Receive)",
            "Whale Alerts",
            "Transaction Alerts (User Addresses)",
            "Airdrop (Devnet)",
            "Connect dapps to wallet",
            "Mini Games",
            "NFT Library",
            "Sign transactions sent by dapps (Coming Soon)",
            "Web3 News (Coming Soon)",
            "Learn Web3 (Coming Soon)"
          ]
        },
        {
          phase: "Future",
          description: "Continuous improvements and new feature additions",
          status: "Planned",
          details: [
            "Multi-chain support",
            "Advanced DeFi integrations",
            "AI-powered insights",
            "Enhanced security features",
            "Mobile app development"
          ]
        },
      ].map((item, index) => (
        <RoadmapItem key={index} {...item} index={index} />
      ))}
    </div>
  </section>
);

const RoadmapItem: React.FC<{ phase: string; description: string; status: string; details: string[]; index: number }> = ({ phase, description, status, details, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-background-light p-6 rounded-lg shadow-md"
  >
    <div className="flex items-center mb-4">
      <div className={`text-white font-bold rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-md ${
        status === "Completed" ? "bg-green-500" :
        status === "In Progress" ? "bg-yellow-500" :
        "bg-blue-500"
      }`}>
        {phase}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{description}</h3>
        <p className={`font-semibold ${
          status === "Completed" ? "text-green-500" :
          status === "In Progress" ? "text-yellow-500" :
          "text-blue-500"
        }`}>{status}</p>
      </div>
    </div>
    <ul className="list-disc list-inside space-y-2 text-text-dark">
      {details.map((detail, idx) => (
        <li key={idx} className={detail.includes("Coming Soon") ? "text-yellow-500" : ""}>{detail}</li>
      ))}
    </ul>
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
    <p className="text-xl text-text-dark mb-4">Have questions or want to contribute? Check out our GitHub or contact us!</p>
    <a href="https://github.com/sanketnighot/walletbuddy" className="text-primary hover:text-primary-light transition-colors duration-300 block mb-2">
      GitHub: Wallet Buddy V2
    </a>
    <a href="mailto:contact@walletbuddy.com" className="text-primary hover:text-primary-light transition-colors duration-300">
      contact@walletbuddy.com
    </a>
  </motion.section>
);

export default LandingPage;