import React from 'react';
import { motion } from 'framer-motion';

interface ConnectedWalletProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleDisconnect: () => void;
  handleSignMessage: () => void;
  handleSendSol: () => void;
  message: string;
  setMessage: (message: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  recipient: string;
  setRecipient: (recipient: string) => void;
}

export const ConnectedWallet: React.FC<ConnectedWalletProps> = ({
  activeTab,
  setActiveTab,
  handleDisconnect,
  handleSignMessage,
  handleSendSol,
  message,
  setMessage,
  amount,
  setAmount,
  recipient,
  setRecipient,
}) => {
  return (
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
  );
};