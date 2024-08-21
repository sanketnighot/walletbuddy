import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordEntryProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>
  title?: string;
  buttonTitle: string;
  onSubmit: () => void;
  error: string;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ title, buttonTitle, password, onSubmit, setPassword, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tg = window.Telegram!.WebApp;
    tg.ready();
    tg.expand();

    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Add this new function to handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-h-dvh bg-tg-bg text-tg-text p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      
      <Lock className="w-12 h-12 mb-6 text-tg-button" />
      
      <div className="relative w-5/6 max-w-sm mb-2">
        <input
          ref={inputRef}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          className={`w-full p-2 pr-10 rounded bg-tg-bg text-tg-text border ${error ? 'border-red-500' : 'border-tg-hint'}`}
          placeholder="Enter password"
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-tg-hint"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="w-5/6 mb-6">
        {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
      </div>
      
      <button
        ref={buttonRef}
        className="relative w-5/6 max-w-sm h-12 bg-tg-button text-tg-button-text rounded overflow-hidden"
        onClick={onSubmit}
      >
        <span className="relative z-10">
          {buttonTitle}
        </span>
      </button>
    </div>
  );
};

export default PasswordEntry;