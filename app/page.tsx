"use client";

import { motion } from 'framer-motion';

export default function Home() {
  return (
    // <Link href="/api/python">
    //   <code className="font-mono font-bold">test api url</code>
    // </Link>
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <motion.h1 
        className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Vinyl Scanner
      </motion.h1>
      <motion.h2
        className="text-2xl md:text-4xl font-semibold mb-2 text-gray-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        For Bas &amp; Jenny&apos;s home &lt;3
      </motion.h2>
      <motion.p
        className="text-lg md:text-2xl max-w-xl text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Discover, scan, and play vinyl records with your phone.
      </motion.p>
    </main>
  );
}
