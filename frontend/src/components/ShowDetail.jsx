import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!show) return <p className="text-center">Show not found</p>;

  const isPastEvent = new Date(show.date) < new Date();
  const instagramButtonText = isPastEvent
    ? "View details"
    : "View show details on Instagram";

  return (
    <div className="show-detail container mx-auto p-4 md:p-8">
      {/* 限制容器最大寬度，避免在大螢幕上分散太開 */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 mb-4 max-w-6xl mx-auto">

        {/* 圖片區：增加 max-w-md 讓圖片在桌面端更小 */}
        <div className="flex flex-col items-center mb-6 lg:mb-0 lg:w-1/2 w-full">
          {show.image.map((img, index) => (
            <div key={index} className="w-full max-w-md bg-gray-50 rounded-lg overflow-hidden mb-4 shadow-sm">
              <img
                src={img}
                alt={`${show.name} image ${index + 1}`}
                // object-contain: 確保圖片完整顯示不裁剪
                // max-h: 防止圖片垂直方向拉得太長
                className="w-full h-auto max-h-[60vh] object-contain block mx-auto"
              />
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

          {/* 按鈕區 */}
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
