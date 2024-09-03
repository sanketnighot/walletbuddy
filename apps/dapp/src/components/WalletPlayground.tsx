import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletConnection } from './WalletConnection';
import { fetchSessionData, updateSessionWithUsername, checkSessionStatus } from '../utils/api';

export const WalletPlayground: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('signMessage');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [username, setUsername] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedSessionData = localStorage.getItem('walletSessionData');
      if (storedSessionData) {
        const parsedData = JSON.parse(storedSessionData);
        setIsConnected(true);
        setQrCodeData(parsedData.id);
      } else {
        handleFetchSessionData();
      }
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [isOpen]);

  const handleFetchSessionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sessionId = await fetchSessionData();
      setQrCodeData(sessionId);
      startPolling(sessionId);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (sessionId: string) => {
    stopPolling(); // Clear any existing interval
    pollingIntervalRef.current = setInterval(() => {
      checkSessionStatus(sessionId)
        .then((data) => {
          if (data.status === 'ACCEPTED') {
            stopPolling();
            setIsConnected(true);
            localStorage.setItem('walletSessionData', JSON.stringify(data));
          }
					if (data.status === 'REJECTED') {
            stopPolling();
            setIsConnected(false);
            localStorage.removeItem('walletSessionData');
						alert("Wallet Connection rejected")
          }
        })
        .catch((err) => {
          console.error('Error polling session status:', err);
        });
    }, 5000); // Poll every 5 seconds
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleConnect = async () => {
    if (username.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await updateSessionWithUsername(qrCodeData, username.trim());
        // Start polling again after updating username
        startPolling(qrCodeData);
      } catch (err) {
        setError('Failed to connect wallet. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter a username');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setActiveTab('signMessage');
    setMessage('');
    setAmount('');
    setRecipient('');
    setUsername('');
    localStorage.removeItem('walletSessionData');
    onClose(); // Close the popup
  };

  const handleSignMessage = () => {
    console.log('Signing message:', message);
    // Implement actual message signing logic here
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
            handleDisconnect={handleDisconnect}
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
            handleConnect={handleConnect}
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