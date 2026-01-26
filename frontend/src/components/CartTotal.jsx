import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ step, selectedMethod }) => {
  const { currency, getCartAmount } = useContext(ShopContext);
  const totalAmount = getCartAmount();

  const formatMethodName = (method) => {
    const names = {
      payme: "SF Express by PayMe",
      fps: "SF Express by FPS",
      cod: "In-Person by Cash",
      paymeTradeIn: "In-Person by PayMe",
      fpsTradeIn: "In-Person by FPS"
    };
    return names[method] || "Selected Method";
  };

  return (
    <div className="w-full">
      <div className="mb-5 text-left">
        <Title text1={`STEP ${step}: `} text2={"CHECK TOTAL"} />
      </div>

      <div className="flex flex-col mt-4">
        {/* Payment Confirmation Section */}
        {selectedMethod && (
          <>
            <div className="flex items-center justify-between py-2 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</span>
              </div>
              <span className="text-sm font-bold text-gray-800 italic">
                {formatMethodName(selectedMethod)}
              </span>
            </div>

            {/* The Divider Line */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
          </>
        )}

        {/* Total Display - Minimalist Style */}
        <div className="flex justify-between items-center py-2">
          <b className="text-gray-900 text-lg font-medium tracking-tight">Total Amount</b>
          <div className="text-right">
            <b className="text-3xl font-black text-gray-900 tracking-tighter">
              <span className="text-sm font-medium text-gray-400 mr-1">{currency}</span>
              {totalAmount === 0 ? "0.00" : totalAmount.toLocaleString()}
            </b>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartTotal;
