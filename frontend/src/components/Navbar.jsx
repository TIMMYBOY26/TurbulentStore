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
  const location = useLocation(); // Get the current route
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const dropdownRef = useRef(null); // Reference for the dropdown

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const handleSearchClick = () => {
    if (location.pathname === "/") {
      navigate("/collection"); // Redirect to collection page if on home page
    } else {
      setShowSearch(true); // Show search functionality for other pages
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const closeDropdown = (e) => {
    // Check if the click is outside the dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false); // Close dropdown if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown); // Add event listener
    return () => {
      document.removeEventListener("mousedown", closeDropdown); // Cleanup
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Logo" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className={"flex flex-col items-center gap-1"}>
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/songs" className={"flex flex-col items-center gap-1"}>
          <p>MUSIC</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink
          to="/collection"
          className={"flex flex-col items-center gap-1"}
        >
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/shows" className={"flex flex-col items-center gap-1"}>
          <p>SHOWS</p> {/* New link for Shows */}
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/contact" className={"flex flex-col items-center gap-1"}>
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        {/* RELEASE Button for small screens */}
        <Link to="/songs" className="sm:hidden">
          <img
            src={assets.music_icon} // Using the specified icon for the RELEASE button
            className="w-5 cursor-pointer"
            alt="RELEASE"
          />
        </Link>
        {/* New Shows button for small screens */}
        <Link to="/shows" className="sm:hidden">
          <img
            src={assets.calender_icon} // Using the specified icon for the SHOWS button
            className="w-5 cursor-pointer"
            alt="Shows"
          />
        </Link>
        <Link to="/collection">
          <img
            onClick={handleSearchClick}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />
        </Link>
        <div className="group relative" ref={dropdownRef}>
          <img
            onClick={() => {
              if (token) {
                toggleDropdown(); // Toggle dropdown if logged in
              } else {
                navigate("/login"); // Redirect to login if not logged in
              }
            }} // Handle click based on authentication status
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />
          {/* Dropdown menu */}
          {token && dropdownOpen && (
            <div
              className="absolute dropdown-menu right-0 pt-4 z-50" // Ensure z-index is high
              onClick={(e) => e.stopPropagation()} // Prevent click propagation
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => {
                    navigate("/orders");
                    setDropdownOpen(false); // Close dropdown after navigating
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  My Order
                </p>
                <p
                  onClick={() => {
                    logout();
                    setDropdownOpen(false); // Close dropdown after logout
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Conditionally render the cart icon */}
        {token && (
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
        )}
        {/* Contact Us button logo for small screens */}
        <Link to="/contact" className="sm:hidden">
          <img
            src={assets.menu_icon} // Replace with the actual contact icon path
            className="w-5 cursor-pointer"
            alt=""
          />
        </Link>

      </div>
    </div>
  );
};

export default Navbar;
