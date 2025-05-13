import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Hero = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleHeroClick = () => {
    navigate("/collection"); // Redirect to the collection page
  };

  return (
    <div
      className="flex flex-col sm:flex-row cursor-pointer transition-transform duration-300" // Removed hover effect
      style={{
        backgroundImage: `url(${assets.hero_bg})`, // Background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={handleHeroClick} // Add onClick event
    >
      {/* Hero Content Grouped Together */}
      <div className="flex flex-col sm:flex-row w-full">
        {/* Hero left */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-[#ffffff]">
            <h1 className="prata-regular text-3xl lg:text-5xl leading-relaxed">
              Latest Merch
            </h1>
            <br />
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-lg">
                \\FROM TURBULENT
              </p>
            </div>
            <hr />
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">
                // Feel The Dynamic...
              </p>
            </div>
          </div>
        </div>

        {/* Hero right */}
        <img
          className="w-full sm:w-1/2" // Added transform effects for hover and active states
          src={assets.hero_img}
          alt="Hero"
        />
      </div>
    </div>
  );
};

export default Hero;
