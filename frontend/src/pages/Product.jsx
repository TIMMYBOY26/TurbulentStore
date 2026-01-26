import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Swipe States
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [showCartNotice, setShowCartNotice] = useState(false);

  const fetchProductData = async () => {
    let found = false;
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        found = true;
        return null;
      }
    });
    if (found || products.length > 0) {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  // Swipe Logic
  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setEndX(e.touches[0].clientX);

  const handleTouchEnd = () => {
    if (!startX || !endX) return;
    const swipeThreshold = 50;
    const distance = startX - endX;
    if (distance > swipeThreshold) handleNextImage();
    else if (distance < -swipeThreshold) handlePrevImage();
    setStartX(0);
    setEndX(0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productData.image.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productData.image.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    if (token) {
      if (!size) {
        toast.error("Please select a size");
        return;
      }
      addToCart(productData._id, size);
      setShowCartNotice(true);
      setTimeout(() => setShowCartNotice(false), 3000);
    } else {
      navigate("/login");
    }
  };

  const formatDescription = (description) => {
    return description.split("-").map((part, index) => (
      <React.Fragment key={index}>
        {part.trim()}
        {index < description.split("-").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* PREMIUM GLASSMORTHISM NOTICE */}
      {showCartNotice && (
        <div className="fixed top-24 right-5 sm:right-10 z-50 animate-toast-in">
          <div className="relative overflow-hidden min-w-[280px] sm:min-w-[320px] bg-white/40 backdrop-blur-2xl border border-white/50 rounded-2xl p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] flex items-center gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-black flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              <p className="text-[10px] font-black tracking-[0.2em] text-black uppercase">
                Success
              </p>
              <p className="text-xs font-semibold text-gray-700">
                1 item added to cart successfully!
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-black animate-progress-shrink" />
          </div>
        </div>
      )}

      {/* BRANDED WAVE LOADER */}
      {isLoading && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_infinite] h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-[wave_1.2s_ease-in-out_0.15s_infinite] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-[wave_1.2s_ease-in-out_0.3s_infinite] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-[wave_1.2s_ease-in-out_0.45s_infinite] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">
            TURBULENT
          </p>
        </div>
      )}

      {productData && (
        <div
          className={`pt-6 transition-opacity ease-in duration-1000 relative ${isLoading ? "opacity-0" : "opacity-100"}`}
        >
          <ToastContainer position="top-right" autoClose={2000} />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 px-4 sm:px-0">
            {/* Image Section */}
            <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
              <div className="hidden sm:flex sm:flex-col overflow-y-auto hide-scrollbar sm:w-[18%] gap-2">
                {productData.image.map((item, index) => (
                  <img
                    onClick={() => setCurrentImageIndex(index)}
                    src={item}
                    key={index}
                    className={`w-full cursor-pointer border rounded-md ${currentImageIndex === index ? "border-black" : "border-transparent"}`}
                    alt=""
                  />
                ))}
              </div>

              <div className="flex flex-col w-full sm:w-[80%] gap-4">
                <div
                  className="w-full aspect-square sm:aspect-auto sm:h-[600px] relative overflow-hidden rounded-xl bg-white shadow-sm"
                  style={{ touchAction: "pan-y" }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {productData.image.map((src, index) => (
                    <img
                      key={index}
                      className={`absolute w-full h-full object-contain p-2 transition-transform duration-500 ease-out transform ${currentImageIndex === index
                          ? "translate-x-0"
                          : currentImageIndex > index
                            ? "-translate-x-full"
                            : "translate-x-full"
                        }`}
                      src={src}
                      alt=""
                    />
                  ))}
                </div>

                {/* DOT INDICATORS - OUTSIDE AND BELOW IMAGE */}
                <div className="flex justify-center gap-2 sm:hidden py-1">
                  {productData.image.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 border border-black
                        ${currentImageIndex === index ? "bg-black w-6" : "bg-white w-2"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 px-1 sm:px-0">
              <h1 className="font-medium text-2xl mt-2 text-black">
                {productData.name}
              </h1>
              <p className="mt-5 text-3xl font-medium text-black">
                {currency}
                {productData.price}
              </p>
              <div className="mt-5 text-gray-500 md:w-4/5 text-sm">
                {formatDescription(productData.description)}
              </div>

              <div className="flex flex-col gap-4 my-8">
                <p className="text-black font-medium">Select product / size</p>
                <div className="flex gap-2">
                  {productData.sizes.map((item) => (
                    <div key={item.size} className="flex flex-col items-center">
                      <button
                        onClick={() => item.count > 0 && setSize(item.size)}
                        /* FIXED LOGIC: Selected = Black Bg + White Text. Unselected = Gray Bg + Black Text */
                        className={`border-2 py-2 px-4 transition-all duration-200 font-bold 
                          ${item.count === 0
                            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                            : item.size === size
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 text-black border-transparent hover:border-black"
                          }`}
                        disabled={item.count === 0}
                      >
                        {item.size}
                      </button>
                      {item.count <= 0 && (
                        <span className="text-sm text-red-500 mt-1 font-bold">
                          Sold Out
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 transition-all font-bold mt-4 ${size === "" ? "cursor-not-allowed opacity-50" : "hover:opacity-90 shadow-lg"}`}
                  disabled={size === ""}
                >
                  {token ? "ADD TO CART" : "LOGIN TO ADD TO CART"}
                </button>
              </div>
            </div>
          </div>

          <RelatedProducts
            category={productData.category}
            currentProductId={productId}
          />
        </div>
      )}

      <style>{`
        @keyframes wave { 0%, 100% { height: 1.5rem; transform: translateY(0); } 50% { height: 4rem; transform: translateY(-5px); } }
        @keyframes toast-in { 0% { transform: translateX(120%) scale(0.9); opacity: 0; } 60% { transform: translateX(-10px) scale(1.02); } 100% { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }
        .animate-toast-in { animation: toast-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-progress-shrink { animation: progress-shrink 3s linear forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default Product;
