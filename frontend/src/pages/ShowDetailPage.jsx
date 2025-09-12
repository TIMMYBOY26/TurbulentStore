import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShowDetail from "../components/ShowDetail"; // Adjust the path based on your structure

const ShowDetailPage = () => {
    const { id } = useParams(); // Get the show ID from the URL
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use the environment variable for the backend URL
    const API_URL = import.meta.env.VITE_BACKEND_URL; // Access the backend URL from .env

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/shows/${id}`); // Fetch the specific show by ID
                setShow(response.data.show); // Set the show data
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Set loading to false after the request
            }
        };

        fetchShow(); // Fetch the show details
    }, [API_URL, id]);

    if (loading) return <p className="text-center text-xl">Loading...</p>; // Loading state
    if (error) return <p className="text-center text-red-500">Error: {error}</p>; // Error state
    if (!show) return <p className="text-center">No show found</p>; // Check if show exists

    return (
        <div className="show-detail-page flex flex-col items-center p-4 md:p-8">
            <ShowDetail show={show} /> {/* Render the ShowDetail component */}
        </div>
    );
};

export default ShowDetailPage;
