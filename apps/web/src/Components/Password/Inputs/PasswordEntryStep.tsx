import React from 'react';
import PasswordEntry from './PasswordEntry';

interface PasswordEntryStepProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>
  title: string;
  buttonTitle: string;
  onSubmit: () => void;
  error: string;
}

const PasswordEntryStep: React.FC<PasswordEntryStepProps> = ({
  password,
  setPassword,
  title,
  buttonTitle,
  onSubmit,
  error,
}) => {
  return (
    <PasswordEntry
      password={password}
      setPassword={setPassword}
      title={title}
      buttonTitle={buttonTitle}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default PasswordEntryStep;