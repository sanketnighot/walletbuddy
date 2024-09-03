import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletConnection } from './WalletConnection';
import { useWalletSession } from '../hooks/useWalletSession';

export const WalletPlayground: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signMessage');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [username, setUsername] = useState('');

  const {
    isConnected,
    qrCodeData,
    isLoading,
    error,
    handleConnect,
    handleDisconnect,
  } = useWalletSession(isOpen);

  const handleSignMessage = () => {
    console.log('Signing message:', message);
    
  };

  const handleSendSol = () => {
    console.log('Sending SOL:', amount, 'to', recipient);
    // Implement actual SOL sending logic here
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-light rounded-lg p-8 w-full max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Wallet Playground
        </h2>

        {isConnected ? (
          <ConnectedWallet
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleDisconnect={() => {
              handleDisconnect();
              onClose();
            }}
            handleSignMessage={handleSignMessage}
            handleSendSol={handleSendSol}
            message={message}
            setMessage={setMessage}
            amount={amount}
            setAmount={setAmount}
            recipient={recipient}
            setRecipient={setRecipient}
          />
        ) : (
          <WalletConnection
            isLoading={isLoading}
            error={error}
            qrCodeData={qrCodeData}
            username={username}
            setUsername={setUsername}
            handleConnect={() => handleConnect(username)}
          />
        )}

        <button
          className="w-full bg-background text-text-dark hover:bg-background-light font-bold py-3 px-4 rounded-full transition-colors duration-300 mt-6"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};