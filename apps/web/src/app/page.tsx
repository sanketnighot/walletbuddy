"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const App = () => {

  const router = useRouter();

  useEffect(() => {
    window.Telegram!.WebApp.BackButton.hide();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-2 bg-tg-bg p-2">
      <h1 className="text-4xl font-bold mb-4 text-tg-text">Welcome to the Wallet Buddy</h1>
      <Link href="/setNewPassword">
        <button className="w-56 bg-tg-button text-tg-button-text px-4 py-2 rounded-md">Set New Password</button>
      </Link>
      <Link href="/onboarding">
        <button className="w-56 bg-tg-button text-tg-button-text px-4 py-2 rounded-md">Onboarding Page</button>
      </Link>
    </div>
  );
};

export default App;