import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
// Modern 2026 Dashboard Icons from Lucide
import {
    LayoutDashboard,
    Music,
    Mic2,
    Package,
    PlusCircle,
    ShoppingCart,
    Users
} from 'lucide-react';

const Sidebar = () => {
    // Shared styling for active and inactive links to maintain 2026 visual hierarchy
    const linkStyle = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ";
    const activeStyle = "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium";
    const inactiveStyle = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

    return (
        <div className='w-[20%] min-h-screen border-r bg-white flex flex-col'>
            {/* Sidebar Branding / Logo Area */}
            <div className='p-6 border-b mb-4'>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Admin Console</p>
            </div>

            <div className='flex flex-col gap-2 px-3 overflow-y-auto'>

                {/* SECTION: E-COMMERCE */}
                <p className='px-4 mt-4 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider'>Store Management</p>

                <NavLink to='/add' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <PlusCircle size={20} />
                    <span className='hidden md:block'>Add Item</span>
                </NavLink>

                <NavLink to='/list' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <Package size={20} />
                    <span className='hidden md:block'>Inventory List</span>
                </NavLink>

                <NavLink to='/orders' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <ShoppingCart size={20} />
                    <span className='hidden md:block'>Customer Orders</span>
                </NavLink>

                {/* SECTION: SHOWS & TOURS */}
                <p className='px-4 mt-6 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider'>Events & Music</p>

                <NavLink to='/addshows' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <Mic2 size={20} className="text-green-500 group-hover:text-green-600" />
                    <span className='hidden md:block'>Add News</span>
                </NavLink>

                <NavLink to='/addsongs' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <Music size={20} />
                    <span className='hidden md:block'>Upload Song</span>
                </NavLink>

                {/* SECTION: SYSTEM */}
                <p className='px-4 mt-6 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider'>System</p>

                <NavLink to='/users' className={({ isActive }) => linkStyle + (isActive ? activeStyle : inactiveStyle)}>
                    <Users size={20} />
                    <span className='hidden md:block'>User Database</span>
                </NavLink>
            </div>

            {/* Bottom Section for Branding or Footer */}
            <div className='mt-auto p-6 border-t'>
                <p className='text-[10px] text-gray-400 text-center'>v2.4.0 Build 2026</p>
            </div>
        </div>
    );
}

export default Sidebar;
