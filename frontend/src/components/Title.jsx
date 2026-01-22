import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-light mb-0">
        {text1}
      </p>
      <h2 className="text-xl sm:text-2xl tracking-[0.15em] uppercase text-black font-semibold">
        {text2}
      </h2>
    </div>
  );
};

export default Title;
