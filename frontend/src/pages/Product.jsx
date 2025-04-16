import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { ToastContainer, toast } from 'react-toastify'; // Import toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const navigate = useNavigate(); // Use navigate for redirection

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

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
      toast.success("1 item added to cart successfully!"); // Show success toast
    } else {
      // Redirect to login page if not logged in
      navigate("/login");
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Arrow Buttons for Small Screens */}
          <div className="sm:hidden flex justify-between w-full">
            <button
              onClick={handlePrevImage}
              className="bg-gray-200 p-2 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              &lt; {/* Left Arrow */}
            </button>
            <button
              onClick={handleNextImage}
              className="bg-gray-200 p-2 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              &gt; {/* Right Arrow */}
            </button>
          </div>

          {/* Small Images for Larger Screens */}
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

          {/* Large Image with Sliding Effect */}
          <div className="w-full sm:w-[75%] h-[500px] relative overflow-hidden">
            {productData.image.map((src, index) => (
              <img
                key={index}
                className={`absolute w-full h-full object-contain transition-transform duration-500 ease-in-out transform ${currentImageIndex === index
                  ? 'translate-x-0'
                  : currentImageIndex > index
                    ? '-translate-x-full'
                    : 'translate-x-full'
                  }`}
                src={src}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item) => (
                <div key={item.size} className="flex flex-col items-center">
                  <button
                    onClick={() => item.count > 0 && setSize(item.size)}
                    className={`border py-2 px-4 ${item.count === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100"} ${item.size === size ? "border-blue-500" : ""}`}
                    disabled={item.count === 0}
                  >
                    {item.size}
                  </button>
                  {item.count <= 0 && (
                    <span className="text-sm text-red-500">Sold Out</span>
                  )}
                  {item.count > 0 && (
                    <span className="text-sm text-gray-500">{item.count} available</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${size === "" ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={size === ""}
            >
              {token ? "ADD TO CART" : "LOGIN TO ADD TO CART"}
            </button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>Original product.</p>
              <p>Cash on delivery is available on this product.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Display related products */}
      <RelatedProducts category={productData.category} currentProductId={productId} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
