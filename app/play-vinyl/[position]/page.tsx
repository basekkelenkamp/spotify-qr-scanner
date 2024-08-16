"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface AlbumInfo {
  id: string;
  name: string;
  artists: string[];
  release_date: string;
  total_tracks: number;
  image: {
    url: string;
    height: number;
    width: number;
  };
  total_duration_ms: number;
  tracks: {
    name: string;
    id: string;
    artists: string[];
    duration_ms: number;
  }[];
}

// Convert milliseconds to a human-readable time format
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

export default function PlayVinyl() {
  const params = useParams();
  const position = params.position; // Extracting position from the URL

  const [albumInfo, setAlbumInfo] = useState<AlbumInfo | null>(null);
  const [playSuccess, setPlaySuccess] = useState(false);
  const [shuffleSuccess, setShuffleSuccess] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); // Tracks loading state for either "play" or "shuffle"
  const [error, setError] = useState<string | null>(null); // Tracks error state for either "play" or "shuffle"

  // Fetch album info when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/album/${position}`).then((res) => res.json());
      setAlbumInfo(data);
      console.log("albumInfo after fetch:", data);
    };
    fetchData();
  }, [position]);

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
      const response = await fetch(`/api/play/album/${position}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album_id: albumInfo?.id }),
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
      const response = await fetch(`/api/play/album/${position}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album_id: albumInfo?.id, shuffle: true }),
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

  // API call to queue the album
  const handleQueue = async () => {
    setLoading('queue');
    setError(null);
    try {
      const response = await fetch(`/api/queue/album/${position}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album_id: albumInfo?.id }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPlaySuccess(true); // Reusing playSuccess to indicate success
      } else {
        throw new Error('Failed to queue album');
      }
    } catch (error) {
      console.error('Error queuing album:', error);
      setError('queue');
    } finally {
      setLoading(null);
      resetButtonState(); // Reset button state after 2 seconds
    }
  };

  // API call to play a specific track
  const playSpecific = async (track_id: string) => {
    setLoading('play');
    setError(null);
    try {
      const response = await fetch(`/api/play/track/${position}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ track_id: track_id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPlaySuccess(true);
      } else {
        throw new Error('Failed to play track');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setError('play');
    } finally {
      setLoading(null);
      resetButtonState(); // Reset button state after 2 seconds
    }
  };
  

  if (!albumInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center text-center">
      {/* Album Title and Artist */}
      <motion.h1
        className="text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {albumInfo.name}
      </motion.h1>
      <motion.h2
        className="text-2xl text-gray-500 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {albumInfo.artists.join(", ")}
      </motion.h2>

      {/* Album Cover */}
      <motion.div
        className="mb-6 shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Image
          src={albumInfo.image.url}
          alt={`Vinyl cover for ${albumInfo.name}`}
          width={albumInfo.image.width}
          height={albumInfo.image.height}
          className="rounded-lg"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))', // Slick shading for a modern look
          }}
        />
      </motion.div>

      {/* Album Total Duration */}
      <motion.div
        className="flex space-x-4 mb-8"
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

        <button
          onClick={handleQueue}
          disabled={loading === 'queue' || playSuccess || error === 'queue'}
          className={`${
            playSuccess
              ? 'bg-green-500'
              : error === 'queue'
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          } text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center min-w-[100px] h-[40px]`}
        >
          <AnimatePresence>
            {loading === 'queue' ? (
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
            ) : error === 'queue' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ❌
              </motion.div>
            ) : (
              <span>Queue</span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>


      {/* Track List */}
      <motion.div
        className="w-full mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold mb-2 text-gray-300">Track List</h3>
        <ul className="text-lg text-gray-100 divide-y divide-gray-700">
          {albumInfo.tracks.map((track, index) => (
            <li 
              key={track.id} 
              className="flex items-center justify-between py-4 px-4 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:backdrop-blur-sm cursor-pointer"
              onClick={() => playSpecific(track.id)}

            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 font-semibold text-sm">{index + 1}</span>
                <div>
                  <p className="text-base font-medium text-left">{track.name}</p>
                  <p className="text-sm text-gray-500 text-left">{track.artists.join(", ")}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{formatDuration(track.duration_ms)}</span>
            </li>
          ))}
        </ul>
      </motion.div>

    </div>
  );
}
