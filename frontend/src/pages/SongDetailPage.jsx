import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SongDetail from "../components/SongDetail"; // Adjust the path based on your structure

const SongDetailPage = () => {
    const { id } = useParams(); // Get the song ID from the URL
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use the environment variable for the backend URL
    const API_URL = import.meta.env.VITE_BACKEND_URL; // Access the backend URL from .env

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/song/${id}`); // Fetch the specific song by ID
                setSong(response.data.song); // Set the song data
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Set loading to false after the request
            }
        };

        fetchSong(); // Fetch the song details
    }, [API_URL, id]);

    if (loading) return <p>Loading...</p>; // Loading state
    if (error) return <p>Error: {error}</p>; // Error state
    if (!song) return <p>No song found</p>; // Check if song exists

    return (
        <div className="song-detail-page">
            <SongDetail song={song} /> {/* Render the SongDetail component */}
        </div>
    );
};

export default SongDetailPage;
