import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { ShopContext } from "../context/ShopContext"; // Import ShopContext

const Footer = () => {
  const { token } = useContext(ShopContext); // Access token from context

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fe_1fr_1fr] gap-14 my-2 mt-10 text-sm">
        <div>
          <p className="text-xl font-medium mb-5">Turbulent Store</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact Us</Link>
            </li>
            {!token && ( // Conditionally render Orders link
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
            )}
            {token && ( // Conditionally render Orders link
              <li>
                <Link to="/orders" className="hover:underline">Orders</Link>
              </li>
            )}
          </ul>
        </div>
        <hr />
        <p className="py-0 text-sm text-center">
          Copyright 2025 @TurbulentStore.com - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
