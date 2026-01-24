import React, { useEffect, useState } from "react";
import axios from "axios";
import Song from "../components/Song";

const SongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/song/list`);
        setSongs(response.data.songs);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchSongs();
  }, [API_URL]);

  if (error)
    return <p className="text-center text-red-500 pt-20">Error: {error}</p>;

  const reversedSongs = [...songs].reverse();

  return (
    <>
      {/* BRANDED WAVE LOADER - Positioned below Navbar */}
      {loading && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">
            TURBULENT
          </p>
          <style>{`
            @keyframes wave {
              0%, 100% { height: 1.5rem; transform: translateY(0); }
              50% { height: 4rem; transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div
        className={`songs-page container mx-auto p-3 transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font mb-1 text-center">MUSIC</h1>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reversedSongs.length > 0 ? (
            reversedSongs.map((song) => <Song key={song._id} song={song} />)
          ) : (
            <p className="col-span-full text-center">No songs available</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default SongsPage;
