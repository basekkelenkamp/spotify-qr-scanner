import './globals.css';
import { Inter, Lexend } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata = {
  title: 'Vinyl Scanner',
  description: 'Scan your vinyl records with your phone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lexend.variable} bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white min-h-screen`}>
        <div className="container mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
