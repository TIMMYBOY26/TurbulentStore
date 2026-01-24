import React, { useState, useEffect } from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import LatestSong from "../components/LatestSong";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect when all images and scripts are fully loaded
    const handleLoad = () => {
      // Small timeout for a smoother visual transition
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {/* FULL-SCREEN MULTI-COLOR WAVE LOADER */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            {/* Dark Blue Bar */}
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>

            {/* Light Blue Bar */}
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>

            {/* Black Bar */}
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>

            {/* White Bar (with grey border for visibility) */}
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>

            {/* Dark Blue Bar (Repeated) */}
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>

          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">
            TURBULENT
          </p>

          {/* Keyframe Animation for Wave Effect */}
          <style>{`
            @keyframes wave {
              0%, 100% { height: 1.5rem; transform: translateY(0); }
              50% { height: 4rem; transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}

      {/* PAGE CONTENT */}
      {/* Content stays hidden with 0 opacity until loader finishes */}
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <LatestSong />
        <LatestCollection />
        <BestSeller />
      </div>
    </>
  );
};

export default Home;
