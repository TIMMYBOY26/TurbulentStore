import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// Modern Modal with Backdrop Blur for 2026 aesthetics
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-4">
            <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Order</h2>
          <p className="text-gray-500">Are you sure you want to place this order?</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all" onClick={onClose}>Cancel</button>
          <button className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("payme");
  const [deliveryType, setDeliveryType] = useState("sf");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({ firstName: "", phone: "" });

  const onChangeHandler = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmitHandler = (e) => { e.preventDefault(); setIsModalOpen(true); };

  const handleConfirmOrder = async () => {
    setIsModalOpen(false);
    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(p => p._id === itemId));
            if (itemInfo) {
              orderItems.push({ name: itemInfo.name, productId: itemInfo._id, size, quantity: cartItems[itemId][size] });
            }
          }
        }
      }
      let orderData = { address: formData, items: orderItems, amount: getCartAmount() + delivery_fee };
      const methodMap = {
        cod: "/api/order/place", payme: "/api/order/payme", fps: "/api/order/fps",
        paymeTradeIn: "/api/order/tradeInPersonPlaceOrderPayme", fpsTradeIn: "/api/order/tradeInPersonPlaceOrderFps"
      };
      const response = await axios.post(backendUrl + methodMap[method], orderData, { headers: { token } });
      if (response.data.success) {
        setCartItems({}); navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /**
   * Payment Option UI
   * isTradeIn: Determines if we show "Schedule meetup" link
   * isCash: Specifically for the COD option to show simplified instructions
   */
  const PaymentOption = ({ id, label, qr, instructions, isTradeIn, isCash }) => (
    <div
      onClick={() => setMethod(id)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${method === id ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === id ? 'border-black' : 'border-gray-300'}`}>
          {method === id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
        </div>
        <span className="font-semibold text-gray-700">{label}</span>
      </div>
      {method === id && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
          <div className="text-sm text-gray-600 space-y-2">
            {qr && <img src={qr} className="w-32 h-32 mx-auto sm:mx-0 rounded-lg border shadow-sm" alt="QR" />}

            {/* Specialized Link Logic */}
            {isCash ? (
              // For Cash on Meeting: Simplified Step 1
              <a href="https://wa.me/85293442688" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold block hover:underline">
                Schedule meet up on Whatsapp
              </a>
            ) : (
              // For PayMe/FPS (SF Express or In-Person)
              <>
                {instructions}
                <a href="https://wa.me/85293442688" target="_blank" rel="noopener noreferrer" className={`font-bold block hover:underline ${isTradeIn ? 'text-purple-600' : 'text-green-600'}`}>
                  2. Send us the payment record {isTradeIn ? '& schedule meet up' : '& delivery address'}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const paymeGuide = <p className="font-medium">1. <a href="https://payme.hsbc/69b506a1e1ac40f0a3ef436a57b245af" target="_blank" className="text-blue-600 underline">Click here to PayMe</a> or scan QR code.</p>;
  const fpsGuide = <p className="font-medium">1. Use FPS ID: <span className="font-mono bg-gray-100 p-1 rounded text-xs">2394658</span> and send payment.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-20">
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmOrder} />

      <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-12">

        {/* LEFT: Information & Delivery Methods */}
        <div className="flex-1 space-y-10">
          <section>
            <Title text1={"STEP 1:"} text2={"YOUR INFORMATION"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">* First Name</label>
                <input required name="firstName" onChange={onChangeHandler} value={formData.firstName} className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50 transition-all" placeholder="John" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">* Phone Number</label>
                <input required name="phone" onChange={onChangeHandler} value={formData.phone} className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50 transition-all" placeholder="9123 4567" maxLength={8} pattern="[0-9]*" />
              </div>
            </div>
          </section>

          <section>
            <Title text1={"STEP 2:"} text2={"DELIVERY & PAYMENT"} />
            <div className="mt-6 space-y-4">

              {/* Delivery Choice A: SF Express */}
              <div className={`rounded-2xl border-2 transition-all overflow-hidden ${deliveryType === 'sf' ? 'border-blue-500 bg-blue-50/10 shadow-md' : 'border-gray-100 bg-white'}`}>
                <button type="button" onClick={() => { setDeliveryType('sf'); setMethod('payme'); }} className="w-full p-5 text-left flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg"> Delivery by SF Express </h3>
                    <p className="text-sm text-blue-600 font-medium italic">Free Delivery in HK Area</p>
                    <p className="text-sm text-blue-600 font-medium italic">* Order is expected to arrive within 1 month after Whatsapp confirmation</p>

                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === 'sf' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {deliveryType === 'sf' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
                {deliveryType === 'sf' && (
                  <div className="p-5 border-t border-blue-100 space-y-3 bg-white">
                    <PaymentOption id="payme" label="By PayMe" qr={assets.paymeCode} instructions={paymeGuide} isTradeIn={false} />
                    <PaymentOption id="fps" label="By FPS" qr={assets.fpsCode} instructions={fpsGuide} isTradeIn={false} />
                  </div>
                )}
              </div>

              {/* Delivery Choice B: In-Person */}
              <div className={`rounded-2xl border-2 transition-all overflow-hidden ${deliveryType === 'inPerson' ? 'border-purple-500 bg-purple-50/10 shadow-md' : 'border-gray-100 bg-white'}`}>
                <button type="button" onClick={() => { setDeliveryType('inPerson'); setMethod('cod'); }} className="w-full p-5 text-left flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">In-Person Delivery</h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === 'inPerson' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                    {deliveryType === 'inPerson' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
                {deliveryType === 'inPerson' && (
                  <div className="p-5 border-t border-purple-100 space-y-3 bg-white">
                    <PaymentOption id="cod" label="By Cash" instructions={<></>} isTradeIn={true} isCash={true} />
                    <PaymentOption id="paymeTradeIn" label="By PayMe" qr={assets.paymeCode} instructions={paymeGuide} isTradeIn={true} />
                    <PaymentOption id="fpsTradeIn" label="By FPS" qr={assets.fpsCode} instructions={fpsGuide} isTradeIn={true} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="lg:w-[400px]">
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-8 sticky top-10">

            {/* We pass 'method' here so the component knows what you selected in Step 2 */}
            <CartTotal step="3" selectedMethod={method} />

            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
              >
                PLACE ORDER
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="w-full text-gray-400 font-medium py-2 hover:text-black transition-colors text-sm flex items-center justify-center gap-2"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>


      </form>
    </div>
  );
};

export default PlaceOrder;
