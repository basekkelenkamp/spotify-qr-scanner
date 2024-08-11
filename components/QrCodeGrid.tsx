import Image from 'next/image';
import { motion } from 'framer-motion';

interface QrCodeGridProps {
  totalQrCodes: number;
}

export default function QrCodeGrid({ totalQrCodes }: QrCodeGridProps) {
  const qrCodes = Array.from({ length: totalQrCodes }, (_, index) => `/qr_codes/qr_code_${index + 1}.png`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {qrCodes.map((qrCode, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center p-2 border border-gray-200 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Image
            src={qrCode}
            alt={`QR Code ${index + 1}`}
            width={300} // Increased width
            height={300} // Increased height
            className="mb-2"
          />
          <span className="text-lg font-semibold">QR Code {index + 1}</span>
        </motion.div>
      ))}
    </div>
  );
}
