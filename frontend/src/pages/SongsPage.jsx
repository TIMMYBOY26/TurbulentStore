import React, { useEffect, useState } from "react";
import axios from "axios";
import Song from "../components/Song"; // Adjust the path based on your structure

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the environment variable for the backend URL
  const API_URL = import.meta.env.VITE_BACKEND_URL; // Access the backend URL from .env

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/song/list`); // Ensure the correct endpoint
        setSongs(response.data.songs); // Set the list of songs
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchSongs(); // Fetch the list of songs
  }, [API_URL]);

  if (loading) return <p className="text-center text-xl">Loading...</p>; // Loading state
  if (error) return <p className="text-center text-red-500">Error: {error}</p>; // Error state

  return (
    <div className="songs-page container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">MUSIC</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {songs.length > 0 ? (
          songs.map((song) => (
            <Song key={song._id} song={song} />
          ))
        ) : (
          <p className="col-span-full text-center">No songs available</p>
        )}
      </ul>
    </div>
  );
};

export default SongsPage;
