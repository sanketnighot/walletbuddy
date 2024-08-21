"use client"

import { useCallback, useEffect, useState } from "react";
import PasswordEntryStep from "@/Components/Inputs/PasswordEntryStep";
import useTelegramBot from "@/hooks/useTelegramBot";
import useBackButton from "@/hooks/useBackButton";

const setNewPassword = () => {
  const [step, setStep] = useState<'initial' | 'confirm'>('initial');
  const [initialPassword, setInitialPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useBackButton()
  useTelegramBot();

  const sendData = useCallback((data: any) => {
    window.Telegram?.WebApp.sendData(JSON.stringify(data))
  }, [])

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [initialPassword, confirmPassword]);


  const handleSubmit = () => {
    if (step === 'initial') {
      if (initialPassword.length >= 6) {
      setStep('confirm');
      setConfirmPassword('');
      } else {
        setError('Password must be at least 6 characters long.');
      }
    } else {
      if (initialPassword === confirmPassword) {
        console.log('Passwords matched. Submitting:', initialPassword);
        sendData({ action: 'submit_password', password: initialPassword });
        window.Telegram?.WebApp.close();
      } else {
        setError('Passwords do not match. Please try again.');
      }
    }
  }

  return (
    <PasswordEntryStep
      password={step === 'initial' ? initialPassword : confirmPassword}
      setPassword={step === 'initial' ? setInitialPassword : setConfirmPassword}
      title={step === 'initial' ? "Enter New Password" : "Confirm New Password"}
      buttonTitle={step === 'initial' ? "Next" : "Confirm Password"}
      onSubmit={handleSubmit}
      error={error}
    />
  )
}

export default setNewPassword;