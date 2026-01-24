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
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    fetchShows();
  }, [API_URL]);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-medium bg-red-50 px-6 py-3 rounded-full border border-red-100">
          Error: {error}
        </p>
      </div>
    );

  const reversedShows = [...shows].reverse();
  const currentDate = new Date();

  const filteredShows = reversedShows.filter((show) => {
    const showDate = new Date(show.date);
    if (filter === "upcoming") return showDate >= currentDate;
    if (filter === "past") return showDate < currentDate;
    return true;
  });

  return (
    <>
      {/* BRANDED WAVE LOADER */}
      {loading && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">TURBULENT</p>
          <style>{`
            @keyframes wave {
              0%, 100% { height: 1.5rem; transform: translateY(0); }
              50% { height: 4rem; transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}

      {/* SHOW PAGE CONTENT */}
      <div className={`container mx-auto px-2 sm:px-4 py-10 transition-opacity duration-1000 ${loading ? "opacity-0" : "opacity-100"}`}>
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter mb-4 uppercase text-center">News</h1>
          <div className="h-1 w-16 sm:w-20 bg-black mb-6 sm:mb-8"></div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsCalendarView(!isCalendarView)}
              className="group flex items-center gap-2 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all"
            >
              <span className="text-gray-300">/</span>
              {isCalendarView ? "List View" : "Calendar View"}
              <span className="text-gray-300">/</span>
            </button>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-transparent border-b border-black px-2 py-1 pr-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
              >
                <option value="all">All News</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">▼</div>
            </div>
          </div>
        </div>

        {isCalendarView ? (
          /* FULL-SCREEN RESPONSIVE CALENDAR VIEW */
          <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Note: p-1 on mobile ensures the grid uses all available screen width */}
            <div className="p-1 sm:p-4 md:p-6">
              <Calendar shows={filteredShows} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ul className="grid grid-cols-1 gap-4 sm:gap-6">
              {filteredShows.length > 0 ? (
                filteredShows.map((show) => (
                  <li
                    key={show._id}
                    className="group bg-white rounded-xl overflow-hidden border border-transparent hover:border-black/5 hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <Show show={show} />
                  </li>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                  No shows found
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowPage;
