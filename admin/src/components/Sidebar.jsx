import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  Music,
  Mic2,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
  List, // Added List icon for the Show List
} from "lucide-react";

const Sidebar = () => {
  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group mx-2 ";
  const activeStyle =
    "bg-blue-600 text-white shadow-lg shadow-blue-200 font-medium";
  const inactiveStyle = "text-gray-500 hover:bg-gray-50 hover:text-blue-600";

  return (
    <div className="w-[70px] md:w-[20%] min-w-[70px] md:min-w-[240px] min-h-screen border-r bg-white flex flex-col transition-all duration-300 sticky top-0">
      <div className="p-4 md:p-6 border-b mb-4 flex justify-center md:justify-start">
        <p className="text-[10px] font-bold text-blue-600 md:text-gray-400 uppercase tracking-widest">
          <span className="md:hidden">AD</span>
          <span className="hidden md:block">Admin Console</span>
        </p>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        {/* SECTION: STORE */}
        <p className="hidden md:block px-6 mt-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Store
        </p>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <PlusCircle size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Add Product</span>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <Package size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">
            Inventory List
          </span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <ShoppingCart size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Orders</span>
        </NavLink>

        {/* SECTION: MEDIA */}
        <div className="my-2 border-t md:border-none mx-4 md:mx-0" />
        <p className="hidden md:block px-6 mt-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Media
        </p>

        <NavLink
          to="/addshows"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <Mic2 size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Add News</span>
        </NavLink>

        {/* --- NEW LINK ADDED HERE --- */}
        <NavLink
          to="/listshows"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <List size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Show List</span>
        </NavLink>

        <NavLink
          to="/addsongs"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <Music size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Upload Song</span>
        </NavLink>

        {/* SECTION: SYSTEM */}
        <div className="my-2 border-t md:border-none mx-4 md:mx-0" />
        <p className="hidden md:block px-6 mt-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          System
        </p>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            linkStyle + (isActive ? activeStyle : inactiveStyle)
          }
        >
          <Users size={22} className="shrink-0" />
          <span className="hidden md:block whitespace-nowrap">Users</span>
        </NavLink>
      </div>

      <div className="mt-auto p-4 border-t">
        <p className="text-[8px] md:text-[10px] text-gray-400 text-center font-mono">
          v2.4.0-26
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
