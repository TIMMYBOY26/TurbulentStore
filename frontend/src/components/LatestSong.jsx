import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";

import { assets } from "../assets/assets"; // 1. Import assets

const LatestSong = () => {
  return (
    /* Changed 'my-2' to 'mt-0' to remove white space at the top */
    <div className="mt-0 mb-10">
      {/* 
          Changed 'py-8' to 'pt-0 pb-8' 
          This removes the top padding gap so it touches your Song Wall image.
      */}
      <div className="text-center pt-6 pb-0 text-3xl">
        <Title text1={""} text2={"LATEST SONG"} />
        {/* 2. Insert the lightwall image */}
        <img
          src={assets.lightwall}
          alt="Light Wall"
          className="w-full h-auto mt-0"
        />
      </div>
    </div>
  );
};

export default LatestSong;
