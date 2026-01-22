import React from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import LatestSong from "../components/LatestSong";

const Home = () => {
  return (
    <div>
      <LatestSong />
      <LatestCollection />
      <BestSeller />
    </div>
  );
};

export default Home;
