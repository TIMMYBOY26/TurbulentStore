import React, { useEffect, useState } from "react";
import axios from "axios";
import Show from "../components/Show";
import Calendar from "../components/Calendar";

const ShowPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [filter, setFilter] = useState("all");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shows/list`);
        setShows(response.data.shows);
      } catch (err) {
        setError(err.message);
      } finally {
        // Smooth transition delay
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchShows();
  }, [API_URL]);

  if (error)
    return <p className="text-center text-red-500 pt-20">Error: {error}</p>;

  const reversedShows = [...shows].reverse();
  const currentDate = new Date();

  const filteredShows = reversedShows.filter((show) => {
    const showDate = new Date(show.date);
    if (filter === "upcoming") {
      return showDate >= currentDate;
    } else if (filter === "past") {
      return showDate < currentDate;
    } else {
      return true;
    }
  });

  return (
    <>
      {/* BRANDED WAVE LOADER - BELOW NAV BAR */}
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

      {/* SHOW PAGE CONTENT */}
      <div
        className={`shows-page container mx-auto p-4 transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">NEWS</h1>
        <div className="mb-5 flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <span
              onClick={() => setIsCalendarView(!isCalendarView)}
              className="cursor-pointer text-black-600 hover:underline"
            >
              &lt; {isCalendarView ? "List View" : "Calendar View"} &gt;
            </span>

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
          <Calendar shows={filteredShows} />
        ) : (
          <ul className="space-y-4">
            {filteredShows.length > 0 ? (
              filteredShows.map((show) => (
                <li
                  key={show._id}
                  className="bg-white shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                >
                  <Show show={show} />
                </li>
              ))
            ) : (
              <p className="text-center text-lg">No shows available</p>
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default ShowPage;
