import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';

const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const WalletPlayground: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('signMessage');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [username, setUsername] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    setQrCodeData(generateRandomString(10));
  }, []);

  const handleConnect = () => {
    if (username.trim()) {
      setIsConnected(true);
      setActiveTab('signMessage');
    } else {
      alert('Please enter a username');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setActiveTab('signMessage');
    setMessage('');
    setAmount('');
    setRecipient('');
    setUsername('');
  };

  const handleSignMessage = () => {
    console.log('Signing message:', message);
    // Implement actual message signing logic here
  };

  const handleSendSol = () => {
    console.log('Sending SOL:', amount, 'to', recipient);
    // Implement actual SOL sending logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
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
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-300"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </button>
            </motion.div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                className={`px-6 py-3 rounded-full text-lg ${
                  activeTab === 'signMessage' ? 'bg-primary text-white' : 'bg-background text-text-dark'
                }`}
                onClick={() => setActiveTab('signMessage')}
              >
                Sign Message
              </button>
              <button
                className={`px-6 py-3 rounded-full text-lg ${
                  activeTab === 'sendSol' ? 'bg-primary text-white' : 'bg-background text-text-dark'
                }`}
                onClick={() => setActiveTab('sendSol')}
              >
                Send SOL
              </button>
            </div>

            {activeTab === 'signMessage' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <textarea
                  className="w-full bg-background text-text p-4 rounded-lg resize-none h-40"
                  placeholder="Enter your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
                  onClick={handleSignMessage}
                >
                  Sign Message
                </button>
              </motion.div>
            )}

            {activeTab === 'sendSol' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  className="w-full bg-background text-text p-4 rounded-lg"
                  placeholder="Amount of SOL"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full bg-background text-text p-4 rounded-lg"
                  placeholder="Recipient address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
                  onClick={handleSendSol}
                >
                  Send SOL
                </button>
              </motion.div>
            )}
          </>
        ) : (
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
              <QRCode value={qrCodeData} size={192} />
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