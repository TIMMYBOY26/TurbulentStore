import React, { useEffect, useState } from "react";
import axios from "axios";
import Show from "../components/Show"; // Adjust the path based on your structure

const ShowPage = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use the environment variable for the backend URL
    const API_URL = import.meta.env.VITE_BACKEND_URL; // Access the backend URL from .env

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/shows/list`);
                setShows(response.data.shows);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [API_URL]);

    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    // Reverse the shows array before rendering
    const reversedShows = [...shows].reverse();

    return (
        <div className="shows-page container mx-auto p-3">
            <hr className="border-t-2 border-gray-300 mb-4 block sm:hidden" />
            <h1 className="text-3xl font mb-1 text-center">SHOWS</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {reversedShows.length > 0 ? (
                    reversedShows.map((show) => (
                        <Show key={show._id} show={show} />
                    ))
                ) : (
                    <p className="col-span-full text-center">No shows available</p>
                )}
            </ul>
        </div>
    );
};

export default ShowPage;
