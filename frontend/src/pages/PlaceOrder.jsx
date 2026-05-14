import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- 彈窗組件：確認下單 ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-4">
            <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">確認訂單</h2>
          <p className="text-gray-500 font-medium">您確定要提交此訂單嗎？</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all" onClick={onClose}>取消</button>
          <button className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all" onClick={onConfirm}>確認</button>
        </div>
      </div>
    </div>
  );
};

// --- 彈窗組件：成功提示 ---
const SuccessOrderModal = ({ isOpen, onDirectRedirect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-2 border-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">訂單已收到！</h2>
        <p className="text-gray-500 mb-6">感謝您的購買，我們會盡快處理您的訂單。</p>
        <button onClick={onDirectRedirect} className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg">查看我的訂單</button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("payme");
  const [deliveryType, setDeliveryType] = useState("sf");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 確保 address 有初始空字串，防止 JSON.stringify 遇到 undefined
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    address: ""
  });
  const [receiptImage, setReceiptImage] = useState(null);

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 付款選項組件 ---
  const PaymentOption = ({ id, label, qr, instructions, isCash }) => (
    <div
      onClick={(e) => { e.stopPropagation(); setMethod(id); }}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${method === id ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200 bg-white"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === id ? "border-black" : "border-gray-300"}`}>
          {method === id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
        </div>
        <span className={`font-semibold ${method === id ? "text-black" : "text-gray-500"}`}>{label}</span>
      </div>
      {method === id && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {qr && <img src={qr} className="w-32 h-32 mx-auto rounded-xl border shadow-sm" alt="QR Code" />}
          {isCash ? (
            <p className="text-purple-600 font-bold italic text-center">下單後將聯絡您確認面交時間與地點</p>
          ) : (
            <div className="space-y-2">
              {instructions}
              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 bg-white transition-colors">
                {receiptImage ? (
                  <p className="text-xs text-green-600 font-bold">✓ 已選擇收據: {receiptImage.name.slice(0, 15)}...</p>
                ) : (
                  <p className="text-[11px] uppercase font-bold tracking-tighter text-gray-400">點擊上傳付款截圖 (Receipt)</p>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setReceiptImage(e.target.files[0])} />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handleConfirmOrder = async () => {
    setIsModalOpen(false);
    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = products.find((p) => p._id === itemId);
            if (itemInfo) {
              orderItems.push({
                ...itemInfo,
                size,
                quantity: cartItems[itemId][size],
              });
            }
          }
        }
      }

      // --- 地址與數據處理 (修復 undefined 關鍵點) ---
      const finalAddress = deliveryType === "manual"
        ? "In-Person (面交)"
        : (formData.address || "No Address Provided");

      const addressData = {
        firstName: formData.firstName || "Customer",
        phone: formData.phone || "00000000",
        address: finalAddress
      };

      const data = new FormData();
      data.append("address", JSON.stringify(addressData));
      data.append("items", JSON.stringify(orderItems));

      const totalAmount = Number(getCartAmount()) + (deliveryType === "sf" ? Number(delivery_fee) : 0);
      data.append("amount", totalAmount);

      if (receiptImage) {
        data.append("image", receiptImage);
      }

      // 路由映射
      const methodMap = {
        cod: "/api/order/place",
        payme: "/api/order/payme",
        fps: "/api/order/fps",
        paymeTradeIn: "/api/order/tradeInPersonPlaceOrderPayme",
        fpsTradeIn: "/api/order/tradeInPersonPlaceOrderFps",
      };

      const response = await axios.post(backendUrl + methodMap[method], data, { headers: { token } });

      if (response.data.success) {
        setCartItems({});
        setIsSuccessModalOpen(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "訂單提交失敗");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-20">
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmOrder} />
      <SuccessOrderModal isOpen={isSuccessModalOpen} onDirectRedirect={() => navigate("/orders")} />

      <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col lg:flex-row gap-12">

        {/* 左側：表單資訊 */}
        <div className="flex-1 space-y-10">
          <section>
            <Title text1={"步驟 1:"} text2={"個人資訊"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="w-full border-gray-200 border rounded-xl py-3 px-4 outline-none bg-gray-50 focus:border-black transition-all" placeholder="收貨人姓名" />
              <input required name="phone" value={formData.phone} onChange={onChangeHandler} className="w-full border-gray-200 border rounded-xl py-3 px-4 outline-none bg-gray-50 focus:border-black transition-all" placeholder="電話號碼" maxLength={8} />
              {deliveryType === "sf" && (
                <textarea required name="address" value={formData.address} onChange={onChangeHandler} className="w-full border-gray-200 border rounded-xl py-3 px-4 outline-none bg-gray-50 sm:col-span-2 focus:border-black transition-all animate-in fade-in duration-300" placeholder="順豐站/智能櫃代碼 或 收貨地址" rows="2" />
              )}
            </div>
          </section>

          <section>
            <Title text1={"步驟 2:"} text2={"配送與付款方式"} />
            <div className="mt-6 border border-gray-200 rounded-[2rem] overflow-hidden bg-white shadow-sm">

              {/* 順豐選項 */}
              <div className={`transition-all duration-300 ${deliveryType === "sf" ? "bg-blue-50/20" : "hover:bg-gray-50"}`} onClick={() => { setDeliveryType("sf"); setMethod("payme"); }}>
                <div className="p-6 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === "sf" ? "border-blue-600" : "border-gray-300"}`}>
                      {deliveryType === "sf" && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                    </div>
                    <span className={`font-bold text-lg ${deliveryType === "sf" ? "text-blue-700" : "text-gray-700"}`}>順豐快遞 (本地運費到付)</span>
                  </div>
                </div>
                {deliveryType === "sf" && (
                  <div className="px-6 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <PaymentOption id="payme" label="PayMe" qr={assets.paymeCode} instructions={<p>1. 掃描下方 QR Code 付款</p>} />
                    <PaymentOption id="fps" label="轉數快 (FPS)" qr={assets.fpsCode} instructions={<p>1. FPS ID: 2394658</p>} />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mx-6"></div>

              {/* 面交選項 */}
              <div className={`transition-all duration-300 ${deliveryType === "manual" ? "bg-purple-50/20" : "hover:bg-gray-50"}`} onClick={() => { setDeliveryType("manual"); setMethod("paymeTradeIn"); }}>
                <div className="p-6 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === "manual" ? "border-purple-600" : "border-gray-300"}`}>
                      {deliveryType === "manual" && <div className="w-3 h-3 bg-purple-600 rounded-full" />}
                    </div>
                    <span className={`font-bold text-lg ${deliveryType === "manual" ? "text-purple-700" : "text-gray-700"}`}>當面交收 (Trade-in Person)</span>
                  </div>
                </div>
                {deliveryType === "manual" && (
                  <div className="px-6 pb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <PaymentOption id="paymeTradeIn" label="PayMe (面交預付)" qr={assets.paymeCode} />
                    <PaymentOption id="fpsTradeIn" label="FPS (面交預付)" qr={assets.fpsCode} />
                    <PaymentOption id="cod" label="面交現付 (Cash on Delivery)" isCash={true} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 右側：結算資訊 */}
        <div className="lg:w-[380px]">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-8 sticky top-10 text-center">
            <CartTotal step="3" selectedMethod={method} />
            <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xl mt-8 hover:bg-gray-800 transition-all shadow-lg active:scale-95 transition-transform">
              確認下單
            </button>
            <p className="text-gray-400 text-xs mt-4">點擊即代表同意本商店之服務條款</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;