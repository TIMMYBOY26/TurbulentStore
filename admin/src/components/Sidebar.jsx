import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                {/* Show-related buttons */}
                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform duration-200'
                    to='/addshows'
                >
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Shows</p>
                </NavLink>

                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform duration-200'
                    to='/listshows'
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Shows</p>
                </NavLink>

                {/* Song-related buttons */}
                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l bg-gray-300 text-black hover:bg-gray-400 hover:scale-105 transition-transform duration-200'
                    to='/addsongs'
                >
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Songs</p>
                </NavLink>

                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l bg-gray-300 text-black hover:bg-gray-400 hover:scale-105 transition-transform duration-200'
                    to='/listsongs'
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Songs</p>
                </NavLink>

                {/* Other buttons */}
                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
                    to='/add'
                >
                    <img className='w-5 h-5' src={assets.add_icon} alt="" />
                    <p className='hidden md:block'>Add Items</p>
                </NavLink>

                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
                    to='/list'
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>

                <NavLink
                    className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
                    to='/orders'
                >
                    <img className='w-5 h-5' src={assets.order_icon} alt="" />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
            </div>
        </div>
    );
}

export default Sidebar;
