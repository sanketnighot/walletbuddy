import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeDisplay } from './QRCodeDisplay';

interface WalletConnectionProps {
  isLoading: boolean;
  error: string | null;
  qrCodeData: string;
  username: string;
  setUsername: (username: string) => void;
  handleConnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  isLoading,
  error,
  qrCodeData,
  username,
  setUsername,
  handleConnect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <p className="text-center text-text-dark">
        To connect your wallet, scan the QR code below with your Telegram app or enter your Telegram username.
      </p>
      
      <div className="bg-white p-4 rounded-lg shadow-inner flex items-center justify-center">
        <QRCodeDisplay isLoading={isLoading} error={error} qrCodeData={qrCodeData} />
      </div>

      <div className="flex items-center">
        <div className="flex-grow h-px bg-text-dark"></div>
        <span className="px-4 text-text-dark">OR</span>
        <div className="flex-grow h-px bg-text-dark"></div>
      </div>

      <input
        type="text"
        className="w-full bg-background text-text p-4 rounded-lg"
        placeholder="Enter your Telegram username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-6 rounded-full shadow-lg transition-colors duration-300 text-xl"
        onClick={handleConnect}
      >
        Connect Wallet
      </button>
    </motion.div>
  );
};