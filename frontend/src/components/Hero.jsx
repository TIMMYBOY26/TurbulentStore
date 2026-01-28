import React, { useState } from "react"; // 1. Added useState
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false); // 2. State for notification

  const handleOrderClick = (e) => {
    e.stopPropagation();
    // Show the message
    setShowMessage(true);

    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleHeroClick = () => {
    navigate("/shows/6973054cc4bb617639eacce5");
  };

  const streamUrl =
    "https://orcd.co/monologue_turbulent";

  return (
    <div
      className="group relative flex flex-col sm:flex-row cursor-pointer h-auto sm:h-[80vh] w-full overflow-hidden transition-transform duration-200 active:scale-[0.98] sm:active:scale-100"
      onClick={handleHeroClick}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out sm:group-hover:scale-105"
        style={{
          backgroundImage: `url(${assets.Monologue_hero})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <div className="w-full aspect-square sm:aspect-auto sm:h-full flex flex-col sm:flex-row relative z-10">
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0"></div>
        <div className="w-full sm:w-1/2"></div>

        <div className="absolute bottom-[11%] sm:bottom-[20%] left-0 w-full flex flex-col items-center px-4">

          {/* 3. CONDITIONAL MESSAGE DISPLAY */}
          <div className={`mb-2 transition-opacity duration-300 ${showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <p className="bg-black/80 text-white px-4 py-1 rounded text-[13px] sm:text-xs uppercase tracking-tighter">
              Pre-order will start at 8pm !
            </p>
          </div>

          <div className="flex flex-col items-center mb-2 sm:mb-4 leading-tight">
            <h2 className="text-white sm:text-black text-[11px] sm:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md sm:drop-shadow-none">
              The New Album
            </h2>
            <h2 className="text-white sm:text-black text-[11px] sm:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md sm:drop-shadow-none">
              Out January 28TH
            </h2>
            <h2 className="text-white sm:text-black text-[11px] sm:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md sm:drop-shadow-none">
              Pre-Order Will start at 8pm
            </h2>
          </div>

          <div className="flex justify-center gap-3 sm:gap-6">
            <button
              onClick={handleOrderClick} // 4. Updated handler
              className="px-5 py-1.5 sm:px-10 sm:py-2.5 border-[1px] sm:border-2 border-white sm:border-black text-white sm:text-black bg-transparent sm:bg-white rounded-sm font-medium uppercase tracking-wider text-[11px] sm:text-base transition-all duration-300 hover:bg-white sm:hover:bg-black hover:text-black sm:hover:text-white active:scale-95"
            >
              ORDER
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(streamUrl, "_blank", "noopener,noreferrer");
              }}
              className="px-5 py-1.5 sm:px-10 sm:py-2.5 border-[1px] sm:border-2 border-white sm:border-black text-white sm:text-black bg-transparent sm:bg-white rounded-sm font-medium uppercase tracking-wider text-[11px] sm:text-base transition-all duration-300 hover:bg-white sm:hover:bg-black hover:text-black sm:hover:text-white active:scale-95"
            >
              STREAM
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          .absolute.inset-0 {
            background-size: cover !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
