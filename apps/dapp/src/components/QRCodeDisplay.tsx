import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
	isLoading: boolean;
  error: string | null;
  qrCodeData: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ isLoading, error, qrCodeData }) => {
  if (isLoading) return <p>Loading QR code...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return <QRCode value={qrCodeData} size={192} />;
};