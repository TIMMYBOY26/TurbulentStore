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
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

  const fetchProductData = async () => {
    let found = false;
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        found = true;
        return null;
      }
    });

    // Smoothly end loading once product is found or search completes
    if (found || products.length > 0) {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  // Swipe functionality
  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (startX - endX > 50) handleNextImage();
    else if (endX - startX > 50) handlePrevImage();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.image.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productData.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = () => {
    if (token) {
      addToCart(productData._id, size);
      toast.success("1 item added to cart successfully!");
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
      {/* BRANDED WAVE LOADER - BELOW NAV BAR */}
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
          <style>{`
            @keyframes wave {
              0%, 100% { height: 1.5rem; transform: translateY(0); }
              50% { height: 4rem; transform: translateY(-5px); }
            }
          `}</style>
        </div>
      )}

      {/* PRODUCT PAGE CONTENT */}
      {productData && (
        <div
          className={`pt-10 transition-opacity ease-in duration-1000 relative ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            {/* Product Images */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="sm:hidden flex justify-between w-full">
                <button
                  onClick={handlePrevImage}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  &gt;
                </button>
              </div>

              <div className="hidden sm:flex sm:flex-col overflow-x-auto hide-scrollbar justify-between sm:w-[20%] w-full">
                {productData.image.map((item, index) => (
                  <img
                    onClick={() => setCurrentImageIndex(index)}
                    src={item}
                    key={index}
                    className="w-full h-auto mb-2 flex-shrink-0 cursor-pointer"
                    alt=""
                  />
                ))}
              </div>

              <div
                className="w-full sm:w-[75%] h-[500px] relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {productData.image.map((src, index) => (
                  <img
                    key={index}
                    className={`absolute w-full h-full object-contain transition-transform duration-500 ease-in-out transform ${
                      currentImageIndex === index
                        ? "translate-x-0"
                        : currentImageIndex > index
                        ? "-translate-x-full"
                        : "translate-x-full"
                    }`}
                    src={src}
                    alt=""
                    style={{ zIndex: -1 }}
                  />
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex-1 z-10 relative">
              <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
              <p className="mt-5 text-3xl font-medium">
                {currency}
                {productData.price}
              </p>
              <div className="mt-5 text-gray-500 md:w-4/5">
                {formatDescription(productData.description)}
              </div>

              <div className="flex flex-col gap-4 my-8">
                <p>Select</p>
                <div className="flex gap-2">
                  {productData.sizes.map((item) => (
                    <div key={item.size} className="flex flex-col items-center">
                      <button
                        onClick={() => item.count > 0 && setSize(item.size)}
                        className={`border py-2 px-4 ${
                          item.count === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-100"
                        } ${item.size === size ? "border-blue-500" : ""}`}
                        disabled={item.count === 0}
                      >
                        {item.size}
                      </button>
                      {item.count <= 0 && (
                        <span className="text-sm text-red-500">Sold Out</span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${
                    size === "" ? "cursor-not-allowed opacity-50" : ""
                  }`}
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
    </>
  );
};

export default Product;
