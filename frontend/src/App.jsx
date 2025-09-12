import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Order";
import SongsPage from "./pages/SongsPage.jsx";
import SongDetailPage from "./pages/SongDetailPage"; // Import the SongDetailPage
import ShowPage from "./pages/ShowPage"; // Import the ShowPage
import ShowDetailPage from "./pages/ShowDetailPage"; // Import the ShowDetailPage
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/songs" element={<SongsPage />} /> {/* Route for songs list */}
        <Route path="/songs/:id" element={<SongDetailPage />} /> {/* Route for song details */}
        <Route path="/shows" element={<ShowPage />} /> {/* Route for shows list */}
        <Route path="/shows/:id" element={<ShowDetailPage />} /> {/* Route for show details */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
