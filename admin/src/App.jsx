import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import AddSong from './pages/Addsong';
import ListSong from './pages/Listsong';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import AddShows from './pages/AddShows'; // 新增演出頁面
import ListShows from './pages/ListShows'; // 列出演出頁面

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Store token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/addsongs' element={<AddSong token={token} />} />
                <Route path='/listsongs' element={<ListSong token={token} />} />

                {/* 新增的演出管理路由 */}
                <Route path='/addshows' element={<AddShows token={token} />} />
                <Route path='/listshows' element={<ListShows token={token} />} />
              </Routes>
            </div>
          </div>
        </>}
    </div>
  );
};

export default App;
