import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Order";
import SongsPage from "./pages/SongsPage.jsx";
import SongDetailPage from "./pages/SongDetailPage";
import ShowPage from "./pages/ShowPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import Hero from "./components/Hero";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  // --- AD POPUP STATE (FOR HOME PAGE) ---
  // 當頁面重新整理時會重置為 false，但在分頁切換時會保持 true
  const [hasSeenAd, setHasSeenAd] = useState(false);

  // --- GLOBAL PREMIUM NOTIFICATION STATE ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const triggerGlobalSuccess = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="relative">
      <ToastContainer />

      {/* PREMIUM SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[100] animate-toast-in">
          <div className="relative overflow-hidden min-w-[280px] sm:min-w-[340px] bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <p className="text-black font-black text-[10px] uppercase tracking-[0.3em]">
                Success
              </p>
              <p className="text-gray-700 text-sm font-medium">{successMsg}</p>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-black animate-progress-shrink" />
          </div>

          <style>{`
            @keyframes toast-in {
              0% { transform: translateX(100%) scale(0.9); opacity: 0; }
              70% { transform: translateX(-10px) scale(1.05); }
              100% { transform: translateX(0) scale(1); opacity: 1; }
            }
            @keyframes progress-shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
            .animate-toast-in { 
              animation: toast-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
            }
            .animate-progress-shrink { 
              animation: progress-shrink 3s linear forwards; 
            }
          `}</style>
        </div>
      )}

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
        <SearchBar />
      </div>

      {location.pathname === "/" && <Hero />}

      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          {/* 傳遞廣告狀態與設定函式給 Home 組件 */}
          <Route
            path="/"
            element={<Home hasSeenAd={hasSeenAd} setHasSeenAd={setHasSeenAd} />}
          />

          <Route path="/collection" element={<Collection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/login"
            element={<Login triggerGlobalSuccess={triggerGlobalSuccess} />}
          />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/shows" element={<ShowPage />} />
          <Route path="/shows/:id" element={<ShowDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
