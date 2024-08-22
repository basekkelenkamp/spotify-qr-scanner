"use client"; // This marks the component as a Client Component

import { useState, useEffect } from 'react';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [vinylPositions, setVinylPositions] = useState<string>('');
  const [originalVinylPositions, setOriginalVinylPositions] = useState<string>('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility
  const [enableSpotify, setEnableSpotify] = useState(true); // Default state is "enabled"
  const [spotifyDevice, setSpotifyDevice] = useState('');  // New state for Spotify Device
  const [deviceUpdateSuccess, setDeviceUpdateSuccess] = useState(false);  // State to handle button feedback

  useEffect(() => {
    // Fetch the current state of 'enable_spotify' and 'spotify_device' from the backend when the component loads
    const fetchSpotifySettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        console.log('Settings:', data.settings);
        setEnableSpotify(data.settings.spotify_enabled);
        setSpotifyDevice(data.settings.spotify_device);  // Set Spotify Device
      } catch (err) {
        console.error('Failed to fetch Spotify settings:', err);
      }
    };

    fetchSpotifySettings();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError('');
        fetchVinylPositions(); // Load the vinyl positions after successful login
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const fetchVinylPositions = async () => {
    try {
      const response = await fetch('/api/vinyls');
      const data = await response.json();
      const jsonString = JSON.stringify(data.data, null, 2); // Pretty print JSON
      setVinylPositions(jsonString);
      setOriginalVinylPositions(jsonString);
    } catch (err) {
      setError('Failed to load vinyl positions');
    }
  };

  const handleUpdate = async () => {
    try {
      // Validate JSON before sending it to the server
      JSON.parse(vinylPositions);

      const response = await fetch('/api/update_vinyl_positions/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positions: JSON.parse(vinylPositions) }),
      });

      if (response.ok) {
        setUpdateSuccess('Vinyl positions updated successfully');
        setUpdateError('');
        setOriginalVinylPositions(vinylPositions); // Update the original state
        setShowPopup(true); // Show the popup

        // Hide the popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } else {
        throw new Error('Failed to update vinyl positions');
      }
    } catch (err) {
      setUpdateError('Invalid JSON format or update failed');
      setUpdateSuccess('');
    }
  };

  const handleCancel = () => {
    setVinylPositions(originalVinylPositions); // Reset to original JSON
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleToggleSpotify = async () => {
    try {
      const response = await fetch('/api/admin/enable_spotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enable: !enableSpotify }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle Spotify');
      }
    } catch (err) {
      console.error('Error toggling Spotify:', err);
    }
  };

  const handleUpdateDevice = async () => {
    try {
      const response = await fetch('/api/admin/update_device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device: spotifyDevice }),
      });

      if (response.ok) {
        setDeviceUpdateSuccess(true);
        setTimeout(() => {
          setDeviceUpdateSuccess(false);
        }, 3000);  // Reset the success state after 3 seconds
      } else {
        throw new Error('Failed to update Spotify device');
      }
    } catch (err) {
      console.error('Error updating Spotify device:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 w-full max-w-sm">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded text-black bg-white"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors w-full">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg space-y-6">
        {/* Spotify Toggle */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold mb-4">Spotify Settings</h2>
          <div className="flex items-center space-x-4">
            <label className="text-lg">Enable Spotify:</label>
            <div
              className={`relative inline-block w-12 h-6 transition duration-200 ease-linear rounded-full cursor-pointer ${
                enableSpotify ? 'bg-green-500' : 'bg-red-500'
              }`}
              onClick={() => {
                setEnableSpotify(!enableSpotify);
                handleToggleSpotify();
              }}
            >
              <input
                type="checkbox"
                className="absolute opacity-0 w-0 h-0"
                checked={enableSpotify}
                onChange={() => {}}
              />
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform ${
                  enableSpotify ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </div>
          </div>

          {/* Spotify Device Field */}
          <div className="flex flex-col space-y-2">
            <label className="text-lg">Spotify Device (optional):</label>
            <input
              type="text"
              value={spotifyDevice}
              onChange={(e) => setSpotifyDevice(e.target.value)}
              placeholder="Enter Spotify Device ID or leave empty"
              className="border p-2 text-black bg-white rounded w-full max-w-xs"
            />
            <button
              onClick={handleUpdateDevice}
              className={`py-2 px-4 rounded max-w-xs ${
                deviceUpdateSuccess ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors`}
            >
              {deviceUpdateSuccess ? 'Device Updated!' : 'Update Device'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Update Vinyl Positions</h2>
          <textarea
            value={vinylPositions}
            onChange={(e) => setVinylPositions(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded text-black bg-white"
          />
          {updateError && <p className="text-red-500">{updateError}</p>}
          {updateSuccess && <p className="text-green-500">{updateSuccess}</p>}
          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Update
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded shadow-lg">
          Deploying changes, please wait 2-3 minutes...
        </div>
      )}
    </div>
  );
};

export default AdminPage;
