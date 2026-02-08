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

  const [isZoomed, setIsZoomed] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [showCartNotice, setShowCartNotice] = useState(false);

  const isUpcomingProduct = productId === "69876c55266afcf9ab41b2ae";

  // 鍵盤支援：按 ESC 關閉燈箱
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsZoomed(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const fetchProductData = async () => {
    let found = products.find((item) => item._id === productId);
    if (found) {
      setProductData(found);
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId, products]);

  useEffect(() => {
    document.body.style.overflow = isZoomed ? 'hidden' : 'auto';
  }, [isZoomed]);

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
    setCurrentImageIndex((prev) => (prev === 0 ? productData.image.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productData.image.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (isUpcomingProduct) return;
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
    if (!description) return "";
    return description.split("-").map((part, index, array) => (
      <React.Fragment key={index}>
        {part.trim()}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* LOADER */}
      {isLoading && (
        <div className="fixed top-[80px] bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-white">
          <div className="flex items-end gap-2 h-16">
            <div className="w-2.5 bg-[#003366] rounded-full animate-wave h-6"></div>
            <div className="w-2.5 bg-[#ADD8E6] rounded-full animate-wave [animation-delay:0.15s] h-10"></div>
            <div className="w-2.5 bg-black rounded-full animate-wave [animation-delay:0.3s] h-14"></div>
            <div className="w-2.5 bg-white border-2 border-gray-200 rounded-full animate-wave [animation-delay:0.45s] h-10"></div>
            <div className="w-2.5 bg-[#003366] rounded-full animate-wave [animation-delay:0.6s] h-6"></div>
          </div>
          <p className="mt-10 text-[10px] font-black tracking-[0.6em] text-black uppercase animate-pulse">TURBULENT</p>
        </div>
      )}

      {/* SUCCESS NOTICE */}
      {showCartNotice && (
        <div className="fixed top-24 right-5 sm:right-10 z-50 animate-toast-in">
          <div className="relative overflow-hidden min-w-[280px] bg-white/40 backdrop-blur-2xl border rounded-2xl p-5 shadow-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white">✓</div>
            <div><p className="text-[10px] font-black uppercase">Success</p><p className="text-xs font-semibold">Added to cart!</p></div>
            <div className="absolute bottom-0 left-0 h-1 bg-black animate-progress-shrink" />
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {isZoomed && productData && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-2xl animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-6 right-6 z-[110] p-3 bg-black text-white rounded-full">✕</button>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img 
              src={productData.image[currentImageIndex]} 
              className="max-w-full max-h-[90vh] object-contain animate-in zoom-in-95" 
              alt="Zoomed product"
              onClick={(e) => e.stopPropagation()} // 防止點擊圖片時關閉
            />
          </div>
        </div>
      )}

      {/* MAIN UI */}
      {productData && (
        <div className={`pt-2 sm:pt-6 transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}>
          <ToastContainer position="top-right" autoClose={2000} />
          
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 px-4 sm:px-0">
            
            {/* IMAGE SECTION */}
            <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
              <div className="hidden sm:flex sm:flex-col overflow-y-auto sm:w-[18%] gap-2">
                {productData.image.map((item, index) => (
                  <img 
                    onClick={() => setCurrentImageIndex(index)} 
                    src={item} 
                    key={index} 
                    className={`w-full cursor-pointer border rounded-md transition-all ${currentImageIndex === index ? "border-black opacity-100" : "opacity-50 border-transparent hover:opacity-80"}`} 
                    alt=""
                  />
                ))}
              </div>

              <div className="w-full sm:w-[82%] flex flex-col">
                <div className="relative overflow-hidden rounded-xl bg-white aspect-[3/4]">
                  {/* Mobile Swipe Wrapper */}
                  <div 
                    className="flex flex-nowrap transition-transform duration-500 ease-out sm:hidden h-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                  >
                    {productData.image.map((img, idx) => (
                      <div key={idx} className="w-full min-w-full flex-shrink-0 flex items-center justify-center">
                        <img src={img} onClick={() => setIsZoomed(true)} className="w-full h-full object-contain" alt=""/>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Display */}
                  <div className="hidden sm:block w-full h-full">
                    <img 
                      key={currentImageIndex}
                      src={productData.image[currentImageIndex]} 
                      onClick={() => setIsZoomed(true)} 
                      className="w-full h-full object-contain cursor-zoom-in animate-in fade-in duration-300" 
                      alt=""
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-2 sm:hidden">
                  {productData.image.map((_, idx) => (
                    <div key={idx} className={`h-1 transition-all duration-300 rounded-full ${currentImageIndex === idx ? "w-6 bg-black" : "w-1.5 bg-gray-300"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* INFO SECTION */}
            <div className="flex-1 px-1 sm:px-0">
              <h1 className="font-medium text-2xl mt-2 uppercase tracking-tight">{productData.name}</h1>
              {Number(productData.price) > 0 && <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>}
              <div className="mt-5 text-gray-500 text-sm leading-relaxed">{formatDescription(productData.description)}</div>

              <div className="flex flex-col gap-4 my-8">
                {productData.category !== "Tickets" ? (
                  <>
                    <p className="text-black font-bold text-xs uppercase tracking-widest">* Select Size</p>
                    <div className="flex gap-2">
                      {productData.sizes.map((item) => (
                        <button key={item.size} disabled={item.count === 0 || isUpcomingProduct} onClick={() => setSize(item.size)}
                          className={`border-2 py-3 px-5 font-bold text-xs transition-colors ${item.size === size ? "bg-black text-white" : "bg-white"} ${(item.count === 0 || isUpcomingProduct) && "opacity-30 cursor-not-allowed"}`}>
                          {item.size}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleAddToCart} className="bg-black text-white px-8 py-4 text-xs font-black tracking-[0.2em] mt-4 uppercase hover:bg-gray-900 transition-colors">
                      {isUpcomingProduct ? "Coming Soon" : token ? "Add to Bag" : "Login to Add"}
                    </button>
                  </>
                ) : (
                  /* TICKET BUTTON LOGIC */
                  <div className="mt-4 py-6 border-t flex flex-col gap-4">
                    <button 
                      onClick={() => productData.isTicketAvailable && window.open(productData.externalLink || 'https://www.offgrid.day/', '_blank')}
                      disabled={!productData.isTicketAvailable}
                      className={`px-8 py-4 text-xs font-black tracking-[0.2em] uppercase shadow-lg text-center transition-all duration-300
                        ${productData.isTicketAvailable 
                          ? "bg-black text-white cursor-pointer hover:bg-gray-800 active:scale-[0.98]" 
                          : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        }`}
                    >
                      {productData.isTicketAvailable ? "GET TICKETS NOW" : "TICKETS COMING SOON"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <RelatedProducts category={productData.category} currentProductId={productId} />
        </div>
      )}

      <style>{`
        @keyframes wave { 0%, 100% { height: 1.5rem; transform: translateY(0); } 50% { height: 4rem; transform: translateY(-5px); } }
        @keyframes toast-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }
        .animate-wave { animation: wave 1.2s ease-in-out infinite; }
        .animate-toast-in { animation: toast-in 0.5s ease-out forwards; }
        .animate-progress-shrink { animation: progress-shrink 3s linear forwards; }
      `}</style>
    </>
  );
};

export default Product;
