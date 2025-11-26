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
      className="relative overflow-hidden cursor-pointer"
      onClick={handleHeroClick}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="w-full h-auto max-h-[60vh] object-contain"
      >
        <source src={assets.sampleWebVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Hero;
