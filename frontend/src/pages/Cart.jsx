import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
    window.scrollTo(0, 0);
  }, [cartItems, products]);

  const handleCheckout = () => {
    for (const item of cartData) {
      const productData = products.find((product) => product._id === item._id);
      const selectedSize = productData.sizes.find((sizeItem) => sizeItem.size === item.size);

      if (selectedSize && item.quantity > selectedSize.count) {
        setModalMessage(`Insufficient stock for size ${item.size}. Only ${selectedSize.count} left!`);
        setShowModal(true);
        return;
      }
    }
    navigate("/place-order");
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-0">
      <div className="text-2xl mb-6">
        <Title text1={"STEP 1: "} text2={"CHECK YOUR CART"} />
      </div>

      <div className="space-y-4">
        {cartData.map((item) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div
              key={`${item._id}-${item.size}`}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_1fr] items-center gap-4"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{productData.name}</h3>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="px-2 sm:px-3 py-1 border bg-slate-50 text-xs sm:text-sm">Size: {item.size}</p>
                    <p className="text-sm font-semibold">{currency} {productData.price}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className="border max-w-[60px] sm:max-w-[80px] px-2 py-1 text-center rounded focus:ring-1 focus:ring-black outline-none"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  src={assets.bin_icon}
                  alt="Remove item"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-10">
        <div className="w-full sm:w-[450px]">
          <CartTotal step="2" />

          {/* Button Container */}
          <div className="flex flex-col gap-3 mt-8">
            {/* Primary Action: Checkout */}
            {getCartAmount() > 0 && (
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white text-sm py-4 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
              >
                NEXT STEP TO CHECKOUT
              </button>
            )}

            {/* Secondary Action: Back (Different Color & Moved Below) */}
            <button
              onClick={() => navigate("/collection")}
              className="w-full bg-gray-100 text-gray-600 text-sm py-3 rounded-xl font-semibold hover:bg-gray-200 hover:text-black transition-all"
            >
              ← BACK TO SHOPPING
            </button>
          </div>
        </div>
      </div>

      {/* Modern Modal Design */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-red-600 mb-3">Stock Warning</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
