import './globals.css';
import { Inter, Lexend } from 'next/font/google';
import Link from 'next/link';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata = {
  title: 'Vinyl Scanner',
  description: 'Scan your vinyl records with your phone',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lexend.variable} bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white min-h-screen`}>
        <div className="container mx-auto px-4">
          <header className="flex justify-between items-center py-4">
            <Link href="/"><h1 className="text-2xl font-bold">Vinyl Scanner</h1></Link>
            <nav>
              <Link href="/all-qr" className="text-lg text-white hover:text-gray-300 transition-colors">
                All QR codes
              </Link>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
