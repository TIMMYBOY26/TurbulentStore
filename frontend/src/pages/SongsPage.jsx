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

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state

  return (
    <div className="songs-page">
      <ul>
        {songs.length > 0 ? (
          songs.map((song) => (
            <Song key={song._id} song={song} /> // Use the Song component to render each song
          ))
        ) : (
          <p>No songs available</p> // Message if no songs are available
        )}
      </ul>
    </div>
  );
};

export default SongsPage;
