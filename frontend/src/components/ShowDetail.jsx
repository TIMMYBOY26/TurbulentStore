import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShowDetail = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use the environment variable for the backend URL
    const API_URL = import.meta.env.VITE_BACKEND_URL; // Access the backend URL from .env

    useEffect(() => {
        const fetchShowDetail = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/shows/${id}`);
                setShow(response.data.show);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShowDetail();
    }, [API_URL, id]);

    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    if (!show) return <p className="text-center">Show not found</p>;

    return (
        <div className="show-detail container mx-auto p-3">
            <h1 className="text-3xl font-bold">{show.name}</h1>
            <img src={show.image[0]} alt={show.name} className="w-full h-auto rounded-lg mb-4" />
            <p className="text-lg">{show.description}</p>
            <p className="text-gray-500">Date: {new Date(show.date).toLocaleDateString()}</p>
            <p className="text-gray-500">Location: {show.location}</p>
            <p className="text-gray-500">Status: {show.status}</p>
            <a href={show.ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Buy Tickets
            </a>
        </div>
    );
};

export default ShowDetail;
