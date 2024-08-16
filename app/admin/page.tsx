"use client"; // This marks the component as a Client Component

import { useState } from 'react';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [vinylPositions, setVinylPositions] = useState<string>('');
  const [originalVinylPositions, setOriginalVinylPositions] = useState<string>('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility

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

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 text-black bg-white"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-2">Update Vinyl Positions</h2>
        <textarea
          value={vinylPositions}
          onChange={(e) => setVinylPositions(e.target.value)}
          rows={20}
          className="w-full p-2 border rounded text-black bg-white"
        />
        {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
        {updateSuccess && <p className="text-green-500 mt-2">{updateSuccess}</p>}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white p-2 rounded"
          >
            Update
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded shadow-lg">
          Deploying changes, please wait 2-3 minutes...
        </div>
      )}
    </div>
  );
};

export default AdminPage;
