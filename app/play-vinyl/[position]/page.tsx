"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function PlayVinyl() {
  const params = useParams();
  const position = params.position; // Extracting position from the URL

  const [playSuccess, setPlaySuccess] = useState(false);
  const [shuffleSuccess, setShuffleSuccess] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); // Tracks loading state for either "play" or "shuffle"
  const [error, setError] = useState<string | null>(null); // Tracks error state for either "play" or "shuffle"

  // Reset the button state after 2 seconds with a smooth transition
  const resetButtonState = () => {
    setTimeout(() => {
      setPlaySuccess(false);
      setShuffleSuccess(false);
      setError(null);
    }, 2000);
  };

  // API call to play the vinyl
  const handlePlay = async () => {
    setLoading('play');
    setError(null);
    try {
      const response = await fetch(`/api/play/${position}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPlaySuccess(true);
        } else {
        throw new Error('Failed to play vinyl');
      }
    } catch (error) {
      console.error('Error playing vinyl:', error);
      setError('play');
    } finally {
      setLoading(null);
      resetButtonState(); // Reset button state after 2 seconds
    }
  };

  // API call to shuffle the vinyl
  const handleShuffle = async () => {
    setLoading('shuffle');
    setError(null);
    try {
      const response = await fetch(`/api/shuffle/${position}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setShuffleSuccess(true);
      } else {
        throw new Error('Failed to shuffle vinyl');
      }
    } catch (error) {
      console.error('Error shuffling vinyl:', error);
      setError('shuffle');
    } finally {
      setLoading(null);
      resetButtonState(); // Reset button state after 2 seconds
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center text-center">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Filler Vinyl {position}
      </motion.h1>
      <motion.div
        className="mb-6 shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Image
          src="/placeholder.png" // This is a placeholder white square image
          alt={`Vinyl cover for position ${position}`}
          width={300} // Adjust the size as needed
          height={300}
          className="rounded-lg"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))', // Slick shading for a modern look
          }}
        />
      </motion.div>
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button
          onClick={handlePlay}
          disabled={loading === 'play' || playSuccess || error === 'play'}
          className={`${
            playSuccess
              ? 'bg-green-500'
              : error === 'play'
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          } text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center min-w-[100px] h-[40px]`}
        >
          <AnimatePresence>
            {loading === 'play' ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </motion.div>
            ) : playSuccess ? (
              <motion.div
                key="checkmark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✔️
              </motion.div>
            ) : error === 'play' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ❌
              </motion.div>
            ) : (
              <span>Play</span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={handleShuffle}
          disabled={loading === 'shuffle' || shuffleSuccess || error === 'shuffle'}
          className={`${
            shuffleSuccess
              ? 'bg-green-500'
              : error === 'shuffle'
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-green-500 to-teal-500'
          } text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center min-w-[100px] h-[40px]`}
        >
          <AnimatePresence>
            {loading === 'shuffle' ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </motion.div>
            ) : shuffleSuccess ? (
              <motion.div
                key="checkmark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ✔️
              </motion.div>
            ) : error === 'shuffle' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ❌
              </motion.div>
            ) : (
              <span>Shuffle</span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  );
}
