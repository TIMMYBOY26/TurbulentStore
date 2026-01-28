import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// MODAL 1: Initial Order Confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-4">
            <svg
              className="h-7 w-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirm Order
          </h2>
          <p className="text-gray-500 font-medium">
            Are you sure you want to place this order?
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// MODAL 2: Success Modal with Two Choices
const SuccessWhatsAppModal = ({ isOpen, onDirectRedirect, whatsappUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-300 border border-green-100 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4 border-2 border-green-100">
          <svg
            className="w-10 h-10 text-[#25D366]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.721 7.454c-1.879 0-3.72-.507-5.322-1.464L3 21.679l1.325-4.834a9.155 9.155 0 0 1-1.41-4.815c0-5.06 4.117-9.177 9.177-9.177 2.451 0 4.755.955 6.486 2.687a9.117 9.117 0 0 1 2.688 6.49c0 5.06-4.118 9.177-9.178 9.177m9.178-20.627C19.758 1.177 17.226 0 14.544 0 9.034 0 4.548 4.486 4.548 9.996c0 1.761.459 3.478 1.328 5.004L3.622 24l9.191-2.411a9.92 9.92 0 0 0 4.437 1.057c5.508 0 9.995-4.486 9.995-9.996a9.932 9.932 0 0 0-2.697-7.054" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 font-medium mb-8 px-2">
          To complete your order, please send your payment record to our
          WhatsApp.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white font-black rounded-2xl hover:bg-[#128C7E] transition-all shadow-lg active:scale-[0.98] text-lg"
          >
            SEND ON WHATSAPP
          </a>
          <button
            onClick={onDirectRedirect}
            className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            I ALREADY SENT!
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("payme");
  const [deliveryType, setDeliveryType] = useState("sf");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [formData, setFormData] = useState({ firstName: "", phone: "" });

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const onChangeHandler = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleConfirmOrder = async () => {
    setIsModalOpen(false);
    try {
      let orderItems = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = products.find((p) => p._id === itemId);
            if (itemInfo)
              orderItems.push({
                name: itemInfo.name,
                productId: itemInfo._id,
                size,
                quantity: cartItems[itemId][size],
              });
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      const methodMap = {
        cod: "/api/order/place",
        payme: "/api/order/payme",
        fps: "/api/order/fps",
        paymeTradeIn: "/api/order/tradeInPersonPlaceOrderPayme",
        fpsTradeIn: "/api/order/tradeInPersonPlaceOrderFps",
      };

      const response = await axios.post(
        backendUrl + methodMap[method],
        orderData,
        { headers: { token } },
      );

      if (response.data.success) {
        setCartItems({});
        const message = `Order Placed! Name: ${formData.firstName}, Phone: ${formData.phone}, Total: $${getCartAmount() + delivery_fee}`;
        setWaUrl(`https://wa.me{encodeURIComponent(message)}`);
        setIsSuccessModalOpen(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const PaymentOption = ({
    id,
    label,
    qr,
    instructions,
    isTradeIn,
    isCash,
  }) => (
    <div
      onClick={() => setMethod(id)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${method === id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === id ? "border-black" : "border-gray-300"}`}
        >
          {method === id && (
            <div className="w-2.5 h-2.5 bg-black rounded-full" />
          )}
        </div>
        <span className="font-semibold">{label}</span>
      </div>
      {method === id && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2 animate-in slide-in-from-top-2">
          {qr && (
            <img
              src={qr}
              className="w-32 h-32 mx-auto rounded-lg border shadow-sm"
              alt="QR"
            />
          )}
          {isCash ? (
            <p className="text-purple-600 font-bold italic">
              1. Schedule meetup on Whatsapp after placing order
            </p>
          ) : (
            <>
              {instructions}
              <p
                className={`font-bold ${isTradeIn ? "text-purple-600" : "text-green-600"}`}
              >
                2. Send us the payment record on Whatsapp
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-20">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
      <SuccessWhatsAppModal
        isOpen={isSuccessModalOpen}
        onDirectRedirect={() => {
          setIsSuccessModalOpen(false);
          navigate("/orders");
        }}
        whatsappUrl={"https://wa.me/85293442688"}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex flex-col lg:flex-row gap-12"
      >
        <div className="flex-1 space-y-10">
          <section>
            <Title text1={"STEP 1:"} text2={"YOUR INFORMATION"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50"
                placeholder="First Name"
              />
              <input
                required
                name="phone"
                onChange={onChangeHandler}
                className="w-full border-gray-200 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none bg-gray-50"
                placeholder="Phone Number"
                maxLength={8}
                pattern="[0-9]*"
              />
            </div>
          </section>

          <section>
            <Title text1={"STEP 2:"} text2={"DELIVERY & PAYMENT"} />
            <div className="mt-6 space-y-4">
              <div
                className={`rounded-2xl border-2 transition-all ${deliveryType === "sf" ? "border-blue-500 bg-blue-50/10 shadow-md" : "border-gray-100 bg-white"}`}
                onClick={() => {
                  setDeliveryType("sf");
                  setMethod("payme");
                }}
              >
                <div className="p-5 flex justify-between items-center cursor-pointer">
                  <div>
                    <h3 className="font-bold text-lg">
                      Delivery by SF Express
                    </h3>
                    <p className="text-sm text-blue-600 italic">
                      Free Delivery in HK Area
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === "sf" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                  >
                    {deliveryType === "sf" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                {deliveryType === "sf" && (
                  <div className="p-5 border-t border-blue-100 space-y-3 bg-white">
                    <PaymentOption
                      id="payme"
                      label="By PayMe"
                      qr={assets.paymeCode}
                      instructions={<p>1. Pay via link/QR</p>}
                      isTradeIn={false}
                    />
                    <PaymentOption
                      id="fps"
                      label="By FPS"
                      qr={assets.fpsCode}
                      instructions={<p>1. FPS ID: 2394658</p>}
                      isTradeIn={false}
                    />
                  </div>
                )}
              </div>

              <div
                className={`rounded-2xl border-2 transition-all ${deliveryType === "inPerson" ? "border-purple-500 bg-purple-50/10 shadow-md" : "border-gray-100 bg-white"}`}
                onClick={() => {
                  setDeliveryType("inPerson");
                  setMethod("cod");
                }}
              >
                <div className="p-5 flex justify-between items-center cursor-pointer">
                  <h3 className="font-bold text-lg">In-Person Delivery</h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryType === "inPerson" ? "border-purple-500 bg-purple-500" : "border-gray-300"}`}
                  >
                    {deliveryType === "inPerson" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                {deliveryType === "inPerson" && (
                  <div className="p-5 border-t border-purple-100 space-y-3 bg-white">
                    <PaymentOption
                      id="cod"
                      label="By Cash"
                      instructions={<></>}
                      isTradeIn={true}
                      isCash={true}
                    />
                    <PaymentOption
                      id="paymeTradeIn"
                      label="By PayMe"
                      qr={assets.paymeCode}
                      instructions={<p>1. Pay via link/QR</p>}
                      isTradeIn={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:w-[400px]">
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 sticky top-10 text-center">
            <CartTotal step="3" selectedMethod={method} />
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all mt-8 active:scale-[0.98] shadow-lg shadow-black/10"
            >
              PLACE ORDER
            </button>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="w-full text-gray-400 font-medium py-2 mt-4 hover:text-black transition-colors text-sm"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
