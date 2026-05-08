import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- 1. Confirm Order Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-4">
            <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Order</h2>
          <p className="text-gray-500 font-medium">Are you sure you want to place this order?</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all" onClick={onClose}>Cancel</button>
          <button className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// --- 2. No Receipt Warning Modal ---
const PendingReceiptModal = ({ isOpen, onCancel, onProceed }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-amber-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-amber-50 mb-4">
            <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Receipt Attached</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            You can place the order now and upload the receipt later in <b>"My Orders"</b>. We will process your order once payment is verified.
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <button className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all" onClick={onProceed}>Place Order Anyway</button>
          <button className="w-full py-3 text-gray-500 font-medium hover:underline transition-all" onClick={onCancel}>Go Back to Upload</button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Success Modal ---
const SuccessOrderModal = ({ isOpen, onDirectRedirect, hasTicket, receiptUploaded }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-2 border-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Received!</h2>
        <div className="mb-8 px-2 space-y-3 text-sm leading-relaxed">
          {receiptUploaded ? (
            <div className="bg-green-50 p-4 rounded-2xl">
              <p className="text-green-700 font-bold">Receipt Uploaded ✓</p>
              <p className="text-xs text-green-600 mt-1">We will verify your order soon. Check "My Orders" for updates.</p>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-blue-700 font-bold">Pending Payment Proof</p>
              <p className="text-xs text-blue-600 mt-1">Please upload your payment screenshot in "My Orders" to complete.</p>
            </div>
          )}
          {hasTicket && (
            <p className="text-gray-400 italic text-xs">※ Ticket info will be sent to your phone after verification.</p>
          )}
        </div>
        <button onClick={onDirectRedirect} className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all uppercase shadow-lg active:scale-[0.98]">Check My Orders</button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("payme");
  const [deliveryType, setDeliveryType] = useState("sf");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", phone: "" });
  const [receiptImage, setReceiptImage] = useState(null);

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const onChangeHandler = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (method !== 'cod' && !receiptImage) {
      setIsPendingModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmOrder = async () => {
    setIsModalOpen(false);
    setIsPendingModalOpen(false);
    try {
      let orderItems = [];
      let containsTicket = false;
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = products.find((p) => p._id === itemId);
            if (itemInfo) {
              orderItems.push({ name: itemInfo.name, productId: itemInfo._id, size, quantity: cartItems[itemId][size] });
              if (itemInfo.category === "Tickets") containsTicket = true;
            }
          }
        }
      }
      setHasTicket(containsTicket);
      const data = new FormData();
      data.append("address", JSON.stringify(formData));
      data.append("items", JSON.stringify(orderItems));
      data.append("amount", getCartAmount() + delivery_fee);
      if (receiptImage) data.append("image", receiptImage);

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
      toast.error(error.message);
    }
  };

  const PaymentOption = ({ id, label, qr, instructions, isTradeIn, isCash }) => (
    <div onClick={(e) => { e.stopPropagation(); setMethod(id); }} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${method === id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === id ? "border-black" : "border-gray-300"}`}>
          {method === id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
        </div>
        <span className="font-semibold">{label}</span>
      </div>
      {method === id && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-3">
          {qr && <img src={qr} className="w-32 h-32 mx-auto rounded-lg border shadow-sm" alt="QR" />}
          {isCash ? (
            <p className="text-purple-600 font-bold italic">Meetup details after order confirmation</p>
          ) : (
            <>
              {instructions}
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors bg-white">
                  {receiptImage ? (
                    <div className="flex flex-col items-center text-center">
                      <img src={URL.createObjectURL(receiptImage)} className="h-20 mb-2 rounded shadow-sm" alt="Preview" />
                      <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Receipt Selected ✓</p>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <svg className="w-6 h-6 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Upload Receipt (Optional)</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setReceiptImage(e.target.files[0])} />
                </label>
              </div>
              <p className="font-bold italic text-[11px] text-blue-600">
                ※ If not uploaded now, please submit via "My Orders" later.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-20">
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmOrder} />
      <PendingReceiptModal isOpen={isPendingModalOpen} onCancel={() => setIsPendingModalOpen(false)} onProceed={() => { setIsPendingModalOpen(false); setIsModalOpen(true); }} />
      <SuccessOrderModal isOpen={isSuccessModalOpen} onDirectRedirect={() => { setIsSuccessModalOpen(false); navigate("/orders"); }} hasTicket={hasTicket} receiptUploaded={!!receiptImage} />

      <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          <section>
            <Title text1={"STEP 1:"} text2={"YOUR INFO"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input required name="firstName" onChange={onChangeHandler} className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50" placeholder="Name" />
              <input required name="phone" onChange={onChangeHandler} className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50" placeholder="Phone Number" maxLength={8} pattern="[0-9]*" />
            </div>
          </section>

          <section>
            <Title text1={"STEP 2:"} text2={"DELIVERY & PAYMENT"} />
            <div className="mt-6 space-y-4">

              {/* SF Express Section */}
              <div className={`rounded-2xl border-2 transition-all cursor-pointer ${deliveryType === "sf" ? "border-blue-500 bg-blue-50/10 shadow-md" : "border-gray-100 bg-white"}`} onClick={() => { setDeliveryType("sf"); setMethod("payme"); }}>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">SF Express Delivery</h3>
                    <p className="text-sm text-blue-600 italic">Free Delivery in HK Area</p>
                  </div>
                </div>
                {deliveryType === "sf" && (
                  <div className="p-5 border-t border-blue-100 space-y-3 bg-white">
                    <PaymentOption id="payme" label="By PayMe" qr={assets.paymeCode} instructions={<p>1. Pay via link/QR</p>} />
                    <PaymentOption id="fps" label="By FPS" qr={assets.fpsCode} instructions={<p>1. FPS ID: 2394658</p>} />
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>

        <div className="lg:w-[400px]">
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 sticky top-10 text-center">
            <CartTotal step="3" selectedMethod={method} />
            <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all mt-8 shadow-lg uppercase">Place Order</button>
            <button type="button" onClick={() => navigate("/cart")} className="w-full text-gray-400 font-medium py-2 mt-4 hover:text-black transition-colors text-sm">← Back to Cart</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;