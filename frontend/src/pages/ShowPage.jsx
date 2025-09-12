import React, { useEffect, useState } from "react";
import axios from "axios";
import Show from "../components/Show"; // Adjust the path based on your structure
import Calendar from "../components/Calendar"; // Import the new Calendar component

const ShowPage = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCalendarView, setIsCalendarView] = useState(false); // State for display mode
    const [filter, setFilter] = useState("all"); // Set default filter to "all"

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

    // Reverse the shows array before filtering
    const reversedShows = [...shows].reverse();

    // Get current date for filtering
    const currentDate = new Date();

    // Filter shows based on the selected filter
    const filteredShows = reversedShows.filter(show => {
        const showDate = new Date(show.date); // Assuming show.date is in a valid date format
        if (filter === "upcoming") {
            return showDate >= currentDate;
        } else if (filter === "past") {
            return showDate < currentDate;
        } else {
            return true; // Show all
        }
    });

    return (
        <div className="shows-page container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">SHOWS</h1>
            <div className="mb-5 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-4"> {/* Flex container for side-by-side layout */}
                    <span
                        onClick={() => setIsCalendarView(!isCalendarView)}
                        className="cursor-pointer text-black-600 hover:underline"
                    >
                        &lt; {isCalendarView ? "List View" : "Calendar View"} &gt;
                    </span>

                    {/* Dropdown Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">Show All</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                </div>
            </div>

            {isCalendarView ? (
                <Calendar shows={filteredShows} /> // Render the Calendar component with filtered shows
            ) : (
                <ul className="space-y-4">
                    {filteredShows.length > 0 ? (
                        filteredShows.map((show) => (
                            <li key={show._id} className="bg-white shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
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
