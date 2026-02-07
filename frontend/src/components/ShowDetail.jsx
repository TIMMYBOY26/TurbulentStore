import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // 新增：用於存放當前要放大的圖片 URL
  const [selectedImg, setSelectedImg] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

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

  // 當彈窗開啟時，禁止頁面滾動
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedImg]);

  if (loading) return <p className="text-center text-xl pt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 pt-20">Error: {error}</p>;
  if (!show) return <p className="text-center pt-20">Show not found</p>;

  const isPastEvent = new Date(show.date) < new Date();
  const instagramButtonText = isPastEvent
    ? "View details"
    : "View show details on Instagram";

  return (
    <div className="show-detail container mx-auto p-4 md:p-8 relative">
      
      {/* 1. 圖片彈窗 Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out p-4 md:p-10"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-6 right-6 text-white text-4xl font-light hover:scale-110 transition-transform">
            ✕
          </button>
          <img
            src={selectedImg}
            alt="Full view"
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // 防止點擊圖片本身時關閉
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 mb-4 max-w-6xl mx-auto">

        {/* 圖片區 */}
        <div className="flex flex-col items-center mb-6 lg:mb-0 lg:w-1/2 w-full">
          {show.image.map((img, index) => (
            <div 
              key={index} 
              className="group w-full max-w-md bg-gray-50 rounded-lg overflow-hidden mb-4 shadow-sm cursor-zoom-in relative"
              onClick={() => setSelectedImg(img)} // 點擊開啟彈窗
            >
              <img
                src={img}
                alt={`${show.name} image ${index + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain block mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Hover 提示文字 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <span className="bg-white/80 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">Click to expand</span>
              </div>
            </div>
          ))}
        </div>

        {/* 文字區 */}
        <div className="lg:w-1/2 w-full text-left">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tighter">{show.name}</h1>

          <div className="mb-6">
            <p className="text-lg font-bold text-gray-800">
              {new Date(show.date).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          <p className="text-lg mb-6 whitespace-pre-wrap break-words leading-relaxed text-gray-700">
            {show.description}
          </p>

          <div className="space-y-2 mb-8 py-4 border-t border-b border-gray-100">
            <p className="text-sm">
              <span className="text-gray-400 uppercase tracking-widest mr-2">Location:</span>
              <span className="font-bold">{show.location}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400 uppercase tracking-widest mr-2">Status:</span>
              <span className="font-bold uppercase">{show.status}</span>
            </p>
          </div>

          <div className="flex flex-col space-y-3 max-w-xs">
            {show.instagramLink && (
              <a
                href={show.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center bg-blue-600 text-white font-bold py-3 px-6 hover:bg-blue-700 transition duration-200"
              >
                {instagramButtonText}
              </a>
            )}

            <a
              href={show.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-black text-white font-bold py-3 px-6 hover:opacity-80 transition duration-200"
            >
              TICKETS / ORDER
            </a>

            <button
              onClick={() => navigate(-1)}
              className="text-center bg-gray-100 text-gray-500 font-bold py-2 px-6 hover:bg-gray-200 transition duration-200 uppercase text-xs tracking-widest"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
