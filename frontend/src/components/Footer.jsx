import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Footer = () => {
  const { token } = useContext(ShopContext);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-20 border-t border-gray-100 pt-10 pb-8">
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 text-sm">

        {/* Brand Section */}
        <div>
          <p className="text-2xl font-black uppercase tracking-tighter mb-5">
            Turbulent Store
          </p>
        </div>

        {/* Shop Section */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-5 text-black">Shop</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link to="/" onClick={scrollToTop} className="hover:text-black transition">Home</Link></li>
            <li><Link to="/collection" onClick={scrollToTop} className="hover:text-black transition">Collection</Link></li>
            <li><Link to="/contact" onClick={scrollToTop} className="hover:text-black transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Entertainment Section */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-5 text-black">Experience</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link to="/songs" onClick={scrollToTop} className="hover:text-black transition">Songs</Link></li>
            <li><Link to="/shows" onClick={scrollToTop} className="hover:text-black transition">News</Link></li>
          </ul>
        </div>

        {/* Account Section */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-5 text-black">Account</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            {!token ? (
              <li><Link to="/login" onClick={scrollToTop} className="hover:text-black transition">Login / Register</Link></li>
            ) : (
              <>
                <li><Link to="/cart" onClick={scrollToTop} className="hover:text-black transition">My Cart</Link></li>
                <li><Link to="/orders" onClick={scrollToTop} className="hover:text-black transition">My Orders</Link></li>
              </>
            )}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="mt-16 pt-8 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.3em]">
          Copyright 2026 @TurbulentStore.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
