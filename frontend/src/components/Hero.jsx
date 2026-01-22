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
      className="flex flex-col sm:flex-row cursor-pointer transition-transform duration-300 h-[80vh] w-full" // Set width to full
      style={{
        backgroundImage: `url(${assets.Monologue_hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={handleHeroClick}
    >
      {/* Hero Content Grouped Together */}
      <div className="flex flex-col sm:flex-row w-full">
        {/* Hero left */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          {/* Removed all text elements */}
        </div>

        {/* Hero right */}
        {/* Uncomment the following if you want to display an image on the right side */}
        {/* <img
          className="w-full sm:w-1/2" // Added transform effects for hover and active states
          src={assets.hero_img}
          alt="Hero"
        /> */}
      </div>
    </div>
  );
};

export default Hero;
