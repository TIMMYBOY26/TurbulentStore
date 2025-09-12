import React, { useEffect, useState } from "react";
import axios from "axios";
import Show from "../components/Show"; // Adjust the path based on your structure
import Calendar from "../components/Calendar"; // Import the new Calendar component

const ShowPage = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCalendarView, setIsCalendarView] = useState(false); // State for display mode

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

    if (loading)
        return <p className="text-center text-xl">Loading...</p>;
    if (error)
        return <p className="text-center text-red-500">Error: {error}</p>;

    // Reverse the shows array before rendering
    const reversedShows = [...shows].reverse();

    return (
        <div className="shows-page container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">SHOWS</h1>
            <button
                onClick={() => setIsCalendarView(!isCalendarView)}
                className="mb-4 bg-black text-white px-4 py-2 border-none" // Updated styles
            >
                {isCalendarView ? "Switch to List View" : "Switch to Calendar View"}
            </button>

            {isCalendarView ? (
                <Calendar shows={reversedShows} /> // Render the Calendar component
            ) : (
                <ul className="space-y-4">
                    {reversedShows.length > 0 ? (
                        reversedShows.map((show) => (
                            <li key={show._id} className="bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 cursor-pointer">
                                <Show show={show} />
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-lg">No shows available</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ShowPage;
