import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const location = useLocation(); // Get the current route

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const handleSearchClick = () => {
    console.log("Search icon clicked, current path:", location.pathname);
    if (location.pathname === "/") {
      navigate("/collection"); // Redirect to collection page if on home page
    } else if (location.pathname === "/login") {
      navigate("/collection"); // Redirect to collection page if on login page

    } else if (location.pathname === "/contact") {
      navigate("/collection"); // Redirect to collection page if on login page
    } else {
      setShowSearch(true); // Show search functionality for other pages
    }
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className={"flex flex-col items-center gap-1"}>
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/collection" className={"flex flex-col items-center gap-1"}>
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/contact" className={"flex flex-col items-center gap-1"}>
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <Link to="/collection"><img onClick={handleSearchClick} src={assets.search_icon} className="w-5 cursor-pointer" alt="" /></Link>
        <div className="group relative">
          <img onClick={() => (token ? null : navigate("login/"))} className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
          {/* Dropdown menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p onClick={() => navigate("/orders")} className="curser-pointer hover:text-black">Orders</p>
                <p onClick={logout} className="curser-pointer hover:text-black">Logout</p>
              </div>
            </div>
          )}
        </div>
        {/* Conditionally render the cart icon */}
        {token && (
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
        )}
        <img onClick={toggleDropdown} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="" />
      </div>
      {/* Sidebar menu for small screen */}
      {location.pathname !== "/login" && (
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
          <div className="flex flex-col text-gray-600">
            <div onClick={toggleDropdown} className="flex items-center gap-4 p-3 cursor-pointer">
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
              <p>Back</p>
            </div>
            <NavLink onClick={toggleDropdown} className="py-2 pl-6 border" to="/">HOME</NavLink>
            <NavLink onClick={toggleDropdown} className="py-2 pl-6 border" to="/collection">COLLECTION</NavLink>
            <NavLink onClick={toggleDropdown} className="py-2 pl-6 border" to="/contact">CONTACT</NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;