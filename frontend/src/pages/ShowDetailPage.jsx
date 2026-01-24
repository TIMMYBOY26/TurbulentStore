import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShowDetail from "../components/ShowDetail";

const ShowDetailPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shows/${id}`);
        setShow(response.data.show);
      } catch (err) {
        setError(err.message);
      } finally {
        // Keep loader for a smooth transition duration
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchShow();
  }, [API_URL, id]);

  if (error)
    return <p className="text-center text-red-500 pt-20">Error: {error}</p>;
  if (!loading && !show)
    return <p className="text-center pt-20">No show found</p>;

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

      {/* PAGE CONTENT */}
      <div
        className={`show-detail-page flex flex-col items-center p-4 md:p-8 transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {show && <ShowDetail show={show} />}
      </div>
    </>
  );
};

export default ShowDetailPage;
