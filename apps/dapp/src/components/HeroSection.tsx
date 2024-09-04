import React, { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/walletbuddylogo.png';
import { WalletPlayground } from './WalletPlayground';

export const HeroSection: React.FC = () => {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const openPlayground = () => setIsPlaygroundOpen(true);
  const closePlayground = () => setIsPlaygroundOpen(false);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="flex flex-col w-full justify-center items-center min-h-screen text-center relative overflow-hidden bg-gradient-to-br from-background to-background-light"
    >
      {/* Background animation */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary opacity-10 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl px-4 mt-16 z-10"> {/* Added z-10 to ensure content is above background */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6"
        >
          <img src={logo} alt="Wallet Buddy Logo" className="h-32 w-32 mx-auto" />
        </motion.div>
        <motion.h1 
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Welcome to Wallet Buddy
        </motion.h1>
        <motion.p 
          className="text-2xl text-text-dark mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Your all-in-one Telegram super bot for Web3 activities
        </motion.p>
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
            onClick={openPlayground}
          >
            Try the Bot
          </motion.button>
          <a href="https://t.me/Wallet_Buddy_Bot" target="_blank">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
            >
              Open Bot
            </motion.button>
          </a>
        </motion.div>
      </div>

      {/* Floating features */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-8">
        {['Solana Wallet', 'Telegram Bot', 'Web3 Activities'].map((feature, index) => (
          <motion.div
            key={feature}
            className="bg-background-light bg-opacity-80 rounded-lg p-4 shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-primary">{feature}</h3>
          </motion.div>
        ))}
      </div>

      <WalletPlayground isOpen={isPlaygroundOpen} onClose={closePlayground} />
    </motion.section>
  );
};