import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import Monologue from "../components/Monologue";

const Home = () => {
  return (
    <div>
      <Monologue />
      <br />
      {/* <Hero /> */}
      <LatestCollection />
      <BestSeller />
    </div>
  );
};

export default Home;
