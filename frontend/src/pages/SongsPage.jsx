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
        const response = await axios.get(`${API_URL}/api/song/list`);
        setSongs(response.data.songs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [API_URL]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Reverse the songs array before rendering
  const reversedSongs = [...songs].reverse();

  return (
    <div className="songs-page container mx-auto p-3">
      {/* Grey horizontal line */}
      <hr className="border-t-2 border-gray-300 mb-4 block sm:hidden" />
      {/* Title */}
      <h1 className="text-3xl font mb-1 text-center">MUSIC</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reversedSongs.length > 0 ? (
          reversedSongs.map((song) => (
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