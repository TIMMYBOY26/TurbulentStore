import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleHeroClick = () => {
    navigate("/shows/6973054cc4bb617639eacce5");
  };

  const streamUrl =
    "https://linktr.ee/turbulent_hk?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnYDzsc9beNCe7Seml2Rvn7ZAL0WdimRCMONWUYlDxWFxpSxhEBLpE06-SiV4_aem_EGqy2IJ7vkj4TaaCYacTMA";

  return (
    <div
      className="group relative flex flex-col sm:flex-row cursor-pointer h-auto sm:h-[80vh] w-full overflow-hidden transition-transform duration-200 active:scale-[0.98] sm:active:scale-100"
      onClick={handleHeroClick}
    >
      {/* BACKGROUND LAYER: Zoom on Hover (Desktop) */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out sm:group-hover:scale-105"
        style={{
          backgroundImage: `url(${assets.Monologue_hero})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* CONTENT LAYER */}
      <div className="w-full aspect-square sm:aspect-auto sm:h-full flex flex-col sm:flex-row relative z-10">
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0"></div>
        <div className="w-full sm:w-1/2"></div>

        {/* --- BUTTONS & TITLE CONTAINER --- */}
        <div className="absolute bottom-[11%] sm:bottom-[20%] left-0 w-full flex flex-col items-center px-4">
          <div className="flex flex-col items-center mb-2 sm:mb-4 leading-tight">
            <h2 className="text-white sm:text-black text-[11px] sm:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md sm:drop-shadow-none">
              The New Album
            </h2>
            <h2 className="text-white sm:text-black text-[11px] sm:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md sm:drop-shadow-none">
              Out January 28TH
            </h2>
          </div>

          <div className="flex justify-center gap-3 sm:gap-6">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering the background click
                navigate("/collection");
              }}
              className="px-5 py-1.5 sm:px-10 sm:py-2.5 border-[1px] sm:border-2 border-white sm:border-black text-white sm:text-black bg-transparent sm:bg-white rounded-sm font-medium uppercase tracking-wider text-[11px] sm:text-base transition-all duration-300 hover:bg-white sm:hover:bg-black hover:text-black sm:hover:text-white active:scale-95"
            >
              ORDER
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering the background click
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
