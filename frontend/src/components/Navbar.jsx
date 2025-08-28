import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      navigate("/collection");
    } else {
      setShowSearch(true);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium px-4">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>

      {/* Navigation links for larger screens */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className={"flex flex-col items-center gap-1"}>
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/songs" className={"flex flex-col items-center gap-1"}>
          <p>RELEASE</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className={"flex flex-col items-center gap-1"}>
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className={"flex flex-col items-center gap-1"}>
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Icons container for small screens and larger */}
      <div className="flex items-center gap-6 ml-4">
        {/* RELEASE icon for small screens */}
        <Link to="/songs" className="sm:hidden">
          <img
            src={assets.music_icon}
            className="w-5 cursor-pointer"
            alt="RELEASE"
          />
        </Link>
        {/* Search icon */}
        <Link to="/collection" onClick={handleSearchClick}>
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />
        </Link>
        {/* Profile icon with dropdown */}
        <div className="group relative" ref={dropdownRef}>
          <img
            onClick={() => {
              if (token) {
                toggleDropdown();
              } else {
                navigate("/login");
              }
            }}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />
          {token && dropdownOpen && (
            <div
              className="absolute dropdown-menu right-0 pt-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => {
                    navigate("/orders");
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  My Order
                </p>
                <p
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Cart icon, only if logged in */}
        {token && (
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
        )}
        {/* Contact icon for small screens */}
        <Link to="/contact" className="sm:hidden">
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer"
            alt="Contact"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;