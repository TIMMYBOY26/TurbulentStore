import React from "react";
import { Link } from "react-router-dom";

const Show = ({ show }) => {
    const currentDate = new Date();
    const showDate = new Date(show.date);
    let status;

    // Determine the show status based on the date
    if (showDate > currentDate) {
        status = "Upcoming !!";
    } else if (showDate < currentDate) {
        status = "Past";
    } else {
        status = "Ongoing";
    }

    return (
        <Link to={`/shows/${show._id}`} className="block p-4"> {/* Increased padding for better touch targets */}
            <div className="show-card flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 py-2">
                <div className="flex flex-col w-full sm:w-1/4 mb-2 sm:mb-0"> {/* Adjusted for mobile */}
                    <div className="flex items-center"> {/* Added flex container for date and status */}
                        <p className="text-gray-500 mr-2">{new Date(show.date).toLocaleDateString()}</p>
                        <p className={`text-sm font-semibold ${status === "Upcoming !!" ? "text-green-500" : status === "Ongoing" ? "text-blue-500" : "text-red-500"}`}>
                            {status}
                        </p>
                    </div>
                </div>
                <h2 className="text-xl font-bold flex-grow text-left mb-2 sm:mb-0 sm:mr-4">{show.name}</h2> {/* Margin adjustments for mobile */}
                <Link
                    to={`/shows/${show._id}`}
                    className="bg-black text-white px-4 py-2 text-center transition w-full sm:w-auto" // Full width on small screens
                >
                    {status === "Past" ? "Details" : "Details / Reservation"} {/* Conditional button text */}
                </Link>
            </div>
        </Link>
    );
};

export default Show;
