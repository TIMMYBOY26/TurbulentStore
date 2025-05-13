import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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

    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"STEP 1: "} text2={"CHECK YOUR CART"} />
      </div>

      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              key={item._id} // Use item._id as the key
              className="py-4 border-t border-b text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_1fr] items-center gap-4"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-12 h-12 sm:w-16 sm:h-16" // Smaller size for mobile
                />
                <div className="flex flex-col">
                  <h3 className="text-lg">{productData.name}</h3>
                  <p className="text-sm">Size: {item.size}</p>
                  <p className="text-sm">
                    Price: {currency} {productData.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-end">
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          item._id,
                          item.size,
                          Number(e.target.value)
                        )
                  }
                  className="border max-w-[60px] sm:max-w-[80px] px-1 sm:px-2 py-1 text-center"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ml-2"
                  src={assets.bin_icon}
                  alt="Remove item"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Display CartTotal and buttons */}
      <div className="flex justify-end my-10">
        <div className="w-full sm:w-[450px] text-end">
          <CartTotal step="2" />

          <div className="flex flex-col sm:flex-row justify-between mt-4">
            <button
              onClick={() => navigate("/collection")}
              className="bg-black text-white text-sm my-2 sm:my-0 px-8 py-3 rounded hover:bg-gray-800 transition"
            >
              BACK
            </button>
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-2 sm:my-0 px-8 py-3 rounded hover:bg-gray-800 transition"
            >
              NEXT STEP TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
