import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fe_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <p className="text-xl font-mediumo mb-5">Tubulent Store</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
          </ul>
        </div>

        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ TurbulentStore.com - ALl Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
