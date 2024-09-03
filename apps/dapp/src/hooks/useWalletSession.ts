import { useState, useEffect, useRef } from 'react';
import { fetchSessionData, updateSessionWithUsername, checkSessionStatus } from '../utils/api';

export const useWalletSession = (isOpen: boolean) => {
  const [isConnected, setIsConnected] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedSessionData = localStorage.getItem('walletSessionData');
      if (storedSessionData) {
        const parsedData = JSON.parse(storedSessionData);
        setIsConnected(true);
        setQrCodeData(parsedData.id);
        setPublicKey(parsedData.user.walletInfo[0].publicKey);
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
    stopPolling();
    pollingIntervalRef.current = setInterval(() => {
      checkSessionStatus(sessionId)
        .then((data) => {
          if (data.status === 'ACCEPTED') {
            stopPolling();
            setIsConnected(true);
            setPublicKey(data.publicKey);
            localStorage.setItem('walletSessionData', JSON.stringify(data));
          }
          if (data.status === 'REJECTED') {
            stopPolling();
            setIsConnected(false);
            setPublicKey(null);
            localStorage.removeItem('walletSessionData');
            alert("Wallet Connection rejected");
          }
        })
        .catch((err) => {
          console.error('Error polling session status:', err);
        });
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleConnect = async (username: string) => {
    if (username.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await updateSessionWithUsername(qrCodeData, username.trim());
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
    setPublicKey(null);
    localStorage.removeItem('walletSessionData');
    handleFetchSessionData();
  };

  return {
    isConnected,
    qrCodeData,
    isLoading,
    error,
    publicKey,
    handleConnect,
    handleDisconnect,
    setError,
  };
};