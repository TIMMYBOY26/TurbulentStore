import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";

const Home = () => {
  return (
    <div>
      <LatestCollection />
      <BestSeller />
    </div>
  );
};

export default Home;
