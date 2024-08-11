"use client";

import QrCodeGrid from '../../components/QrCodeGrid';

export default function QrPage() {
  const totalQrCodes = 7;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">QR Codes</h1>
      <QrCodeGrid totalQrCodes={totalQrCodes} />
    </div>
  );
}
