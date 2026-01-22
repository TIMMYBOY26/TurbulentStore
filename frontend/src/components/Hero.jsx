import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleHeroClick = () => {
    navigate("/collection");
  };

  return (
    <div
      className="flex flex-col sm:flex-row cursor-pointer transition-transform duration-300 h-auto sm:h-[80vh] w-full"
      onClick={handleHeroClick}
      style={{
        backgroundImage: `url(${assets.Monologue_hero})`,
        // 'contain' on mobile to show full square, 'cover' on desktop for full bleed
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* 
          On mobile, we use an invisible aspect-square div to force the 
          container to be a perfect square so the background image fills it 
      */}
      <div className="w-full aspect-square sm:aspect-auto sm:h-full flex flex-col sm:flex-row">
        {/* Hero left */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          {/* Content goes here */}
        </div>

        {/* Hero right */}
        <div className="w-full sm:w-1/2"></div>
      </div>

      {/* Inline Style Override for Desktop */}
      <style jsx>{`
        @media (min-width: 640px) {
          div {
            background-size: cover !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
