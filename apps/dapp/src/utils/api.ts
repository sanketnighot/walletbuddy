import axios from 'axios';

export const fetchSessionData = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_WEBHOOK_URL}/api/v1/session/create`, {
      dapp: {
        name: "Wallet Buddy Dapp",
        description: "This is a test dapp to test the wallet buddy functionality",
        url: "https://walletbuddy.sanketnighot.com"
      }
    });
    if (!response.data) {
      throw new Error('Failed to fetch session data');
    }
    return response.data.walletSession.id;
  } catch (err) {
    console.error('Error fetching session data:', err);
    throw err;
  }
};

export const updateSessionWithUsername = async (sessionId: string, username: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_WEBHOOK_URL}/api/v1/session/update`, {
      sessionId,
      username
    });
    if (!response.data) {
      throw new Error('Failed to update session with username');
    }
    return response.data;
  } catch (err) {
    console.error('Error updating session with username:', err);
    throw err;
  }
};

export const checkSessionStatus = async (sessionId: string) => {
  try {
    console.log('Checking session status for sessionId:', sessionId);
    const response = await axios.get(`${import.meta.env.VITE_WEBHOOK_URL}/api/v1/session?sessionId=${sessionId}`);
    if (!response.data) {
      throw new Error('Failed to check session status');
    }
    return response.data;
  } catch (err) {
    console.error('Error checking session status:', err);
    throw err;
  }
};