import React from "react";
import { Link } from "react-router-dom";

const Show = ({ show }) => {
    return (
        <div className="show-card border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold">{show.name}</h2>
            <p className="text-gray-600">{show.description}</p>
            <p className="text-gray-500">{new Date(show.date).toLocaleDateString()}</p>
            <Link to={`/shows/${show._id}`} className="text-blue-500 hover:underline">
                View Details
            </Link>
        </div>
    );
};

export default Show;
