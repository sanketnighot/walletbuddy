import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletConnection } from './WalletConnection';
import { useWalletSession } from '../hooks/useWalletSession';
import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import axios from 'axios';

window.Buffer = Buffer;

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
    publicKey,
    handleConnect,
    handleDisconnect,
  } = useWalletSession(isOpen);

  const handleSignMessage = () => {
    console.log('Signing message:', message);
  };

  const handleSendSol = async () => {
    if (!publicKey) {
      console.error('Public key not available');
      return;
    }

    try {
      const senderPublicKey = new web3.PublicKey(publicKey);
      const recipientPublicKey = new web3.PublicKey(recipient);

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: web3.LAMPORTS_PER_SOL * parseFloat(amount),
        })
      );
      // Get the latest blockhash
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPublicKey;

      // Serialize the transaction
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      });

      // Convert the serialized transaction to base64
      const base64Transaction = serializedTransaction.toString('base64');
			const session = await localStorage.getItem("walletSessionData")
			if (!session) {
				console.error("No session data found")
				return
			}
			const sessionData = JSON.parse(session)

      console.log('Base64 encoded transaction:', base64Transaction);
			const response = await axios.post(`${import.meta.env.VITE_WEBHOOK_URL}/api/v1/transaction/sign`, {
				transaction: base64Transaction,
				sessionId: sessionData.id
			})
			const data = await response.data.json();
			console.log('Signature:', data.signature);

    } catch (err) {
      console.error('Error creating transaction:', err);
    }
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
          <>
            <div className="mb-4 text-center">
              <p className="text-lg text-text-dark">Connected Public Key:</p>
              <p className="text-sm text-primary break-all cursor-pointer" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }} onClick={() => navigator.clipboard.writeText(publicKey ?? '')}>
                {publicKey ?? 'No public key available'}
              </p>
            </div>
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
          </>
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