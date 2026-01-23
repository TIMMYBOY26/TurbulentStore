import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import { assets } from "../assets/assets";

const LatestSong = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Set volume to 70% on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.7;
    }
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoClick = () => {
    navigate("/songs/69719365c59ead5f6d4c8f40");
  };

  return (
    <div className="mt-0 mb-10">
      <div className="flex flex-col items-center pt-6 pb-3 text-3xl">
        <Title text2={"Music video"} />
        <p
          onClick={() => navigate("/songs")}
          className="cursor-pointer text-gray-400 text-xs sm:text-sm font-light tracking-[0.2em] uppercase hover:text-black transition-colors leading-none mt-[-8px]"
        >
          Full MV / Lyrics <span className="text-[10px] ml-1">→</span>
        </p>
      </div>

      {/* 
          CONTAINER: 
          - 'group' allows children to react to hover
          - 'overflow-hidden' clips the zoom effect
          - 'active:scale-[0.98]' provides mobile press feedback
      */}
      <div
        onClick={handleVideoClick}
        className="group relative w-full overflow-hidden cursor-pointer transition-transform duration-300 active:scale-[0.98] sm:active:scale-100"
      >
        <video
          ref={videoRef}
          src={assets.lightwallvideo}
          // VIDEO: Zoom effect on desktop hover via group-hover
          className="w-full h-auto mt-0 transition-transform duration-700 ease-in-out sm:group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        />

        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-black/40 z-10 active:scale-90"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11.293 4.293a1 1 0 00-1.414 0L5.586 8H4a1 1 0 00-1 1v6a1 1 0 001 1h1.586l4.293 4.293a1 1 0 001.707-.707V5a1 1 0 00-.293-.707z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default LatestSong;
