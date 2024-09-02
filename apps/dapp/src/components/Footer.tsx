import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-background-light py-4 text-center">
    <p className="text-text-dark">&copy; {new Date().getFullYear()} Wallet Buddy. All rights reserved.</p>
  </footer>
);