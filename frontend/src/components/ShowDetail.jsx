import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [selectedImg, setSelectedImg] = useState(null);
  
  // 手機版滑動狀態
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        // 保持您原本的 API 路徑不變
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

  useEffect(() => {
    document.body.style.overflow = selectedImg ? "hidden" : "unset";
  }, [selectedImg]);

  // 手勢滑動邏輯 (Swipe Logic)
  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!startX || !endX || !show?.image) return;
    const swipeThreshold = 50;
    const distance = startX - endX;
    if (distance > swipeThreshold) {
      setCurrentImageIndex((prev) => (prev === show.image.length - 1 ? 0 : prev + 1));
    } else if (distance < -swipeThreshold) {
      setCurrentImageIndex((prev) => (prev === 0 ? show.image.length - 1 : prev - 1));
    }
    setStartX(0);
    setEndX(0);
  };

  if (loading) return <p className="text-center text-xl pt-20 font-black uppercase tracking-widest">Loading...</p>;
  if (error) return <p className="text-center text-red-500 pt-20 font-bold">Error: {error}</p>;
  if (!show) return <p className="text-center pt-20 font-black">Show not found</p>;

  const isPastEvent = new Date(show.date) < new Date();
  const instagramButtonText = isPastEvent ? "View details" : "View on Instagram";

  return (
    <div className="show-detail container mx-auto p-4 md:p-8 relative">
      
      {/* Lightbox 彈窗 */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Full view" className="max-w-full max-h-full object-contain animate-in zoom-in duration-300" />
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 mb-4 max-w-5xl mx-auto">

        {/* 圖片區 */}
        <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
          <div 
            className="lg:hidden relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 shadow-sm"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {show.image.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImg(img)}
                className={`absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 ease-out ${
                  currentImageIndex === index ? "translate-x-0" : index < currentImageIndex ? "-translate-x-full" : "translate-x-full"
                }`}
                alt=""
              />
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {show.image.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${currentImageIndex === i ? "bg-black w-4" : "bg-gray-300 w-1"}`} />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center">
            {show.image.map((img, index) => (
              <div key={index} className="group w-full max-w-md bg-gray-50 rounded-lg overflow-hidden mb-4 shadow-sm cursor-zoom-in" onClick={() => setSelectedImg(img)}>
                <img src={img} className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]" alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* 文字區 */}
        <div className="lg:w-1/2 w-full text-left">
          {/* 標題區域：檢測 "-" 並換行 */}
          <h1 className="text-3xl sm:text-4xl font-black mb-3 uppercase tracking-tighter leading-tight">
            {show.name.split('-').map((part, index, array) => (
              <React.Fragment key={index}>
                {part.trim()}
                {index < array.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <div className="mb-4">
            <p className="text-sm font-bold text-gray-800">
              {new Date(show.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* 描述文字 */}
          <p className="text-base mb-6 whitespace-pre-wrap break-words leading-relaxed text-gray-600 font-medium">
            {show.description}
          </p>

          {/* Location & Status */}
          <div className="space-y-3 mb-6 py-5 border-t border-b border-gray-100">
            <p className="text-sm flex items-baseline">
              <span className="text-gray-400 uppercase tracking-widest text-[10px] mr-3 w-20 flex-shrink-0 font-black">Location:</span>
              <span className="font-bold text-gray-800">{show.location}</span>
            </p>
            <p className="text-sm flex items-baseline">
              <span className="text-gray-400 uppercase tracking-widest text-[10px] mr-3 w-20 flex-shrink-0 font-black">Status:</span>
              <span className="font-bold uppercase text-gray-800">{show.status}</span>
            </p>
          </div>

          <div className="flex flex-col space-y-2 max-w-xs">
            {show.instagramLink && (
              <a href={show.instagramLink} target="_blank" rel="noreferrer" className="text-center bg-blue-600 text-white font-black py-3 text-[10px] uppercase tracking-widest hover:bg-blue-700 transition">
                {instagramButtonText}
              </a>
            )}

            {/* 直接顯示按鈕，不再判定 isUpcoming */}
            <a href={show.ticketLink} target="_blank" rel="noreferrer" className="text-center bg-black text-white font-black py-3 text-[10px] uppercase tracking-widest hover:opacity-80 transition shadow-lg active:scale-95">
              TICKETS / ORDER
            </a>

            <button onClick={() => navigate(-1)} className="text-center bg-gray-100 text-gray-400 font-black py-2.5 text-[9px] hover:bg-gray-200 transition uppercase tracking-widest mt-4">
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
